const SUPABASE_URL = "https://wzdxgmzwxzfhegelqugy.supabase.co";
const SUPABASE_KEY = "sb_publishable_63IpIFewxY0qJ3Cx532LQA_vEwXoSwP";

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
const appState = { resendTimer: null };

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
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6 4 4M5 19l3.5-.8L18.5 8a2.1 2.1 0 0 0-3-3L5.5 15.2 5 19Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5v9.2a4 4 0 1 1-3-3.9M14 5c.5 2.2 1.9 3.6 4 4"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="3"/><path d="m10 10 5 2-5 2v-4Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z"/><circle cx="12" cy="12" r="2"/></svg>',
  logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 16l4-4-4-4M9 12h9"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
  palette: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16h1.2a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18A2 2 0 0 0 20 12a8 8 0 0 0-8-8Z"/><path d="M8 10h.1M10 7h.1M7 14h.1"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.5-1.2.9-1.9-2.1-2.1-1.9.9-1.2-.5-.7-2h-3l-.7 2-1.2.5-1.9-.9-2.1 2.1.9 1.9-.5 1.2-2 .7v3l2 .7.5 1.2-.9 1.9 2.1 2.1 1.9-.9 1.2.5.7 2h3l.7-2 1.2-.5 1.9.9 2.1-2.1-.9-1.9.5-1.2 2-.7Z"/></svg>',
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 14 5-5 5 5"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>'
};

function icon(name) { return icons[name] || icons.link; }

function currentPath() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) history.replaceState(null, "", redirect);
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/index.html" ? "/" : path;
}

function navigate(path) {
  history.pushState(null, "", path);
  render();
  window.scrollTo(0, 0);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}

function normalizeLinkUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^(javascript|data|vbscript):/i.test(raw)) return "";
  if (/^(https?:|mailto:)/i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `https://${raw.replace(/\s+/g, "")}`;
}

function safeUrl(value) {
  const normalized = normalizeLinkUrl(value);
  if (!normalized) return "";
  try {
    const parsed = new URL(normalized);
    return ["https:", "http:", "mailto:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
}

function safeColor(value, fallback = "#c9cdd4") { return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback; }

function friendlyError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("failed to fetch") || message.includes("networkerror") || message.includes("fetch resource")) return "Nie udało się połączyć z serwerem. Odśwież stronę i spróbuj ponownie.";
  if (message.includes("invalid login credentials")) return "Nieprawidłowy e-mail lub hasło.";
  if (message.includes("user already registered") || message.includes("already been registered")) return "Konto z tym adresem już istnieje. Zaloguj się.";
  if (message.includes("password should be at least")) return "Hasło musi mieć co najmniej 6 znaków.";
  if (message.includes("rate limit")) return "Za dużo prób. Odczekaj chwilę i spróbuj ponownie.";
  if (message.includes("token has expired") || message.includes("otp has expired")) return "Ten kod wygasł. Wyślij nowy kod.";
  if (message.includes("invalid token") || message.includes("otp is invalid")) return "Kod jest nieprawidłowy. Sprawdź go dokładnie w wiadomości.";
  if (message.includes("duplicate key") || message.includes("unique constraint")) return "Ta nazwa użytkownika jest już zajęta.";
  return "Coś poszło nie tak. Sprawdź dane i spróbuj ponownie.";
}

function feedback(message, error = false) {
  const node = document.querySelector("#form-feedback");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("is-error", error);
  node.classList.toggle("is-success", !error && Boolean(message));
}

function setBusy(button, busy, label) {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="button-spinner" aria-hidden="true"></span>${escapeHtml(label || "Pracuję...")}`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.label || button.innerHTML;
  }
}

function layout(content, { pageClass = "site-page", showNav = true, showFooter = true } = {}) {
  const nav = showNav ? `<header class="site-nav"><a class="brand" href="/" aria-label="sqezen — strona główna"><span class="brand-mark">s</span><span>sqezen</span></a><nav class="nav-actions" aria-label="Główna nawigacja"><a class="nav-link nav-desktop" href="/">O projekcie</a><a class="button button-small button-ghost" href="/login">Zaloguj się</a><a class="button button-small button-primary" href="/register">Stwórz profil ${icon("arrow")}</a></nav></header>` : "";
  const footer = showFooter ? `<footer class="site-footer"><span>sqezen.lol</span><span>your space online</span></footer>` : "";
  return `<div class="${pageClass}">${nav}<main>${content}</main>${footer}</div>`;
}

function buttonLink(href, label, { primary = false, external = false, className = "" } = {}) {
  const target = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a class="button ${primary ? "button-primary" : "button-ghost"} ${className}" href="${escapeHtml(href)}"${target}>${escapeHtml(label)} ${icon("arrow")}</a>`;
}

