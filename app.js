const SUPABASE_URL = "https://wzdxgmzwxzfhegelqugy.supabase.co";
const SUPABASE_KEY = "sb_publishable_63IpIFewxY0qJ3Cx532LQA_vEwXoSwP";
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
const state = { resendTimer: null, dashboard: null };

const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
  discord: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.4 8.5a14 14 0 0 1 7.2 0M8 16.5c2.8 1.4 5.2 1.4 8 0M7.5 17c-1.8-2-2.5-4.7-1.5-8.2 1.6-1.2 3.2-1.7 4.8-1.8l1.2 1.5 1.2-1.5c1.6.1 3.2.6 4.8 1.8 1 3.5.3 6.2-1.5 8.2-1.8.3-3.2-.4-4.5-1.4M9.3 13.5h.1M14.6 13.5h.1"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8c-2-2.2-3-4.8-3-8s1-5.8 3-8Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.2-4-2-5.5-2.5M14.5 21v-3.5c0-1 .1-1.7-.5-2.5 2.8-.3 5.8-1.4 5.8-6.1 0-1.3-.5-2.4-1.3-3.3.1-.3.6-1.6-.1-3.3 0 0-1.1-.4-3.5 1.3a12 12 0 0 0-6.4 0C6.1 1.9 5 2.3 5 2.3c-.7 1.7-.2 3-.1 3.3-.8.9-1.3 2-1.3 3.3 0 4.7 3 5.8 5.8 6.1-.6.5-.7 1.2-.7 2.5V21"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7.1l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1M14 10.5a4 4 0 0 0-5.7-.1l-2 2A4 4 0 0 0 12 18.1l1.1-1.1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 16l4-4-4-4M9 12h9"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/></svg>',
  palette: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16h1.2a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18A2 2 0 0 0 20 12a8 8 0 0 0-8-8Z"/><path d="M8 10h.1M10 7h.1M7 14h.1"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6 4 4M5 19l3.5-.8L18.5 8a2.1 2.1 0 0 0-3-3L5.5 15.2 5 19Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="m8 5 11 7-11 7V5Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  rewind: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M11 6 4 12l7 6V6Zm9 0-7 6 7 6V6Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.5-1.2.9-1.9-2.1-2.1-1.9.9-1.2-.5-.7-2h-3l-.7 2-1.2.5-1.9-.9-2.1 2.1.9 1.9-.5 1.2-2 .7v3l2 .7.5 1.2-.9 1.9 2.1 2.1 1.9-.9 1.2.5.7 2h3l.7-2 1.2-.5 1.9.9 2.1-2.1-.9-1.9.5-1.2 2-.7Z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h3l4 3V7l-4 3H5ZM16 9.5a4 4 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/></svg>',
  forward: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="m13 6 7 6-7 6V6ZM4 6l7 6-7 6V6Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5v9.2a4 4 0 1 1-3-3.9M14 5c.5 2.2 1.9 3.6 4 4"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="3"/><path d="m10 10 5 2-5 2v-4Z"/></svg>'
};

const DEFAULT_CUSTOMIZATION = Object.freeze({ backgroundMediaUrl: "", audioUrl: "", audioTitle: "", audioArtist: "", audioLyrics: "", cursorUrl: "", cursorGlowColor: "#5865ee", location: "", profileOpacity: 92, profileBlur: 18, cardWidth: 520, avatarSize: 104, backgroundEffect: "none", usernameEffect: "none", nameParticles: "none", badges: [], defaultEmbed: "standard", dynamicEmbedPositions: { profile: { x: 50, y: 35, free: true }, connections: { x: 78, y: 55, free: true }, badges: { x: 75, y: 82, free: true }, audio: { x: 25, y: 82, free: true }, lyrics: { x: 76, y: 27, free: true } }, textColor: "#f5f6fb", cardColor: "#111116", buttonColor: "#5865ee", buttonTextColor: "#ffffff", gradientPrimary: "#000000", gradientSecondary: "#000000", useGradient: false, alignment: "center", spacing: "comfortable", buttonStyle: "glass", buttonRadius: 13, fontFamily: "inter", showHandle: true, showBranding: true });

