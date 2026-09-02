import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "DISCORD_BOT_TOKEN",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const name of requiredEnv) {
  if (!process.env[name] || !process.env[name].trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const trackedIdsRefreshMs = parsePositiveInteger(process.env.TRACKED_IDS_REFRESH_MS, 300_000);
const memberFetchBatchSize = parsePositiveInteger(process.env.MEMBER_FETCH_BATCH_SIZE, 25);
const discordGuildId = process.env.DISCORD_GUILD_ID?.trim() || null;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

let trackedUsers = new Map();
let refreshTimer = null;

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }

  const sanitized = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!sanitized) {
    return null;
  }

  return sanitized.slice(0, maxLength);
}

function normalizeStatus(status) {
  if (status === "online" || status === "idle" || status === "dnd") {
    return status;
  }
  return "offline";
}

function getActivityTypeName(activityType) {
  switch (activityType) {
    case ActivityType.Playing:
      return "playing";
    case ActivityType.Streaming:
      return "streaming";
    case ActivityType.Listening:
      return "listening";
    case ActivityType.Watching:
      return "watching";
    case ActivityType.Competing:
      return "competing";
    default:
      return "unknown";
  }
}

function formatCustomStatusText(activity) {
  if (!activity || activity.type !== ActivityType.Custom) {
    return null;
  }

  return sanitizeText(activity.state, 256);
}

function formatCustomStatusEmoji(activity) {
  if (!activity || activity.type !== ActivityType.Custom) {
    return null;
  }

  if (typeof activity.emoji?.id === "string" && typeof activity.emoji?.name === "string") {
    return activity.emoji.animated
      ? `<a:${activity.emoji.name}:${activity.emoji.id}>`
      : `<:${activity.emoji.name}:${activity.emoji.id}>`;
  }

  return sanitizeText(activity.emoji?.name, 64);
}

function sanitizeActivities(activities) {
  return activities
    .filter((activity) => activity.type !== ActivityType.Custom)
    .map((activity) => ({
      type: getActivityTypeName(activity.type),
      name: sanitizeText(activity.name, 128),
      state: sanitizeText(activity.state, 256),
      details: sanitizeText(activity.details, 256),
      timestamps: {
        start: activity.timestamps?.start ? new Date(activity.timestamps.start).toISOString() : null,
        end: activity.timestamps?.end ? new Date(activity.timestamps.end).toISOString() : null,
      },
    }))
    .filter((activity) => activity.name);
}

function serializePresence(discordId, presence) {
  const activities = Array.isArray(presence?.activities) ? presence.activities : [];
  const customActivity = activities.find((activity) => activity.type === ActivityType.Custom) ?? null;
  const nowIso = new Date().toISOString();

  return {
    discord_id: discordId,
    status: normalizeStatus(presence?.status),
    custom_status: formatCustomStatusText(customActivity),
    custom_status_emoji: formatCustomStatusEmoji(customActivity),
    activities: sanitizeActivities(activities),
    last_seen_at: nowIso,
    synced_at: nowIso,
    updated_at: nowIso,
  };
}

async function upsertPresenceRow(discordId, presence) {
  const payload = serializePresence(discordId, presence);
  const { error } = await supabase
    .from("discord_presence")
    .upsert(payload, { onConflict: "discord_id" });

  if (error) {
    throw new Error(`Failed to sync presence for ${discordId}: ${error.message}`);
  }
}

async function refreshTrackedUsers() {
  const { data, error } = await supabase
    .from("discord_connections")
    .select("profile_id, discord_id");

  if (error) {
    throw new Error(`Failed to refresh tracked Discord IDs: ${error.message}`);
  }

  trackedUsers = new Map(
    (data ?? [])
      .filter((row) => typeof row.profile_id === "string" && typeof row.discord_id === "string")
      .map((row) => [row.discord_id, row.profile_id]),
  );

  console.log(`[discord-presence-bot] tracking ${trackedUsers.size} linked Discord account(s)`);
}