function landing() {
  return layout(`<section class="hero-section"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> SIMPLE PROFILES FOR THE INTERNET</p><h1>Jedno miejsce.<br /><em>Cały Ty.</em></h1><p class="hero-lead">Stwórz spokojną, szybką stronę bio i zbierz swoje linki pod własnym adresem <strong>sqezen.lol</strong>.</p><div class="hero-actions">${buttonLink("/register", "Stwórz swój profil", { primary: true })}${buttonLink("/login", "Mam już konto")}</div><div class="hero-note"><span>${icon("check")}</span> Bez reklam&nbsp;&nbsp;·&nbsp;&nbsp; Bez ciężkich dodatków&nbsp;&nbsp;·&nbsp;&nbsp; Twój adres</div></div><div class="showcase-wrap" aria-label="Podgląd profilu sqezen"><div class="showcase-label"><span>LIVE PREVIEW</span><span class="live-indicator"><i></i> online</span></div><div class="mock-profile"><div class="mock-profile-top"><span class="mock-avatar">s</span><span class="mock-menu">•••</span></div><p class="mock-handle">@sqezen</p><h2>sqezen</h2><p class="mock-bio">developer <span>•</span> gamer <span>•</span> digital chaos</p><div class="mock-links"><div class="mock-link"><span class="mock-icon">${icon("github")}</span><span>GitHub</span><span class="mock-arrow">↗</span></div><div class="mock-link"><span class="mock-icon">${icon("discord")}</span><span>Discord</span><span class="mock-arrow">↗</span></div><div class="mock-link"><span class="mock-icon">${icon("youtube")}</span><span>YouTube</span><span class="mock-arrow">↗</span></div></div><div class="mock-footer"><span>sqezen.lol/sqezen</span><span>${icon("sparkle")}</span></div></div></div></section><section class="intro-strip"><div><p class="eyebrow">DLACZEGO SQEZEN</p><h2>Profil, który nie walczy o uwagę.</h2></div><p>Najważniejsze rzeczy mają być widoczne od razu: Twoja nazwa, krótki opis i linki. Reszta ma tylko dobrze wyglądać.</p></section><section class="feature-grid" aria-label="Najważniejsze funkcje"><article class="feature-card"><span class="feature-icon">${icon("pencil")}</span><p class="eyebrow">01 / PERSONAL</p><h3>Twój styl</h3><p>Avatar, opis, kolory i linki ustawiasz w jednym prostym edytorze.</p></article><article class="feature-card"><span class="feature-icon">${icon("link")}</span><p class="eyebrow">02 / ONE LINK</p><h3>Jeden adres</h3><p>Udostępnij sqezen.lol/nazwauzytkownika zamiast pięciu różnych profili.</p></article><article class="feature-card"><span class="feature-icon">${icon("lock")}</span><p class="eyebrow">03 / FOCUSED</p><h3>Bez chaosu</h3><p>Ciemny, czytelny layout zaprojektowany dla twórców, graczy i developerów.</p></article></section><section class="steps-section"><div><p class="eyebrow">START W 3 KROKACH</p><h2>Od pustej strony do własnego adresu.</h2></div><div class="steps-list"><div class="step-item"><span>01</span><div><h3>Załóż konto</h3><p>Podaj e-mail i potwierdź go krótkim kodem.</p></div></div><div class="step-item"><span>02</span><div><h3>Uzupełnij profil</h3><p>Wybierz nazwę, dodaj opis i najważniejsze linki.</p></div></div><div class="step-item"><span>03</span><div><h3>Udostępnij</h3><p>Twój profil jest gotowy pod sqezen.lol/username.</p></div></div></div></section><section class="final-cta"><div><p class="eyebrow">READY WHEN YOU ARE</p><h2>Twoje linki zasługują na własny adres.</h2></div>${buttonLink("/register", "Zacznij za darmo", { primary: true })}</section>`, { pageClass: "site-page landing-page" });
}

function authPage(kind) {
  const code = kind === "code";
  const register = kind === "register";
  const title = code ? "Sprawdź swoją skrzynkę" : register ? "Zacznij od prostego profilu" : "Wróć do swojego profilu";
  const eyebrow = code ? "SQEZEN / VERIFY" : register ? "SQEZEN / JOIN" : "SQEZEN / SIGN IN";
  const formContent = code ? `<p class="auth-card-kicker">OSTATNI KROK</p><h2>Wpisz kod</h2><p class="form-intro">Wysłaliśmy 8-cyfrowy kod na adres zapisany przy rejestracji.</p><form id="code-form" class="stack-form"><label class="field-label">Kod z wiadomości<input class="code-input" name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" placeholder="00000000" required /></label><button class="button button-primary button-wide" type="submit">Potwierdź e-mail ${icon("arrow")}</button><button class="text-button" id="resend-code" type="button">Wyślij kod ponownie</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Kod wygasa po kilku minutach. Sprawdź też folder Spam.</p><a class="back-link" href="/register">${icon("arrow")} Zmień dane</a>` : register ? `<p class="auth-card-kicker">UTWÓRZ KONTO</p><h2>Dołącz do sqezen</h2><p class="form-intro">Załóż konto, potwierdź e-mail kodem i wybierz własną nazwę profilu.</p><form id="register-form" class="stack-form"><label class="field-label">E-mail<input name="email" type="email" autocomplete="email" placeholder="ty@example.com" required /></label><label class="field-label">Hasło<input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="minimum 6 znaków" required /></label><button class="button button-primary button-wide" type="submit">Dalej ${icon("arrow")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Masz już konto? <a href="/login">Zaloguj się</a></p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a>` : `<p class="auth-card-kicker">ZALOGUJ SIĘ</p><h2>Miło Cię widzieć</h2><p class="form-intro">Zaloguj się, żeby edytować swój profil i linki.</p><form id="login-form" class="stack-form"><label class="field-label">E-mail<input name="email" type="email" autocomplete="email" placeholder="ty@example.com" required /></label><label class="field-label">Hasło<input name="password" type="password" autocomplete="current-password" placeholder="Twoje hasło" required /></label><button class="button button-primary button-wide" type="submit">Zaloguj się ${icon("arrow")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Nie masz konta? <a href="/register">Stwórz je za darmo</a></p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a>`;
  return layout(`<section class="auth-layout"><div class="auth-story"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="auth-story-copy">Jedna spokojna strona dla Twojej obecności online. Ustaw ją raz i wracaj, kiedy chcesz.</p><div class="story-points"><div><span>${icon("check")}</span><p><strong>Prosty profil</strong><small>Nick, bio, avatar i linki w jednym miejscu.</small></p></div><div><span>${icon("check")}</span><p><strong>Własny adres</strong><small>Udostępniaj jeden link znajomym i społeczności.</small></p></div><div><span>${icon("check")}</span><p><strong>Gotowe do edycji</strong><small>Zmiany zapisujesz bez przeładowywania strony.</small></p></div></div></div><section class="auth-card">${formContent}</section></section>`, { pageClass: "site-page auth-page" });
}

function login() { return authPage("login"); }
function register() { return authPage("register"); }
function registerCode() { return authPage("code"); }

function iconOptions(selected = "website") {
  const options = [["website", "Strona / link"], ["github", "GitHub"], ["discord", "Discord"], ["youtube", "YouTube"], ["tiktok", "TikTok"]];
  return options.map(([value, label]) => `<option value="${value}"${selected === value ? " selected" : ""}>${label}</option>`).join("");
}