function icon(name) { return icons[name] || icons.link; }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char])); }
function currentPath() { const redirect = new URLSearchParams(location.search).get("redirect"); if (redirect?.startsWith("/") && !redirect.startsWith("//")) history.replaceState(null, "", redirect); return location.pathname.replace(/\/+$/, "") || "/"; }
function navigate(path) { history.pushState(null, "", path); render(); scrollTo(0, 0); }
function safeColor(value, fallback = "#5865ee") { const color = String(value || ""); if (!/^#[0-9a-f]{6}$/i.test(color)) return fallback; return color.toLowerCase() === "#c9cdd4" ? "#5865ee" : color; }
function themeColor(value, fallback = "#5865ee") { const color = String(value || ""); return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : fallback; }
function migrateColor(value, legacy, fallback) { const color = safeColor(value, fallback); return color.toLowerCase() === legacy ? fallback : color; }
function normalizeUrl(value) { const raw = String(value || "").trim(); if (!raw || /^(javascript|data|vbscript):/i.test(raw)) return ""; if (/^(https?:|mailto:)/i.test(raw)) return raw; return `https://${raw.replace(/^\/\//, "").replace(/\s+/g, "")}`; }
function safeUrl(value) { const normalized = normalizeUrl(value); try { const url = new URL(normalized); return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } }
function safeMediaUrl(value) { const raw = String(value || "").trim(); if (/^data:(?:image\/(?:png|jpeg|gif|webp)|audio\/(?:mpeg|mp3|wav|ogg|aac|webm)|video\/(?:mp4|webm|ogg));base64,[a-z0-9+/=\s]+$/i.test(raw) && raw.length <= 18000000) return raw.replace(/\s+/g, ""); const url = safeUrl(raw); return /^https?:/i.test(url) ? url : ""; }
function safeImageUrl(value) { const raw = String(value || "").trim(); if (/^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(raw) && raw.length <= 9000000) return raw.replace(/\s+/g, ""); return safeMediaUrl(raw); }
function safeCursorUrl(value) { const raw = String(value || "").trim(); if (/^data:/i.test(raw)) return /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(raw) && raw.length <= 350000 ? raw.replace(/\s+/g, "") : ""; return safeMediaUrl(raw); }
function isVideoMedia(value) { return /^data:video\//i.test(String(value || "")) || /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(String(value || "")); }
function discordUrl(value) { try { const url = new URL(String(value || "").trim()); return /^(?:cdn|media)\.discord(?:app)?\.(?:com|net)$/i.test(url.hostname) ? url : null; } catch { return null; } }
function isDiscordUrl(value) { return Boolean(discordUrl(value)); }
function isExpiredDiscordUrl(value) { const url = discordUrl(value); if (!url) return false; const expires = url.searchParams.get("ex"); return /^[0-9a-f]+$/i.test(expires || "") && Number.parseInt(expires, 16) * 1000 <= Date.now(); }
function mediaMimeType(value, kind) { const extension = String(value || "").split(/[?#]/)[0].toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] || ""; const types = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", mp3: "audio/mpeg", wav: "audio/wav", aac: "audio/aac", mp4: "video/mp4", ogg: kind === "background" ? "video/ogg" : "audio/ogg", webm: kind === "background" ? "video/webm" : "audio/webm" }; return types[extension] || ""; }
function blobToDataUrl(blob) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.addEventListener("load", () => { const value = String(reader.result || ""); if (value) resolve(value); else reject(new Error("Nie udało się odczytać pobranego pliku.")); }, { once: true }); reader.addEventListener("error", () => reject(new Error("Nie udało się odczytać pobranego pliku.")), { once: true }); reader.readAsDataURL(blob); }); }
async function cacheDiscordAsset(value, kind, meta) {
  if (kind === "avatar") return value;
  let response;
  try {
    response = await fetch(value, { mode: "cors" });
  } catch (error) {
    const message = String(error?.message || error || "").toLowerCase();
    if (error?.name === "TypeError" || message.includes("networkerror") || message.includes("failed to fetch") || message.includes("network error")) {
      throw new Error("Nie można pobrać pliku z Discorda w przeglądarce. Pobierz go na komputer i wybierz plik z komputera.");
    }
    throw error;
  }
  if (!response.ok) throw new Error("Nie udało się pobrać pliku z Discorda. Wybierz plik z komputera.");
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > meta.maxSize) throw new Error(`Plik jest za duży. Maksymalny rozmiar to ${Math.round(meta.maxSize / 1000000)} MB.`);
  const blob = await response.blob();
  if (blob.size > meta.maxSize) throw new Error(`Plik jest za duży. Maksymalny rozmiar to ${Math.round(meta.maxSize / 1000000)} MB.`);
  const responseType = String(response.headers.get("content-type") || blob.type || "").split(";")[0].trim().toLowerCase();
  const fallbackType = mediaMimeType(value, kind);
  const mime = meta.test.test(responseType) ? responseType : (!responseType || responseType === "application/octet-stream" || responseType === "binary/octet-stream") ? fallbackType : "";
  if (!mime || !meta.test.test(mime)) throw new Error("Discord nie zwrócił pliku w obsługiwanym formacie.");
  const dataUrl = await blobToDataUrl(new Blob([blob], { type: mime }));
  const cached = kind === "cursor" ? safeCursorUrl(dataUrl) : kind === "avatar" ? safeImageUrl(dataUrl) : safeMediaUrl(dataUrl);
  if (!cached || !/^data:/i.test(cached)) throw new Error("Nie udało się przygotować trwałej kopii pliku.");
  return cached;
}
const PROFILE_ASSET_OPTIONS = Object.freeze({
  background: { title: "Tło", description: "Wybierz obraz lub wideo, które pojawi się w tle profilu. Dla ostrego tła użyj minimum 1280×720.", accept: "image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,video/ogg", maxSize: 12000000, test: /^(image\/(?:png|jpeg|gif|webp)|video\/(?:mp4|webm|ogg))$/i, extensions: /\.(?:png|jpe?g|gif|webp|mp4|webm|ogg)$/i },
  audio: { title: "Audio", description: "Wybierz plik MP3 z komputera albo wklej bezpośredni adres audio. Dynamic embed sam wyszuka lyrics po metadanych utworu.", accept: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/webm", maxSize: 12000000, test: /^audio\/(?:mpeg|mp3|wav|ogg|aac|webm)$/i, extensions: /\.(?:mp3|wav|ogg|aac|webm)$/i },
  avatar: { title: "Profile Avatar", description: "Dodaj obraz avatara widoczny na karcie profilu.", accept: "image/png,image/jpeg,image/gif,image/webp", maxSize: 6000000, test: /^image\/(?:png|jpeg|gif|webp)$/i, extensions: /\.(?:png|jpe?g|gif|webp)$/i },
  cursor: { title: "Custom Cursor", description: "Dodaj obraz kursora. Dla najlepszego efektu użyj małego pliku PNG.", accept: "image/png,image/jpeg,image/gif,image/webp", maxSize: 256000, test: /^image\/(?:png|jpeg|gif|webp)$/i, extensions: /\.(?:png|jpe?g|gif|webp)$/i }
});
function safeNumber(value, min, max, fallback) { const number = Number(value); return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback; }
function choice(value, list, fallback) { return list.includes(value) ? value : fallback; }
function bool(value, fallback) { return typeof value === "boolean" ? value : fallback; }
function hexRgb(value) { const hex = safeColor(value).slice(1); return `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`; }
function brandMarkup(className = "brand-wordmark") { return `<img class="${escapeHtml(className)}" src="/sqezen-logo-chrome.png" alt="sqezen">`; }
function sanitizeDynamicEmbedPositions(raw = {}) { const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}; const defaults = { profile: { x: 50, y: 35 }, connections: { x: 78, y: 55 }, badges: { x: 75, y: 82 }, audio: { x: 25, y: 82 }, lyrics: { x: 76, y: 27 } }; const legacyScale = { profile: { x: 0.5, y: 0.5 }, connections: { x: 0.5, y: 0.5 }, badges: { x: 0.5, y: 0.5 }, audio: { x: 0.5, y: 0.4 }, lyrics: { x: 0.5, y: 0.5 } }; const position = (candidate, key) => { const fallback = defaults[key]; if (candidate?.free === true) return { x: safeNumber(candidate.x, 0, 100, fallback.x), y: safeNumber(candidate.y, 0, 100, fallback.y), free: true }; const scale = legacyScale[key]; return { x: safeNumber(fallback.x + safeNumber(candidate?.x, -35, 35, 0) * scale.x, 0, 100, fallback.x), y: safeNumber(fallback.y + safeNumber(candidate?.y, -30, 30, 0) * scale.y, 0, 100, fallback.y), free: true }; }; return { profile: position(value.profile, "profile"), connections: position(value.connections, "connections"), badges: position(value.badges, "badges"), audio: position(value.audio, "audio"), lyrics: position(value.lyrics, "lyrics") }; }
function sanitizeCustomization(raw = {}) { const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}; return { backgroundMediaUrl: safeMediaUrl(value.backgroundMediaUrl), audioUrl: safeMediaUrl(value.audioUrl), audioTitle: String(value.audioTitle || "").trim().slice(0, 80), audioArtist: String(value.audioArtist || "").trim().slice(0, 60), audioLyrics: String(value.audioLyrics || "").trim().slice(0, 12000), cursorUrl: safeMediaUrl(value.cursorUrl), cursorGlowColor: themeColor(value.cursorGlowColor), location: String(value.location || "").trim().slice(0, 42), profileOpacity: safeNumber(value.profileOpacity, 45, 100, 92), profileBlur: safeNumber(value.profileBlur, 0, 40, 18), cardWidth: safeNumber(value.cardWidth, 360, 680, 520), avatarSize: safeNumber(value.avatarSize, 72, 148, 104), backgroundEffect: choice(value.backgroundEffect, ["none", "noise", "grid", "spotlight"], "none"), usernameEffect: choice(value.usernameEffect, ["none", "gradient", "soft-glow", "outline"], "none"), textColor: migrateColor(value.textColor, "#f5f7fb", "#f5f6fb"), cardColor: migrateColor(value.cardColor, "#171820", "#111116"), buttonColor: migrateColor(value.buttonColor, "#ffffff", "#5865ee"), buttonTextColor: migrateColor(value.buttonTextColor, "#f5f7fb", "#ffffff"), gradientPrimary: migrateColor(value.gradientPrimary, "#151521", "#000000"), gradientSecondary: migrateColor(value.gradientSecondary, "#07070a", "#000000"), useGradient: bool(value.useGradient, false), alignment: choice(value.alignment, ["center", "left"], "center"), spacing: choice(value.spacing, ["compact", "comfortable", "airy"], "comfortable"), buttonStyle: choice(value.buttonStyle, ["glass", "solid", "outline"], "glass"), buttonRadius: safeNumber(value.buttonRadius, 0, 28, 13), fontFamily: choice(value.fontFamily, ["inter", "system", "mono", "serif"], "inter"), showHandle: bool(value.showHandle, true), showBranding: bool(value.showBranding, true) }; }
const baseSanitizeCustomization = sanitizeCustomization;
sanitizeCustomization = (raw = {}) => ({ ...baseSanitizeCustomization(raw), cursorUrl: safeCursorUrl(raw?.cursorUrl) });
const NAME_EFFECT_VALUES = ["none", "fuzzy", "typewrite", "rainbow", "shuffle", "gradient", "soft-glow", "outline"];
const NAME_PARTICLE_VALUES = ["none", "blue", "green", "pink", "red", "white", "yellow"];
let lastProfileParticles = "none";
const BADGE_DEFINITIONS = [
  { id: "staff", name: "Staff", description: "Be a part of the sqezen.lol staff team.", symbol: "⚒" },
  { id: "helper", name: "Helper", description: "Be active and help users in the community.", symbol: "💡" },
  { id: "premium", name: "Premium", description: "Purchase the premium package.", symbol: "◆" },
  { id: "verified", name: "Verified", description: "Purchase or be a known content creator.", symbol: "✹" },
  { id: "donor", name: "Donor", description: "Donate at least 10€ to sqezen.lol.", symbol: "$" },
  { id: "bug-hunter", name: "Bug Hunter", description: "Report a bug to the sqezen.lol team.", symbol: "✿" },
  { id: "og", name: "OG", description: "Be an early supporter of sqezen.lol.", symbol: "▮" },
  { id: "summer-2026", name: "Summer 2026", description: "Exclusive badge from the 2026 summer sale.", symbol: "☀" },
  { id: "winner", name: "Winner", description: "Win a sqezen.lol event.", symbol: "♛" }
];
const BADGE_VALUES = BADGE_DEFINITIONS.map((badge) => badge.id);
const BADGE_MAX = 8;
let lastProfileBadges = [];
const baseNameSanitizeCustomization = sanitizeCustomization;
sanitizeCustomization = (raw = {}) => {
  const value = baseNameSanitizeCustomization(raw);
  const usernameEffect = String(raw?.usernameEffect || "");
  const normalizedUsernameEffect = usernameEffect === "glitch" ? "fuzzy" : usernameEffect;
  const nameParticles = String(raw?.nameParticles || "");
  const badges = Array.isArray(raw?.badges) ? raw.badges.filter((badge) => BADGE_VALUES.includes(String(badge))).map(String).filter((badge, index, list) => list.indexOf(badge) === index).slice(0, BADGE_MAX) : [];
  lastProfileParticles = NAME_PARTICLE_VALUES.includes(nameParticles) ? nameParticles : "none";
  lastProfileBadges = badges;
  const defaultEmbed = String(raw?.defaultEmbed || "");
  return { ...value, usernameEffect: NAME_EFFECT_VALUES.includes(normalizedUsernameEffect) ? normalizedUsernameEffect : value.usernameEffect, nameParticles: lastProfileParticles, badges, defaultEmbed: choice(defaultEmbed, ["standard", "dynamic"], "standard"), dynamicEmbedPositions: sanitizeDynamicEmbedPositions(raw?.dynamicEmbedPositions) };
};
const baseReadCustomization = readCustomization;
readCustomization = (form) => {
  const value = baseReadCustomization(form);
  const nameParticles = String(form?.elements.name_particles?.value || "none");
  return { ...value, nameParticles: NAME_PARTICLE_VALUES.includes(nameParticles) ? nameParticles : "none" };
};
const baseSetCustomization = setCustomization;
setCustomization = (form, raw) => {
  const config = baseSetCustomization(form, raw);
  if (form?.elements.name_particles) form.elements.name_particles.value = config.nameParticles || "none";
  form?.querySelectorAll("[data-badge-option]").forEach((option) => {
    const selected = config.badges?.includes(option.dataset.badgeOption);
    option.classList.toggle("is-selected", selected);
    const action = option.querySelector("[data-badge-action]");
    if (action) action.textContent = selected ? "Selected" : "Select";
  });
  return config;
};
const baseSetEmbedCustomization = setCustomization;
setCustomization = (form, raw) => {
  const config = baseSetEmbedCustomization(form, raw);
  if (form?.elements.default_embed) form.elements.default_embed.value = config.defaultEmbed || "standard";
  return config;
};
const baseReadBadgesCustomization = readCustomization;
readCustomization = (form) => ({ ...baseReadBadgesCustomization(form), badges: Array.from(form?.querySelectorAll("[data-badge-option].is-selected") || []).map((option) => option.dataset.badgeOption).filter((badge) => BADGE_VALUES.includes(badge)).slice(0, BADGE_MAX) });
const baseReadEmbedCustomization = readCustomization;
readCustomization = (form) => ({ ...baseReadEmbedCustomization(form), defaultEmbed: choice(String(form?.elements.default_embed?.value || "standard"), ["standard", "dynamic"], "standard") });
const baseReadDynamicEmbedCustomization = readCustomization;
readCustomization = (form) => { let positions = {}; try { positions = JSON.parse(String(form?.elements.dynamic_embed_positions?.value || "{}")); } catch {} return { ...baseReadDynamicEmbedCustomization(form), dynamicEmbedPositions: sanitizeDynamicEmbedPositions(positions) }; };
const baseSetDynamicEmbedCustomization = setCustomization;
setCustomization = (form, raw) => { const config = baseSetDynamicEmbedCustomization(form, raw); if (form?.elements.dynamic_embed_positions) form.elements.dynamic_embed_positions.value = JSON.stringify(config.dynamicEmbedPositions || sanitizeDynamicEmbedPositions()); return config; };
function feedback(message, error = false) { const node = document.querySelector("#form-feedback"); if (!node) return; node.textContent = message; node.className = `form-feedback ${message ? error ? "is-error" : "is-success" : ""}`; }
function busy(button, value, label = "Pracuję…") { if (!button) return; if (value) { button.dataset.original = button.innerHTML; button.disabled = true; button.innerHTML = `<span class="button-spinner"></span>${escapeHtml(label)}`; } else { button.disabled = false; button.innerHTML = button.dataset.original || button.innerHTML; } }
function errorText(error) { const message = String(error?.message || error || "").toLowerCase(); if (message.includes("invalid login")) return "Nieprawidłowy e-mail lub hasło."; if (message.includes("already registered")) return "To konto już istnieje. Zaloguj się."; if (message.includes("rate limit")) return "Za dużo prób. Odczekaj chwilę."; if (message.includes("expired")) return "Kod wygasł. Wyślij nowy."; if (message.includes("invalid token") || message.includes("otp is invalid")) return "Kod jest nieprawidłowy."; if (message.includes("duplicate") || message.includes("unique")) return "Ta nazwa użytkownika jest już zajęta."; if (message.includes("fetch") || message.includes("network")) return "Nie udało się połączyć z serwerem."; return "Coś poszło nie tak. Spróbuj ponownie."; }
function layout(content, pageClass = "site-page") { return `<div class="${pageClass}"><header class="site-nav"><a class="brand" href="/">${brandMarkup()}</a><nav class="nav-actions"><a class="nav-link" href="/">O projekcie</a><a class="button button-small button-ghost" href="/login">Zaloguj się</a><a class="button button-small button-primary" href="/register">Stwórz profil ${icon("arrow")}</a></nav></header>${content}<footer class="site-footer"><span>sqezen.lol</span><span>your space online</span></footer></div>`; }
function button(href, label, primary = false) { return `<a class="button ${primary ? "button-primary" : "button-ghost"}" href="${escapeHtml(href)}">${escapeHtml(label)} ${icon("arrow")}</a>`; }
const BADGE_GLYPHS = {
  staff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m4.1 17.9 8.7-8.7 2 2-8.7 8.7a2.8 2.8 0 0 1-2.9.6l.6-2.6.3.3Z"/><path fill="currentColor" d="M13.5 4.1a3.8 3.8 0 0 0 4.8 4.8l-2.2 2.2-4.8-4.8 2.2-2.2ZM17.7 13.3l2.1-2.1 2.1 2.1-2.1 2.1 2.1 2.1-2.1 2.1-2.1-2.1-2.1 2.1-2.1-2.1 2.1-2.1-2.1-2.1 2.1-2.1Z"/></svg>`,
  helper: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6a6 6 0 0 0-3.6 10.8c.7.5.9 1.1.9 1.9h5.4c0-.8.2-1.4.9-1.9A6 6 0 0 0 12 2.6Z"/><path fill="currentColor" d="M9.3 16.3h5.4v2H9.3zM10.2 19.1h3.6v1.5h-3.6z"/></svg>`,
  premium: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m3 8 4-4h10l4 4-9 13L3 8Z"/><path fill="none" stroke="currentColor" stroke-width="1.2" d="m3 8h18M7 4l5 17 5-17M3 8l9 4 9-4"/></svg>`,
  verified: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2 2 1.5 2.5-.1 1 2.3 2.2 1.2-.5 2.4 1.3 2-1.3 2 .5 2.4-2.2 1.2-1 2.3-2.5-.1L12 22l-2-1.4-2.5.1-1-2.3-2.2-1.2.5-2.4-1.3-2 1.3-2-.5-2.4 2.2-1.2 1-2.3L10 3.5 12 2Z"/><path fill="none" stroke="#08080b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m8.1 12.2 2.4 2.4 5.4-5.4"/></svg>`,
  donor: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor"/><path fill="none" stroke="#07120d" stroke-linecap="round" stroke-width="1.6" d="M14.5 8.5c-.6-.5-1.4-.8-2.4-.8-1.2 0-2.1.6-2.1 1.5 0 2.2 4.8.9 4.8 3.5 0 1-.9 1.6-2.3 1.6-1 0-1.9-.3-2.6-.9M12 6.8v10.4"/></svg>`,
  gifter: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9h18v12H3zM2 6h20v4H2z"/><path fill="none" stroke="#17120a" stroke-width="1.5" d="M12 6v15M2 9h20"/><path fill="currentColor" d="M12 6H7.6C5.4 6 4.7 3.2 6.8 2.7 9.4 2.1 12 6 12 6ZM12 6h4.4c2.2 0 2.9-2.8.8-3.3C14.6 2.1 12 6 12 6Z"/></svg>`,
  "image-host": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.5 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.5Z"/><path fill="none" stroke="#07120d" stroke-linecap="round" stroke-width="1.5" d="M12 8.3v7.2"/></svg>`,
  "domain-legend": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.5 13.7 13.9 4.3l5.8-.9-.9 5.8-9.4 9.4-4.4-.5-.5-4.4Z"/><path fill="none" stroke="#1b0b0c" stroke-linecap="round" stroke-width="1.4" d="m5.5 18.5 5.7-5.7M15.8 7.8h.1"/><path fill="currentColor" d="m3 21 2.7-1.3-1.4-1.4L3 21Z"/></svg>`,
  "hone-gg": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.2" d="M19.2 9.2A8 8 0 1 0 18 16.5"/><path fill="currentColor" d="m16.6 5.2 4.3 1.4-1.3 4.4-1.6-2.4-2.8 1.1 1.4-4.5Z"/></svg>`,
  "bug-hunter": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="6" width="10" height="13" rx="5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" d="M9 4.5 10.5 7M15 4.5 13.5 7M4 10h4M16 10h4M4.5 15h3.8M15.7 15h3.8M8 19l-1 2M16 19l1 2"/><circle cx="10" cy="11" r=".8" fill="#07120d"/><circle cx="14" cy="11" r=".8" fill="#07120d"/></svg>`,
  og: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 3h5v7l-2.5-1.5L6 10V3ZM13 3h5v7l-2.5-1.5L13 10V3Z"/><path fill="currentColor" d="M12 7.5 13.6 11l3.8.4-2.9 2.5.9 3.7-3.4-1.9-3.4 1.9.9-3.7-2.9-2.5 3.8-.4L12 7.5Z"/></svg>`,
  "summer-2026": `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>`,
  "easter-2026": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.2 9.1C7.3 7.3 6.4 2.7 8 2.3c1.3-.3 2.5 3.1 2.7 5.5.4-.1.8-.1 1.3-.1s.9 0 1.3.1c.2-2.4 1.4-5.8 2.7-5.5 1.6.4.7 5-1.2 6.8 1.5.9 2.5 2.5 2.5 4.5 0 3.6-2.4 6-5.3 6s-5.3-2.4-5.3-6c0-2 1-3.6 2.5-4.5Z"/><circle cx="10" cy="12" r=".7" fill="#151021"/><circle cx="14" cy="12" r=".7" fill="#151021"/></svg>`,
  "christmas-2025": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M7 3.8l1.7 2.9M17 3.8l-1.7 2.9M7 20.2l1.7-2.9M17 20.2l-1.7-2.9M2.9 12h3.4M17.7 12h3.4"/></svg>`,
  "easter-2025": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.7c3.8 2.1 6.2 5.7 6.2 10.1 0 4.6-2.4 8-6.2 8s-6.2-3.4-6.2-8c0-4.4 2.4-8 6.2-10.1Z"/><path fill="none" stroke="#2a1119" stroke-linecap="round" stroke-width="1.4" d="M7 8.5c3 1.1 7 1.1 10 0M6.2 13c3.4 1.2 8.2 1.2 11.6 0M7.1 17.5c3.1 1 6.7 1 9.8 0"/></svg>`,
  "christmas-2024": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.5 5.3c2.7-2.2 5.2-.3 4.7 2-.5 2.1-2.8 2.3-4.1 1.3M15.1 8.5c-2.9 2.7-2.3 5.7-.3 7.1 1.7 1.2 1.5 3.4.1 4.3"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.4" d="M14.8 8.8c-1.7 1.1-3.7 2.3-3.7 4.7 0 2.1 1.1 3.1 2.5 3.1"/></svg>`,
  "the-million": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m3 9 7 2.2L18.7 5l-2.2 7.3L21 16l-7.3.2L9 21l.1-7.2L3 9Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m18.5 3 .1 1.7M21 5.2l-1.2 1.2M4.5 4.2l-.2 1.7M2.4 6.6l1.4.6"/></svg>`,
  winner: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10v5.3a5 5 0 0 1-3.8 4.8V16h3v2H7v-2h3v-2.9A5 5 0 0 1 7 8.3V3Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 5H4.5v2.2A3.8 3.8 0 0 0 8 11M17 5h2.5v2.2A3.8 3.8 0 0 1 16 11M6 21h12"/></svg>`,
  "second-place": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h4v7l-2 3-2-3V3ZM13 3h4v7l-2 3-2-3V3Z"/><circle cx="12" cy="14" r="6.5" fill="currentColor"/><path fill="none" stroke="#111116" stroke-linecap="round" stroke-width="1.5" d="M12 10.6v6M10.3 12.2c.4-.5 1-.8 1.7-.8 1 0 1.7.5 1.7 1.3 0 1.7-3.4 1-3.4 2.5 0 .8.7 1.4 1.8 1.4.6 0 1.2-.2 1.6-.5"/></svg>`,
  "third-place": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h4v7l-2 3-2-3V3ZM13 3h4v7l-2 3-2-3V3Z"/><circle cx="12" cy="14" r="6.5" fill="currentColor"/><path fill="none" stroke="#111116" stroke-linecap="round" stroke-width="1.5" d="M10.4 12c.3-.4.9-.7 1.6-.7 1 0 1.6.5 1.6 1.2 0 .6-.4 1-1.1 1.2 1 .2 1.5.7 1.5 1.4 0 .9-.8 1.5-2 1.5-.8 0-1.4-.2-1.9-.7"/></svg>`
};
function badgeIcon(badge) { return `<span class="badge-symbol badge-${escapeHtml(badge.id)}" aria-hidden="true">${BADGE_GLYPHS[badge.id] || escapeHtml(badge.symbol)}</span>`; }
function badgePills(badges = []) { return badges.map((id) => BADGE_DEFINITIONS.find((badge) => badge.id === id)).filter(Boolean).map((badge) => `<span class="profile-badge" title="${escapeHtml(badge.name)}" aria-label="${escapeHtml(badge.name)}">${badgeIcon(badge)}</span>`).join(""); }
function dynamicBadgeItems(badges = []) { return badges.map((id) => BADGE_DEFINITIONS.find((badge) => badge.id === id)).filter(Boolean).map((badge) => `<span class="embed-badge" title="${escapeHtml(badge.name)}" aria-label="${escapeHtml(badge.name)}">${badgeIcon(badge)}</span>`).join(""); }
function badgeCards() { return BADGE_DEFINITIONS.map((badge) => `<button class="badge-card" data-badge-option="${escapeHtml(badge.id)}" type="button"><span class="badge-card-symbol">${badgeIcon(badge)}</span><span class="badge-card-copy"><strong>${escapeHtml(badge.name)}</strong><small>${escapeHtml(badge.description)}</small></span><span class="badge-card-action" data-badge-action>Select</span></button>`).join(""); }

function landing() { return layout(`<main class="landing-main"><section class="landing-hero"><div class="hero-copy"><p class="eyebrow"><i class="eyebrow-dot"></i> YOUR SPACE ONLINE</p><h1>Twój internet.<br><em>W jednym miejscu.</em></h1><p class="hero-lead">Minimalistyczny profil bio dla ludzi, którzy budują, tworzą i są gdzieś pomiędzy. Jeden adres. Twoje zasady.</p><div class="hero-actions">${button("/register", "Zacznij za darmo", true)}${button("/login", "Zaloguj się")}</div><div class="trust-row"><span>${icon("check")} Bez reklam</span><span>${icon("lock")} Prywatne konto</span><span>${icon("link")} Jeden link</span></div></div><div class="landing-showcase"><div class="showcase-chrome"><span><i></i><i></i><i></i></span><small>sqezen.lol / profile</small><b>${icon("arrowUp")}</b></div><div class="showcase-profile"><div class="showcase-top"><span class="showcase-avatar">s</span><span class="showcase-menu">•••</span></div><p class="showcase-handle">@sqezen</p><h2>sqezen</h2><p class="showcase-bio">developer <b>·</b> gamer <b>·</b> digital chaos</p><div class="showcase-links"><div>${icon("github")}<span>GitHub</span><b>↗</b></div><div>${icon("discord")}<span>Discord</span><b>↗</b></div><div>${icon("youtube")}<span>YouTube</span><b>↗</b></div></div><div class="showcase-footer"><span>online now</span><span>sqezen.lol/sqezen</span></div></div></div></section><section class="landing-stats"><div><strong>01</strong><span>Stwórz swój profil</span></div><div><strong>∞</strong><span>Możliwości personalizacji</span></div><div><strong>24/7</strong><span>Twój adres jest online</span></div></section><section class="landing-manifesto"><div><p class="eyebrow">DLACZEGO SQEZEN</p><h2>Ma wyglądać jak Ty,<br><em>nie jak kolejny link-in-bio.</em></h2></div><div class="manifesto-copy"><p>Profil, który jest szybki, spokojny i gotowy do udostępnienia. Zbierasz linki, ustawiasz klimat i dostajesz własny adres pod sqezen.lol.</p><div class="manifesto-list"><div><span>01</span><strong>Wyraźny profil</strong><small>Nick, opis i linki bez zbędnego hałasu.</small></div><div><span>02</span><strong>Pełna kontrola</strong><small>Kolory, karta, tło, font i układ w jednym panelu.</small></div><div><span>03</span><strong>Gotowe do wysłania</strong><small>Jeden adres dla znajomych, społeczności i bio.</small></div></div></div></section><section class="landing-cta"><div><p class="eyebrow">MAKE IT YOURS</p><h2>Masz już miejsce<br>dla swoich linków.</h2></div>${button("/register", "Zarezerwuj nazwę", true)}</section></main>`, "site-page landing-page"); }

function landingMinimal() { return `<div class="landing-minimal-page"><main class="landing-minimal-inner"><div class="sqezen-logo" role="img" aria-label="Logo sqezen"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M47 16H27a10 10 0 0 0 0 20h10a10 10 0 0 1 0 20H17"/><path d="M17 16h9"/></svg></div><h1 class="landing-minimal-title">sqezen</h1><div class="landing-showcase landing-example"><div class="showcase-chrome"><span><i></i><i></i><i></i></span><small>sqezen.lol / profile</small><b>${icon("arrowUp")}</b></div><div class="showcase-profile"><div class="showcase-top"><span class="showcase-avatar">s</span><span class="showcase-menu">•••</span></div><p class="showcase-handle">@sqezen</p><h2>sqezen</h2><p class="showcase-bio">developer <b>·</b> gamer <b>·</b> digital chaos</p><div class="showcase-links"><div>${icon("github")}<span>GitHub</span><b>↗</b></div><div>${icon("discord")}<span>Discord</span><b>↗</b></div><div>${icon("youtube")}<span>YouTube</span><b>↗</b></div></div><div class="showcase-footer"><span>online now</span><span>sqezen.lol/sqezen</span></div></div></div></main></div>`; }
function auth(kind) { const isRegister = kind === "register"; const isCode = kind === "code"; const title = isCode ? "Potwierdź swój e-mail" : isRegister ? "Zbuduj swój adres" : "Witaj z powrotem"; const intro = isCode ? "Wpisz 8-cyfrowy kod z wiadomości. Nie używamy linków, więc zawsze wiesz, co potwierdzasz." : isRegister ? "Załóż konto i stwórz profil, który możesz wysłać wszędzie." : "Zaloguj się, aby zarządzać swoim profilem i personalizacją."; const form = isCode ? `<form id="code-form" class="stack-form"><label class="field-label">Kod z wiadomości<input class="code-input" name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" placeholder="00000000" required></label><button class="button button-primary button-wide" type="submit">Potwierdź kod ${icon("arrow")}</button><button class="text-button" id="resend-code" type="button">Wyślij kod ponownie</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Kod wygasa po kilku minutach. Sprawdź również folder Spam.</p><a class="back-link" href="/register">${icon("arrow")} Zmień dane</a>` : isRegister ? `<form id="register-form" class="stack-form"><label class="field-label">E-mail<input name="email" type="email" autocomplete="email" placeholder="ty@example.com" required></label><label class="field-label">Hasło<input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="minimum 6 znaków" required></label><button class="button button-primary button-wide" type="submit">Dalej ${icon("arrow")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Masz już konto? <a href="/login">Zaloguj się</a></p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a>` : `<form id="login-form" class="stack-form"><label class="field-label">E-mail<input name="email" type="email" autocomplete="email" placeholder="ty@example.com" required></label><label class="field-label">Hasło<input name="password" type="password" autocomplete="current-password" placeholder="Twoje hasło" required></label><button class="button button-primary button-wide" type="submit">Zaloguj się ${icon("arrow")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Nie masz konta? <a href="/register">Stwórz je za darmo</a></p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a>`; return `<div class="auth-shell"><header class="site-nav"><a class="brand" href="/">${brandMarkup()}</a><a class="nav-link" href="/">Wróć na stronę główną ${icon("arrowUp")}</a></header><main class="auth-main"><section class="auth-pitch"><p class="eyebrow">SQEZEN / ${isCode ? "VERIFY" : isRegister ? "JOIN" : "SIGN IN"}</p><h1>${title}</h1><p>${intro}</p><div class="auth-perks"><span>${icon("check")} Własny adres profilu</span><span>${icon("check")} Ciemny, lekki interfejs</span><span>${icon("check")} Personalizacja bez limitu pomysłów</span></div></section><section class="auth-card"><div class="auth-card-head"><span class="auth-card-icon">${isCode ? icon("mail") : isRegister ? icon("pencil") : icon("lock")}</span><span class="auth-card-step">${isCode ? "02 / VERIFY" : isRegister ? "01 / CREATE" : "ACCOUNT ACCESS"}</span></div><h2>${isCode ? "Wpisz kod" : isRegister ? "Utwórz konto" : "Zaloguj się"}</h2><p class="form-intro">${isCode ? "Kod znajdziesz w wiadomości wysłanej po rejestracji." : isRegister ? "Zaczniemy od e-maila i hasła." : "Twoje dane są obsługiwane bezpiecznie przez Supabase."}</p>${form}</section></main><footer class="site-footer"><span>sqezen.lol</span><span>private by design</span></footer></div>`; }

function iconOptions(selected = "website") { return [["website", "Strona / link"], ["github", "GitHub"], ["discord", "Discord"], ["youtube", "YouTube"], ["tiktok", "TikTok"]].map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join(""); }
function profileIcon(link) { const value = String(link?.icon || "").toLowerCase(); if (["github", "discord", "youtube", "tiktok"].includes(value)) return value; const url = String(link?.url || "").toLowerCase(); if (url.includes("github.com")) return "github"; if (url.includes("discord")) return "discord"; if (url.includes("youtube") || url.includes("youtu.be")) return "youtube"; if (url.includes("tiktok")) return "tiktok"; return "globe"; }
function linkItem(link = {}, index = 0) { const selected = ["website", "github", "discord", "youtube", "tiktok"].includes(link.icon) ? link.icon : "website"; return `<article class="link-item" data-link-item><div class="link-item-top"><span class="link-number">${String(index + 1).padStart(2, "0")}</span><span class="link-item-name">Link ${index + 1}</span><div class="link-item-actions"><button type="button" class="icon-button" data-link-action="up" aria-label="Przesuń link wyżej">↑</button><button type="button" class="icon-button" data-link-action="down" aria-label="Przesuń link niżej">↓</button><button type="button" class="icon-button" data-link-action="duplicate" aria-label="Duplikuj link">＋</button><button type="button" class="icon-button danger-icon" data-link-action="remove" aria-label="Usuń link">${icon("close")}</button></div></div><div class="link-fields"><label class="field-label">Tytuł<input data-link-title maxlength="38" value="${escapeHtml(link.title || "")}" placeholder="np. Mój GitHub"></label><label class="field-label">Adres lub tekst<input data-link-url value="${escapeHtml(link.url || "")}" placeholder="discord.gg/nazwa lub dowolny tekst"><small>Dodaj dowolny tekst — przed otwarciem zamienimy go w adres.</small></label><label class="field-label">Ikona<select data-link-icon>${iconOptions(selected)}</select></label></div></article>`; }

function dashboard() { return `<div class="dashboard-page"><header class="dashboard-topbar"><a class="brand" href="/"><span class="brand-mark">s</span><span>sqezen</span></a><div class="dashboard-topbar-center"><span class="topbar-breadcrumb">Workspace <b>/</b> <strong id="topbar-section">Profil</strong></span><span class="save-status" id="top-status"><i></i> gotowe do edycji</span></div><div class="dashboard-topbar-actions"><a class="button button-small button-ghost" id="view-profile" href="/" target="_blank" rel="noopener noreferrer">Otwórz profil ${icon("arrowUp")}</a><button class="icon-button mobile-menu" id="mobile-menu" type="button" aria-label="Otwórz menu">☰</button><button class="button button-small button-dark" id="logout-button" type="button">Wyloguj ${icon("logout")}</button></div></header><div class="dashboard-layout"><aside class="dashboard-sidebar" id="dashboard-sidebar"><div class="sidebar-brand"><span class="sidebar-label">WORKSPACE</span><span class="sidebar-caption">Twój panel</span></div><nav class="dashboard-nav-list" aria-label="Panel profilu"><button class="sidebar-item is-active" data-dashboard-tab="profile" type="button">${icon("dashboard")}<span>Profil</span><kbd>01</kbd></button><button class="sidebar-item" data-dashboard-tab="links" type="button">${icon("link")}<span>Linki</span><kbd id="links-count">0</kbd></button><button class="sidebar-item" data-dashboard-tab="appearance" type="button">${icon("palette")}<span>Wygląd</span><kbd>03</kbd></button></nav><div class="sidebar-rule"></div><span class="sidebar-label">ACCOUNT</span><button class="sidebar-item" data-dashboard-tab="account" type="button">${icon("settings")}<span>Konto</span></button><div class="sidebar-account"><span class="account-avatar" id="account-avatar">S</span><div><strong id="account-name">Twoje konto</strong><small id="account-email">Ładowanie…</small></div></div><div class="sidebar-bottom"><span>${icon("lock")} Supabase auth</span><small>Twoje dane są prywatne</small></div></aside><main class="dashboard-main"><div class="dashboard-intro"><div><p class="eyebrow" id="dashboard-eyebrow">SQEZEN / PROFILE</p><h1 id="dashboard-title">Zbuduj swój profil.</h1><p id="dashboard-subtitle">Ustaw informacje, które zobaczą osoby odwiedzające Twój adres.</p></div><span class="intro-orb">${icon("sparkle")}</span></div><form id="profile-form" class="dashboard-grid"><div class="editor-panel"><section data-tab-panel="profile"><div class="panel-heading"><div><span class="panel-index">01</span><h2>Tożsamość</h2><p>To pojawi się na samej górze Twojego profilu.</p></div></div><div class="field-grid"><label class="field-label">Nazwa użytkownika<input name="username" pattern="[a-z0-9_]{3,24}" minlength="3" maxlength="24" placeholder="np. sqezen" required><small>sqezen.lol/<b>twoja_nazwa</b> · małe litery, cyfry i _</small></label><label class="field-label">Nazwa wyświetlana<input name="display_name" maxlength="40" placeholder="Twoja nazwa" required><small>Może zawierać spacje i wielkie litery.</small></label></div><label class="field-label bio-field">Bio<textarea name="bio" maxlength="160" placeholder="developer · gamer · digital chaos"></textarea><small><span>Krótko i konkretnie.</span><span id="bio-count">0 / 160</span></small></label><div class="panel-divider"></div><div class="panel-heading compact-heading"><div><span class="panel-index">02</span><h2>Avatar</h2><p>Bezpośredni adres do zdjęcia profilowego.</p></div></div><label class="field-label"><span>Avatar URL</span><input name="avatar_url" type="text" inputmode="url" placeholder="https://.../avatar.png"><small>Może być dowolny bezpośredni adres obrazka.</small></label></section><section data-tab-panel="links" hidden><div class="panel-heading"><div><span class="panel-index">LINKS</span><h2>Twoje odnośniki</h2><p>Ułóż miejsca, w których można Cię znaleźć.</p></div><button class="button button-small button-ghost" id="add-link" type="button">${icon("plus")} Dodaj link</button></div><div class="link-tip">W polu adresu możesz wkleić domenę, zaproszenie Discord albo zwykły tekst. Kolejność zmienisz strzałkami.</div><div id="links-list" class="links-editor"></div></section><section data-tab-panel="appearance" hidden><div class="panel-heading"><div><span class="panel-index">CUSTOMIZE</span><h2>Twój klimat</h2><p>Ustaw profil dokładnie tak, jak chcesz go pokazywać.</p></div><button class="button button-small button-dark" id="reset-customization" type="button">Resetuj</button></div><div class="custom-card"><div class="custom-card-title"><span>${icon("sparkle")}</span><div><h3>Materiały</h3><p>Tło, muzyka i dodatkowe detale.</p></div></div><div class="field-grid"><label class="field-label">Tło obrazu / wideo<input name="background_media_url" type="text" placeholder="https://.../background.mp4"><small>JPG, PNG, GIF, WebP, MP4 lub WebM.</small></label><label class="field-label">Audio profilu<input name="audio_url" type="text" placeholder="https://.../track.mp3"><small>Odwiedzający uruchamia je ręcznie.</small></label><label class="field-label">Własny kursor<input name="cursor_url" type="text" placeholder="https://.../cursor.png"><small>Najlepiej obraz 32×32 px.</small></label><label class="field-label">Lokalizacja<input name="location" maxlength="42" placeholder="np. Warszawa"></label></div></div><div class="custom-card"><div class="custom-card-title"><span>${icon("dashboard")}</span><div><h3>Karta profilu</h3><p>Rozmiar i intensywność powierzchni.</p></div></div><div class="range-grid"><label class="range-field"><span>Przezroczystość <output data-output-for="profile_opacity">92%</output></span><input name="profile_opacity" type="range" min="45" max="100" value="92"></label><label class="range-field"><span>Blur <output data-output-for="profile_blur">18px</output></span><input name="profile_blur" type="range" min="0" max="40" value="18"></label><label class="range-field"><span>Szerokość <output data-output-for="card_width">520px</output></span><input name="card_width" type="range" min="360" max="680" step="10" value="520"></label><label class="range-field"><span>Avatar <output data-output-for="avatar_size">104px</output></span><input name="avatar_size" type="range" min="72" max="148" step="4" value="104"></label></div><div class="field-grid"><label class="field-label">Efekt tła<select name="background_effect"><option value="none">Brak</option><option value="noise">Subtelny noise</option><option value="grid">Delikatna siatka</option><option value="spotlight">Miękki spotlight</option></select></label><label class="field-label">Efekt nazwy<select name="username_effect"><option value="none">Brak</option><option value="gradient">Gradient</option><option value="soft-glow">Delikatny glow</option><option value="outline">Kontur</option></select></label></div></div><div class="custom-card"><div class="custom-card-title"><span>${icon("palette")}</span><div><h3>Kolor i ton</h3><p>Stwórz paletę pasującą do Twojej osoby.</p></div></div><div class="color-grid"><label class="color-control">Akcent<input name="background_color" type="color" value="#c9cdd4"><b id="color-value">#C9CDD4</b></label><label class="color-control">Tekst<input name="text_color" type="color" value="#f5f7fb"><b data-color-label="text_color">#F5F7FB</b></label><label class="color-control">Karta<input name="card_color" type="color" value="#171820"><b data-color-label="card_color">#171820</b></label><label class="color-control">Przyciski<input name="button_color" type="color" value="#ffffff"><b data-color-label="button_color">#FFFFFF</b></label><label class="color-control">Tekst przycisków<input name="button_text_color" type="color" value="#f5f7fb"><b data-color-label="button_text_color">#F5F7FB</b></label><label class="color-control">Gradient 1<input name="gradient_primary" type="color" value="#151521"><b data-color-label="gradient_primary">#151521</b></label><label class="color-control">Gradient 2<input name="gradient_secondary" type="color" value="#07070a"><b data-color-label="gradient_secondary">#07070A</b></label></div><label class="toggle-row"><input name="use_gradient" type="checkbox" checked><span class="toggle"></span><span><b>Włącz gradient tła</b><small>Połącz wybrane kolory w delikatne tło.</small></span></label></div><div class="custom-card"><div class="custom-card-title"><span>${icon("settings")}</span><div><h3>Układ i detale</h3><p>Ostatnie szlify wyglądu strony.</p></div></div><div class="field-grid"><label class="field-label">Wyrównanie<select name="alignment"><option value="center">Wyśrodkowane</option><option value="left">Do lewej</option></select></label><label class="field-label">Odstępy<select name="spacing"><option value="compact">Kompaktowe</option><option value="comfortable">Wygodne</option><option value="airy">Przestronne</option></select></label><label class="field-label">Styl przycisków<select name="button_style"><option value="glass">Glass</option><option value="solid">Pełne</option><option value="outline">Kontur</option></select></label><label class="field-label">Font<select name="font_family"><option value="inter">Inter</option><option value="system">Systemowy</option><option value="mono">Monospace</option><option value="serif">Serif</option></select></label></div><label class="range-field"><span>Zaokrąglenie przycisków <output data-output-for="button_radius">13px</output></span><input name="button_radius" type="range" min="0" max="28" value="13"></label><div class="toggle-grid"><label class="toggle-row"><input name="show_handle" type="checkbox" checked><span class="toggle"></span><span><b>Pokaż @username</b><small>Nick nad nazwą.</small></span></label><label class="toggle-row"><input name="show_branding" type="checkbox" checked><span class="toggle"></span><span><b>Pokaż branding</b><small>Stopka sqezen.</small></span></label></div></div></section><section data-tab-panel="account" hidden><div class="panel-heading"><div><span class="panel-index">ACCOUNT</span><h2>Konto i adres</h2><p>Podstawowe informacje oraz szybkie akcje.</p></div></div><div class="account-grid"><label class="field-label">E-mail<input id="account-email-field" readonly></label><label class="field-label">Publiczny adres<div class="copy-field"><input id="profile-address-field" readonly><button class="icon-button" id="copy-profile-address" type="button" aria-label="Skopiuj adres">${icon("copy")}</button></div></label></div><div class="account-note">${icon("lock")} <div><b>Twoje konto jest chronione</b><p>Sesja i hasło są obsługiwane przez Supabase. sqezen nie przechowuje haseł.</p></div></div></section><div class="editor-footer"><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p><button class="button button-primary save-button" type="submit">Zapisz wszystkie zmiany ${icon("check")}</button></div></div><aside class="preview-column"><div class="preview-sticky"><div class="preview-heading"><div><span class="panel-index">LIVE PREVIEW</span><h2>Tak widzą Cię inni</h2></div><span class="live-pill"><i></i> na żywo</span></div><div id="dashboard-preview" class="dashboard-preview"></div><div class="preview-footnote">${icon("check")} Zmiany są widoczne tutaj od razu. Opublikują się po zapisaniu.</div></div></aside></form></main></div></div>`; }

function readLinks() { return Array.from(document.querySelectorAll("[data-link-item]")).map((item) => ({ title: String(item.querySelector("[data-link-title]")?.value || "").trim(), url: String(item.querySelector("[data-link-url]")?.value || "").trim(), icon: String(item.querySelector("[data-link-icon]")?.value || "website") })).filter((link) => link.title || link.url); }
function readCustomization(form) { const values = new FormData(form); return sanitizeCustomization({ backgroundMediaUrl: values.get("background_media_url"), audioUrl: values.get("audio_url"), audioTitle: values.get("audio_title"), audioArtist: values.get("audio_artist"), audioLyrics: values.get("audio_lyrics"), cursorUrl: values.get("cursor_url"), cursorGlowColor: values.get("cursor_glow_color"), location: values.get("location"), profileOpacity: values.get("profile_opacity"), profileBlur: values.get("profile_blur"), cardWidth: values.get("card_width"), avatarSize: values.get("avatar_size"), backgroundEffect: values.get("background_effect"), usernameEffect: values.get("username_effect"), textColor: values.get("text_color"), cardColor: values.get("card_color"), buttonColor: values.get("button_color"), buttonTextColor: values.get("button_text_color"), gradientPrimary: values.get("gradient_primary"), gradientSecondary: values.get("gradient_secondary"), useGradient: Boolean(form.elements.use_gradient?.checked), alignment: values.get("alignment"), spacing: values.get("spacing"), buttonStyle: values.get("button_style"), buttonRadius: values.get("button_radius"), fontFamily: values.get("font_family"), showHandle: Boolean(form.elements.show_handle?.checked), showBranding: Boolean(form.elements.show_branding?.checked) }); }
function setCustomization(form, raw) { const config = sanitizeCustomization(raw); const fields = { background_media_url: config.backgroundMediaUrl, audio_url: config.audioUrl, audio_title: config.audioTitle, audio_artist: config.audioArtist, audio_lyrics: config.audioLyrics, cursor_url: config.cursorUrl, cursor_glow_color: config.cursorGlowColor, location: config.location, profile_opacity: config.profileOpacity, profile_blur: config.profileBlur, card_width: config.cardWidth, avatar_size: config.avatarSize, background_effect: config.backgroundEffect, username_effect: config.usernameEffect, text_color: config.textColor, card_color: config.cardColor, button_color: config.buttonColor, button_text_color: config.buttonTextColor, gradient_primary: config.gradientPrimary, gradient_secondary: config.gradientSecondary, alignment: config.alignment, spacing: config.spacing, button_style: config.buttonStyle, button_radius: config.buttonRadius, font_family: config.fontFamily }; Object.entries(fields).forEach(([name, value]) => { if (form.elements[name]) form.elements[name].value = value; }); if (form.elements.use_gradient) form.elements.use_gradient.checked = config.useGradient; if (form.elements.show_handle) form.elements.show_handle.checked = config.showHandle; if (form.elements.show_branding) form.elements.show_branding.checked = config.showBranding; return config; }
function setupCustomizationCarousel() { const appearance = document.querySelector('[data-tab-panel="appearance"]'); if (!appearance || appearance.dataset.carouselReady) return; const cards = Array.from(appearance.querySelectorAll('.custom-card')); if (cards.length < 2) return; appearance.dataset.carouselReady = 'true'; cards.forEach((card, index) => { card.dataset.customStep = String(index); card.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'); }); const first = cards[0]; const nav = document.createElement('div'); nav.className = 'custom-carousel-nav'; nav.innerHTML = `<button class="carousel-arrow" data-custom-direction="prev" type="button" aria-label="Poprzednia sekcja">←</button><div class="custom-wheel-wrap"><div class="custom-wheel" data-custom-wheel aria-hidden="true">${Array.from({ length: cards.length }, () => "<i></i>").join("")}</div><div class="custom-wheel-label"><b data-custom-step-label>01</b><span data-custom-step-name>Materiały</span></div></div><button class="carousel-arrow" data-custom-direction="next" type="button" aria-label="Następna sekcja">→</button>`; const stage = document.createElement('div'); stage.className = 'custom-stage'; appearance.insertBefore(nav, first); appearance.insertBefore(stage, first); cards.forEach((card) => stage.appendChild(card)); const names = cards.map((card) => card.querySelector('h3')?.textContent?.trim() || 'Sekcja'); let active = 0; const show = (next, direction = 1) => { active = (next + cards.length) % cards.length; cards.forEach((card, index) => { const selected = index === active; card.classList.toggle('is-active', selected); card.setAttribute('aria-hidden', selected ? 'false' : 'true'); }); const wheel = nav.querySelector('[data-custom-wheel]'); wheel.classList.remove('is-turning'); void wheel.offsetWidth; wheel.style.transform = `rotate(${active * (360 / cards.length)}deg)`; wheel.classList.add(direction > 0 ? 'turn-right' : 'turn-left'); nav.querySelector('[data-custom-step-label]').textContent = String(active + 1).padStart(2, '0'); nav.querySelector('[data-custom-step-name]').textContent = names[active]; nav.querySelector('[data-custom-direction="prev"]').disabled = active === 0; nav.querySelector('[data-custom-direction="next"]').disabled = active === cards.length - 1; }; nav.addEventListener('click', (event) => { const button = event.target.closest('[data-custom-direction]'); if (!button) return; const direction = button.dataset.customDirection === 'next' ? 1 : -1; show(active + direction, direction); }); show(0, 1); }
function avatar(profile, className = "profile-avatar") { const name = profile?.display_name || profile?.username || "s"; const image = safeImageUrl(profile?.avatar_url); return image ? `<img class="${className}" src="${escapeHtml(image)}" alt="Avatar użytkownika ${escapeHtml(name)}" loading="eager">` : `<span class="${className} avatar-fallback" aria-label="Avatar użytkownika ${escapeHtml(name)}">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>`; }
function renderPreview() { const form = document.querySelector("#profile-form"); const target = document.querySelector("#dashboard-preview"); if (!form || !target) return; const config = readCustomization(form); const name = String(form.elements.display_name?.value || form.elements.username?.value || "Twoja nazwa").trim() || "Twoja nazwa"; const username = String(form.elements.username?.value || "username").trim().toLowerCase() || "username"; const bio = String(form.elements.bio?.value || "").trim(); const image = safeImageUrl(form.elements.avatar_url?.value); const links = readLinks(); const previewWidth = Math.round(70 + ((config.cardWidth - 360) / 320) * 30); target.style.setProperty("--preview-surface", config.useGradient ? `linear-gradient(145deg,${config.gradientPrimary},${config.gradientSecondary})` : config.gradientSecondary); target.innerHTML = `<div class="preview-card preview-align-${config.alignment} preview-buttons-${config.buttonStyle} preview-font-${config.fontFamily} preview-name-${config.usernameEffect}" style="width:${previewWidth}%;--preview-card-rgb:${hexRgb(config.cardColor)};--preview-text:${config.textColor};--preview-button-rgb:${hexRgb(config.buttonColor)};--preview-button-text:${config.buttonTextColor};--preview-opacity:${config.profileOpacity / 100};--preview-blur:${config.profileBlur}px;--preview-avatar:${config.avatarSize}px;--preview-radius:${config.buttonRadius}px"><div class="preview-card-top">${image ? `<img class="preview-avatar" src="${escapeHtml(image)}" alt="">` : `<span class="preview-avatar avatar-fallback">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>`}<span class="preview-menu">•••</span></div>${config.showHandle ? `<p class="preview-handle">@${escapeHtml(username)}</p>` : ""}<h3 class="preview-name">${escapeHtml(name)}</h3>${config.location ? `<p class="preview-location">${icon("globe")} ${escapeHtml(config.location)}</p>` : ""}<p class="preview-bio${bio ? "" : " preview-placeholder"}">${escapeHtml(bio || "Twój krótki opis pojawi się tutaj.")}</p><div class="preview-links">${links.length ? links.slice(0, 4).map((link) => `<div class="preview-link"><span>${icon(profileIcon(link))}</span><strong>${escapeHtml(link.title || "Nazwa linku")}</strong><i>↗</i></div>`).join("") : `<div class="preview-link preview-placeholder-link">Dodaj pierwszy link ${icon("plus")}</div>`}</div>${config.showBranding ? `<div class="preview-card-footer"><span>sqezen.lol/${escapeHtml(username)}</span></div>` : ""}</div>`; }

async function wireAuth() { const loginForm = document.querySelector("#login-form"); if (loginForm) loginForm.addEventListener("submit", async (event) => { event.preventDefault(); const submit = loginForm.querySelector("button[type=submit]"); const values = new FormData(loginForm); feedback("Logowanie…"); busy(submit, true, "Logowanie…"); const { error } = await supabaseClient.auth.signInWithPassword({ email: values.get("email"), password: values.get("password") }); busy(submit, false); if (error) return feedback(errorText(error), true); navigate("/dashboard"); }); const registerForm = document.querySelector("#register-form"); if (registerForm) registerForm.addEventListener("submit", async (event) => { event.preventDefault(); const submit = registerForm.querySelector("button[type=submit]"); const values = new FormData(registerForm); const email = String(values.get("email") || "").trim().toLowerCase(); feedback("Tworzenie konta…"); busy(submit, true, "Tworzenie konta…"); const { data, error } = await supabaseClient.auth.signUp({ email, password: values.get("password") }); busy(submit, false); if (error) return feedback(errorText(error), true); if (data.session) navigate("/dashboard"); else { sessionStorage.setItem("sqezen_email", email); navigate("/register/code"); } }); const codeForm = document.querySelector("#code-form"); const email = sessionStorage.getItem("sqezen_email"); if (codeForm) { const intro = codeForm.closest(".auth-card")?.querySelector(".form-intro"); if (intro && email) intro.textContent = `Wysłaliśmy kod na ${email}. Wpisz go poniżej.`; const input = codeForm.elements.token; input?.addEventListener("input", () => { input.value = input.value.replace(/\D/g, "").slice(0, 8); }); codeForm.addEventListener("submit", async (event) => { event.preventDefault(); if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true); const submit = codeForm.querySelector("button[type=submit]"); const token = String(new FormData(codeForm).get("token") || ""); if (!/^\d{8}$/.test(token)) return feedback("Wpisz dokładnie 8 cyfr z wiadomości.", true); feedback("Sprawdzanie kodu…"); busy(submit, true, "Sprawdzanie…"); const { error } = await supabaseClient.auth.verifyOtp({ email, token, type: "signup" }); busy(submit, false); if (error) return feedback(errorText(error), true); sessionStorage.removeItem("sqezen_email"); navigate("/dashboard"); }); } const resend = document.querySelector("#resend-code"); if (resend) resend.addEventListener("click", async () => { if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true); resend.disabled = true; feedback("Wysyłanie nowego kodu…"); const { error } = await supabaseClient.auth.resend({ type: "signup", email }); if (error) { resend.disabled = false; return feedback(errorText(error), true); } feedback("Nowy kod wysłany. Sprawdź skrzynkę i Spam."); let seconds = 30; resend.textContent = `Wyślij ponownie za ${seconds}s`; state.resendTimer = setInterval(() => { seconds -= 1; if (seconds <= 0) { clearInterval(state.resendTimer); state.resendTimer = null; resend.disabled = false; resend.textContent = "Wyślij kod ponownie"; } else resend.textContent = `Wyślij ponownie za ${seconds}s`; }, 1000); }); }

async function wireDashboard() { const form = document.querySelector("#profile-form"); if (!form) return; const session = await supabaseClient.auth.getSession(); const current = session.data?.session; if (!current) return navigate(`/login?redirect=${encodeURIComponent("/dashboard")}`); const linksList = document.querySelector("#links-list"); const profileLink = document.querySelector("#view-profile"); const { data: profileData } = await supabaseClient.from("profiles").select("*").eq("id", current.user.id).maybeSingle(); const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", current.user.id).order("position", { ascending: true }); const setValue = (name, value) => { if (form.elements[name]) form.elements[name].value = value || ""; }; setValue("username", profileData?.username); setValue("display_name", profileData?.display_name); setValue("bio", profileData?.bio); setValue("avatar_url", profileData?.avatar_url); form.elements.background_color.value = safeColor(profileData?.background_color); setCustomization(form, profileData?.customization); linksList.innerHTML = (links?.length ? links : [{}]).map(linkItem).join(""); document.querySelector("#account-email").textContent = current.user.email || "zalogowane konto"; document.querySelector("#account-email-field").value = current.user.email || "";
  const meta = () => { const username = String(form.elements.username?.value || "").trim().toLowerCase(); const display = String(form.elements.display_name?.value || username || "Twoje konto").trim(); const active = readLinks().filter((link) => safeUrl(link.url)).length; document.querySelector("#account-name").textContent = display; document.querySelector("#account-avatar").textContent = display.slice(0, 1).toUpperCase(); document.querySelector("#links-count").textContent = active; document.querySelector("#bio-count").textContent = `${String(form.elements.bio?.value || "").length} / 160`; document.querySelector("#color-value").textContent = String(form.elements.background_color.value).toUpperCase(); document.querySelectorAll("[data-output-for]").forEach((out) => { const field = form.elements[out.dataset.outputFor]; if (field) out.textContent = `${field.value}${field.name === "profile_opacity" ? "%" : "px"}`; }); document.querySelectorAll("[data-color-label]").forEach((out) => { const field = form.elements[out.dataset.colorLabel]; if (field) out.textContent = String(field.value).toUpperCase(); }); const address = username ? `${location.origin}/${username}` : "Ustaw nazwę użytkownika"; document.querySelector("#profile-address-field").value = address; if (username) { profileLink.href = `/${encodeURIComponent(username)}`; profileLink.classList.remove("is-disabled"); } else { profileLink.href = "/"; profileLink.classList.add("is-disabled"); } }; const tabs = { profile: ["Profil", "SQEZEN / PROFILE", "Zbuduj swój profil.", "Ustaw informacje, które zobaczą osoby odwiedzające Twój adres."], links: ["Linki", "SQEZEN / LINKS", "Twoje odnośniki.", "Dodawaj, testuj i układaj linki w kolejności, którą lubisz."], appearance: ["Wygląd", "SQEZEN / CUSTOMIZE", "Twój klimat.", "Tło, karta, typografia i kolory — wszystko pod Twoją kontrolą."], account: ["Konto", "SQEZEN / ACCOUNT", "Konto i adres.", "Sprawdź e-mail i skopiuj publiczny adres profilu."] }; const setTab = (tab) => { const selected = tabs[tab] ? tab : "profile"; document.querySelectorAll("[data-dashboard-tab]").forEach((item) => item.classList.toggle("is-active", item.dataset.dashboardTab === selected)); document.querySelectorAll("[data-tab-panel]").forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== selected; }); const [label, eyebrow, title, subtitle] = tabs[selected]; document.querySelector("#topbar-section").textContent = label; document.querySelector("#dashboard-eyebrow").textContent = eyebrow; document.querySelector("#dashboard-title").textContent = title; document.querySelector("#dashboard-subtitle").textContent = subtitle; sessionStorage.setItem("sqezen_dashboard_tab", selected); }; document.querySelectorAll("[data-dashboard-tab]").forEach((item) => item.addEventListener("click", () => { setTab(item.dataset.dashboardTab); document.querySelector("#dashboard-sidebar")?.classList.remove("is-open"); })); setTab(sessionStorage.getItem("sqezen_dashboard_tab") || "profile"); meta(); renderPreview();
  form.addEventListener("input", (event) => { if (event.target.matches("[data-link-url]")) { const item = event.target.closest("[data-link-item]"); const detected = profileIcon({ url: event.target.value, icon: "website" }); if (detected !== "globe") item.querySelector("[data-link-icon]").value = detected; } meta(); renderPreview(); }); form.addEventListener("change", () => { meta(); renderPreview(); }); document.querySelector("#add-link").addEventListener("click", () => { linksList.insertAdjacentHTML("beforeend", linkItem({}, document.querySelectorAll("[data-link-item]").length)); updateLinkNumbers(); renderPreview(); linksList.lastElementChild?.querySelector("[data-link-title]")?.focus(); }); linksList.addEventListener("click", (event) => { const button = event.target.closest("[data-link-action]"); if (!button) return; const item = button.closest("[data-link-item]"); const action = button.dataset.linkAction; if (action === "remove") { item.remove(); if (!document.querySelector("[data-link-item]")) linksList.insertAdjacentHTML("beforeend", linkItem({}, 0)); } if (action === "duplicate") { const copy = { title: item.querySelector("[data-link-title]").value, url: item.querySelector("[data-link-url]").value, icon: item.querySelector("[data-link-icon]").value }; item.insertAdjacentHTML("afterend", linkItem(copy, 0)); } if (action === "up" && item.previousElementSibling) item.previousElementSibling.before(item); if (action === "down" && item.nextElementSibling) item.nextElementSibling.after(item); updateLinkNumbers(); meta(); renderPreview(); }); document.querySelectorAll("[data-color-preset]").forEach((item) => item.addEventListener("click", () => { form.elements.background_color.value = item.dataset.colorPreset; meta(); renderPreview(); })); document.querySelector("#reset-customization").addEventListener("click", () => { setCustomization(form, DEFAULT_CUSTOMIZATION); meta(); renderPreview(); feedback("Przywrócono ustawienia domyślne."); }); document.querySelector("#copy-profile-address").addEventListener("click", async () => { const value = document.querySelector("#profile-address-field").value; if (!value.startsWith("http")) return feedback("Najpierw ustaw nazwę użytkownika.", true); try { await navigator.clipboard.writeText(value); feedback("Adres skopiowany."); } catch { feedback("Nie udało się skopiować adresu.", true); } }); document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#dashboard-sidebar")?.classList.toggle("is-open")); document.querySelector("#logout-button").addEventListener("click", async () => { await supabaseClient.auth.signOut(); navigate("/"); }); form.addEventListener("submit", async (event) => { event.preventDefault(); const submit = form.querySelector("button[type=submit]"); const values = new FormData(form); const username = String(values.get("username") || "").trim().toLowerCase(); const display = String(values.get("display_name") || "").trim(); const linksValue = readLinks().map((link) => ({ ...link, url: normalizeUrl(link.url) })); if (!/^[a-z0-9_]{3,24}$/.test(username)) { setTab("profile"); return feedback("Nazwa musi mieć 3–24 znaki: małe litery, cyfry lub _.", true); } if (!display) { setTab("profile"); return feedback("Wpisz nazwę wyświetlaną.", true); } for (const link of linksValue) if (!safeUrl(link.url)) { setTab("links"); return feedback(`Sprawdź adres linku „${link.title || "bez nazwy"}”.`, true); } let customization = readCustomization(form); let avatarUrl = safeImageUrl(values.get("avatar_url")); busy(submit, true, "Zapisywanie…"); feedback("Przygotowuję materiały…");   try { if (avatarUrl && isDiscordUrl(avatarUrl)) { avatarUrl = await cacheDiscordAsset(avatarUrl, "avatar", PROFILE_ASSET_OPTIONS.avatar); const avatarInput = form.querySelector('[name="avatar_url"]'); if (avatarInput) avatarInput.value = avatarUrl; } } catch (error) { busy(submit, false); return feedback(String(error?.message || "Nie udało się zapisać trwałej kopii pliku. Wybierz plik z komputera."), true); } feedback("Zapisuję wszystkie zmiany…"); let save = await supabaseClient.from("profiles").upsert({ id: current.user.id, username, display_name: display, bio: String(values.get("bio") || "").trim(), avatar_url: avatarUrl, background_color: safeColor(values.get("background_color")), customization }); if (save.error) { busy(submit, false); return feedback(errorText(save.error), true); } const deleted = await supabaseClient.from("links").delete().eq("profile_id", current.user.id); if (deleted.error) { busy(submit, false); return feedback("Profil zapisany, ale nie udało się odświeżyć linków.", true); } if (linksValue.length) { const inserted = await supabaseClient.from("links").insert(linksValue.map((link, index) => ({ profile_id: current.user.id, title: link.title || "Link", url: link.url, icon: link.icon, position: index }))); if (inserted.error) { busy(submit, false); return feedback("Profil zapisany, ale linki mają problem z zapisem.", true); } } linksValue.forEach((link, index) => { const input = document.querySelectorAll("[data-link-url]")[index]; if (input) input.value = link.url; }); busy(submit, false); meta(); document.querySelector("#top-status").innerHTML = `<i></i> zapisano przed chwilą`; feedback("Wszystkie zmiany zostały zapisane."); }); }
function updateLinkNumbers() { document.querySelectorAll("[data-link-item]").forEach((item, index) => { item.querySelector(".link-number").textContent = String(index + 1).padStart(2, "0"); item.querySelector(".link-item-name").textContent = `Link ${index + 1}`; }); }
document.addEventListener("input", (event) => { const field = event.target; if (!field.matches?.("#profile-form input[type=range]")) return; const output = document.querySelector(`[data-output-for="${field.name}"]`); if (output) output.textContent = `${field.value}${field.name === "profile_opacity" ? "%" : "px"}`; renderPreview(); });
function publicLink(link) { const href = safeUrl(link.url); if (!href) return ""; return `<a class="profile-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"><span class="profile-link-icon">${icon(profileIcon(link))}</span><span class="profile-link-title">${escapeHtml(String(link.title || "Link").trim() || "Link")}</span><span class="profile-link-arrow">${icon("arrowUp")}</span></a>`; }
async function publicProfile(username) { const { data, error } = await supabaseClient.from("profiles").select("*").eq("username", username).maybeSingle(); if (error) return layout(`<main class="empty-page"><p class="eyebrow">SQEZEN / ERROR</p><h1>Nie udało się wczytać profilu.</h1><p>Spróbuj ponownie za chwilę.</p></main>`); if (!data) return layout(`<main class="empty-page"><p class="eyebrow">SQEZEN / PROFILE</p><h1>Nie znaleziono profilu.</h1><p>Nazwa <strong>${escapeHtml(username)}</strong> nie jest jeszcze zajęta.</p>${button("/register", "Zarezerwuj nazwę", true)}</main>`); const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", data.id).order("position", { ascending: true }); const config = sanitizeCustomization(data.customization); const media = config.backgroundMediaUrl; const mediaMarkup = media ? (/\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(media) ? `<video class="public-media" autoplay muted loop playsinline src="${escapeHtml(media)}"></video>` : `<div class="public-media" style="background-image:url('${escapeHtml(media).replace(/&#039;/g, "%27")}')"></div>`) : ""; const pageBg = config.useGradient ? `radial-gradient(circle at top,${config.gradientPrimary} 0%,${config.gradientSecondary} 74%)` : config.gradientSecondary; const style = [`--profile-accent:${safeColor(data.background_color)}`, `--profile-text:${config.textColor}`, `--profile-card-rgb:${hexRgb(config.cardColor)}`, `--profile-button-rgb:${hexRgb(config.buttonColor)}`, `--profile-button-text:${config.buttonTextColor}`, `--profile-opacity:${config.profileOpacity / 100}`, `--profile-blur:${config.profileBlur}px`, `--profile-width:${config.cardWidth}px`, `--profile-avatar:${config.avatarSize}px`, `--profile-radius:${config.buttonRadius}px`, `--profile-background:${pageBg}`].join(";"); const classes = `align-${config.alignment} spacing-${config.spacing} buttons-${config.buttonStyle} effect-${config.backgroundEffect} name-${config.usernameEffect} font-${config.fontFamily}`; return `<div class="public-page ${classes}" style="${style}"${config.cursorUrl ? ` data-custom-cursor="${escapeHtml(config.cursorUrl)}"` : ""}>${mediaMarkup}<div class="public-shade"></div>${config.showBranding ? `<a class="public-brand" href="/">${brandMarkup("public-brand-logo")}</a>` : ""}<main class="public-main"><section class="public-card"><div class="public-card-top"><span class="public-live"><i></i> public profile</span><div class="public-tools">${config.audioUrl ? `<button class="icon-button audio-toggle" data-audio-toggle type="button" aria-label="Odtwórz audio">${icon("sparkle")}</button><audio data-profile-audio preload="none" src="${escapeHtml(config.audioUrl)}"></audio>` : ""}<button class="icon-button" data-copy-profile="${escapeHtml(location.href)}" type="button" aria-label="Skopiuj link">${icon("copy")}</button></div></div>${avatar(data)}${config.showHandle ? `<p class="public-handle">@${escapeHtml(data.username)}</p>` : ""}<h1>${escapeHtml(data.display_name || data.username)}</h1>${config.location ? `<p class="public-location">${icon("globe")} ${escapeHtml(config.location)}</p>` : ""}${data.bio ? `<p class="public-bio">${escapeHtml(data.bio)}</p>` : ""}<div class="profile-links">${(links || []).map(publicLink).filter(Boolean).join("") || `<p class="empty-links">Ten profil nie ma jeszcze linków.</p>`}</div>${config.showBranding ? `<div class="public-card-footer"><span>sqezen.lol/${escapeHtml(data.username)}</span><span>made with <b>sqezen</b></span></div>` : ""}</section>${config.showBranding ? `<a class="claim-link" href="/register">Stwórz własny profil ${icon("arrow")}</a>` : ""}</main></div>`; }
function wirePublic() { const copy = document.querySelector("[data-copy-profile]"); if (copy) copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(copy.dataset.copyProfile); copy.innerHTML = icon("check"); setTimeout(() => { copy.innerHTML = icon("copy"); }, 1400); } catch {} }); const page = document.querySelector(".public-page"); const cursor = page?.dataset.customCursor; if (cursor) page.style.cursor = `url("${cursor.replace(/["\\\n\r]/g, "")}"),auto`; const audio = document.querySelector("[data-profile-audio]"); const toggle = document.querySelector("[data-audio-toggle]"); const volume = document.querySelector("[data-audio-volume]"); const label = document.querySelector("[data-audio-label]"); if (audio && toggle) { const updateAudioUi = () => { const playing = !audio.paused; toggle.classList.toggle("is-playing", playing); toggle.setAttribute("aria-label", playing ? "Sound on" : "Sound off"); if (label) label.textContent = playing ? "SOUND ON" : "SOUND OFF"; if (volume && document.activeElement !== volume) volume.value = String(audio.volume); }; audio.volume = Number(volume?.value || 0.72); toggle.addEventListener("click", async () => { try { if (audio.paused) await audio.play(); else audio.pause(); } catch {} updateAudioUi(); }); volume?.addEventListener("input", () => { audio.volume = Number(volume.value); updateAudioUi(); }); audio.addEventListener("play", updateAudioUi); audio.addEventListener("pause", updateAudioUi); audio.addEventListener("volumechange", updateAudioUi); updateAudioUi(); audio.play().then(updateAudioUi).catch(updateAudioUi); } }
async function render() { if (state.resendTimer) { clearInterval(state.resendTimer); state.resendTimer = null; } const path = currentPath(); document.body.dataset.route = path; document.title = path === "/" ? "sqezen — your space online" : `${path.slice(1).split("/")[0] || "sqezen"} — sqezen`; const app = document.querySelector("#app"); try { if (path === "/") app.innerHTML = landingMinimal(); else if (path === "/login") app.innerHTML = auth("login"); else if (path === "/register") app.innerHTML = auth("register"); else if (path === "/register/code") app.innerHTML = auth("code"); else if (path === "/dashboard") app.innerHTML = dashboard(); else app.innerHTML = await publicProfile(path.slice(1).split("/")[0].toLowerCase()); await wireAuth(); await wireDashboard(); setupCustomizationCarousel(); wirePublic(); } catch (error) { console.error(error); app.innerHTML = layout(`<main class="empty-page"><p class="eyebrow">SQEZEN / ERROR</p><h1>Coś poszło nie tak.</h1><p>Odśwież stronę i spróbuj ponownie.</p></main>`); } }
const baseDashboardMarkup = dashboard;
dashboard = () => baseDashboardMarkup().replace('<label class="field-label">Własny kursor<input name="cursor_url" type="text" placeholder="https://.../cursor.png"><small>Najlepiej obraz 32×32 px.</small></label>', '<div class="field-label"><span>Własny kursor</span><div class="cursor-input-row"><input id="cursor-url" name="cursor_url" type="text" inputmode="url" placeholder="https://.../cursor.png"><button id="cursor-file-trigger" class="button button-small button-dark" type="button">Wybierz plik</button><input id="cursor-file-input" class="cursor-file-input" type="file" accept="image/png,image/jpeg,image/gif,image/webp"></div><span class="cursor-preview" data-cursor-preview aria-hidden="true"></span><small>URL albo PNG, JPG, GIF lub WebP — najlepiej 32×32 px.</small></div>').replace('<label class="field-label">Efekt nazwy<select name="username_effect"><option value="none">Brak</option><option value="gradient">Gradient</option><option value="soft-glow">Delikatny glow</option><option value="outline">Kontur</option></select></label>', '<div class="field-label name-effect-field"><span>Efekt nazwy</span><div class="name-effect-picker" role="group" aria-label="Wybierz efekt nazwy"><button class="name-effect-option" data-name-effect-option="none" type="button"><span class="name-effect-sample is-none">sqezen</span><small>Brak</small></button><button class="name-effect-option" data-name-effect-option="glitch" type="button"><span class="name-effect-sample is-glitch">sqezen</span><small>Glitch</small></button><button class="name-effect-option" data-name-effect-option="typewrite" type="button"><span class="name-effect-sample is-typewrite">sqezen</span><small>Typewrite</small></button><button class="name-effect-option" data-name-effect-option="rainbow" type="button"><span class="name-effect-sample is-rainbow">sqezen</span><small>Rainbow</small></button><button class="name-effect-option" data-name-effect-option="shuffle" type="button"><span class="name-effect-sample is-shuffle">sqezen</span><small>Shuffle</small></button></div><select class="name-effect-value" name="username_effect" aria-label="Efekt nazwy"><option value="none">Brak</option><option value="glitch">Glitch</option><option value="typewrite">Typewrite</option><option value="rainbow">Rainbow</option><option value="shuffle">Shuffle</option><option value="gradient">Gradient</option><option value="soft-glow">Delikatny glow</option><option value="outline">Kontur</option></select><small>Wybierz animację, którą zobaczą osoby odwiedzające Twój profil.</small></div>');
const baseDashboardWithParticles = dashboard;
dashboard = () => baseDashboardWithParticles().replace('<small>Wybierz animację, którą zobaczą osoby odwiedzające Twój profil.</small>', '<span class="name-effect-subtitle">Cząsteczki</span><div class="particle-picker" role="group" aria-label="Wybierz kolor cząsteczek"><button class="particle-option" data-particle-option="none" type="button" aria-label="Brak cząsteczek"><span class="particle-sample is-none"></span></button><button class="particle-option" data-particle-option="blue" type="button" aria-label="Niebieskie cząsteczki"><span class="particle-sample is-blue"></span></button><button class="particle-option" data-particle-option="green" type="button" aria-label="Zielone cząsteczki"><span class="particle-sample is-green"></span></button><button class="particle-option" data-particle-option="pink" type="button" aria-label="Różowe cząsteczki"><span class="particle-sample is-pink"></span></button><button class="particle-option" data-particle-option="red" type="button" aria-label="Czerwone cząsteczki"><span class="particle-sample is-red"></span></button><button class="particle-option" data-particle-option="white" type="button" aria-label="Białe cząsteczki"><span class="particle-sample is-white"></span></button><button class="particle-option" data-particle-option="yellow" type="button" aria-label="Żółte cząsteczki"><span class="particle-sample is-yellow"></span></button></div><select class="name-effect-value particle-value" name="name_particles" aria-label="Cząsteczki"><option value="none">Brak</option><option value="blue">Niebieskie</option><option value="green">Zielone</option><option value="pink">Różowe</option><option value="red">Czerwone</option><option value="white">Białe</option><option value="yellow">Żółte</option></select><small>Dodaj delikatne punkty światła wokół nazwy.</small>');
const baseDashboardWithParticleLayout = dashboard;
dashboard = () => baseDashboardWithParticleLayout().replace(/<span class="name-effect-subtitle">Cząsteczki<\/span><div class="particle-picker"[\s\S]*?<small>Dodaj delikatne punkty światła wokół nazwy\.<\/small>/, '<small>Wybierz animację, którą zobaczą osoby odwiedzające Twój profil.</small>').replace('<label class="field-label">Efekt tła<select name="background_effect"><option value="none">Brak</option><option value="noise">Subtelny noise</option><option value="grid">Delikatna siatka</option><option value="spotlight">Miękki spotlight</option></select></label>', '<label class="field-label">Efekt tła<select name="background_effect"><option value="none">Brak</option><option value="noise">Subtelny noise</option><option value="grid">Delikatna siatka</option><option value="spotlight">Miękki spotlight</option></select></label><div class="field-label particle-field"><span>Cząsteczki</span><div class="particle-picker" role="group" aria-label="Wybierz kolor cząsteczek"><button class="particle-option" data-particle-option="none" type="button" aria-label="Brak cząsteczek"><span class="particle-sample is-none"></span></button><button class="particle-option" data-particle-option="blue" type="button" aria-label="Niebieskie cząsteczki"><span class="particle-sample is-blue"></span></button><button class="particle-option" data-particle-option="green" type="button" aria-label="Zielone cząsteczki"><span class="particle-sample is-green"></span></button><button class="particle-option" data-particle-option="pink" type="button" aria-label="Różowe cząsteczki"><span class="particle-sample is-pink"></span></button><button class="particle-option" data-particle-option="red" type="button" aria-label="Czerwone cząsteczki"><span class="particle-sample is-red"></span></button><button class="particle-option" data-particle-option="white" type="button" aria-label="Białe cząsteczki"><span class="particle-sample is-white"></span></button><button class="particle-option" data-particle-option="yellow" type="button" aria-label="Żółte cząsteczki"><span class="particle-sample is-yellow"></span></button></div><select class="name-effect-value particle-value" name="name_particles" aria-label="Cząsteczki"><option value="none">Brak</option><option value="blue">Niebieskie</option><option value="green">Zielone</option><option value="pink">Różowe</option><option value="red">Czerwone</option><option value="white">Białe</option><option value="yellow">Żółte</option></select><small>Dodaj delikatne punkty światła wokół nazwy.</small></div>');
const baseDashboardWithEmbed = dashboard;
dashboard = () => baseDashboardWithEmbed().replace('<button class="sidebar-item" data-dashboard-tab="account" type="button">${icon("settings")}<span>Konto</span></button>', '<button class="sidebar-item" data-dashboard-tab="embed" type="button">${icon("link")}<span>Embed</span><kbd>04</kbd></button><button class="sidebar-item" data-dashboard-tab="account" type="button">${icon("settings")}<span>Konto</span></button>').replace('<section data-tab-panel="account" hidden>', `<section data-tab-panel="embed" hidden><div class="panel-heading"><div><span class="panel-index">EMBED</span><h2>Dynamic embed</h2><p>Osadź aktualny profil na stronie, portfolio albo w swoim panelu.</p></div><button class="button button-small button-ghost" id="copy-embed-code" type="button">Kopiuj kod</button></div><div class="embed-code-card"><label class="field-label">Adres embedu<textarea id="embed-code" rows="3" readonly></textarea><small>Ten adres zawsze pobiera najnowsze dane Twojego profilu.</small></label><div class="embed-preview-shell"><iframe id="embed-preview" title="Podgląd dynamicznego embedu" loading="lazy"></iframe></div></div></section><section data-tab-panel="account" hidden>`);
const baseDashboardWithEmbedNav = dashboard;
dashboard = () => baseDashboardWithEmbedNav().replace('<button class="sidebar-item" data-dashboard-tab="account" type="button">', `<button class="sidebar-item" data-dashboard-tab="embed" type="button">${icon("link")}<span>Embed</span><kbd>04</kbd></button><button class="sidebar-item" data-dashboard-tab="account" type="button">`);
const baseDashboardWithBadges = dashboard;
dashboard = () => baseDashboardWithBadges().replace('<button class="sidebar-item" data-dashboard-tab="embed" type="button">', `<button class="sidebar-item" data-dashboard-tab="badges" type="button">${icon("sparkle")}<span>Badges</span><kbd>05</kbd></button><button class="sidebar-item" data-dashboard-tab="embed" type="button">`).replace('<section data-tab-panel="embed" hidden>', `<section data-tab-panel="badges" hidden><div class="panel-heading"><div><span class="panel-index">BADGES</span><h2>Twój zestaw odznak</h2><p>Wybierz odznaki, które mają pojawić się przy Twoim nicku.</p></div><span class="badge-count" data-badge-count>0 / ${BADGE_MAX}</span></div><div class="badges-note">Możesz wybrać maksymalnie ${BADGE_MAX} odznak. Zmiany opublikują się po zapisaniu profilu.</div><div class="badge-grid">${badgeCards()}</div></section><section data-tab-panel="embed" hidden>`);
const baseDashboardWithFuzzyEffect = dashboard;
dashboard = () => baseDashboardWithFuzzyEffect().replace('data-name-effect-option="glitch"', 'data-name-effect-option="fuzzy"').replace('is-glitch">sqezen</span><small>Glitch', 'is-fuzzy">sqezen</span><small>Fuzzy').replace('<option value="glitch">Glitch</option>', '<option value="fuzzy">Fuzzy</option>');
const baseDashboardWithEmbedBuilder = dashboard;
dashboard = () => baseDashboardWithEmbedBuilder().replace('<span>Embed</span><kbd>04</kbd>', '<span>Embed Builder</span><kbd>04</kbd>').replace('<h2>Dynamic embed</h2><p>Osadź aktualny profil na stronie, portfolio albo w swoim panelu.</p>', '<h2>Embed Builder</h2><p>Wybierz zwykły albo dynamiczny wariant i skopiuj gotowy kod.</p>').replace('<label class="field-label">Adres embedu<textarea', '<label class="field-label">Kod iframe<textarea').replace('<small>Ten adres zawsze pobiera najnowsze dane Twojego profilu.</small>', '<small>Wybierz wariant powyżej, a potem wklej ten kod na swoją stronę.</small>').replace('<div class="embed-code-card">', `<div class="embed-mode-picker" role="group" aria-label="Wybierz typ embedu"><button class="embed-mode-option is-active" data-embed-mode="standard" type="button" aria-pressed="true"><span class="embed-mode-kicker">STANDARD</span><strong>Zwykły embed</strong><small>Pełna karta profilu, tak jak na publicznej stronie.</small></button><button class="embed-mode-option" data-embed-mode="dynamic" type="button" aria-pressed="false"><span class="embed-mode-kicker">DYNAMIC</span><strong>Dynamic embed</strong><small>Układ z kartą profilu i sekcją Connections.</small></button></div><div class="embed-code-card">`);
const baseDashboardWithoutEmbedCode = dashboard;
dashboard = () => baseDashboardWithoutEmbedCode().replace('<label class="field-label">Kod iframe<textarea id="embed-code" rows="3" readonly></textarea><small>Wybierz wariant powyżej, a potem wklej ten kod na swoją stronę.</small></label>', '<textarea id="embed-code" class="embed-code-value" aria-hidden="true" tabindex="-1" readonly></textarea>').replace('<div class="embed-mode-picker" role="group" aria-label="Wybierz typ embedu">', '<div class="embed-mode-heading"><span>Rodzaj embedu</span><small>Wybierz, jak ma wyglądać osadzony profil.</small></div><div class="embed-mode-picker" role="group" aria-label="Wybierz typ embedu">');
const baseDashboardWithEmbedDefaults = dashboard;
dashboard = () => baseDashboardWithEmbedDefaults().replace('<button class="button button-small button-ghost" id="copy-embed-code" type="button">Kopiuj kod</button>', '').replace('<textarea id="embed-code" class="embed-code-value" aria-hidden="true" tabindex="-1" readonly></textarea>', '').replace('<div class="embed-mode-heading">', '<input id="default-embed" name="default_embed" type="hidden" value="standard"><input id="dynamic-embed-positions" name="dynamic_embed_positions" type="hidden" value="{}"><div class="embed-mode-heading">').replace('<div class="embed-code-card">', '<div class="embed-default-row"><span data-embed-default-label>Domyślny embed: zwykły</span><button class="button button-small button-dark" data-embed-default-button type="button">Ustaw dynamic embed jako domyślny</button></div><div class="embed-position-row"><span data-embed-position-label>Ustaw układ kafelków dynamicznego embedu.</span><button class="button button-small button-dark" data-embed-position-toggle type="button">Edytuj pozycje kafelków</button></div><div class="embed-code-card">').replace('<h2>Embed Builder</h2><p>Wybierz zwykły albo dynamiczny wariant i skopiuj gotowy kod.</p>', '<h2>Embed Builder</h2><p>Wybierz zwykły albo dynamiczny wariant i zobacz podgląd.</p>');
const baseDashboardWithoutLiveEmbedPreview = dashboard;
dashboard = () => baseDashboardWithoutLiveEmbedPreview().replace('<div class="embed-code-card"><div class="embed-preview-shell"><iframe id="embed-preview" title="Podgląd dynamicznego embedu" loading="lazy"></iframe></div></div>', '').replace('<h2>Embed Builder</h2><p>Wybierz zwykły albo dynamiczny wariant i zobacz podgląd.</p>', '<h2>Embed Builder</h2><p>Wybierz wariant embedu i ustaw jego układ.</p>');
const baseDashboardWithFlatSidebar = dashboard;
dashboard = () => baseDashboardWithFlatSidebar().replace(/<div class="sidebar-brand">[\s\S]*?<\/div>/, '').replace('</nav><div class="sidebar-rule"></div><span class="sidebar-label">ACCOUNT</span>', '').replace('</button><div class="sidebar-account">', '</button></nav><div class="sidebar-account">');
function profileAssetPreview() {
  return `<aside class="preview-column profile-assets-column"><div class="profile-assets-section-heading"><span class="panel-index">PROFILE ASSETS</span><h2>Assets Uploader</h2><p>Podgląd elementów ustawionych na Twoim profilu.</p></div><div class="profile-assets-panel"><div class="profile-assets-grid"><article class="profile-asset-card" data-profile-asset-card="background"><h3>Background</h3><div class="profile-asset-preview" data-asset-preview="background"><span class="profile-asset-empty">Brak tła</span></div><small class="profile-asset-status" data-asset-status="background" aria-live="polite"></small><span class="profile-asset-type" data-asset-type="background" hidden></span><button class="profile-asset-clear" data-asset-clear="background" type="button" aria-label="Usuń tło" hidden>×</button></article><article class="profile-asset-card" data-profile-asset-card="audio"><h3>Audio</h3><button class="profile-asset-preview profile-asset-audio-action" data-asset-preview="audio" data-asset-open="audio" type="button"><span class="profile-asset-empty-icon">${icon("volume")}</span><span>Kliknij, aby otworzyć ustawienia audio</span></button><small class="profile-asset-status" data-asset-status="audio" aria-live="polite"></small><span class="profile-asset-type" data-asset-type="audio" hidden></span><button class="profile-asset-clear" data-asset-clear="audio" type="button" aria-label="Usuń audio" hidden>×</button></article><article class="profile-asset-card" data-profile-asset-card="avatar"><h3>Profile Avatar</h3><div class="profile-asset-preview" data-asset-preview="avatar"><span class="profile-asset-avatar-fallback">S</span></div><small class="profile-asset-status" data-asset-status="avatar" aria-live="polite"></small><span class="profile-asset-type" data-asset-type="avatar" hidden></span><button class="profile-asset-clear" data-asset-clear="avatar" type="button" aria-label="Usuń avatar" hidden>×</button></article><article class="profile-asset-card" data-profile-asset-card="cursor"><h3>Custom Cursor</h3><div class="profile-asset-preview" data-asset-preview="cursor"><span class="profile-asset-empty">Brak custom cursora</span></div><small class="profile-asset-status" data-asset-status="cursor" aria-live="polite"></small><span class="profile-asset-type" data-asset-type="cursor" hidden></span><button class="profile-asset-clear" data-asset-clear="cursor" type="button" aria-label="Usuń custom cursora" hidden>×</button></article></div></div></aside>`;
}
const baseProfileAssetPreview = profileAssetPreview;
profileAssetPreview = () => baseProfileAssetPreview().replace('</div></div></aside>', '</div></div><section class="profile-audio-metadata" data-audio-metadata><div class="profile-audio-metadata-heading"><strong>Szczegóły utworu</strong><small>Tytuł i wykonawca pokażą się w Dynamic embed i pomogą znaleźć lyrics automatycznie.</small></div><div class="profile-audio-metadata-fields"><label class="field-label">Tytuł utworu<input data-audio-title-control type="text" maxlength="80" placeholder="Nazwa utworu"></label><label class="field-label">Wykonawca<input data-audio-artist-control type="text" maxlength="60" placeholder="Nazwa wykonawcy"></label></div></section></aside>');
const baseDashboardWithProfileAssets = dashboard;
dashboard = () => baseDashboardWithProfileAssets().replace('<form id="profile-form" class="dashboard-grid">', '<form id="profile-form" class="dashboard-grid dashboard-grid-assets">').replace(/<aside class="preview-column">[\s\S]*?<\/aside>/, profileAssetPreview());
const profileAssetTopPreview = () => profileAssetPreview().replace('<aside class="preview-column profile-assets-column">', '<section class="profile-assets-top">').replace('</aside>', '</section>');
const baseDashboardWithTopProfileAssets = dashboard;
dashboard = () => baseDashboardWithTopProfileAssets().replace('<form id="profile-form" class="dashboard-grid dashboard-grid-assets">', profileAssetTopPreview() + '<form id="profile-form" class="dashboard-grid dashboard-grid-assets">').replace(/<aside class="preview-column profile-assets-column">[\s\S]*?<\/aside>/, '').replace('<h2>Twój klimat</h2><p>Ustaw profil dokładnie tak, jak chcesz go pokazywać.</p>', '<h2>General Customization</h2><p>Background, card, type and colors — all under your control.</p>');
const baseDashboardWithAppearanceAssets = dashboard;
dashboard = () => baseDashboardWithAppearanceAssets().replace(profileAssetTopPreview(), '').replace('<section data-tab-panel="appearance" hidden>', `<section data-tab-panel="appearance" hidden>${profileAssetTopPreview()}`);
const baseDashboardWithCursorGlowColor = dashboard;
dashboard = () => baseDashboardWithCursorGlowColor().replace('<label class="color-control">Gradient 1<input name="gradient_primary" type="color" value="#151521"><b data-color-label="gradient_primary">#151521</b></label>', '<label class="color-control">Kolor glow kursora<input name="cursor_glow_color" type="color" value="#5865ee"><b data-color-label="cursor_glow_color">#5865EE</b></label><label class="color-control">Gradient 1<input name="gradient_primary" type="color" value="#151521"><b data-color-label="gradient_primary">#151521</b></label>');
const baseDashboardWithLogo = dashboard;
dashboard = () => baseDashboardWithLogo().replace('<span class="brand-mark">s</span><span>sqezen</span>', brandMarkup());
const baseDashboardWithoutMaterialsCard = dashboard;
dashboard = () => {
  let markup = baseDashboardWithoutMaterialsCard();
  const firstCard = markup.indexOf('<div class="custom-card">');
  const nextCard = firstCard >= 0 ? markup.indexOf('<div class="custom-card">', firstCard + 1) : -1;
  if (firstCard >= 0 && nextCard > firstCard) markup = markup.slice(0, firstCard) + markup.slice(nextCard);
  const locationField = '<label class="field-label">Lokalizacja<input name="location" maxlength="42" placeholder="np. Warszawa"></label>';
  markup = markup.replace('<label class="field-label">Efekt tła<select name="background_effect">', `${locationField}<label class="field-label">Efekt tła<select name="background_effect">`);
  const hiddenAssetFields = '<input name="background_media_url" type="hidden"><input name="audio_url" type="hidden"><input name="audio_title" type="hidden"><input name="audio_artist" type="hidden"><input name="audio_lyrics" type="hidden"><input name="cursor_url" type="hidden">';
  return markup.replace('<section data-tab-panel="appearance" hidden>', `${hiddenAssetFields}<section data-tab-panel="appearance" hidden>`);
};
const baseRenderPreview = renderPreview;
renderPreview = function () {
  const result = baseRenderPreview();
  const form = document.querySelector("#profile-form");
  const target = document.querySelector("#dashboard-preview");
  const config = form ? readCustomization(form) : null;
  if (config?.defaultEmbed === "dynamic" && target) {
    const name = String(form.elements.display_name?.value || form.elements.username?.value || "Twoja nazwa").trim() || "Twoja nazwa";
    const username = String(form.elements.username?.value || "username").trim().toLowerCase() || "username";
    const bio = String(form.elements.bio?.value || "").trim();
    const image = safeImageUrl(form.elements.avatar_url?.value);
    const links = readLinks();
    const connections = links.length ? links.slice(0, 5).map((link) => `<span class="dashboard-dynamic-link" title="${escapeHtml(String(link.title || "Link"))}">${icon(profileIcon(link))}</span>`).join("") : `<span class="dashboard-dynamic-link dashboard-dynamic-link-empty">${icon("globe")}</span>`;
    const badgeItems = dynamicBadgeItems(config.badges);
    const badges = badgeItems ? `<section class="dashboard-dynamic-badges"><span class="dashboard-dynamic-kicker">BADGES</span><div class="dashboard-dynamic-badge-list">${badgeItems}</div></section>` : "";
    target.innerHTML = `<div class="dashboard-dynamic-preview" style="--preview-card-rgb:${hexRgb(config.cardColor)};--preview-text:${config.textColor};--preview-button-rgb:${hexRgb(config.buttonColor)};--preview-opacity:${config.profileOpacity / 100};--preview-blur:${config.profileBlur}px;--preview-avatar:${Math.min(config.avatarSize, 72)}px"><section class="dashboard-dynamic-profile"><div class="preview-card-top">${image ? `<img class="preview-avatar" src="${escapeHtml(image)}" alt="">` : `<span class="preview-avatar avatar-fallback">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>`}<span class="preview-menu">•••</span></div>${config.showHandle ? `<p class="preview-handle">@${escapeHtml(username)}</p>` : ""}<h3 class="preview-name preview-name-${config.usernameEffect}">${escapeHtml(name)}</h3>${bio ? `<p class="preview-bio">${escapeHtml(bio)}</p>` : ""}<div class="dashboard-dynamic-meta"><span><i></i> online</span><span>sqezen.lol/${escapeHtml(username)}</span></div></section><section class="dashboard-dynamic-connections"><span class="dashboard-dynamic-kicker">CONNECTIONS</span><div class="dashboard-dynamic-links">${connections}</div></section>${badges}</div>`;
  }
  const particles = String(document.querySelector("#profile-form")?.elements.name_particles?.value || "none");
  const selectedBadges = Array.from(document.querySelectorAll("#profile-form [data-badge-option].is-selected"))
    .map((option) => option.dataset.badgeOption)
    .filter((badge) => BADGE_VALUES.includes(badge))
    .slice(0, BADGE_MAX);
  document.querySelectorAll(".preview-name").forEach((node) => {
    node.dataset.name = String(node.textContent || "").trim();
    node.querySelector(".name-particles")?.remove();
    node.parentElement?.querySelector(".preview-badges")?.remove();
    if (NAME_PARTICLE_VALUES.includes(particles) && particles !== "none") {
      const particleLayer = document.createElement("span");
      particleLayer.className = `name-particles is-${particles}`;
      particleLayer.setAttribute("aria-hidden", "true");
      node.appendChild(particleLayer);
    }
    if (selectedBadges.length) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "preview-badges";
      badgeRow.innerHTML = badgePills(selectedBadges);
      node.after(badgeRow);
    }
  });
  return result;
};
const baseLandingMinimal = landingMinimal;
landingMinimal = () => baseLandingMinimal().replace('<div class="landing-showcase landing-example">', `<div class="landing-minimal-actions">${button("/login", "Zaloguj się")}${button("/register", "Stwórz profil", true)}</div><div class="landing-showcase landing-example">`);
const landingWithActions = landingMinimal;
landingMinimal = () => landingWithActions().replace('<main class="landing-minimal-inner">', '<main class="landing-minimal-inner"><div class="landing-minimal-copy">').replace('<div class="landing-showcase landing-example">', '</div><div class="landing-showcase landing-example">');
landingMinimal = () => `<div class="landing-reference-page"><main class="landing-reference-layout"><section class="landing-reference-copy"><h1>sqezen</h1><p class="landing-reference-tagline">Make it yours<span>.</span></p><div class="landing-reference-actions">${button("/login", "zaloguj się")}${button("/register", "stwórz profil", true)}</div></section><section class="landing-reference-profile" aria-label="Przykładowy profil"><span class="landing-reference-dots">•••</span><span class="landing-reference-avatar" aria-hidden="true">s</span><p class="landing-reference-handle">@sqezen</p><h2>sqezen</h2><p class="landing-reference-profile-tagline">Make it yours<span>.</span></p><div class="landing-reference-links"><div>${icon("github")}<span>GitHub</span><b>→</b></div><div>${icon("discord")}<span>Discord</span><b>→</b></div><div>${icon("youtube")}<span>YouTube</span><b>→</b></div></div><footer><span><i></i> online now</span><span>sqezen.lol/<em>sqezen</em></span></footer></section></main></div>`;
const PLATFORM_ICON_NAMES = ["snapchat", "youtube", "discord", "spotify", "instagram", "x", "tiktok", "telegram", "soundcloud", "paypal", "github", "roblox", "xbox", "gitlab", "twitch", "reddit", "namemc", "steam", "threads", "linkedin", "pinterest", "email", "facebook", "website"];
const PLATFORM_ICON_LABELS = { snapchat: "Snapchat", youtube: "YouTube", discord: "Discord", spotify: "Spotify", instagram: "Instagram", x: "X", tiktok: "TikTok", telegram: "Telegram", soundcloud: "SoundCloud", paypal: "PayPal", github: "GitHub", roblox: "Roblox", xbox: "Xbox", gitlab: "GitLab", twitch: "Twitch", reddit: "Reddit", namemc: "NameMC", steam: "Steam", threads: "Threads", linkedin: "LinkedIn", pinterest: "Pinterest", email: "Email", facebook: "Facebook", website: "Custom URL" };
const PLATFORM_ICON_LOGOS = { snapchat: "snapchat", youtube: "youtube", discord: "discord", spotify: "spotify", instagram: "instagram", x: "x", tiktok: "tiktok", telegram: "telegram", soundcloud: "soundcloud", paypal: "paypal", github: "github", roblox: "roblox", xbox: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/xbox.svg", gitlab: "gitlab", twitch: "twitch", reddit: "reddit", namemc: "namemc", steam: "steam", threads: "threads", linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linkedin.svg", pinterest: "pinterest", facebook: "facebook" };
const baseLandingWithLogo = landingMinimal;
landingMinimal = () => baseLandingWithLogo().replace('<h1>sqezen</h1>', '<h1 class="landing-reference-logo"><img src="/sqezen-logo-chrome.png" alt="sqezen"></h1>');
const baseIcon = icon;
const brandIcon = (name, className = "") => { const source = PLATFORM_ICON_LOGOS[name]; if (!source) return baseIcon(name === "email" ? "mail" : "globe"); const remoteSource = source.startsWith("http") ? source : `https://cdn.simpleicons.org/${source}/f5f6fb`; return `<img class="platform-logo ${source.startsWith("http") ? "is-monochrome " : ""}${className}" src="${remoteSource}" alt="" aria-hidden="true" loading="lazy" decoding="async">`; };
icon = (name) => PLATFORM_ICON_NAMES.includes(name) ? brandIcon(name) : baseIcon(name);
const baseProfileIcon = profileIcon;
profileIcon = (link) => { const value = String(link?.icon || "").toLowerCase(); if (PLATFORM_ICON_NAMES.includes(value) && value !== "website") return value; const url = String(link?.url || "").toLowerCase(); const matches = [["snapchat", "snapchat"], ["youtube", "youtube"], ["discord", "discord"], ["spotify", "spotify"], ["instagram", "instagram"], ["x", "x.com"], ["tiktok", "tiktok"], ["telegram", "t.me"], ["soundcloud", "soundcloud"], ["paypal", "paypal"], ["github", "github"], ["roblox", "roblox"], ["xbox", "xbox"], ["gitlab", "gitlab"], ["twitch", "twitch"], ["reddit", "reddit"], ["namemc", "namemc"], ["steam", "steam"], ["threads", "threads"], ["linkedin", "linkedin"], ["pinterest", "pinterest"], ["email", "mailto:"]]; const detected = matches.find(([, needle]) => url.includes(needle)); return detected?.[0] || baseProfileIcon(link); };
iconOptions = (selected = "website") => PLATFORM_ICON_NAMES.map((value) => `<option value="${value}"${selected === value ? " selected" : ""}>${escapeHtml(PLATFORM_ICON_LABELS[value])}</option>`).join("");
const baseWireDashboard = wireDashboard;
wireDashboard = async function () {
  await baseWireDashboard();
  const form = document.querySelector("#profile-form");
  if (!form) return;
  const effectSelect = form.elements.username_effect;
  const effectOptions = Array.from(document.querySelectorAll("[data-name-effect-option]"));
  const syncEffectPicker = () => effectOptions.forEach((option) => option.classList.toggle("is-active", option.dataset.nameEffectOption === effectSelect?.value));
  const particleSelect = form.elements.name_particles;
  const particleOptions = Array.from(document.querySelectorAll("[data-particle-option]"));
  const syncParticlePicker = () => particleOptions.forEach((option) => option.classList.toggle("is-active", option.dataset.particleOption === particleSelect?.value));
  if (effectSelect && effectOptions.length && effectSelect.dataset.bound !== "true") {
    effectSelect.dataset.bound = "true";
    effectOptions.forEach((option) => option.addEventListener("click", () => {
      effectSelect.value = option.dataset.nameEffectOption;
      syncEffectPicker();
      effectSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }));
    form.addEventListener("change", syncEffectPicker);
    document.querySelector("#reset-customization")?.addEventListener("click", () => setTimeout(syncEffectPicker));
    syncEffectPicker();
  }
  if (particleSelect && particleOptions.length && particleSelect.dataset.bound !== "true") {
    particleSelect.dataset.bound = "true";
    particleOptions.forEach((option) => option.addEventListener("click", () => {
      particleSelect.value = option.dataset.particleOption;
      syncParticlePicker();
      particleSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }));
    form.addEventListener("change", syncParticlePicker);
    document.querySelector("#reset-customization")?.addEventListener("click", () => setTimeout(syncParticlePicker));
    syncParticlePicker();
  }
  const badgeTab = document.querySelector('[data-dashboard-tab="badges"]');
  const badgePanel = document.querySelector('[data-tab-panel="badges"]');
  const badgeOptions = Array.from(document.querySelectorAll("[data-badge-option]"));
  const badgeCount = document.querySelector("[data-badge-count]");
  if (badgeTab && badgePanel && badgeOptions.length && badgeTab.dataset.bound !== "true") {
    badgeTab.dataset.bound = "true";
    const syncBadgePicker = () => {
      const selected = badgeOptions.filter((option) => option.classList.contains("is-selected")).length;
      badgeOptions.forEach((option) => { const active = option.classList.contains("is-selected"); const action = option.querySelector("[data-badge-action]"); option.setAttribute("aria-pressed", String(active)); if (action) action.textContent = active ? "Selected" : "Select"; });
      if (badgeCount) badgeCount.textContent = `${selected} / ${BADGE_MAX}`;
    };
    badgeOptions.forEach((option) => option.addEventListener("click", () => {
      const active = option.classList.contains("is-selected");
      if (!active && badgeOptions.filter((item) => item.classList.contains("is-selected")).length >= BADGE_MAX) return feedback(`Możesz wybrać maksymalnie ${BADGE_MAX} odznak.`, true);
      option.classList.toggle("is-selected", !active);
      syncBadgePicker();
      renderPreview();
    }));
    const showBadges = () => {
      document.querySelectorAll("[data-dashboard-tab]").forEach((item) => item.classList.toggle("is-active", item === badgeTab));
      document.querySelectorAll("[data-tab-panel]").forEach((panel) => { panel.hidden = panel !== badgePanel; });
      document.querySelector("#topbar-section").textContent = "Badges";
      document.querySelector("#dashboard-eyebrow").textContent = "SQEZEN / BADGES";
      document.querySelector("#dashboard-title").textContent = "Pokaż, kim jesteś.";
      document.querySelector("#dashboard-subtitle").textContent = "Wybierz odznaki, które wyróżnią Twój profil.";
      sessionStorage.setItem("sqezen_dashboard_tab", "badges");
      syncBadgePicker();
    };
    badgeTab.addEventListener("click", showBadges);
    syncBadgePicker();
    if (sessionStorage.getItem("sqezen_dashboard_tab") === "badges") showBadges();
  }
  const embedTab = document.querySelector('[data-dashboard-tab="embed"]');
  const embedPanel = document.querySelector('[data-tab-panel="embed"]');
  const embedPreview = document.querySelector("#embed-preview");
  const embedModes = Array.from(document.querySelectorAll("[data-embed-mode]"));
  const embedDefault = form.elements.default_embed;
  const embedDefaultButton = document.querySelector("[data-embed-default-button]");
  const embedDefaultLabel = document.querySelector("[data-embed-default-label]");
  if (embedTab && embedPanel && embedTab.dataset.bound !== "true") {
    embedTab.dataset.bound = "true";
    let embedMode = embedDefault?.value === "dynamic" ? "dynamic" : sessionStorage.getItem("sqezen_embed_mode") === "dynamic" ? "dynamic" : "standard";
    const getEmbedUrl = () => {
      const username = String(form.elements.username?.value || "").trim().toLowerCase();
      return username ? `${location.origin}/${encodeURIComponent(username)}${embedMode === "dynamic" ? "?embed=1" : ""}` : "";
    };
    const updateEmbedModeUi = () => embedModes.forEach((mode) => {
      const active = mode.dataset.embedMode === embedMode;
      mode.classList.toggle("is-active", active);
      mode.setAttribute("aria-pressed", String(active));
      if (active && embedDefaultLabel) embedDefaultLabel.textContent = `Domyślny embed: ${embedDefault?.value === "dynamic" ? "dynamiczny" : "zwykły"}`;
    });
    const updateEmbed = () => {
      const embedUrl = getEmbedUrl();
      const height = embedMode === "dynamic" ? 480 : 720;
      if (embedPreview) {
        embedPreview.src = embedUrl || "about:blank";
        embedPreview.style.height = `${height}px`;
      }
      updateEmbedModeUi();
      if (embedDefaultButton) {
        const defaultMode = embedDefault?.value === "dynamic" ? "dynamic" : "standard";
        const sameAsDefault = embedMode === defaultMode;
        embedDefaultButton.disabled = sameAsDefault;
        embedDefaultButton.textContent = sameAsDefault ? `${embedMode === "dynamic" ? "Dynamic embed" : "Zwykły embed"} jest domyślny` : `Ustaw ${embedMode === "dynamic" ? "dynamic embed" : "zwykły embed"} jako domyślny`;
      }
    };
    const showEmbed = () => {
      document.querySelectorAll("[data-dashboard-tab]").forEach((item) => item.classList.toggle("is-active", item === embedTab));
      document.querySelectorAll("[data-tab-panel]").forEach((panel) => { panel.hidden = panel !== embedPanel; });
      document.querySelector("#topbar-section").textContent = "Embed Builder";
      document.querySelector("#dashboard-eyebrow").textContent = "SQEZEN / EMBED BUILDER";
      document.querySelector("#dashboard-title").textContent = "Pokaż swój profil.";
      document.querySelector("#dashboard-subtitle").textContent = "Wybierz wariant embedu i ustaw jego układ.";
      sessionStorage.setItem("sqezen_dashboard_tab", "embed");
      updateEmbed();
    };
    embedTab.addEventListener("click", showEmbed);
    embedModes.forEach((mode) => mode.addEventListener("click", () => {
      embedMode = mode.dataset.embedMode === "dynamic" ? "dynamic" : "standard";
      sessionStorage.setItem("sqezen_embed_mode", embedMode);
      updateEmbed();
    }));
    embedDefaultButton?.addEventListener("click", () => {
      if (!embedDefault) return;
      embedDefault.value = embedMode;
      updateEmbed();
      renderPreview();
      feedback(`${embedMode === "dynamic" ? "Dynamic embed" : "Zwykły embed"} ustawiony jako domyślny. Zapisz profil, aby opublikować zmianę.`);
    });
    form.addEventListener("input", updateEmbed);
    form.addEventListener("change", updateEmbed);
    updateEmbed();
    if (sessionStorage.getItem("sqezen_dashboard_tab") === "embed") showEmbed();
  }
  if (document.documentElement.dataset.dashboardTabsCapture !== "true") {
    document.documentElement.dataset.dashboardTabsCapture = "true";
    document.addEventListener("click", (event) => {
      const item = event.target.closest?.("[data-dashboard-tab]");
      const tab = item?.dataset.dashboardTab;
      if (!item || !["badges", "embed"].includes(tab)) return;
      const currentForm = document.querySelector("#profile-form");
      const panel = document.querySelector(`[data-tab-panel="${tab}"]`);
      if (!currentForm || !panel) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelectorAll("[data-dashboard-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.dashboardTab === tab));
      document.querySelectorAll("[data-tab-panel]").forEach((currentPanel) => { currentPanel.hidden = currentPanel !== panel; });
      const copy = tab === "badges" ? ["Badges", "SQEZEN / BADGES", "Pokaż, kim jesteś.", "Wybierz odznaki, które wyróżnią Twój profil."] : ["Embed Builder", "SQEZEN / EMBED BUILDER", "Pokaż swój profil.", "Wybierz wariant embedu i ustaw jego układ."];
      document.querySelector("#topbar-section").textContent = copy[0];
      document.querySelector("#dashboard-eyebrow").textContent = copy[1];
      document.querySelector("#dashboard-title").textContent = copy[2];
      document.querySelector("#dashboard-subtitle").textContent = copy[3];
      sessionStorage.setItem("sqezen_dashboard_tab", tab);
      document.querySelector("#dashboard-sidebar")?.classList.remove("is-open");
      if (tab === "badges") {
        const count = currentForm.querySelectorAll("[data-badge-option].is-selected").length;
        const badgeCount = document.querySelector("[data-badge-count]");
        if (badgeCount) badgeCount.textContent = `${count} / ${BADGE_MAX}`;
      } else {
        const username = String(currentForm.elements.username?.value || "").trim().toLowerCase();
        const embedMode = sessionStorage.getItem("sqezen_embed_mode") === "dynamic" ? "dynamic" : document.querySelector("[data-embed-mode].is-active")?.dataset.embedMode || "standard";
        const embedUrl = username ? `${location.origin}/${encodeURIComponent(username)}${embedMode === "dynamic" ? "?embed=1" : ""}` : "";
        const height = embedMode === "dynamic" ? 480 : 720;
        document.querySelectorAll("[data-embed-mode]").forEach((modeButton) => {
          const active = modeButton.dataset.embedMode === embedMode;
          modeButton.classList.toggle("is-active", active);
          modeButton.setAttribute("aria-pressed", String(active));
        });
        const currentEmbedPreview = document.querySelector("#embed-preview");
        if (currentEmbedPreview) { currentEmbedPreview.src = embedUrl || "about:blank"; currentEmbedPreview.style.height = `${height}px`; }
      }
    }, true);
  }
  const fileInput = document.querySelector("#cursor-file-input");
  const trigger = document.querySelector("#cursor-file-trigger");
  const urlInput = form?.elements.cursor_url;
  const preview = document.querySelector("[data-cursor-preview]");
  if (!fileInput || !trigger || !urlInput || !preview || trigger.dataset.bound === "true") return;
  trigger.dataset.bound = "true";
  const updatePreview = () => {
    const cursorUrl = safeCursorUrl(urlInput.value);
    if (cursorUrl) {
      preview.style.backgroundImage = `url("${cursorUrl}")`;
      preview.classList.add("has-image");
    } else {
      preview.style.backgroundImage = "";
      preview.classList.remove("has-image");
    }
  };
  trigger.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp)$/i.test(file.type) || file.size > 256000) {
      fileInput.value = "";
      feedback("Wybierz PNG, JPG, GIF lub WebP do 256 KB.", true);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const cursorUrl = safeCursorUrl(reader.result);
      if (!cursorUrl) {
        feedback("Nie udało się odczytać tego obrazu.", true);
        return;
      }
      urlInput.value = cursorUrl;
      updatePreview();
      urlInput.dispatchEvent(new Event("input", { bubbles: true }));
      feedback("Kursor dodany. Zapisz zmiany, aby opublikować go na profilu.");
    };
    reader.readAsDataURL(file);
  });
  urlInput.addEventListener("input", updatePreview);
  updatePreview();
};
const baseWireDashboardWithEmbedPositions = wireDashboard;
wireDashboard = async function () {
  await baseWireDashboardWithEmbedPositions();
  const form = document.querySelector("#profile-form");
  const embedPreview = document.querySelector("#embed-preview");
  const positionButton = document.querySelector("[data-embed-position-toggle]");
  const positionLabel = document.querySelector("[data-embed-position-label]");
  const positionInput = form?.elements.dynamic_embed_positions;
  if (!form || !embedPreview || !positionButton || positionButton.dataset.bound === "true") return;
  positionButton.dataset.bound = "true";
  let editing = false;
  let editorCleanup = () => {};
  const currentMode = () => document.querySelector("[data-embed-mode].is-active")?.dataset.embedMode || "standard";
  const readPositions = () => {
    try { return sanitizeDynamicEmbedPositions(JSON.parse(String(positionInput?.value || "{}"))); } catch { return sanitizeDynamicEmbedPositions(); }
  };
  const writePositions = (positions) => { if (positionInput) positionInput.value = JSON.stringify(sanitizeDynamicEmbedPositions(positions)); };
  const getEmbedDocument = () => { try { return embedPreview.contentDocument || embedPreview.contentWindow?.document || null; } catch { return null; } };
  const applyPositions = () => {
    const doc = getEmbedDocument();
    if (!doc) return [];
    const positions = readPositions();
    return Array.from(doc.querySelectorAll("[data-dynamic-tile]")).map((tile) => {
      const position = positions[tile.dataset.dynamicTile] || { x: 0, y: 0 };
      tile.style.setProperty("--dynamic-x", String(position.x));
      tile.style.setProperty("--dynamic-y", String(position.y));
      return tile;
    });
  };
  const syncPositionButton = () => {
    const dynamic = currentMode() === "dynamic";
    if (!dynamic && editing) stopEditing();
    positionButton.disabled = !dynamic;
    if (!editing) {
      positionButton.textContent = dynamic ? "Edytuj pozycje kafelków" : "Wybierz Dynamic embed";
      if (positionLabel) positionLabel.textContent = dynamic ? "Przeciągnij elementy w podglądzie, aby ustawić ich układ." : "Wybierz Dynamic embed, aby edytować pozycje kafelków.";
    }
  };
  const stopEditing = () => {
    editorCleanup();
    editorCleanup = () => {};
    editing = false;
    const doc = getEmbedDocument();
    const page = doc?.querySelector(".dynamic-embed-page");
    page?.classList.remove("is-position-editing");
    syncPositionButton();
  };
  const startEditing = () => {
    if (currentMode() !== "dynamic") return feedback("Najpierw wybierz Dynamic embed.", true);
    const doc = getEmbedDocument();
    const tiles = applyPositions();
    const page = doc?.querySelector(".dynamic-embed-page");
    if (!doc || !page || tiles.length < 2) return feedback("Podgląd dynamicznego embedu jeszcze się ładuje. Spróbuj ponownie za chwilę.", true);
    editing = true;
    page.classList.add("is-position-editing");
    positionButton.disabled = false;
    positionButton.textContent = "Zakończ edycję pozycji";
    if (positionLabel) positionLabel.textContent = "Przeciągnij kartę profilu, Connections, odtwarzacz lub Live lyrics. Zapisz profil, aby opublikować układ.";
    const cleanups = [];
    const previousUserSelect = doc.body?.style.userSelect || "";
    if (doc.body) doc.body.style.userSelect = "none";
    tiles.forEach((tile) => {
      const onPointerDown = (event) => {
        if (event.button !== 0 || event.target.closest("button,input,a,select,textarea")) return;
        event.preventDefault();
        event.stopPropagation();
        const key = tile.dataset.dynamicTile;
        const start = readPositions()[key] || { x: 0, y: 0 };
        const frame = doc.querySelector(".dynamic-embed-main")?.getBoundingClientRect() || embedPreview.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        tile.classList.add("is-dragging");
        const onPointerMove = (moveEvent) => {
          const x = Math.min(100, Math.max(0, start.x + ((moveEvent.clientX - startX) / Math.max(frame.width, 1)) * 100));
          const y = Math.min(100, Math.max(0, start.y + ((moveEvent.clientY - startY) / Math.max(frame.height, 1)) * 100));
          const next = readPositions();
          next[key] = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, free: true };
          writePositions(next);
          tile.style.setProperty("--dynamic-x", String(next[key].x));
          tile.style.setProperty("--dynamic-y", String(next[key].y));
        };
        const finish = () => {
          tile.classList.remove("is-dragging");
          tile.removeEventListener("pointermove", onPointerMove);
          tile.removeEventListener("pointerup", finish);
          tile.removeEventListener("pointercancel", finish);
          doc.removeEventListener("pointerup", finish);
          doc.removeEventListener("pointercancel", finish);
          try { tile.releasePointerCapture?.(event.pointerId); } catch {}
        };
        tile.addEventListener("pointermove", onPointerMove);
        tile.addEventListener("pointerup", finish);
        tile.addEventListener("pointercancel", finish);
        doc.addEventListener("pointerup", finish);
        doc.addEventListener("pointercancel", finish);
        try { tile.setPointerCapture?.(event.pointerId); } catch {}
      };
      tile.addEventListener("pointerdown", onPointerDown);
      cleanups.push(() => tile.removeEventListener("pointerdown", onPointerDown));
    });
    editorCleanup = () => { cleanups.splice(0).forEach((cleanup) => cleanup()); if (doc.body) doc.body.style.userSelect = previousUserSelect; tiles.forEach((tile) => tile.classList.remove("is-dragging")); };
  };
  const onPreviewLoad = () => { if (editing) stopEditing(); applyPositions(); syncPositionButton(); };
  embedPreview.addEventListener("load", onPreviewLoad);
  positionButton.addEventListener("click", () => { if (editing) stopEditing(); else startEditing(); });
  document.querySelectorAll("[data-embed-mode]").forEach((mode) => mode.addEventListener("click", () => setTimeout(syncPositionButton, 0)));
  syncPositionButton();
  applyPositions();
};
const baseWireDashboardWithFullscreenPositionEditor = wireDashboard;
wireDashboard = async function () {
  await baseWireDashboardWithFullscreenPositionEditor();
  const form = document.querySelector("#profile-form");
  const positionButton = document.querySelector("[data-embed-position-toggle]");
  const positionLabel = document.querySelector("[data-embed-position-label]");
  const positionInput = form?.elements.dynamic_embed_positions;
  if (!form || !positionButton || !positionInput || positionButton.dataset.fullscreenBound === "true") return;
  const replacement = positionButton.cloneNode(true);
  positionButton.replaceWith(replacement);
  replacement.dataset.fullscreenBound = "true";
  const currentMode = () => document.querySelector("[data-embed-mode].is-active")?.dataset.embedMode || "standard";
  const syncButton = () => {
    const dynamic = currentMode() === "dynamic";
    replacement.disabled = !dynamic;
    replacement.textContent = dynamic ? "Edytuj pozycje w pełnym wymiarze" : "Wybierz Dynamic embed";
    if (positionLabel) positionLabel.textContent = dynamic ? "Otwórz pełnoekranowy edytor, aby ustawić układ elementów." : "Wybierz Dynamic embed, aby edytować pozycje elementów.";
  };
  const syncSavedPositions = () => {
    try {
      const payload = JSON.parse(localStorage.getItem("sqezen_dynamic_embed_positions") || "null");
      const username = String(form.elements.username?.value || "").trim().toLowerCase();
      if (payload?.username === username && payload.positions) positionInput.value = JSON.stringify(sanitizeDynamicEmbedPositions(payload.positions));
    } catch {}
  };
  replacement.addEventListener("click", () => {
    if (currentMode() !== "dynamic") return feedback("Najpierw wybierz Dynamic embed.", true);
    const username = String(form.elements.username?.value || "").trim().toLowerCase();
    if (!username) return feedback("Najpierw ustaw nazwę użytkownika.", true);
    const editorUrl = `${location.origin}/${encodeURIComponent(username)}?embed=1&edit=1`;
    const editorWindow = window.open(editorUrl, "_blank", "noopener,noreferrer");
    if (!editorWindow) window.location.href = editorUrl;
  });
  document.querySelectorAll("[data-embed-mode]").forEach((mode) => mode.addEventListener("click", () => setTimeout(syncButton, 0)));
  window.addEventListener("storage", syncSavedPositions);
  window.addEventListener("focus", syncSavedPositions);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncSavedPositions(); });
  syncSavedPositions();
  syncButton();
};
function bindProfileAssetPreview() {
  const form = document.querySelector("#profile-form");
  const assetPanels = Array.from(document.querySelectorAll(".profile-assets-panel"));
  if (!form || !assetPanels.length) return;
  const fields = { background: "background_media_url", audio: "audio_url", avatar: "avatar_url", cursor: "cursor_url" };
  const options = PROFILE_ASSET_OPTIONS;
  const assetValue = (kind, value) => kind === "cursor" ? safeCursorUrl(value) : kind === "avatar" ? safeImageUrl(value) : safeMediaUrl(value);
  const extension = (url) => {
    const mime = String(url || "").match(/^data:([^;,]+)/i)?.[1] || "";
    const mimeExtension = { "image/png": ".PNG", "image/jpeg": ".JPG", "image/gif": ".GIF", "image/webp": ".WEBP", "audio/mpeg": ".MP3", "audio/mp3": ".MP3", "audio/wav": ".WAV", "audio/ogg": ".OGG", "video/mp4": ".MP4", "video/webm": ".WEBM", "video/ogg": ".OGG" }[mime];
    if (mimeExtension) return mimeExtension;
    const value = String(url || "").split(/[?#]/)[0].split(".").pop()?.toUpperCase() || "";
    return value && value.length <= 5 ? `.${value}` : "FILE";
  };
  const readField = (name) => { const field = form.elements.namedItem(name); return String(field?.value || "").trim(); };
  const audioTitleControl = document.querySelector("[data-audio-title-control]");
  const audioArtistControl = document.querySelector("[data-audio-artist-control]");
  const syncAudioMetadata = () => {
    const titleField = form.elements.audio_title;
    const artistField = form.elements.audio_artist;
    if (audioTitleControl && document.activeElement !== audioTitleControl) audioTitleControl.value = String(titleField?.value || "");
    if (audioArtistControl && document.activeElement !== audioArtistControl) audioArtistControl.value = String(artistField?.value || "");
  };
  const bindAudioMetadataControl = (control, fieldName, maxLength) => {
    if (!control || control.dataset.audioMetadataBound === "true") return;
    control.dataset.audioMetadataBound = "true";
    control.addEventListener("input", () => {
      const field = form.elements[fieldName];
      if (!field) return;
      field.value = String(control.value || "").trim().slice(0, maxLength);
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };
  const setAssetStatus = (card, status, message = "") => { if (!card) return; const node = card.querySelector("[data-asset-status]"); card.dataset.assetStatus = status || ""; if (node) node.textContent = message; };
  const watchAssetLoad = (kind, card, element, url) => {
    if (!element) return;
    const markReady = () => setAssetStatus(card, "ready");
    const markBroken = () => setAssetStatus(card, "error", isExpiredDiscordUrl(url) ? "Link z Discorda wygasł — wybierz plik ponownie." : "Nie udało się wczytać assetu — sprawdź adres.");
    element.addEventListener("load", markReady, { once: true });
    element.addEventListener("loadeddata", markReady, { once: true });
    element.addEventListener("error", markBroken, { once: true });
    if ((element.tagName === "IMG" && element.complete) || (element.tagName === "VIDEO" && element.readyState >= 2)) markReady();
    window.setTimeout(() => { if (element.isConnected && element.tagName === "IMG" && element.complete && element.naturalWidth === 0) markBroken(); }, 1400);
  };
  const syncAsset = (kind, value) => {
    const url = assetValue(kind, value);
    assetPanels.forEach((panel) => {
      const preview = panel.querySelector(`[data-asset-preview="${kind}"]`);
      const type = panel.querySelector(`[data-asset-type="${kind}"]`);
      const clear = panel.querySelector(`[data-asset-clear="${kind}"]`);
      if (!preview || !type || !clear) return;
      setAssetStatus(panel.querySelector(`[data-profile-asset-card="${kind}"]`), "", "");
      type.textContent = url ? extension(url) : "";
      type.hidden = !url;
      clear.hidden = !url;
      if (kind === "background") preview.innerHTML = url ? (isVideoMedia(url) ? `<video autoplay muted loop playsinline src="${escapeHtml(url)}"></video>` : `<img src="${escapeHtml(url)}" alt="">`) : `<span class="profile-asset-empty">Brak tła</span>`;
      if (kind === "audio") preview.innerHTML = url ? `<span class="profile-asset-set-icon">${icon("volume")}</span><span>Audio ustawione</span>` : `<span class="profile-asset-empty-icon">${icon("volume")}</span><span>Kliknij, aby wybrać audio</span>`;
      if (kind === "avatar") { const name = String(form.elements.display_name?.value || form.elements.username?.value || "S").trim() || "S"; preview.innerHTML = url ? `<img src="${escapeHtml(url)}" alt="">` : `<span class="profile-asset-avatar-fallback">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>`; }
      if (kind === "cursor") preview.innerHTML = url ? `<img class="profile-asset-cursor-image" src="${escapeHtml(url)}" alt="">` : `<span class="profile-asset-empty">Brak custom cursora</span>`;
      if (url && kind !== "audio") watchAssetLoad(kind, panel.querySelector(`[data-profile-asset-card="${kind}"]`), preview.querySelector("img,video"), url);
      if (url && isExpiredDiscordUrl(url)) setAssetStatus(panel.querySelector(`[data-profile-asset-card="${kind}"]`), "error", "Link z Discorda wygasł — wybierz plik ponownie.");
    });
  };
  const syncAssets = () => {
    let config = {};
    try { config = readCustomization(form) || {}; } catch {}
    const fallback = { background: config.backgroundMediaUrl, audio: config.audioUrl, avatar: readField("avatar_url"), cursor: config.cursorUrl };
    Object.entries(fields).forEach(([kind, fieldName]) => syncAsset(kind, readField(fieldName) || fallback[kind] || ""));
    syncAudioMetadata();
  };
  const openPicker = (kind) => {
    const meta = options[kind];
    const field = form.elements[fields[kind]];
    if (!meta || !field) return;
    document.querySelector("[data-asset-picker]")?.remove();
    const currentValue = assetValue(kind, readField(fields[kind]));
    const currentIsLocal = /^data:/i.test(currentValue);
    let pendingValue = currentValue;
    const modal = document.createElement("div");
    modal.className = "asset-picker-backdrop";
    modal.dataset.assetPicker = kind;
    modal.innerHTML = `<div class="asset-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="asset-picker-title"><div class="asset-picker-head"><div><span class="asset-picker-kicker">PROFILE ASSETS</span><h2 id="asset-picker-title">${escapeHtml(meta.title)}</h2><p>${escapeHtml(meta.description)}</p></div><button class="asset-picker-close" type="button" data-asset-picker-close aria-label="Zamknij">×</button></div><div class="asset-picker-choice"><div><strong>Wybierz z komputera</strong><small>Plik zostanie zapisany w profilu i od razu pojawi się w podglądzie.</small></div><button class="button button-small button-dark asset-picker-file-button" type="button" data-asset-file-button>Wybierz z komputera</button><input data-asset-file type="file" accept="${meta.accept}" hidden></div><div class="asset-picker-divider"><span>albo</span></div><label class="asset-picker-url"><span>Wklej adres URL</span><input data-asset-url type="url" inputmode="url" placeholder="https://..." value="${currentIsLocal ? "" : escapeHtml(currentValue)}"><small>Adres musi prowadzić bezpośrednio do pliku. Linki z Discorda mogą wymagać wybrania pliku z komputera.</small></label><p class="asset-picker-current" data-asset-picker-current>${currentValue ? (currentIsLocal ? "Obecnie ustawiono plik z komputera." : "Obecnie ustawiono adres URL.") : "Nie wybrano jeszcze tego assetu."}</p><p class="asset-picker-message" data-asset-picker-message role="status" aria-live="polite"></p><div class="asset-picker-foot"><button class="button button-small button-dark" type="button" data-asset-picker-close>Anuluj</button><button class="button button-small button-primary" type="button" data-asset-picker-apply>Ustaw asset</button></div></div>`;
    document.body.append(modal);
    document.body.classList.add("asset-picker-open");
    const fileInput = modal.querySelector("[data-asset-file]");
    const fileButton = modal.querySelector("[data-asset-file-button]");
    const urlInput = modal.querySelector("[data-asset-url]");
    const message = modal.querySelector("[data-asset-picker-message]");
    const current = modal.querySelector("[data-asset-picker-current]");
    let audioTitleInput;
    let audioArtistInput;
    let audioLyricsInput;
    if (kind === "audio") {
      const metadata = document.createElement("div");
      metadata.className = "asset-picker-audio-meta";
      metadata.innerHTML = `<span class="asset-picker-meta-title">Informacje o utworze</span><div class="asset-picker-audio-fields"><label>Tytuł utworu<input data-asset-audio-title type="text" maxlength="80" placeholder="Nazwa utworu" value="${escapeHtml(String(form.elements.audio_title?.value || ""))}"></label><label>Wykonawca<input data-asset-audio-artist type="text" maxlength="60" placeholder="Nazwa wykonawcy" value="${escapeHtml(String(form.elements.audio_artist?.value || ""))}"></label></div><label class="asset-picker-lyrics-field">Własny tekst na żywo (opcjonalnie)<textarea data-asset-audio-lyrics maxlength="12000" rows="7" placeholder="[00:12.50] Pierwszy wers&#10;[00:16.00] Kolejny wers">${escapeHtml(String(form.elements.audio_lyrics?.value || ""))}</textarea><small>Dynamic embed najpierw wyszukuje lyrics po tytule, wykonawcy lub nazwie pliku. Wklej LRC tylko jako własny fallback.</small></label>`;
      modal.querySelector(".asset-picker-url")?.after(metadata);
      audioTitleInput = metadata.querySelector("[data-asset-audio-title]");
      audioArtistInput = metadata.querySelector("[data-asset-audio-artist]");
      audioLyricsInput = metadata.querySelector("[data-asset-audio-lyrics]");
    }
    const setMessage = (text, error = false) => { message.textContent = text; message.classList.toggle("is-error", error); };
    if (currentValue && isExpiredDiscordUrl(currentValue)) setMessage("Ten link z Discorda wygasł. Wybierz plik z komputera albo wklej nowy, stały URL.", true);
    const readVideoDimensions = (file) => {
      const isVideo = kind === "background" && (/^video\//i.test(file.type || "") || meta.extensions.test(file.name || ""));
      if (!isVideo || typeof URL.createObjectURL !== "function") return Promise.resolve(null);
      return new Promise((resolve) => {
        const video = document.createElement("video");
        const objectUrl = URL.createObjectURL(file);
        const finish = (dimensions) => { URL.revokeObjectURL(objectUrl); resolve(dimensions); };
        video.preload = "metadata";
        video.addEventListener("loadedmetadata", () => finish({ width: video.videoWidth, height: video.videoHeight }), { once: true });
        video.addEventListener("error", () => finish(null), { once: true });
        video.src = objectUrl;
      });
    };
    let onKeydown;
    const close = () => { if (onKeydown) document.removeEventListener("keydown", onKeydown); modal.remove(); document.body.classList.remove("asset-picker-open"); };
    fileButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const validType = meta.test.test(file.type || "") || meta.extensions.test(file.name || "");
      if (!validType) { pendingValue = ""; setMessage("Ten typ pliku nie pasuje do wybranego assetu.", true); return; }
      if (file.size > meta.maxSize) { pendingValue = ""; setMessage(`Plik jest za duży. Maksymalny rozmiar to ${Math.round(meta.maxSize / 1000000)} MB.`, true); return; }
      const dimensions = await readVideoDimensions(file);
      const qualityMessage = dimensions && Math.min(dimensions.width, dimensions.height) < 720
        ? `Nagranie ma ${dimensions.width}×${dimensions.height} px. Na pełnym tle może wyglądać pikselowo — użyj pliku co najmniej 1280×720.`
        : "";
      if (kind === "audio" && audioTitleInput && !audioTitleInput.value.trim()) {
        const inferredTitle = dynamicAudioFilenameTitle(file.name);
        if (inferredTitle) audioTitleInput.value = inferredTitle.slice(0, 80);
      }
      const reader = new FileReader();
      reader.onload = () => {
        const value = assetValue(kind, String(reader.result || ""));
        if (!value) { pendingValue = ""; setMessage("Nie udało się odczytać tego pliku.", true); return; }
        pendingValue = value;
        urlInput.value = "";
        current.textContent = `${file.name} — plik gotowy do ustawienia.`;
        setMessage(qualityMessage);
      };
      reader.onerror = () => { pendingValue = ""; setMessage("Nie udało się odczytać tego pliku.", true); };
      reader.readAsDataURL(file);
    });
    urlInput.addEventListener("input", () => {
      pendingValue = urlInput.value.trim() ? "" : (currentIsLocal && !urlInput.value.trim() ? currentValue : "");
      if (urlInput.value.trim()) current.textContent = "Adres URL zostanie użyty po zatwierdzeniu.";
      else if (!currentValue) current.textContent = "Nie wybrano jeszcze tego assetu.";
      setMessage(isExpiredDiscordUrl(urlInput.value) ? "Ten link z Discorda już wygasł. Wklej nowy URL albo wybierz plik z komputera." : "", Boolean(isExpiredDiscordUrl(urlInput.value)));
    });
    modal.querySelectorAll("[data-asset-picker-close]").forEach((button) => button.addEventListener("click", close));
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    onKeydown = (event) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKeydown);
    const applyButton = modal.querySelector("[data-asset-picker-apply]");
    applyButton.addEventListener("click", async () => {
      const typedUrl = urlInput.value.trim();
      let value = typedUrl ? assetValue(kind, typedUrl) : pendingValue;
      if (typedUrl && !value) return setMessage("Wpisz prawidłowy bezpośredni adres URL do pliku.", true);
      if (typedUrl && isExpiredDiscordUrl(typedUrl)) return setMessage("Ten link z Discorda wygasł. Wybierz plik z komputera albo wklej nowy URL.", true);
      if (typedUrl && isDiscordUrl(typedUrl)) {
        busy(applyButton, true, "Pobieranie…");
        try {
          value = await cacheDiscordAsset(typedUrl, kind, meta);
        } catch (error) {
          setMessage(String(error?.message || "Nie udało się pobrać pliku z Discorda. Wybierz plik z komputera."), true);
          return;
        } finally {
          busy(applyButton, false);
        }
      }
      if (kind === "audio") {
        const hasAudio = Boolean(value);
        form.elements.audio_title.value = hasAudio ? String(audioTitleInput?.value || "").trim().slice(0, 80) : "";
        form.elements.audio_artist.value = hasAudio ? String(audioArtistInput?.value || "").trim().slice(0, 60) : "";
        form.elements.audio_lyrics.value = hasAudio ? String(audioLyricsInput?.value || "").trim().slice(0, 12000) : "";
        [form.elements.audio_title, form.elements.audio_artist, form.elements.audio_lyrics].forEach((input) => input?.dispatchEvent(new Event("input", { bubbles: true })));
      }
      field.value = value || "";
      field.dispatchEvent(new Event("input", { bubbles: true }));
      syncAssets();
      close();
      feedback(`${meta.title} ${value ? "ustawione" : "usunięte"}. Zapisz zmiany, aby opublikować.`);
    });
    urlInput.focus();
  };
  if (form.dataset.profileAssetsBound === "true") { syncAssets(); return; }
  form.dataset.profileAssetsBound = "true";
  assetPanels.forEach((panel) => {
    panel.querySelectorAll("[data-asset-clear]").forEach((button) => button.addEventListener("click", () => {
      const field = form.elements[fields[button.dataset.assetClear]];
      if (!field) return;
      field.value = "";
      if (button.dataset.assetClear === "audio") ["audio_title", "audio_artist", "audio_lyrics"].forEach((name) => { const metadataField = form.elements[name]; if (metadataField) metadataField.value = ""; });
      field.dispatchEvent(new Event("input", { bubbles: true }));
      syncAssets();
      feedback(`${button.dataset.assetClear === "background" ? "Tło" : button.dataset.assetClear === "audio" ? "Audio" : button.dataset.assetClear === "avatar" ? "Avatar" : "Custom cursor"} usunięte. Zapisz zmiany, aby opublikować.`);
    }));
    panel.querySelectorAll("[data-profile-asset-card]").forEach((card) => card.addEventListener("click", (event) => {
      if (event.target.closest("[data-asset-clear]")) return;
      const kind = card.dataset.profileAssetCard;
      if (options[kind]) openPicker(kind);
    }));
  });
  bindAudioMetadataControl(audioTitleControl, "audio_title", 80);
  bindAudioMetadataControl(audioArtistControl, "audio_artist", 60);
  form.addEventListener("submit", (event) => { const config = readCustomization(form); const expiredAsset = [["tła", config.backgroundMediaUrl], ["audio", config.audioUrl], ["kursora", config.cursorUrl], ["avatara", readField("avatar_url")]].find(([, value]) => isExpiredDiscordUrl(value)); if (!expiredAsset) return; event.preventDefault(); event.stopImmediatePropagation(); document.querySelector('[data-dashboard-tab="appearance"]')?.click(); feedback(`Link do ${expiredAsset[0]} z Discorda wygasł. Wybierz plik z komputera albo wklej nowy, stały URL.`, true); }, true);
  form.addEventListener("input", syncAssets);
  form.addEventListener("change", syncAssets);
  syncAssets();
  window.setTimeout(syncAssets, 250);
}
const baseWireDashboardWithProfileAssets = wireDashboard;
wireDashboard = async function () {
  try { await baseWireDashboardWithProfileAssets(); } catch (error) { console.error("Dashboard wiring failed", error); }
  bindProfileAssetPreview();
  window.setTimeout(bindProfileAssetPreview, 350);
};
const baseWirePublic = wirePublic;
wirePublic = function () {
  baseWirePublic();
  wireAdaptiveBackgroundMedia();
  document.querySelectorAll(".public-card h1,.embed-profile-card h1").forEach((node) => {
    node.dataset.name = String(node.textContent || "").trim();
    if (NAME_PARTICLE_VALUES.includes(lastProfileParticles) && lastProfileParticles !== "none") {
      const particleLayer = document.createElement("span");
      particleLayer.className = `name-particles is-${lastProfileParticles}`;
      particleLayer.setAttribute("aria-hidden", "true");
      node.appendChild(particleLayer);
    }
    const badges = badgePills(lastProfileBadges);
    if (badges && node.closest(".public-card")) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "profile-badges";
      badgeRow.innerHTML = badges;
      node.after(badgeRow);
    }
  });
  const audio = document.querySelector("[data-profile-audio]");
  if (!audio) return;
  audio.autoplay = true;
  audio.preload = "auto";
  const unlockEvents = ["pointerdown", "keydown", "touchstart"];
  const removeUnlockListeners = () => unlockEvents.forEach((eventName) => document.removeEventListener(eventName, unlockAudio));
  const unlockAudio = () => {
    if (!document.contains(audio)) {
      removeUnlockListeners();
      return;
    }
    audio.play().then(removeUnlockListeners).catch(() => {});
  };
  audio.addEventListener("play", removeUnlockListeners, { once: true });
  unlockEvents.forEach((eventName) => document.addEventListener(eventName, unlockAudio, { passive: true }));
  unlockAudio();
};
const baseWirePublicWithDynamicControls = wirePublic;
wirePublic = function () {
  baseWirePublicWithDynamicControls();
  const widget = document.querySelector(".dynamic-audio-widget");
  const audio = widget?.querySelector("[data-profile-audio]");
  const progress = widget?.querySelector("[data-audio-progress]");
  if (!widget || !audio || !progress || widget.dataset.controlsBound === "true") return;
  widget.dataset.controlsBound = "true";
  const playButton = widget.querySelector("[data-audio-toggle]");
  const iconNode = widget.querySelector("[data-audio-icon]");
  const rewindButton = widget.querySelector("[data-audio-rewind]");
  const forwardButton = widget.querySelector("[data-audio-forward]");
  const currentTime = widget.querySelector("[data-audio-current]");
  const durationTime = widget.querySelector("[data-audio-duration]");
  const formatTime = (value) => {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const seconds = Math.floor(value);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const updateProgress = () => {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const current = Math.max(0, Math.min(Number(audio.currentTime) || 0, duration || Number.MAX_SAFE_INTEGER));
    progress.max = String(duration);
    progress.value = String(current);
    progress.style.setProperty("--audio-progress", `${duration ? (current / duration) * 100 : 0}%`);
    if (currentTime) currentTime.textContent = formatTime(current);
    if (durationTime) durationTime.textContent = formatTime(duration);
  };
  const updateState = () => {
    const playing = !audio.paused && !audio.ended;
    widget.classList.toggle("is-playing", playing);
    playButton?.classList.toggle("is-playing", playing);
    playButton?.setAttribute("aria-label", playing ? "Wstrzymaj audio" : "Odtwórz audio");
    if (iconNode) iconNode.innerHTML = icon(playing ? "pause" : "play");
    updateProgress();
  };
  const seekBy = (seconds) => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, (audio.currentTime || 0) + seconds));
    updateProgress();
  };
  rewindButton?.addEventListener("click", () => seekBy(-10));
  forwardButton?.addEventListener("click", () => seekBy(10));
  progress.addEventListener("input", () => {
    const next = Number(progress.value);
    if (Number.isFinite(next)) audio.currentTime = next;
    updateProgress();
  });
  ["loadedmetadata", "durationchange", "timeupdate", "progress", "seeking", "seeked", "play", "pause", "ended"].forEach((eventName) => audio.addEventListener(eventName, updateState));
  updateState();
};
const DYNAMIC_LYRICS_API = "https://lrclib.net/api";
function dynamicLyricsLineMarkup(entries) {
  return entries.map((entry, index) => `<span class="dynamic-lyrics-line${index === 0 ? " is-next" : ""}" data-lyrics-time="${entry.time}">${escapeHtml(entry.text)}</span>`).join("");
}
function dynamicLyricsCandidate(payload, duration = 0) {
  const items = Array.isArray(payload) ? payload : payload && typeof payload === "object" ? [payload] : [];
  const candidates = items.filter((item) => item && typeof item.syncedLyrics === "string" && dynamicLyricsEntries(item.syncedLyrics).length);
  if (!candidates.length) return null;
  if (!Number.isFinite(duration) || duration <= 0) return candidates[0];
  return candidates.reduce((best, candidate) => {
    const bestDuration = Number(best.duration);
    const candidateDuration = Number(candidate.duration);
    const bestDistance = Number.isFinite(bestDuration) && bestDuration > 0 ? Math.abs(bestDuration - duration) : Number.POSITIVE_INFINITY;
    const candidateDistance = Number.isFinite(candidateDuration) && candidateDuration > 0 ? Math.abs(candidateDuration - duration) : Number.POSITIVE_INFINITY;
    return candidateDistance < bestDistance ? candidate : best;
  });
}
async function dynamicLyricsProviderRequest(endpoint, params, signal) {
  const response = await fetch(`${DYNAMIC_LYRICS_API}/${endpoint}?${params.toString()}`, { headers: { Accept: "application/json" }, cache: "force-cache", signal });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Lyrics provider returned ${response.status}`);
  return response.json();
}
async function lookupDynamicLyrics(widget, audio) {
  const title = String(widget.dataset.lyricsTrackTitle || "").trim();
  const artist = String(widget.dataset.lyricsTrackArtist || "").trim();
  if (!title || title.toLowerCase() === "now playing") return null;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeout = controller ? window.setTimeout(() => controller.abort(), 7000) : null;
  try {
    const duration = Number(audio.duration);
    if (artist) {
      const exact = await dynamicLyricsProviderRequest("get", new URLSearchParams({ track_name: title, artist_name: artist }), controller?.signal);
      const exactMatch = dynamicLyricsCandidate(exact, duration);
      if (exactMatch) return exactMatch.syncedLyrics;
    }
    const search = await dynamicLyricsProviderRequest("search", new URLSearchParams({ q: [title, artist].filter(Boolean).join(" ") }), controller?.signal);
    return dynamicLyricsCandidate(search, duration)?.syncedLyrics || "";
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}
function showDynamicLyricsMessage(widget, state, heading, description) {
  const stateLabel = widget.querySelector("[data-lyrics-state]");
  const viewport = widget.querySelector("[data-lyrics-viewport]");
  if (stateLabel) stateLabel.textContent = state;
  if (viewport) viewport.innerHTML = `<div class="dynamic-lyrics-auto-message" data-lyrics-message><strong>${escapeHtml(heading)}</strong><p>${escapeHtml(description)}</p></div>`;
  widget.dataset.lyricsAuto = "false";
}
function applyDynamicLyrics(widget, audio, syncedLyrics) {
  const entries = dynamicLyricsEntries(syncedLyrics);
  const viewport = widget.querySelector("[data-lyrics-viewport]");
  if (!entries.length || !viewport) return false;
  viewport.innerHTML = `<div class="dynamic-lyrics-lines">${dynamicLyricsLineMarkup(entries)}</div>`;
  widget.dataset.lyricsAuto = "false";
  const stateLabel = widget.querySelector("[data-lyrics-state]");
  if (stateLabel) stateLabel.textContent = "READY";
  bindDynamicLyricsWidget(widget, audio);
  return true;
}
async function loadDynamicLyrics(widget, audio) {
  try {
    const syncedLyrics = await lookupDynamicLyrics(widget, audio);
    if (!widget.isConnected) return;
    if (syncedLyrics && applyDynamicLyrics(widget, audio, syncedLyrics)) return;
    const title = String(widget.dataset.lyricsTrackTitle || "").trim();
    showDynamicLyricsMessage(widget, "NOT FOUND", "NO SYNCED LYRICS", title ? `No synced lyrics found for ${title}.` : "This audio has no searchable track metadata.");
  } catch (error) {
    if (!widget.isConnected) return;
    console.warn("Automatic lyrics lookup failed", error);
    showDynamicLyricsMessage(widget, "UNAVAILABLE", "LYRICS UNAVAILABLE", "The lyrics provider could not be reached right now.");
  }
}
function bindDynamicLyricsWidget(widget, audio) {
  const lines = Array.from(widget?.querySelectorAll(".dynamic-lyrics-line") || []);
  if (!widget || !audio || !lines.length || widget.dataset.lyricsBound === "true") return;
  widget.dataset.lyricsBound = "true";
  const viewport = widget.querySelector("[data-lyrics-viewport]");
  const stateLabel = widget.querySelector("[data-lyrics-state]");
  const timeLabel = widget.querySelector("[data-lyrics-time-label]");
  const points = lines.map((line) => Number(line.dataset.lyricsTime)).map((time) => Number.isFinite(time) ? time : 0);
  let previousFocusIndex = -1;
  const formatTime = (value) => {
    const seconds = Math.max(0, Math.floor(Number(value) || 0));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const syncLyrics = () => {
    const current = Math.max(0, Number(audio.currentTime) || 0);
    const activeIndex = points.reduce((index, time, candidate) => time <= current + 0.05 ? candidate : index, -1);
    const focusIndex = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex = activeIndex >= 0 && activeIndex + 1 < lines.length ? activeIndex + 1 : activeIndex < 0 ? 0 : -1;
    const playing = !audio.paused && !audio.ended;
    widget.classList.toggle("is-playing", playing);
    if (stateLabel) stateLabel.textContent = playing ? "LIVE" : audio.ended ? "END" : "PAUSED";
    if (timeLabel) timeLabel.textContent = formatTime(current);
    lines.forEach((line, index) => {
      line.classList.toggle("is-active", index === activeIndex);
      line.classList.toggle("is-past", activeIndex >= 0 && index < activeIndex);
      line.classList.toggle("is-next", index === nextIndex);
    });
    if (focusIndex !== previousFocusIndex) {
      previousFocusIndex = focusIndex;
      const line = lines[focusIndex];
      if (line && viewport) viewport.scrollTo({ top: Math.max(0, line.offsetTop - (viewport.clientHeight - line.offsetHeight) / 2), behavior: "smooth" });
    }
  };
  ["loadedmetadata", "durationchange", "timeupdate", "seeking", "seeked", "play", "pause", "ended"].forEach((eventName) => audio.addEventListener(eventName, syncLyrics));
  syncLyrics();
}
const baseWirePublicWithLiveLyrics = wirePublic;
wirePublic = function () {
  baseWirePublicWithLiveLyrics();
  const widget = document.querySelector("[data-lyrics-widget]");
  const audio = document.querySelector("[data-profile-audio]");
  if (!widget || !audio) return;
  if (widget.dataset.lyricsAuto === "true" && widget.dataset.lyricsLookupBound !== "true") {
    widget.dataset.lyricsLookupBound = "true";
    loadDynamicLyrics(widget, audio);
  }
  bindDynamicLyricsWidget(widget, audio);
};
function clampDynamicEmbedTilePosition(tile, main, position = {}) {
  const frame = main?.getBoundingClientRect();
  if (!frame) return { x: safeNumber(position.x, 0, 100, 50), y: safeNumber(position.y, 0, 100, 50), free: true };
  const rect = tile.getBoundingClientRect();
  const halfWidth = Math.min(50, (rect.width / Math.max(frame.width, 1)) * 50);
  const halfHeight = Math.min(50, (rect.height / Math.max(frame.height, 1)) * 50);
  return { x: Math.round(safeNumber(position.x, halfWidth, 100 - halfWidth, 50) * 10) / 10, y: Math.round(safeNumber(position.y, halfHeight, 100 - halfHeight, 50) * 10) / 10, free: true };
}
function clampDynamicEmbedTiles(main) {
  if (!main) return;
  main.querySelectorAll("[data-dynamic-tile]").forEach((tile) => {
    const styles = getComputedStyle(tile);
    const position = clampDynamicEmbedTilePosition(tile, main, { x: Number.parseFloat(styles.getPropertyValue("--dynamic-x")), y: Number.parseFloat(styles.getPropertyValue("--dynamic-y")) });
    tile.style.setProperty("--dynamic-x", String(position.x));
    tile.style.setProperty("--dynamic-y", String(position.y));
  });
}
function dynamicEmbedEditorToolbar() {
  return `<div class="embed-editor-toolbar" data-embed-editor-toolbar><div class="embed-editor-copy"><span class="embed-editor-kicker">EMBED EDITOR</span><strong>Arrange your embed</strong><small>Drag profile, Connections, music player or Live lyrics. Add synced lines in Audio settings.</small></div><div class="embed-editor-actions"><span class="embed-editor-status" data-embed-editor-status>Changes not saved</span><button class="button button-small button-primary" data-embed-editor-save type="button">Save layout</button><a class="button button-small button-dark" href="/dashboard">Back to builder</a></div></div>`;
}
const baseWirePublicWithEmbedEditor = wirePublic;
wirePublic = function () {
  baseWirePublicWithEmbedEditor();
  const dynamicPage = document.querySelector(".dynamic-embed-page");
  const dynamicMain = dynamicPage?.querySelector(".dynamic-embed-main");
  if (dynamicMain) {
    clampDynamicEmbedTiles(dynamicMain);
    if (dynamicPage.dataset.layoutResizeBound !== "true") {
      dynamicPage.dataset.layoutResizeBound = "true";
      window.addEventListener("resize", () => clampDynamicEmbedTiles(dynamicMain));
    }
  }
  const page = document.querySelector(".dynamic-embed-page.is-embed-editor");
  const main = page?.querySelector(".dynamic-embed-main");
  const saveButton = page?.querySelector("[data-embed-editor-save]");
  const status = page?.querySelector("[data-embed-editor-status]");
  if (!page || !main || !saveButton || page.dataset.editorBound === "true") return;
  page.dataset.editorBound = "true";
  const tiles = Array.from(main.querySelectorAll("[data-dynamic-tile]"));
  const readPositions = () => sanitizeDynamicEmbedPositions(Object.fromEntries(tiles.map((tile) => [tile.dataset.dynamicTile, { x: Number.parseFloat(getComputedStyle(tile).getPropertyValue("--dynamic-x")) || 0, y: Number.parseFloat(getComputedStyle(tile).getPropertyValue("--dynamic-y")) || 0, free: true }])));
  const applyPosition = (tile, position) => { tile.style.setProperty("--dynamic-x", String(position.x)); tile.style.setProperty("--dynamic-y", String(position.y)); };
  const setStatus = (message, error = false) => { if (status) { status.textContent = message; status.classList.toggle("is-error", error); } };
  const clampTilePosition = (tile, position) => clampDynamicEmbedTilePosition(tile, main, position);
  const clampTiles = () => { const positions = readPositions(); tiles.forEach((tile) => applyPosition(tile, clampTilePosition(tile, positions[tile.dataset.dynamicTile] || { x: 50, y: 50 }))); };
  tiles.forEach((tile) => {
    const onPointerDown = (event) => {
      if (event.button !== 0 || event.target.closest("button,input,a,select,textarea")) return;
      event.preventDefault();
      event.stopPropagation();
      const key = tile.dataset.dynamicTile;
      const start = readPositions()[key] || { x: 50, y: 50 };
      const frame = main.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      tile.classList.add("is-dragging");
      const onPointerMove = (moveEvent) => {
        const position = clampTilePosition(tile, { x: start.x + ((moveEvent.clientX - startX) / Math.max(frame.width, 1)) * 100, y: start.y + ((moveEvent.clientY - startY) / Math.max(frame.height, 1)) * 100 });
        applyPosition(tile, position);
        setStatus("Unsaved layout");
      };
      const finish = () => {
        tile.classList.remove("is-dragging");
        tile.removeEventListener("pointermove", onPointerMove);
        tile.removeEventListener("pointerup", finish);
        tile.removeEventListener("pointercancel", finish);
        document.removeEventListener("pointerup", finish);
        document.removeEventListener("pointercancel", finish);
        try { tile.releasePointerCapture?.(event.pointerId); } catch {}
      };
      tile.addEventListener("pointermove", onPointerMove);
      tile.addEventListener("pointerup", finish);
      tile.addEventListener("pointercancel", finish);
      document.addEventListener("pointerup", finish);
      document.addEventListener("pointercancel", finish);
      try { tile.setPointerCapture?.(event.pointerId); } catch {}
    };
    tile.addEventListener("pointerdown", onPointerDown);
  });
  clampTiles();
  window.addEventListener("resize", clampTiles);
  saveButton.addEventListener("click", async () => {
    const username = page.dataset.embedUsername;
    if (!username) return;
    busy(saveButton, true, "Saving…");
    setStatus("Saving…");
    try {
      const { data: profile, error: fetchError } = await supabaseClient.from("profiles").select("id,customization").eq("username", username).maybeSingle();
      if (fetchError || !profile) throw fetchError || new Error("Profile not found");
      const customization = sanitizeCustomization(profile.customization);
      customization.dynamicEmbedPositions = readPositions();
      const { error: updateError } = await supabaseClient.from("profiles").update({ customization }).eq("id", profile.id);
      if (updateError) throw updateError;
      try { localStorage.setItem("sqezen_dynamic_embed_positions", JSON.stringify({ username, positions: customization.dynamicEmbedPositions, timestamp: Date.now() })); } catch {}
      setStatus("Layout saved");
    } catch (error) {
      console.error("Embed layout save failed", error);
      setStatus("Could not save layout.", true);
    } finally {
      busy(saveButton, false);
    }
  });
  setStatus("Drag any element to arrange it");
};
function wireAdaptiveBackgroundMedia() {
  document.querySelectorAll(".public-media").forEach((media) => {
    if (media.tagName !== "VIDEO" || media.dataset.backgroundQualityBound === "true") return;
    media.dataset.backgroundQualityBound = "true";
    const adapt = () => {
      const width = Number(media.videoWidth);
      const height = Number(media.videoHeight);
      if (!width || !height) return;
      const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const coverScale = Math.max(viewportWidth / width, viewportHeight / height);
      media.classList.toggle("is-low-resolution", coverScale > 1.35);
    };
    media.addEventListener("loadedmetadata", adapt);
    media.addEventListener("loadeddata", adapt);
    window.addEventListener("resize", adapt, { passive: true });
    adapt();
  });
}
function dynamicLyricsEntries(value) {
  const entries = [];
  String(value || "").split(/\r?\n/).slice(0, 300).forEach((line, order) => {
    const timestamps = [];
    const timestampPattern = /\[(\d{1,3}):([0-5]\d)(?:[.:](\d{1,3}))?\]/g;
    let match;
    while ((match = timestampPattern.exec(line))) {
      const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
      timestamps.push(Number(match[1]) * 60 + Number(match[2]) + fraction);
    }
    const text = line.replace(/\[\d{1,3}:[0-5]\d(?:[.:]\d{1,3})?\]/g, "").trim();
    if (!text || !timestamps.length) return;
    timestamps.forEach((time) => entries.push({ time, text, order }));
  });
  return entries.sort((left, right) => left.time - right.time || left.order - right.order).slice(0, 240);
}
function dynamicLyricsWidget(lyrics, position = { x: 76, y: 27 }, showEmptyState = false, track = {}) {
  const entries = dynamicLyricsEntries(lyrics);
  const x = safeNumber(position?.x, 0, 100, 76);
  const y = safeNumber(position?.y, 0, 100, 27);
  const trackTitle = String(track.title || "").trim().slice(0, 120);
  const trackArtist = String(track.artist || "").trim().slice(0, 80);
  const automatic = !entries.length;
  const description = showEmptyState ? "We will look up synced lyrics from the track metadata automatically." : "Looking up synced lyrics from the track metadata.";
  const content = entries.length
    ? `<div class="dynamic-lyrics-lines">${dynamicLyricsLineMarkup(entries)}</div>`
    : `<div class="dynamic-lyrics-auto-message" data-lyrics-message><strong>LOOKING FOR LYRICS</strong><p>${description}</p>${trackTitle ? `<code>${escapeHtml(trackTitle)}${trackArtist ? ` · ${escapeHtml(trackArtist)}` : ""}</code>` : ""}</div>`;
  return `<section class="dynamic-lyrics-widget" data-dynamic-tile="lyrics" data-lyrics-widget data-lyrics-auto="${automatic}" data-lyrics-track-title="${escapeHtml(trackTitle)}" data-lyrics-track-artist="${escapeHtml(trackArtist)}" aria-label="Live lyrics" style="--dynamic-x:${x};--dynamic-y:${y}"><div class="dynamic-lyrics-heading"><span class="dynamic-lyrics-label">LIVE LYRICS</span><span class="dynamic-lyrics-state" data-lyrics-state>${automatic ? "LOOKING UP" : "READY"}</span></div><div class="dynamic-lyrics-visualizer" aria-hidden="true">${Array.from({ length: 6 }, () => "<i></i>").join("")}</div><div class="dynamic-lyrics-viewport" data-lyrics-viewport>${content}</div><div class="dynamic-lyrics-footer"><span>${automatic ? "AUTO SYNC" : "SYNCED TO AUDIO"}</span><time data-lyrics-time-label>0:00</time></div></section>`;
}
function dynamicAudioFilenameTitle(value) {
  const source = String(value || "");
  if (!source || /^data:/i.test(source)) return "";
  const encodedFilename = source.split(/[?#]/)[0].split("/").pop() || "";
  let rawFilename = encodedFilename;
  try { rawFilename = decodeURIComponent(encodedFilename); } catch {}
  return rawFilename.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
}
function dynamicAudioTrackMeta(audioUrl, metadata = {}, fallbackArtist = "sqezen") {
  const source = String(audioUrl || "");
  const rawFilename = dynamicAudioFilenameTitle(source);
  return { title: String(metadata.title || "").trim() || rawFilename || "Now playing", artist: String(metadata.artist || "").trim() || fallbackArtist || "sqezen" };
}
function dynamicBadgeWidget(badges = [], position = { x: 75, y: 82 }) {
  const items = dynamicBadgeItems(badges);
  if (!items) return "";
  const x = safeNumber(position?.x, 0, 100, 75);
  const y = safeNumber(position?.y, 0, 100, 82);
  return `<section class="embed-badges-card" data-dynamic-tile="badges" aria-label="Odznaki" style="--dynamic-x:${x};--dynamic-y:${y}"><span class="embed-kicker">BADGES</span><div class="embed-badges">${items}</div></section>`;
}
function dynamicAudioWidget(audioUrl, position = { x: 25, y: 82 }, metadata = {}, fallbackArtist = "sqezen") {
  const x = safeNumber(position?.x, 0, 100, 25);
  const y = safeNumber(position?.y, 0, 100, 82);
  const track = dynamicAudioTrackMeta(audioUrl, metadata, fallbackArtist);
  return `<div class="profile-audio-widget dynamic-audio-widget" data-audio-widget data-dynamic-tile="audio" style="--dynamic-x:${x};--dynamic-y:${y}"><div class="dynamic-audio-track"><div class="dynamic-audio-copy"><strong class="dynamic-audio-title">${escapeHtml(track.title)}</strong><span class="dynamic-audio-artist">${escapeHtml(track.artist)}</span></div></div><div class="dynamic-audio-controls" role="group" aria-label="Sterowanie muzyką"><button class="dynamic-audio-control" data-audio-rewind type="button" aria-label="Cofnij 10 sekund" title="Cofnij 10 sekund">${icon("rewind")}</button><button class="dynamic-audio-control dynamic-audio-play" data-audio-toggle type="button" aria-label="Odtwórz audio"><span data-audio-icon>${icon("play")}</span></button><button class="dynamic-audio-control" data-audio-forward type="button" aria-label="Przewiń 10 sekund" title="Przewiń 10 sekund">${icon("forward")}</button></div><div class="dynamic-audio-progress-row"><time data-audio-current>0:00</time><input class="dynamic-audio-progress" data-audio-progress type="range" min="0" max="0" step="0.1" value="0" aria-label="Pozycja utworu"><time data-audio-duration>0:00</time></div><audio data-profile-audio preload="auto" src="${escapeHtml(audioUrl)}"></audio></div>`;
}
async function dynamicEmbedProfile(username) {
  const { data, error } = await supabaseClient.from("profiles").select("*").eq("username", username).maybeSingle();
  if (error) return layout(`<main class="empty-page"><p class="eyebrow">SQEZEN / EMBED</p><h1>Nie udało się wczytać embedu.</h1><p>Spróbuj ponownie za chwilę.</p></main>`);
  if (!data) return layout(`<main class="empty-page"><p class="eyebrow">SQEZEN / PROFILE</p><h1>Nie znaleziono profilu.</h1><p>Nazwa <strong>${escapeHtml(username)}</strong> nie jest jeszcze zajęta.</p>${button("/register", "Zarezerwuj nazwę", true)}</main>`);
  const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", data.id).order("position", { ascending: true });
  const config = sanitizeCustomization(data.customization);
  const display = String(data.display_name || data.username || username).trim();
  const media = config.backgroundMediaUrl;
  const mediaMarkup = media ? (isVideoMedia(media) ? `<video class="public-media" autoplay muted loop playsinline src="${escapeHtml(media)}"></video>` : `<div class="public-media" style="background-image:url('${escapeHtml(media).replace(/&#039;/g, "%27")}')"></div>`) : "";
  const pageBg = config.useGradient ? `radial-gradient(circle at top,${config.gradientPrimary} 0%,${config.gradientSecondary} 74%)` : config.gradientSecondary;
  const style = [`--profile-accent:${safeColor(data.background_color)}`, `--profile-text:${config.textColor}`, `--profile-card-rgb:${hexRgb(config.cardColor)}`, `--profile-button-rgb:${hexRgb(config.buttonColor)}`, `--profile-button-text:${config.buttonTextColor}`, `--profile-opacity:${config.profileOpacity / 100}`, `--profile-blur:${config.profileBlur}px`, `--profile-width:${config.cardWidth}px`, `--profile-avatar:${config.avatarSize}px`, `--profile-radius:${config.buttonRadius}px`, `--profile-background:${pageBg}`].join(";");
  const connections = (links || []).map((link) => { const href = safeUrl(link.url); if (!href) return ""; const title = String(link.title || "Link").trim() || "Link"; return `<a class="embed-connection" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">${icon(profileIcon(link))}</a>`; }).filter(Boolean).slice(0, 5).join("") || `<span class="embed-connection embed-connection-empty">${icon("globe")}</span>`;
  const classes = `align-${config.alignment} spacing-${config.spacing} buttons-${config.buttonStyle} effect-${config.backgroundEffect} name-${config.usernameEffect} font-${config.fontFamily}`;
  const positions = config.dynamicEmbedPositions || sanitizeDynamicEmbedPositions();
  const badgesMarkup = dynamicBadgeWidget(config.badges, positions.badges);
  const audioTrack = dynamicAudioTrackMeta(config.audioUrl, { title: config.audioTitle, artist: config.audioArtist }, display);
  const audioMarkup = config.audioUrl ? dynamicAudioWidget(config.audioUrl, positions.audio, audioTrack, display) : "";
  const lyricsMarkup = config.audioUrl ? dynamicLyricsWidget(config.audioLyrics, positions.lyrics, new URLSearchParams(location.search).get("edit") === "1", { title: audioTrack.title, artist: config.audioArtist }) : "";
  return `<div class="public-page dynamic-embed-page ${classes}" style="${style}"${config.cursorUrl ? ` data-custom-cursor="${escapeHtml(config.cursorUrl)}"` : ""}>${mediaMarkup}<div class="public-shade"></div><main class="dynamic-embed-main"><section class="embed-profile-card" data-dynamic-tile="profile" style="--dynamic-x:${positions.profile.x};--dynamic-y:${positions.profile.y}"><div class="embed-profile-top">${avatar(data, "embed-profile-avatar")}<button class="icon-button" data-copy-profile="${escapeHtml(location.href)}" type="button" aria-label="Skopiuj link">${icon("copy")}</button></div><p class="embed-profile-handle">@${escapeHtml(data.username)}</p><h1 data-name="${escapeHtml(display)}">${escapeHtml(display)}</h1>${data.bio ? `<p class="embed-profile-bio">${escapeHtml(data.bio)}</p>` : ""}<div class="embed-profile-meta"><span><i></i> online</span><span>sqezen.lol/${escapeHtml(data.username)}</span></div></section><section class="embed-connections-card" data-dynamic-tile="connections" style="--dynamic-x:${positions.connections.x};--dynamic-y:${positions.connections.y}"><span class="embed-kicker">CONNECTIONS</span><div class="embed-connections">${connections}</div></section>${badgesMarkup}${audioMarkup}${lyricsMarkup}</main></div>`;
}
const baseDynamicEmbedProfileForEditor = dynamicEmbedProfile;
dynamicEmbedProfile = async function (username) {
  const markup = await baseDynamicEmbedProfileForEditor(username);
  if (new URLSearchParams(location.search).get("edit") !== "1" || !markup.includes('class="public-page dynamic-embed-page ')) return markup;
  return markup.replace('<div class="public-page dynamic-embed-page ', '<div class="public-page dynamic-embed-page is-embed-editor ').replace(' style="', ` data-embed-editor="true" data-embed-username="${escapeHtml(username)}" style="`).replace('<div class="public-shade"></div>', `${dynamicEmbedEditorToolbar()}<div class="public-shade"></div>`);
};
const basePublicProfile = publicProfile;
publicProfile = async function (username) {
  const markup = await basePublicProfile(username);
  const audioMarkup = markup.match(/<audio data-profile-audio[^>]*><\/audio>/)?.[0];
  if (!audioMarkup) return markup;
  const audioControl = /<button class="icon-button audio-toggle"[\s\S]*?<\/button><audio data-profile-audio[^>]*><\/audio>/;
  const audioWidget = `<div class="profile-audio-widget" data-audio-widget><button class="profile-audio-toggle" data-audio-toggle type="button" aria-label="Sound off"><span>${icon("volume")}</span><span data-audio-label>SOUND OFF</span></button><label class="profile-audio-volume"><span class="sr-only">Volume</span><input data-audio-volume type="range" min="0" max="1" step="0.01" value="0.72" aria-label="Profile volume"></label>${audioMarkup.replace('preload="none"', 'preload="auto"')}</div>`;
  return markup.replace(audioControl, "").replace('<div class="public-shade"></div>', `<div class="public-shade"></div>${audioWidget}`);
};
const basePublicProfileWithAudio = publicProfile;
publicProfile = async function (username) {
  const embedMode = new URLSearchParams(location.search).get("embed");
  if (embedMode === "1") return dynamicEmbedProfile(username);
  if (embedMode !== "0") {
    const { data } = await supabaseClient.from("profiles").select("customization").eq("username", username).maybeSingle();
    if (sanitizeCustomization(data?.customization).defaultEmbed === "dynamic") return dynamicEmbedProfile(username);
  }
  return basePublicProfileWithAudio(username);
};
const basePublicProfileWithCursorGlow = publicProfile;
publicProfile = async function (username) {
  const markup = await basePublicProfileWithCursorGlow(username);
  if (!markup.includes('class="public-page ') || markup.includes("data-cursor-glow=")) return markup;
  const { data } = await supabaseClient.from("profiles").select("customization").eq("username", username).maybeSingle();
  const glowColor = sanitizeCustomization(data?.customization).cursorGlowColor;
  return markup.replace(' style="', ` data-cursor-glow="${escapeHtml(glowColor)}" style="`);
};
const basePublicProfileWithLocalVideo = publicProfile;
publicProfile = async function (username) {
  const markup = await basePublicProfileWithLocalVideo(username);
  return markup.replace(/<div class="public-media" style="background-image:url\('((?:data:video\/)[^']+)'\)"><\/div>/i, (_, src) => `<video class="public-media" autoplay muted loop playsinline src="${src}"></video>`);
};
const baseRender = render;
render = async function () { const path = currentPath(); if (!["/login", "/register", "/register/code"].includes(path)) return baseRender(); if (state.resendTimer) { clearInterval(state.resendTimer); state.resendTimer = null; } document.body.dataset.route = path; document.title = `${path === "/login" ? "Sign in" : path === "/register" ? "Create an account" : "Confirm your email"} — sqezen`; const app = document.querySelector("#app"); const kind = path === "/register/code" ? "code" : path.slice(1); app.innerHTML = typeof window.auth === "function" ? window.auth(kind) : auth(kind); await wireAuth(); };
window.rerenderAuth = () => render();
addEventListener("popstate", render); render();