async function getTargetGuilds() {
  if (discordGuildId) {
    const guild = await client.guilds.fetch(discordGuildId);
    return guild ? [guild] : [];
  }

  const guildIds = client.guilds.cache.size > 0
    ? [...client.guilds.cache.keys()]
    : [...(await client.guilds.fetch()).keys()];

  const guilds = await Promise.all(
    guildIds.map(async (guildId) => {
      try {
        return await client.guilds.fetch(guildId);
      } catch {
        return null;
      }
    }),
  );

  return guilds.filter(Boolean);
}

async function syncGuildMember(guild, discordId) {
  try {
    const member = await guild.members.fetch({
      user: discordId,
      force: true,
      withPresences: true,
    });

    await upsertPresenceRow(discordId, member.presence ?? null);
    return true;
  } catch (error) {
    const code = error?.code ?? error?.rawError?.code;
    if (code === 10007 || code === 10013) {
      return false;
    }
    throw error;
  }
}

async function syncOfflineUsers(unseenDiscordIds) {
  const offlineUpdates = [];
  for (const discordId of unseenDiscordIds) {
    if (!trackedUsers.has(discordId)) {
      continue;
    }
    offlineUpdates.push(upsertPresenceRow(discordId, null));
  }

  await Promise.all(offlineUpdates);
}

async function syncTrackedMembers() {
  if (trackedUsers.size === 0) {
    return;
  }

  const guilds = await getTargetGuilds();
  if (guilds.length === 0) {
    console.warn("[discord-presence-bot] no target guilds available for presence sync");
    return;
  }

  const entries = [...trackedUsers.entries()];
  const seenDiscordIds = new Set();

  for (const guild of guilds) {
    for (const batch of chunk(entries, memberFetchBatchSize)) {
      const results = await Promise.allSettled(
        batch.map(async ([discordId]) => {
          const found = await syncGuildMember(guild, discordId);
          if (found) {
            seenDiscordIds.add(discordId);
          }
        }),
      );

      for (const result of results) {
        if (result.status === "rejected") {
          throw result.reason;
        }
      }
    }
  }

  const unseenDiscordIds = entries
    .map(([discordId]) => discordId)
    .filter((discordId) => !seenDiscordIds.has(discordId));

  await syncOfflineUsers(unseenDiscordIds);
  console.log("[discord-presence-bot] completed full tracked presence sync");
}

async function fullRefreshAndSync() {
  await refreshTrackedUsers();
  await syncTrackedMembers();
}

client.on("ready", async () => {
  console.log(`[discord-presence-bot] logged in as ${client.user?.tag ?? client.user?.id}`);

  try {
    await fullRefreshAndSync();
  } catch (error) {
    console.error("[discord-presence-bot] initial sync failed", error);
  }

  refreshTimer = setInterval(() => {
    fullRefreshAndSync().catch((error) => {
      console.error("[discord-presence-bot] periodic sync failed", error);
    });
  }, trackedIdsRefreshMs);
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  const guildId = newPresence?.guild?.id ?? oldPresence?.guild?.id ?? null;
  if (discordGuildId && guildId !== discordGuildId) {
    return;
  }

  const discordId = newPresence?.userId ?? oldPresence?.userId ?? null;
  if (!discordId) {
    return;
  }

  if (!trackedUsers.has(discordId)) {
    return;
  }

  try {
    await upsertPresenceRow(discordId, newPresence ?? oldPresence ?? null);
  } catch (error) {
    console.error(`[discord-presence-bot] live sync failed for ${discordId}`, error);
  }
});

client.on("guildCreate", () => {
  fullRefreshAndSync().catch((error) => {
    console.error("[discord-presence-bot] guildCreate sync failed", error);
  });
});

client.on("error", (error) => {
  console.error("[discord-presence-bot] client error", error);
});

process.on("SIGINT", async () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  await client.destroy();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  await client.destroy();
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  console.error("[discord-presence-bot] unhandled rejection", error);
});

client.login(process.env.DISCORD_BOT_TOKEN);