function linkEditorItem(link = {}, index = 0) {
  const iconName = ["website", "github", "discord", "youtube", "tiktok"].includes(link.icon) ? link.icon : "website";
  return `<article class="link-item" data-link-item><div class="link-item-head"><span class="link-index">${String(index + 1).padStart(2, "0")}</span><span class="link-item-title">Link ${index + 1}</span><div class="link-actions"><button class="icon-button" type="button" data-link-action="up" aria-label="Przesuń wyżej">${icon("up")}</button><button class="icon-button" type="button" data-link-action="down" aria-label="Przesuń niżej">${icon("down")}</button><button class="icon-button" type="button" data-link-action="duplicate" aria-label="Duplikuj link">${icon("copy")}</button><button class="icon-button" type="button" data-link-action="test" aria-label="Otwórz link testowo">${icon("arrowUp")}</button><button class="icon-button remove-link" type="button" data-link-action="remove" aria-label="Usuń link">${icon("close")}</button></div></div><div class="link-fields"><label class="field-label">Nazwa<input data-link-title type="text" maxlength="38" value="${escapeHtml(link.title || "")}" placeholder="np. Mój GitHub" /></label><label class="field-label">Adres / tekst linku<input data-link-url type="text" inputmode="url" value="${escapeHtml(link.url || "")}" placeholder="discord.gg/twojserwer lub https://..." /><small>Możesz wkleić adres bez https:// — uzupełnimy go automatycznie.</small></label><label class="field-label">Ikona<select data-link-icon>${iconOptions(iconName)}</select></label></div></article>`;
}

function dashboardLegacy() {
  return `<div class="dashboard-page"><header class="dashboard-nav"><a class="brand" href="/"><span class="brand-mark">s</span><span>sqezen</span></a><div class="dashboard-nav-actions"><span class="save-status" id="top-status"><i></i> dashboard</span><a class="button button-small button-ghost" id="view-profile" href="#" target="_blank" rel="noopener noreferrer">Zobacz profil ${icon("arrowUp")}</a><button class="button button-small button-dark" id="logout-button" type="button">Wyloguj ${icon("logout")}</button></div></header><div class="dashboard-layout"><aside class="dashboard-sidebar"><div class="sidebar-label">WORKSPACE</div><div class="sidebar-item is-active">${icon("dashboard")}<span>Twój profil</span></div><div class="sidebar-item sidebar-muted">${icon("sparkle")}<span>Personalizacja</span><em>soon</em></div><div class="sidebar-divider"></div><div class="sidebar-label">ACCOUNT</div><div class="account-mini"><span class="account-avatar" id="account-avatar">s</span><div><strong id="account-name">Twoje konto</strong><small id="account-email">Ładowanie...</small></div></div></aside><main class="dashboard-main"><div class="dashboard-heading"><div><p class="eyebrow">SQEZEN / DASHBOARD</p><h1>Ustaw swój profil.</h1><p class="dashboard-subtitle">Zadbaj o pierwsze wrażenie. Zmiany pojawią się na Twoim publicznym adresie od razu po zapisaniu.</p></div><div class="dashboard-heading-mark">${icon("sparkle")}</div></div><div class="dashboard-grid"><form id="profile-form" class="editor-panel"><div class="panel-heading"><div><p class="panel-kicker">01 / IDENTITY</p><h2>Podstawowe dane</h2></div><span class="panel-number">A</span></div><div class="identity-grid"><label class="field-label">Nazwa użytkownika<input name="username" pattern="[a-z0-9_]{3,24}" minlength="3" maxlength="24" autocomplete="off" placeholder="np. sqezen" required /><small>Tylko małe litery, cyfry i podkreślenie.</small></label><label class="field-label">Nazwa wyświetlana<input name="display_name" maxlength="40" placeholder="Twoja nazwa" required /></label></div><label class="field-label">Bio<textarea name="bio" maxlength="160" placeholder="developer • gamer • digital chaos"></textarea><small>Krótko i konkretnie. Maksymalnie 160 znaków.</small></label><div class="editor-divider"></div><div class="panel-heading"><div><p class="panel-kicker">02 / LOOK</p><h2>Wygląd profilu</h2></div><span class="panel-number">B</span></div><div class="look-grid"><label class="field-label">Avatar URL<input name="avatar_url" type="url" placeholder="https://.../avatar.png" /></label><label class="field-label color-field">Kolor akcentu<div class="color-input"><input name="background_color" type="color" value="#c9cdd4" /><span id="color-value">#C9CDD4</span></div></label></div><div class="editor-divider"></div><div class="panel-heading"><div><p class="panel-kicker">03 / LINKS</p><h2>Twoje linki</h2></div><button class="button button-small button-ghost add-link" id="add-link" type="button">${icon("plus")} Dodaj link</button></div><p class="panel-help">Dodaj miejsca, w których można Cię znaleźć. Kolejność jest taka sama jak tutaj.</p><div id="links-list" class="links-editor"></div><button class="button button-primary button-wide save-profile" type="submit">Zapisz profil ${icon("check")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><aside class="preview-panel"><div class="preview-sticky"><div class="preview-topline"><div><p class="panel-kicker">LIVE PREVIEW</p><h2>Tak wygląda Twój profil</h2></div><span class="preview-live"><i></i> live</span></div><div id="dashboard-preview" class="dashboard-preview"></div><p class="preview-hint">Podgląd aktualizuje się podczas pisania. Publicznie zobaczysz go po zapisaniu profilu.</p></div></aside></div></main></div></div>`;
}

