import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

type JsonRecord = Record<string, unknown>;

type DiscordConnection = {
  profile_id: string;
  discord_id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  public_flags: number;
  primary_guild_tag: string | null;
  show_widget: boolean;
  show_status: boolean;
  show_activity: boolean;
  show_badges: boolean;
  show_guild_tag: boolean;
  custom_idle_text: string | null;
  connected_at: string;
  created_at: string;
  updated_at: string;
};

type DiscordPresence = {
  discord_id: string;
  status: "online" | "idle" | "dnd" | "offline";
  custom_status: string | null;
  custom_status_emoji: string | null;
  activities: unknown[];
  last_seen_at: string | null;
  synced_at: string;
  created_at: string;
  updated_at: string;
};

type LinkResult =
  | {
    ok: true;
    payload: JsonRecord;
  }
  | {
    ok: false;
    status: number;
    code: string;
    message: string;
  };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

const supabaseUrl = mustGetEnv("SUPABASE_URL");
const supabaseAnonKey = mustGetEnv("SUPABASE_ANON_KEY");
const supabaseServiceRoleKey = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");
const discordClientId = mustGetEnv("DISCORD_CLIENT_ID");
const discordClientSecret = mustGetEnv("DISCORD_CLIENT_SECRET");
const discordOAuthRedirectUri = mustGetEnv("DISCORD_OAUTH_REDIRECT_URI");
const defaultDiscordDashboardUrl = "https://sqezen.lol/dashboard";
const discordDashboardUrl = Deno.env.get("DISCORD_DASHBOARD_URL")?.trim() || defaultDiscordDashboardUrl;
const stateTtlMinutes = 10;

function mustGetEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function jsonResponse(status: number, payload: JsonRecord): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders,
  });
}

function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse(status, {
    ok: false,
    error: { code, message },
  });
}

function redirectResponse(location: string): Response {
  return new Response(null, {
    status: 303,
    headers: {
      Location: location,
    },
  });
}

function buildDashboardRedirect(status: "connected" | "error"): string {
  const url = new URL(discordDashboardUrl);
  url.searchParams.set("discord", status);
  return url.toString();
}

function sanitizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const sanitized = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!sanitized) {
    return null;
  }

  return sanitized.slice(0, maxLength);
}

function createStateValue(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function buildDiscordAvatarUrl(discordId: string, avatarHash: string | null): string | null {
  if (!avatarHash) {
    return null;
  }

  const extension = avatarHash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${extension}?size=256`;
}

function getSupabaseAdmin(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getSupabaseUser(authorization: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });
}

async function loadOwnerState(
  admin: SupabaseClient,
  profileId: string,
): Promise<{ connection: DiscordConnection | null; presence: DiscordPresence | null }> {
  const { data: connection, error: connectionError } = await admin
    .from("discord_connections")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (connectionError) {
    throw new Error(`Failed to load Discord connection: ${connectionError.message}`);
  }

  let presence: DiscordPresence | null = null;
  if (connection?.discord_id) {
    const { data: presenceData, error: presenceError } = await admin
      .from("discord_presence")
      .select("*")
      .eq("discord_id", connection.discord_id)
      .maybeSingle();

    if (presenceError) {
      throw new Error(`Failed to load Discord presence: ${presenceError.message}`);
    }

    presence = (presenceData as DiscordPresence | null) ?? null;
  }

  return {
    connection: (connection as DiscordConnection | null) ?? null,
    presence,
  };
}

async function startAuthorization(admin: SupabaseClient, userId: string) {
  const expiresAt = new Date(Date.now() + stateTtlMinutes * 60_000).toISOString();
  const state = createStateValue();

  const { error: deleteError } = await admin
    .from("discord_oauth_states")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Failed to clear existing OAuth states: ${deleteError.message}`);
  }

  const { error } = await admin
    .from("discord_oauth_states")
    .insert({
      state,
      user_id: userId,
      expires_at: expiresAt,
    });

  if (error) {
    throw new Error(`Failed to create OAuth state: ${error.message}`);
  }

  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: discordClientId,
    redirect_uri: discordOAuthRedirectUri,
    response_type: "code",
    scope: "identify",
    prompt: "consent",
    state,
  }).toString();

  return {
    url: authorizeUrl.toString(),
    authorize_url: authorizeUrl.toString(),
    authorizeUrl: authorizeUrl.toString(),
    redirect_uri: discordOAuthRedirectUri,
    redirectUri: discordOAuthRedirectUri,
    expires_at: expiresAt,
    expiresAt,
  };
}

async function consumeOAuthState(
  admin: SupabaseClient,
  state: string,
  expectedUserId?: string,
): Promise<string | null> {
  let query = admin
    .from("discord_oauth_states")
    .delete()
    .eq("state", state)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString());

  if (expectedUserId) {
    query = query.eq("user_id", expectedUserId);
  }

  const { data, error } = await query
    .select("user_id")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate OAuth state: ${error.message}`);
  }

  return typeof data?.user_id === "string" ? data.user_id : null;
}

async function exchangeAuthorizationCode(code: string) {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: discordClientId,
      client_secret: discordClientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: discordOAuthRedirectUri,
    }),
  });

  const tokenJson = (await tokenResponse.json().catch(() => null)) as JsonRecord | null;
  if (!tokenResponse.ok || typeof tokenJson?.access_token !== "string") {
    return {
      ok: false,
      status: 400,
      code: "discord_exchange_failed",
      message: "Discord authorization could not be completed.",
    } as const;
  }

  const profileResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
  });

  const profileJson = (await profileResponse.json().catch(() => null)) as JsonRecord | null;
  if (!profileResponse.ok || typeof profileJson?.id !== "string" || typeof profileJson?.username !== "string") {
    return {
      ok: false,
      status: 400,
      code: "discord_identity_failed",
      message: "Discord identity lookup failed.",
    } as const;
  }

  const primaryGuild = typeof profileJson.primary_guild === "object" && profileJson.primary_guild !== null
    ? profileJson.primary_guild as JsonRecord
    : null;

  return {
    ok: true,
    identity: {
      discord_id: profileJson.id,
      username: sanitizeText(profileJson.username, 32),
      global_name: sanitizeText(profileJson.global_name, 64),
      avatar: buildDiscordAvatarUrl(profileJson.id, typeof profileJson.avatar === "string" ? profileJson.avatar : null),
      public_flags: typeof profileJson.public_flags === "number" && Number.isInteger(profileJson.public_flags)
        ? profileJson.public_flags
        : 0,
      primary_guild_tag: sanitizeText(primaryGuild?.tag, 64),
    },
  } as const;
}

async function linkDiscordIdentity(
  admin: SupabaseClient,
  profileId: string,
  code: string,
): Promise<LinkResult> {
  const exchangeResult = await exchangeAuthorizationCode(code.trim());
  if (!exchangeResult.ok) {
    return exchangeResult;
  }

  const identity = exchangeResult.identity;
  if (!identity.username || !/^[0-9]{17,20}$/.test(identity.discord_id)) {
    return {
      ok: false,
      status: 400,
      code: "invalid_identity",
      message: "Discord returned an invalid public identity.",
    };
  }

  const { data: duplicateConnection, error: duplicateError } = await admin
    .from("discord_connections")
    .select("profile_id")
    .eq("discord_id", identity.discord_id)
    .neq("profile_id", profileId)
    .maybeSingle();

  if (duplicateError) {
    throw new Error(`Failed to check Discord account ownership: ${duplicateError.message}`);
  }

  if (duplicateConnection) {
    return {
      ok: false,
      status: 409,
      code: "discord_already_linked",
      message: "That Discord account is already linked to another user.",
    };
  }

  const existingState = await loadOwnerState(admin, profileId);
  const nowIso = new Date().toISOString();

  const { error: upsertConnectionError } = await admin
    .from("discord_connections")
    .upsert({
      profile_id: profileId,
      discord_id: identity.discord_id,
      username: identity.username,
      global_name: identity.global_name,
      avatar: identity.avatar,
      public_flags: identity.public_flags,
      primary_guild_tag: identity.primary_guild_tag ?? existingState.connection?.primary_guild_tag ?? null,
      show_widget: existingState.connection?.show_widget ?? true,
      show_status: existingState.connection?.show_status ?? true,
      show_activity: existingState.connection?.show_activity ?? true,
      show_badges: existingState.connection?.show_badges ?? true,
      show_guild_tag: existingState.connection?.show_guild_tag ?? true,
      custom_idle_text: existingState.connection?.custom_idle_text ?? null,
      connected_at: existingState.connection?.connected_at ?? nowIso,
      updated_at: nowIso,
    }, { onConflict: "profile_id" });

  if (upsertConnectionError) {
    throw new Error(`Failed to save Discord connection: ${upsertConnectionError.message}`);
  }

  const { error: upsertPresenceError } = await admin
    .from("discord_presence")
    .upsert({
      discord_id: identity.discord_id,
      status: existingState.presence?.status ?? "offline",
      custom_status: existingState.presence?.custom_status ?? null,
      custom_status_emoji: existingState.presence?.custom_status_emoji ?? null,
      activities: existingState.presence?.activities ?? [],
      last_seen_at: existingState.presence?.last_seen_at ?? null,
      synced_at: existingState.presence?.synced_at ?? nowIso,
      updated_at: nowIso,
    }, { onConflict: "discord_id" });

  if (upsertPresenceError) {
    throw new Error(`Failed to ensure Discord presence row: ${upsertPresenceError.message}`);
  }

  const current = await loadOwnerState(admin, profileId);
  return {
    ok: true,
    payload: {
      ok: true,
      connected: true,
      connection: current.connection,
      presence: current.presence,
      url: null,
      redirect_uri: discordOAuthRedirectUri,
      redirectUri: discordOAuthRedirectUri,
    },
  };
}

async function completeAuthorization(
  admin: SupabaseClient,
  profileId: string,
  code: unknown,
  state: unknown,
): Promise<Response> {
  if (typeof code !== "string" || code.trim().length < 8) {
    return errorResponse(400, "invalid_code", "A valid Discord authorization code is required.");
  }

  if (typeof state !== "string" || state.trim().length < 32) {
    return errorResponse(400, "invalid_state", "A valid Discord OAuth state is required.");
  }

  const consumedUserId = await consumeOAuthState(admin, state, profileId);
  if (!consumedUserId) {
    return errorResponse(400, "expired_state", "This Discord OAuth state is invalid or has expired.");
  }

  const result = await linkDiscordIdentity(admin, profileId, code);
  if (!result.ok) {
    return errorResponse(result.status, result.code, result.message);
  }

  return jsonResponse(200, result.payload);
}

function getSettingsPayload(body: JsonRecord): JsonRecord | Response {
  const source = typeof body.settings === "object" && body.settings !== null
    ? body.settings as JsonRecord
    : body;

  const updates: JsonRecord = {};
  const booleanFields = [
    "show_widget",
    "show_status",
    "show_activity",
    "show_badges",
    "show_guild_tag",
  ];

  for (const field of booleanFields) {
    if (field in source) {
      if (typeof source[field] !== "boolean") {
        return errorResponse(400, "invalid_settings", `${field} must be a boolean.`);
      }
      updates[field] = source[field];
    }
  }

  if ("custom_idle_text" in source) {
    const value = source.custom_idle_text;
    if (value !== null && typeof value !== "string") {
      return errorResponse(400, "invalid_settings", "custom_idle_text must be a string or null.");
    }

    const sanitized = value === null ? null : sanitizeText(value, 120);
    if (value !== null && !sanitized) {
      return errorResponse(400, "invalid_settings", "custom_idle_text cannot be empty.");
    }
    updates.custom_idle_text = sanitized;
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse(400, "missing_settings", "Provide at least one display setting to update.");
  }

  updates.updated_at = new Date().toISOString();
  return updates;
}

async function handleGetCallback(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code")?.trim() ?? "";
  const state = requestUrl.searchParams.get("state")?.trim() ?? "";
  const oauthError = requestUrl.searchParams.get("error");

  if (oauthError) {
    if (state) {
      try {
        const admin = getSupabaseAdmin();
        await admin.from("discord_oauth_states").delete().eq("state", state);
      } catch (error) {
        console.error("[discord-oauth] failed to clear rejected state", error);
      }
    }
    return redirectResponse(buildDashboardRedirect("error"));
  }

  if (!code || !state) {
    return redirectResponse(buildDashboardRedirect("error"));
  }

  try {
    const admin = getSupabaseAdmin();
    const profileId = await consumeOAuthState(admin, state);
    if (!profileId) {
      return redirectResponse(buildDashboardRedirect("error"));
    }

    const result = await linkDiscordIdentity(admin, profileId, code);
    if (!result.ok) {
      return redirectResponse(buildDashboardRedirect("error"));
    }

    return redirectResponse(buildDashboardRedirect("connected"));
  } catch (error) {
    console.error("[discord-oauth] callback failed", error);
    return redirectResponse(buildDashboardRedirect("error"));
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "GET") {
    return await handleGetCallback(request);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "method_not_allowed", "Use GET for the callback or POST for API actions.");
  }

  const authorization = request.headers.get("Authorization")?.trim();
  if (!authorization?.startsWith("Bearer ")) {
    return errorResponse(401, "missing_bearer_token", "A Supabase Bearer token is required.");
  }

  let body: JsonRecord;
  try {
    body = (await request.json()) as JsonRecord;
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON.");
  }

  const action = typeof body.action === "string" ? body.action.trim() : "";
  if (!action) {
    return errorResponse(400, "missing_action", "Request body must include an action.");
  }

  try {
    const userClient = getSupabaseUser(authorization);
    const admin = getSupabaseAdmin();
    const { data: authData, error: authError } = await userClient.auth.getUser();

    if (authError || !authData.user) {
      return errorResponse(401, "invalid_bearer_token", "The provided Supabase Bearer token is invalid.");
    }

    const profileId = authData.user.id;

    if (action === "authorize") {
      if (body.code || body.state) {
        return await completeAuthorization(admin, profileId, body.code, body.state);
      }

      const current = await loadOwnerState(admin, profileId);
      const authorizationState = await startAuthorization(admin, profileId);
      return jsonResponse(200, {
        ok: true,
        connection: current.connection,
        presence: current.presence,
        ...authorizationState,
      });
    }

    if (action === "get") {
      const current = await loadOwnerState(admin, profileId);
      return jsonResponse(200, {
        ok: true,
        connection: current.connection,
        presence: current.presence,
      });
    }

    if (action === "settings") {
      const current = await loadOwnerState(admin, profileId);
      if (!current.connection) {
        return errorResponse(404, "not_connected", "No Discord account is linked for this user.");
      }

      const updates = getSettingsPayload(body);
      if (updates instanceof Response) {
        return updates;
      }

      const { error: updateError } = await admin
        .from("discord_connections")
        .update(updates)
        .eq("profile_id", profileId);

      if (updateError) {
        throw new Error(`Failed to update Discord settings: ${updateError.message}`);
      }

      const refreshed = await loadOwnerState(admin, profileId);
      return jsonResponse(200, {
        ok: true,
        connection: refreshed.connection,
        presence: refreshed.presence,
      });
    }

    if (action === "disconnect") {
      const { error: deleteStatesError } = await admin
        .from("discord_oauth_states")
        .delete()
        .eq("user_id", profileId);

      if (deleteStatesError) {
        throw new Error(`Failed to clear OAuth states: ${deleteStatesError.message}`);
      }

      const { error: deleteConnectionError } = await admin
        .from("discord_connections")
        .delete()
        .eq("profile_id", profileId);

      if (deleteConnectionError) {
        throw new Error(`Failed to disconnect Discord account: ${deleteConnectionError.message}`);
      }

      return jsonResponse(200, {
        ok: true,
        disconnected: true,
        connection: null,
        presence: null,
      });
    }

    return errorResponse(400, "unsupported_action", `Unsupported action: ${action}`);
  } catch (error) {
    console.error("[discord-oauth] request failed", error);
    return errorResponse(500, "server_error", "Internal server error.");
  }
});