function dashboard() {
  return `<div class="dashboard-page">
    <header class="dashboard-nav">
      <a class="brand" href="/"><span class="brand-mark">s</span><span>sqezen</span></a>
      <div class="dashboard-nav-actions">
        <span class="save-status" id="top-status"><i></i> dashboard</span>
        <a class="button button-small button-ghost" id="view-profile" href="#" target="_blank" rel="noopener noreferrer">Zobacz profil ${icon("arrowUp")}</a>
        <button class="button button-small button-dark" id="logout-button" type="button">Wyloguj ${icon("logout")}</button>
      </div>
    </header>
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <div class="sidebar-label">WORKSPACE</div>
        <button class="sidebar-item is-active" type="button" data-dashboard-tab="profile">${icon("user")}<span>Profil</span></button>
        <button class="sidebar-item" type="button" data-dashboard-tab="links">${icon("link")}<span>Linki</span><em id="links-count">0</em></button>
        <button class="sidebar-item" type="button" data-dashboard-tab="appearance">${icon("palette")}<span>Wygląd</span></button>
        <div class="sidebar-divider"></div>
        <div class="sidebar-label">ACCOUNT</div>
        <button class="sidebar-item" type="button" data-dashboard-tab="account">${icon("settings")}<span>Konto</span></button>
        <div class="account-mini"><span class="account-avatar" id="account-avatar">s</span><div><strong id="account-name">Twoje konto</strong><small id="account-email">Ładowanie...</small></div></div>
      </aside>
      <main class="dashboard-main">
        <div class="dashboard-heading"><div><p class="eyebrow" id="dashboard-eyebrow">SQEZEN / PROFILE</p><h1 id="dashboard-title">Twój profil.</h1><p class="dashboard-subtitle" id="dashboard-subtitle">Ustaw nazwę, opis i avatar widoczne na publicznej stronie.</p></div><div class="dashboard-heading-mark">${icon("sparkle")}</div></div>
        <div class="dashboard-grid">
          <form id="profile-form" class="editor-panel">
            <section class="dashboard-tab-panel" data-tab-panel="profile">
              <div class="panel-heading"><div><p class="panel-kicker">01 / IDENTITY</p><h2>Podstawowe dane</h2></div><span class="panel-number">A</span></div>
              <div class="identity-grid"><label class="field-label">Nazwa użytkownika<input name="username" pattern="[a-z0-9_]{3,24}" minlength="3" maxlength="24" autocomplete="off" placeholder="np. sqezen" required /><small>Tylko małe litery, cyfry i podkreślenie.</small></label><label class="field-label">Nazwa wyświetlana<input name="display_name" maxlength="40" placeholder="Twoja nazwa" required /></label></div>
              <label class="field-label bio-field">Bio<textarea name="bio" maxlength="160" placeholder="developer • gamer • digital chaos"></textarea><small><span>Krótko i konkretnie.</span><span id="bio-count">0 / 160</span></small></label>
              <div class="editor-divider"></div>
              <div class="panel-heading"><div><p class="panel-kicker">02 / AVATAR</p><h2>Zdjęcie profilowe</h2></div><span class="panel-number">B</span></div>
              <label class="field-label avatar-url-field">Adres avatara<input name="avatar_url" type="text" inputmode="url" placeholder="cdn.discordapp.com/.../avatar.png" /><small>Wklej bezpośredni adres obrazka. Może być również bez https://.</small></label>
            </section>
            <section class="dashboard-tab-panel" data-tab-panel="links" hidden>
              <div class="panel-heading"><div><p class="panel-kicker">LINK MANAGER</p><h2>Twoje linki</h2></div><button class="button button-small button-ghost add-link" id="add-link" type="button">${icon("plus")} Dodaj link</button></div>
              <p class="panel-help">Wklej dowolny zapis adresu, np. <strong>discord.gg/nazwa</strong>. Nie musisz dodawać https://. Strzałkami zmienisz kolejność, a ikoną ↗ sprawdzisz link.</p>
              <div id="links-list" class="links-editor"></div>
            </section>
            <section class="dashboard-tab-panel" data-tab-panel="appearance" hidden>
              <div class="panel-heading"><div><p class="panel-kicker">VISUAL STYLE</p><h2>Wygląd profilu</h2></div><span class="panel-number">C</span></div>
              <p class="panel-help">Wybierz neutralny odcień dla avatara, detali i delikatnego tła profilu.</p>
              <label class="field-label color-field">Kolor akcentu<div class="color-input"><input name="background_color" type="color" value="#c9cdd4" /><span id="color-value">#C9CDD4</span></div></label>
              <div class="quick-colors" aria-label="Szybkie kolory"><button type="button" data-color-preset="#c9cdd4"><i style="background:#c9cdd4"></i>Srebrny</button><button type="button" data-color-preset="#8f96a1"><i style="background:#8f96a1"></i>Grafit</button><button type="button" data-color-preset="#eef0f3"><i style="background:#eef0f3"></i>Jasny</button><button type="button" data-color-preset="#5f6670"><i style="background:#5f6670"></i>Ciemny</button></div>
              <div class="appearance-note">${icon("eye")} Podgląd po prawej aktualizuje się natychmiast.</div>
            </section>
            <section class="dashboard-tab-panel" data-tab-panel="account" hidden>
              <div class="panel-heading"><div><p class="panel-kicker">ACCOUNT</p><h2>Konto i adres</h2></div><span class="panel-number">D</span></div>
              <div class="account-settings"><label class="field-label">Adres e-mail<input id="account-email-field" type="text" readonly /></label><label class="field-label">Publiczny adres<div class="readonly-action"><input id="profile-address-field" type="text" readonly /><button class="icon-button" id="copy-profile-address" type="button" aria-label="Skopiuj adres profilu">${icon("copy")}</button></div></label></div>
              <div class="account-info-card"><span>${icon("lock")}</span><div><strong>Konto chronione przez Supabase</strong><p>Sesja i hasło nie są zapisywane w przeglądarce przez sqezen.</p></div></div>
            </section>
            <div class="editor-actions"><button class="button button-primary button-wide save-profile" type="submit">Zapisz wszystkie zmiany ${icon("check")}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></div>
          </form>
          <aside class="preview-panel"><div class="preview-sticky"><div class="preview-topline"><div><p class="panel-kicker">LIVE PREVIEW</p><h2>Tak wygląda Twój profil</h2></div><span class="preview-live"><i></i> live</span></div><div id="dashboard-preview" class="dashboard-preview"></div><p class="preview-hint">Podgląd aktualizuje się podczas pisania. Publicznie zobaczysz go po zapisaniu profilu.</p></div></aside>
        </div>
      </main>
    </div>
  </div>`;
}

function profileIcon(link) {
  const value = String(link?.icon || "").toLowerCase();
  if (["github", "discord", "youtube", "tiktok"].includes(value)) return value;
  const url = String(link?.url || "").toLowerCase();
  if (url.includes("github.com")) return "github";
  if (url.includes("discord")) return "discord";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("tiktok.com")) return "tiktok";
  return "globe";
}

function avatarMarkup(profile, className = "profile-avatar") {
  const name = profile?.display_name || profile?.username || "s";
  const initial = escapeHtml(name.slice(0, 1).toUpperCase());
  const avatar = safeUrl(profile?.avatar_url);
  return avatar ? `<img class="${className}" src="${escapeHtml(avatar)}" alt="Avatar użytkownika ${escapeHtml(name)}" loading="eager" />` : `<span class="${className} avatar-fallback" aria-label="Avatar użytkownika ${escapeHtml(name)}">${initial}</span>`;
}

function publicLink(link) {
  const href = safeUrl(link?.url);
  if (!href) return "";
  const title = String(link?.title || "Link").trim() || "Link";
  return `<a class="profile-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"><span class="profile-link-icon">${icon(profileIcon(link))}</span><span class="profile-link-title">${escapeHtml(title)}</span><span class="profile-link-arrow">${icon("arrowUp")}</span></a>`;
}

async function profile(username) {
  if (!supabaseClient) return layout(`<section class="empty-state"><p class="eyebrow">SQEZEN / ERROR</p><h1>Chwilowy problem z połączeniem.</h1><p>Odśwież stronę za moment.</p></section>`);
  const { data, error } = await supabaseClient.from("profiles").select("*").eq("username", username).maybeSingle();
  if (error) return layout(`<section class="empty-state"><p class="eyebrow">SQEZEN / ERROR</p><h1>Nie udało się wczytać profilu.</h1><p>Spróbuj ponownie za chwilę.</p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a></section>`);
  if (!data) return layout(`<section class="empty-state"><p class="eyebrow">SQEZEN / PROFILE</p><h1>Nie znaleziono profilu.</h1><p>Nazwa <strong>${escapeHtml(username)}</strong> nie jest jeszcze zajęta.</p><a class="button button-primary" href="/register">Zarezerwuj własną nazwę ${icon("arrow")}</a><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a></section>`);
  const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", data.id).order("position", { ascending: true });
  const safeLinks = (links || []).map(publicLink).filter(Boolean).join("");
  const displayName = data.display_name || data.username;
  const accent = safeColor(data.background_color);
  return `<div class="public-page" style="--profile-accent:${accent}"><a class="public-brand" href="/" aria-label="sqezen — strona główna"><span class="brand-mark">s</span><span>sqezen</span></a><main class="public-main"><section class="public-card"><div class="public-card-top"><span class="public-live"><i></i> public profile</span><button class="icon-button share-profile" type="button" data-copy-profile="${escapeHtml(window.location.href)}" aria-label="Skopiuj link do profilu">${icon("copy")}</button></div>${avatarMarkup(data)}<p class="public-handle">@${escapeHtml(data.username)}</p><h1>${escapeHtml(displayName)}</h1>${data.bio ? `<p class="public-bio">${escapeHtml(data.bio)}</p>` : ""}<div class="profile-links">${safeLinks || `<p class="empty-links">Ten profil nie ma jeszcze linków.</p>`}</div><div class="public-card-footer"><span>sqezen.lol/${escapeHtml(data.username)}</span><span>made with <strong>sqezen</strong></span></div></section><a class="claim-link" href="/register">Stwórz własny profil ${icon("arrow")}</a></main></div>`;
}

async function getSession() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  return data?.session || null;
}

function maskEmail(email) {
  const [name, domain] = String(email || "").split("@");
  if (!name || !domain) return email || "swój e-mail";
  return `${name.slice(0, 2)}${"•".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

function startResendCooldown(button, seconds = 30) {
  if (appState.resendTimer) clearInterval(appState.resendTimer);
  let remaining = seconds;
  button.disabled = true;
  button.textContent = `Wyślij ponownie za ${remaining}s`;
  appState.resendTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) { clearInterval(appState.resendTimer); appState.resendTimer = null; button.disabled = false; button.textContent = "Wyślij kod ponownie"; return; }
    button.textContent = `Wyślij ponownie za ${remaining}s`;
  }, 1000);
}

async function wireAuth() {
  const loginForm = document.querySelector("#login-form");
  if (loginForm) loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector("button[type=submit]");
    const form = new FormData(loginForm);
    feedback("Logowanie..."); setBusy(button, true, "Logowanie...");
    const { error } = await supabaseClient.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
    setBusy(button, false);
    if (error) return feedback(friendlyError(error), true);
    navigate("/dashboard");
  });

  const registerForm = document.querySelector("#register-form");
  if (registerForm) registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = registerForm.querySelector("button[type=submit]");
    const form = new FormData(registerForm);
    const email = String(form.get("email") || "").trim().toLowerCase();
    feedback("Tworzenie konta..."); setBusy(button, true, "Tworzenie konta...");
    const { data, error } = await supabaseClient.auth.signUp({ email, password: form.get("password") });
    setBusy(button, false);
    if (error) return feedback(friendlyError(error), true);
    if (data.session) navigate("/dashboard");
    else { sessionStorage.setItem("sqezen_email", email); navigate("/register/code"); }
  });

  const codeForm = document.querySelector("#code-form");
  const email = sessionStorage.getItem("sqezen_email");
  if (codeForm) {
    const intro = codeForm.parentElement.querySelector(".form-intro");
    if (intro && email) intro.textContent = `Wysłaliśmy 8-cyfrowy kod na ${maskEmail(email)}. Wpisz go poniżej, aby aktywować konto.`;
    const tokenInput = codeForm.elements.token;
    tokenInput?.addEventListener("input", () => { tokenInput.value = tokenInput.value.replace(/\D/g, "").slice(0, 8); });
    codeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true);
      const button = codeForm.querySelector("button[type=submit]");
      const token = String(new FormData(codeForm).get("token") || "").trim();
      if (!/^\d{8}$/.test(token)) return feedback("Wpisz dokładnie 8 cyfr z wiadomości.", true);
      feedback("Sprawdzanie kodu..."); setBusy(button, true, "Sprawdzanie...");
      const { error } = await supabaseClient.auth.verifyOtp({ email, token, type: "signup" });
      setBusy(button, false);
      if (error) return feedback(friendlyError(error), true);
      sessionStorage.removeItem("sqezen_email"); navigate("/dashboard");
    });
  }

  const resendButton = document.querySelector("#resend-code");
  if (resendButton) resendButton.addEventListener("click", async () => {
    if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true);
    feedback("Wysyłanie nowego kodu..."); resendButton.disabled = true;
    const { error } = await supabaseClient.auth.resend({ type: "signup", email });
    if (error) { resendButton.disabled = false; return feedback(friendlyError(error), true); }
    feedback("Nowy kod został wysłany. Sprawdź skrzynkę i folder Spam."); startResendCooldown(resendButton);
  });
}

function setInputValue(form, name, value) { if (form.elements[name]) form.elements[name].value = value || ""; }

function readLinkItems() {
  return Array.from(document.querySelectorAll("[data-link-item]")).map((item) => ({ title: String(item.querySelector("[data-link-title]")?.value || "").trim(), url: String(item.querySelector("[data-link-url]")?.value || "").trim(), icon: String(item.querySelector("[data-link-icon]")?.value || "website") })).filter((link) => link.title || link.url);
}

function updateLinkNumbers() {
  document.querySelectorAll("[data-link-item]").forEach((item, index) => { item.querySelector(".link-index").textContent = String(index + 1).padStart(2, "0"); item.querySelector(".link-item-title").textContent = `Link ${index + 1}`; });
}

function renderDashboardPreview() {
  const form = document.querySelector("#profile-form");
  const target = document.querySelector("#dashboard-preview");
  if (!form || !target) return;
  const name = String(form.elements.display_name?.value || form.elements.username?.value || "Twoja nazwa").trim() || "Twoja nazwa";
  const username = String(form.elements.username?.value || "username").trim().toLowerCase() || "username";
  const bio = String(form.elements.bio?.value || "").trim();
  const avatar = safeUrl(form.elements.avatar_url?.value);
  const color = safeColor(form.elements.background_color?.value);
  const links = readLinkItems();
  target.style.setProperty("--preview-accent", color);
  target.innerHTML = `<div class="preview-card"><div class="preview-profile-head">${avatar ? `<img class="preview-avatar" src="${escapeHtml(avatar)}" alt="" />` : `<span class="preview-avatar avatar-fallback">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>`}<span class="preview-menu">•••</span></div><p class="preview-handle">@${escapeHtml(username)}</p><h3>${escapeHtml(name)}</h3>${bio ? `<p class="preview-bio">${escapeHtml(bio)}</p>` : `<p class="preview-bio preview-placeholder">Twój krótki opis pojawi się tutaj.</p>`}<div class="preview-links">${links.length ? links.slice(0, 4).map((link) => `<div class="preview-link"><span>${icon(profileIcon(link))}</span><strong>${escapeHtml(link.title || "Nazwa linku")}</strong><i>↗</i></div>`).join("") : `<div class="preview-link preview-placeholder-link">Dodaj pierwszy link ${icon("plus")}</div>`}</div><div class="preview-card-footer"><span>sqezen.lol/${escapeHtml(username)}</span><span>${icon("sparkle")}</span></div></div>`;
}

async function wireDashboardLegacy() {
  const form = document.querySelector("#profile-form");
  if (!form) return;
  const current = await getSession();
  if (!current) return navigate("/login");
  document.querySelector("#account-email").textContent = current.user.email || "zalogowane konto";
  const { data: profileData, error: profileError } = await supabaseClient.from("profiles").select("*").eq("id", current.user.id).maybeSingle();
  if (profileError) feedback("Nie udało się wczytać danych profilu.", true);
  const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", current.user.id).order("position", { ascending: true });
  if (profileData) { setInputValue(form, "username", profileData.username); setInputValue(form, "display_name", profileData.display_name); setInputValue(form, "bio", profileData.bio); setInputValue(form, "avatar_url", profileData.avatar_url); if (form.elements.background_color) form.elements.background_color.value = safeColor(profileData.background_color, "#c9cdd4"); }
  document.querySelector("#color-value").textContent = String(form.elements.background_color.value).toUpperCase();
  const linksList = document.querySelector("#links-list");
  linksList.innerHTML = (links?.length ? links : [{}]).map((link, index) => linkEditorItem(link, index)).join(""); updateLinkNumbers();
  const username = String(form.elements.username.value || "").trim();
  const accountName = String(profileData?.display_name || username || "Twoje konto");
  document.querySelector("#account-name").textContent = accountName; document.querySelector("#account-avatar").textContent = accountName.slice(0, 1).toUpperCase();
  const profileLink = document.querySelector("#view-profile");
  if (username) { profileLink.href = `/${encodeURIComponent(username)}`; profileLink.classList.remove("is-disabled"); } else { profileLink.href = "/"; profileLink.classList.add("is-disabled"); }
  renderDashboardPreview();
  form.addEventListener("input", (event) => { if (event.target.name === "background_color") document.querySelector("#color-value").textContent = event.target.value.toUpperCase(); renderDashboardPreview(); });
  document.querySelector("#add-link").addEventListener("click", () => { const count = document.querySelectorAll("[data-link-item]").length; linksList.insertAdjacentHTML("beforeend", linkEditorItem({}, count)); updateLinkNumbers(); renderDashboardPreview(); linksList.lastElementChild?.querySelector("[data-link-title]")?.focus(); });
  linksList.addEventListener("click", (event) => { const remove = event.target.closest("[data-remove-link]"); if (!remove) return; remove.closest("[data-link-item]").remove(); if (!document.querySelector("[data-link-item]")) linksList.insertAdjacentHTML("beforeend", linkEditorItem({}, 0)); updateLinkNumbers(); renderDashboardPreview(); });
  document.querySelector("#logout-button").addEventListener("click", async () => { await supabaseClient.auth.signOut(); navigate("/"); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const values = new FormData(form);
    const usernameValue = String(values.get("username") || "").trim().toLowerCase();
    const linksValue = readLinkItems();
    if (!/^[a-z0-9_]{3,24}$/.test(usernameValue)) return feedback("Nazwa musi mieć 3–24 znaki: małe litery, cyfry lub _.", true);
    for (const link of linksValue) if (!safeUrl(link.url)) return feedback(`Sprawdź adres linku „${link.title || "bez nazwy"}”.`, true);
    feedback("Zapisywanie profilu..."); setBusy(button, true, "Zapisywanie...");
    const profilePayload = { id: current.user.id, username: usernameValue, display_name: String(values.get("display_name") || "").trim(), bio: String(values.get("bio") || "").trim(), avatar_url: String(values.get("avatar_url") || "").trim(), background_color: safeColor(values.get("background_color")) };
    let saveResult = await supabaseClient.from("profiles").upsert(profilePayload);
    if (saveResult.error && /background_color|avatar_url/i.test(saveResult.error.message || "")) saveResult = await supabaseClient.from("profiles").upsert({ id: profilePayload.id, username: profilePayload.username, display_name: profilePayload.display_name, bio: profilePayload.bio });
    if (saveResult.error) { setBusy(button, false); return feedback(friendlyError(saveResult.error), true); }
    const { error: deleteError } = await supabaseClient.from("links").delete().eq("profile_id", current.user.id);
    if (deleteError) { setBusy(button, false); return feedback("Profil zapisany, ale nie udało się zaktualizować linków.", true); }
    if (linksValue.length) {
      const { error: linksError } = await supabaseClient.from("links").insert(linksValue.map((link, index) => ({ profile_id: current.user.id, title: link.title || "Link", url: link.url, icon: link.icon, position: index })));
      if (linksError) { setBusy(button, false); return feedback("Profil zapisany, ale linki mają problem z zapisem.", true); }
    }
    setBusy(button, false); document.querySelector("#top-status").innerHTML = `<i></i> saved just now`; document.querySelector("#account-name").textContent = profilePayload.display_name || usernameValue; document.querySelector("#account-avatar").textContent = (profilePayload.display_name || usernameValue).slice(0, 1).toUpperCase(); profileLink.href = `/${encodeURIComponent(usernameValue)}`; profileLink.classList.remove("is-disabled"); feedback("Profil zapisany. Jest już dostępny publicznie.");
  });
}

async function wireDashboard() {
  const form = document.querySelector("#profile-form");
  if (!form) return;
  form.noValidate = true;
  const current = await getSession();
  if (!current) return navigate("/login");

  const linksList = document.querySelector("#links-list");
  const profileLink = document.querySelector("#view-profile");
  const bioCount = document.querySelector("#bio-count");
  const email = current.user.email || "zalogowane konto";
  document.querySelector("#account-email").textContent = email;
  document.querySelector("#account-email-field").value = email;

  const { data: profileData, error: profileError } = await supabaseClient.from("profiles").select("*").eq("id", current.user.id).maybeSingle();
  if (profileError) feedback("Nie udało się wczytać danych profilu.", true);
  const { data: links } = await supabaseClient.from("links").select("title,url,icon,position").eq("profile_id", current.user.id).order("position", { ascending: true });

  if (profileData) {
    setInputValue(form, "username", profileData.username);
    setInputValue(form, "display_name", profileData.display_name);
    setInputValue(form, "bio", profileData.bio);
    setInputValue(form, "avatar_url", profileData.avatar_url);
    form.elements.background_color.value = safeColor(profileData.background_color, "#c9cdd4");
  }
  linksList.innerHTML = (links?.length ? links : [{}]).map((link, index) => linkEditorItem(link, index)).join("");

  function refreshDashboardMeta() {
    updateLinkNumbers();
    const username = String(form.elements.username.value || "").trim().toLowerCase();
    const displayName = String(form.elements.display_name.value || username || "Twoje konto").trim();
    const activeLinks = readLinkItems().filter((link) => link.url).length;
    const address = username ? `${window.location.origin}/${username}` : "Ustaw najpierw nazwę użytkownika";
    document.querySelector("#links-count").textContent = String(activeLinks);
    document.querySelector("#account-name").textContent = displayName;
    document.querySelector("#account-avatar").textContent = displayName.slice(0, 1).toUpperCase();
    document.querySelector("#profile-address-field").value = address;
    document.querySelector("#color-value").textContent = String(form.elements.background_color.value).toUpperCase();
    bioCount.textContent = `${String(form.elements.bio.value || "").length} / 160`;
    if (username) { profileLink.href = `/${encodeURIComponent(username)}`; profileLink.classList.remove("is-disabled"); }
    else { profileLink.href = "/"; profileLink.classList.add("is-disabled"); }
  }

  const tabCopy = {
    profile: ["SQEZEN / PROFILE", "Twój profil.", "Ustaw nazwę, opis i avatar widoczne na publicznej stronie."],
    links: ["SQEZEN / LINKS", "Zarządzaj linkami.", "Dodawaj, duplikuj, testuj i ustawiaj kolejność swoich odnośników."],
    appearance: ["SQEZEN / APPEARANCE", "Dopasuj wygląd.", "Wybierz neutralny akcent pasujący do Twojego profilu."],
    account: ["SQEZEN / ACCOUNT", "Konto i adres.", "Sprawdź dane konta i skopiuj publiczny adres profilu."]
  };

  function setDashboardTab(tab) {
    const selected = tabCopy[tab] ? tab : "profile";
    document.querySelectorAll("[data-dashboard-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.dashboardTab === selected));
    document.querySelectorAll("[data-tab-panel]").forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== selected; });
    const [eyebrow, title, subtitle] = tabCopy[selected];
    document.querySelector("#dashboard-eyebrow").textContent = eyebrow;
    document.querySelector("#dashboard-title").textContent = title;
    document.querySelector("#dashboard-subtitle").textContent = subtitle;
    sessionStorage.setItem("sqezen_dashboard_tab", selected);
  }

  document.querySelectorAll("[data-dashboard-tab]").forEach((button) => button.addEventListener("click", () => setDashboardTab(button.dataset.dashboardTab)));
  setDashboardTab(sessionStorage.getItem("sqezen_dashboard_tab") || "profile");
  refreshDashboardMeta();
  renderDashboardPreview();

  form.addEventListener("input", (event) => {
    if (event.target.matches("[data-link-url]")) {
      const item = event.target.closest("[data-link-item]");
      const detected = profileIcon({ url: event.target.value, icon: "website" });
      if (detected !== "globe") item.querySelector("[data-link-icon]").value = detected;
    }
    refreshDashboardMeta();
    renderDashboardPreview();
  });

  document.querySelector("#add-link").addEventListener("click", () => {
    const count = document.querySelectorAll("[data-link-item]").length;
    linksList.insertAdjacentHTML("beforeend", linkEditorItem({}, count));
    refreshDashboardMeta();
    renderDashboardPreview();
    linksList.lastElementChild?.querySelector("[data-link-title]")?.focus();
  });

  linksList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-link-action]");
    if (!actionButton) return;
    const item = actionButton.closest("[data-link-item]");
    const action = actionButton.dataset.linkAction;
    const itemData = { title: item.querySelector("[data-link-title]").value, url: item.querySelector("[data-link-url]").value, icon: item.querySelector("[data-link-icon]").value };
    if (action === "remove") {
      item.remove();
      if (!document.querySelector("[data-link-item]")) linksList.insertAdjacentHTML("beforeend", linkEditorItem({}, 0));
    }
    if (action === "up" && item.previousElementSibling) item.previousElementSibling.before(item);
    if (action === "down" && item.nextElementSibling) item.nextElementSibling.after(item);
    if (action === "duplicate") item.insertAdjacentHTML("afterend", linkEditorItem(itemData, 0));
    if (action === "test") {
      const href = safeUrl(itemData.url);
      if (!href) return feedback("Wpisz treść adresu, żeby otworzyć link.", true);
      const opened = window.open(href, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    }
    refreshDashboardMeta();
    renderDashboardPreview();
  });

  document.querySelectorAll("[data-color-preset]").forEach((button) => button.addEventListener("click", () => {
    form.elements.background_color.value = button.dataset.colorPreset;
    refreshDashboardMeta();
    renderDashboardPreview();
  }));

  document.querySelector("#copy-profile-address").addEventListener("click", async () => {
    const address = document.querySelector("#profile-address-field").value;
    if (!/^https?:\/\//.test(address)) return feedback("Ustaw nazwę użytkownika, aby skopiować adres.", true);
    try { await navigator.clipboard.writeText(address); feedback("Adres profilu skopiowany."); }
    catch { feedback("Nie udało się skopiować adresu automatycznie.", true); }
  });

  document.querySelector("#logout-button").addEventListener("click", async () => { await supabaseClient.auth.signOut(); navigate("/"); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const values = new FormData(form);
    const usernameValue = String(values.get("username") || "").trim().toLowerCase();
    const displayName = String(values.get("display_name") || "").trim();
    const linksValue = readLinkItems().map((link) => ({ ...link, url: normalizeLinkUrl(link.url) }));
    if (!/^[a-z0-9_]{3,24}$/.test(usernameValue)) { setDashboardTab("profile"); return feedback("Nazwa musi mieć 3–24 znaki: małe litery, cyfry lub _.", true); }
    if (!displayName) { setDashboardTab("profile"); return feedback("Wpisz nazwę wyświetlaną.", true); }
    for (const link of linksValue) if (!safeUrl(link.url)) { setDashboardTab("links"); return feedback(`Sprawdź treść linku „${link.title || "bez nazwy"}”.`, true); }
    feedback("Zapisywanie profilu...");
    setBusy(button, true, "Zapisywanie...");
    const profilePayload = { id: current.user.id, username: usernameValue, display_name: displayName, bio: String(values.get("bio") || "").trim(), avatar_url: safeUrl(values.get("avatar_url")), background_color: safeColor(values.get("background_color")) };
    let saveResult = await supabaseClient.from("profiles").upsert(profilePayload);
    if (saveResult.error && /background_color|avatar_url/i.test(saveResult.error.message || "")) saveResult = await supabaseClient.from("profiles").upsert({ id: profilePayload.id, username: profilePayload.username, display_name: profilePayload.display_name, bio: profilePayload.bio });
    if (saveResult.error) { setBusy(button, false); return feedback(friendlyError(saveResult.error), true); }
    const { error: deleteError } = await supabaseClient.from("links").delete().eq("profile_id", current.user.id);
    if (deleteError) { setBusy(button, false); return feedback("Profil zapisany, ale nie udało się zaktualizować linków.", true); }
    if (linksValue.length) {
      const { error: linksError } = await supabaseClient.from("links").insert(linksValue.map((link, index) => ({ profile_id: current.user.id, title: link.title || "Link", url: link.url, icon: link.icon, position: index })));
      if (linksError) { setBusy(button, false); return feedback("Profil zapisany, ale linki mają problem z zapisem.", true); }
    }
    linksValue.forEach((link, index) => { const input = document.querySelectorAll("[data-link-url]")[index]; if (input) input.value = link.url; });
    setBusy(button, false);
    document.querySelector("#top-status").innerHTML = `<i></i> saved just now`;
    refreshDashboardMeta();
    feedback("Wszystkie zmiany zostały zapisane.");
  });
}

function wireCopy() {
  const button = document.querySelector("[data-copy-profile]");
  if (!button) return;
  button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(button.dataset.copyProfile); button.classList.add("is-copied"); button.innerHTML = icon("check"); setTimeout(() => { button.classList.remove("is-copied"); button.innerHTML = icon("copy"); }, 1600); } catch { /* Clipboard may be unavailable. */ } });
}

async function render() {
  const path = currentPath();
  if (appState.resendTimer) { clearInterval(appState.resendTimer); appState.resendTimer = null; }
  const app = document.querySelector("#app");
  document.body.dataset.route = path;
  document.title = path === "/" ? "sqezen — your space online" : `${path.slice(1).split("/")[0] || "sqezen"} — sqezen`;
  try {
    if (path === "/") app.innerHTML = landing();
    else if (path === "/login") app.innerHTML = login();
    else if (path === "/register") app.innerHTML = register();
    else if (path === "/register/code") app.innerHTML = registerCode();
    else if (path === "/dashboard") app.innerHTML = dashboard();
    else app.innerHTML = await profile(path.slice(1).split("/")[0].toLowerCase());
    await wireAuth(); await wireDashboard(); wireCopy();
  } catch (error) {
    app.innerHTML = layout(`<section class="empty-state"><p class="eyebrow">SQEZEN / ERROR</p><h1>Coś poszło nie tak.</h1><p>Odśwież stronę i spróbuj ponownie.</p><a class="back-link" href="/">${icon("arrow")} Wróć na stronę główną</a></section>`); console.error(error);
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || link.target === "_blank" || link.origin !== window.location.origin || link.hasAttribute("download")) return;
  event.preventDefault(); navigate(link.pathname);
});
window.addEventListener("popstate", render);
render();
