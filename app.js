const profile = {
  username: "sqezz",
  displayName: "Sqezz",
  bio: "tworzę rzeczy w internecie ✦",
  avatar: "S",
  location: "Polska",
  views: "1 248",
  links: [
    { label: "Discord", icon: "◈", href: "#" },
    { label: "YouTube", icon: "▶", href: "#" },
    { label: "TikTok", icon: "♪", href: "#" },
    { label: "Mój najnowszy projekt", icon: "↗", href: "#", featured: true },
  ],
};

const SUPABASE_URL = "https://wzdxgmzwxzfhegelqugy.supabase.co";
const SUPABASE_KEY = "sb_publishable_63IpIFewxY0qJ3Cx532LQA_vEwXoSwP";
const authClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

function routePath() {
  const segments = window.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const routeSegments = segments[0] === "sqezzbio" ? segments.slice(1) : segments;
  return "/" + routeSegments.join("/") || "/";
}

function go(path) {
  history.pushState(null, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function claimPage(user) {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / CLAIM</span><h1>Wybierz swoją<br /><em>nazwę profilu.</em></h1><p>To właśnie ten adres udostępnisz ludziom. Możesz używać małych liter, cyfr i podkreśleń.</p></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">OSTATNI KROK</span><span class="auth-status">● ${user?.email || "NOWE KONTO"}</span></div><h2>Zajmij username</h2><p class="auth-muted">Twój profil będzie dostępny pod sqezen.lol/username.</p><form id="claim-form"><label>Twoja nazwa<div class="input-prefix"><span>sqezen.lol/</span><input name="username" placeholder="sqezz" pattern="[a-z0-9_]{3,24}" minlength="3" maxlength="24" required /></div></label><label>Nazwa wyświetlana<input name="display_name" placeholder="Sqezz" required /></label><label>Bio<textarea name="bio" placeholder="Napisz coś o sobie..."></textarea></label><button class="button button-primary auth-submit" type="submit">Opublikuj profil <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form></section></section>`);
}

function layout(content) {
  return `<div class="noise"></div><header class="topbar"><a class="brand" href="/"><span class="brand-mark">s</span><span>sqezen</span></a><nav><a href="/">Start</a><a href="/dashboard">Dashboard</a><a class="nav-login" href="/dashboard">Zaloguj się <span>↗</span></a></nav></header><main>${content}</main><footer><span>sqezen © 2026</span><span>zbudowane dla twórców</span></footer>`;
}

function landing() {
  return layout(`<section class="hero"><div class="eyebrow"><span class="pulse"></span> Twoje miejsce w internecie</div><h1>Wszystko o Tobie.<br /><em>W jednym miejscu.</em></h1><p class="hero-copy">Stwórz minimalistyczny profil, który zbiera Twoje linki, projekty i społeczność. Prosto, szybko i po swojemu.</p><div class="hero-actions"><a class="button button-primary" href="/dashboard">Zacznij za darmo <span>→</span></a><a class="button button-ghost" href="/sqezz">Zobacz przykład <span>↗</span></a></div><div class="hero-note"><span>◉</span> Bez karty płatniczej&nbsp; · &nbsp;Gotowe w 60 sekund</div></section><section class="feature-grid"><article class="feature-card feature-wide"><div><span class="card-kicker">01 / Twój profil</span><h2>Niech Twoje<br /><span>linki mówią.</span></h2><p>Jedna estetyczna strona na wszystkie miejsca, w których można Cię znaleźć.</p></div><div class="mini-profile"><div class="mini-avatar">S</div><strong>sqezz</strong><small>tworzę rzeczy w internecie</small><div class="mini-link"></div><div class="mini-link short"></div></div></article><article class="feature-card accent"><span class="card-kicker">02 / Personalizacja</span><h2>Twój styl.<br />Twoje zasady.</h2><p>Kolory, tła, fonty i układ. Dopasuj profil do siebie.</p><div class="swatches"><i></i><i></i><i></i><i></i></div></article><article class="feature-card dark"><span class="card-kicker">03 / Analityka</span><h2>Wiesz, co<br /><span>działa.</span></h2><p>Sprawdzaj wyświetlenia i kliknięcia bez zbędnego chaosu.</p><div class="chart"><span style="height:32%"></span><span style="height:46%"></span><span style="height:38%"></span><span style="height:68%"></span><span style="height:54%"></span><span style="height:88%"></span><span style="height:72%"></span></div></article></section>`);
}

function publicProfile(view = profile) {
  const links = (view.links || profile.links).map((link) => `<a class="profile-link ${link.featured ? "featured" : ""}" href="${link.href}"><span class="link-icon">${link.icon}</span><span>${link.label}</span><span class="link-arrow">↗</span></a>`).join("");
  return `<div class="profile-page"><div class="profile-glow"></div><a class="profile-brand" href="/"><span class="brand-mark">s</span> sqezen</a><section class="profile-card"><div class="profile-avatar">${view.avatar || "S"}</div><div class="verified">● VERIFIED</div><h1>${view.displayName || view.username}</h1><p class="profile-handle">@${view.username}</p><p class="profile-bio">${view.bio || ""}</p><div class="profile-meta"><span>⌖ ${view.location || "Polska"}</span><span>◉ ${view.views || "0"} wyświetleń</span></div><div class="profile-links">${links}</div><div class="profile-footer"><span>sqezen.lol/${view.username}</span><button onclick="copyProfile()">⧉</button></div></section><p class="profile-report">Zgłoś profil</p></div>`;
}

function loginPage() {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / ACCOUNT</span><h1>Wróć do<br /><em>swojego miejsca.</em></h1><p>Zaloguj się, żeby edytować profil, linki i wygląd swojej strony.</p><a class="auth-back" href="/">← Wróć na stronę główną</a></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">LOGOWANIE</span><span class="auth-status">● SECURE</span></div><h2>Zaloguj się</h2><p class="auth-muted">Dostęp do Twojego profilu sqezen.</p><form id="login-form"><label>E-mail<input type="email" name="email" placeholder="ty@przyklad.pl" required /></label><label>Hasło<input type="password" name="password" placeholder="••••••••" required /></label><div class="auth-row"><label class="remember"><input type="checkbox" /> Zapamiętaj mnie</label><a href="#">Nie pamiętasz hasła?</a></div><button class="button button-primary auth-submit" type="submit">Zaloguj się <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form><div class="auth-divider"><span>albo</span></div><button class="oauth-button" type="button">◉ Kontynuuj z Google</button><p class="auth-switch">Nie masz konta? <a href="/register">Utwórz je za darmo</a></p></section></section>`);
}

function registerPage() {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / JOIN</span><h1>Zajmij swoje<br /><em>miejsce online.</em></h1><p>Załóż konto, wybierz nazwę i opublikuj swój profil w mniej niż minutę.</p><a class="auth-back" href="/">← Wróć na stronę główną</a></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">NOWE KONTO</span><span class="auth-status">● FREE</span></div><h2>Stwórz profil</h2><p class="auth-muted">Najpierw konto, potem Twoja nazwa.</p><form id="register-form"><label>E-mail<input type="email" name="email" placeholder="ty@przyklad.pl" required /></label><label>Hasło<input type="password" name="password" placeholder="minimum 8 znaków" minlength="8" required /></label><button class="button button-primary auth-submit" type="submit">Dalej <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form><p class="auth-switch">Masz już konto? <a href="/login">Zaloguj się</a></p></section></section>`);
}

function verifyPage() {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / VERIFY</span><h1>Sprawdź swój<br /><em>e-mail.</em></h1><p>Wysłaliśmy 6-cyfrowy kod. Wpisz go tutaj, żeby odblokować wybór nazwy profilu.</p><a class="auth-back" href="/register">← Zmień adres e-mail</a></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">WERYFIKACJA</span><span class="auth-status">● 6 DIGITS</span></div><h2>Wpisz kod</h2><p class="auth-muted">Kod jest ważny przez kilka minut.</p><form id="verify-form"><label>Kod weryfikacyjny<input class="otp-input" name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="000000" required /></label><button class="button button-primary auth-submit" type="submit">Potwierdź e-mail <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form><p class="auth-switch">Nie widzisz wiadomości? Sprawdź spam lub wyślij kod ponownie.</p></section></section>`);
}

function dashboard() {
  return layout(`<section class="dashboard"><div class="dashboard-heading"><div><span class="eyebrow">PANEL TWÓRCY</span><h1>Witaj, Sqezz <span>✦</span></h1><p>Twój profil wygląda dobrze. Co dziś zmieniamy?</p></div><a class="button button-primary" href="/sqezz">Zobacz profil <span>↗</span></a></div><div class="stats"><div><span>Wyświetlenia profilu</span><strong>1 248</strong><small class="up">↗ 18,4% w tym tygodniu</small></div><div><span>Kliknięcia linków</span><strong>386</strong><small class="up">↗ 9,2% w tym tygodniu</small></div><div><span>Najlepszy link</span><strong>YouTube</strong><small>142 kliknięcia</small></div></div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><span class="card-kicker">EDYTOR PROFILU</span><h2>Podstawowe informacje</h2></div><button class="save-button">Zapisz zmiany</button></div><label>Nazwa wyświetlana<input value="Sqezz" /></label><label>Bio<textarea>tworzę rzeczy w internecie ✦</textarea></label><label>Adres profilu<div class="input-prefix"><span>sqezen.lol/</span><input value="sqezz" /></div></label></section><section class="panel preview-panel"><div class="panel-head"><div><span class="card-kicker">PODGLĄD NA ŻYWO</span><h2>Twój profil</h2></div><span class="live-dot">● LIVE</span></div><div class="preview-box"><div class="preview-avatar">S</div><strong>Sqezz</strong><small>@sqezz</small><div class="preview-line"></div><div class="preview-link"></div><div class="preview-link"></div></div></section></div>`);
}

function copyProfile() {
  navigator.clipboard?.writeText(window.location.origin + "/sqezz");
  const button = document.querySelector(".profile-footer button");
  if (button) { button.textContent = "✓"; setTimeout(() => button.textContent = "⧉", 1400); }
}

async function wireAuth(path) {
  const feedback = document.querySelector("#auth-feedback");
  const setFeedback = (message, error = false) => { if (feedback) { feedback.textContent = message; feedback.classList.toggle("error", error); } };
  if (!authClient) { setFeedback("Auth nie jest dostępny.", true); return; }
  const loginForm = document.querySelector("#login-form");
  if (loginForm) loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    setFeedback("Logowanie...");
    const { data, error } = await authClient.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
    if (error) { setFeedback(error.message, true); return; }
    const { data: owned } = await authClient.from("profiles").select("username").eq("id", data.user.id).maybeSingle();
    go(owned ? "/dashboard" : "/claim");
  });
  const registerForm = document.querySelector("#register-form");
  if (registerForm) registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(registerForm);
    setFeedback("Tworzenie konta...");
    const { data, error } = await authClient.auth.signUp({ email: form.get("email"), password: form.get("password"), options: { emailRedirectTo: "https://sqezen.lol/claim" } });
    if (error) { setFeedback(error.message, true); return; }
    if (data.session) go("/claim");
    else { sessionStorage.setItem("sqezen_email", String(form.get("email"))); go("/verify"); }
  });
  const verifyForm = document.querySelector("#verify-form");
  if (verifyForm) verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(verifyForm);
    const email = sessionStorage.getItem("sqezen_email");
    if (!email) { setFeedback("Wpisz e-mail jeszcze raz.", true); return; }
    setFeedback("Sprawdzanie kodu...");
    const { error } = await authClient.auth.verifyOtp({ email, token: String(form.get("token")), type: "signup" });
    if (error) { setFeedback("Kod jest nieprawidłowy lub wygasł.", true); return; }
    sessionStorage.removeItem("sqezen_email");
    go("/claim");
  });
  const claimForm = document.querySelector("#claim-form");
  if (claimForm) claimForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(claimForm);
    const username = String(form.get("username")).trim().toLowerCase();
    setFeedback("Publikowanie profilu...");
    const { data: sessionData } = await authClient.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) { go("/login"); return; }
    const { error } = await authClient.from("profiles").insert({ id: user.id, username, display_name: form.get("display_name"), bio: form.get("bio") || "" });
    if (error) { setFeedback(error.code === "23505" ? "Ta nazwa jest już zajęta." : error.message, true); return; }
    await authClient.from("links").insert([{ profile_id: user.id, title: "Dodaj pierwszy link", url: "https://sqezen.lol", icon: "↗", position: 0 }]);
    go("/dashboard");
  });
  if (path === "/dashboard" || path === "/claim") {
    const { data } = await authClient.auth.getSession();
    if (!data.session) go("/login");
  }
}

function dashboardReal() {
  return layout(`<section class="dashboard"><div class="dashboard-heading"><div><span class="eyebrow">SQEZEN / DASHBOARD</span><h1>Twój profil. <span>Twoje zasady.</span></h1><p>Uzupełnij profil i dodaj pierwsze linki.</p></div><a class="button button-primary" href="/sqezz">Podgląd profilu <span>↗</span></a></div><div class="stats"><div><span>Wyświetlenia profilu</span><strong>0</strong><small>Statystyki pojawią się po publikacji</small></div><div><span>Kliknięcia linków</span><strong>0</strong><small>Dodaj link, żeby zacząć</small></div><div><span>Najlepszy link</span><strong>—</strong><small>Brak danych</small></div></div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><span class="card-kicker">EDYTOR PROFILU</span><h2>Podstawowe informacje</h2></div><button class="save-button" type="button">Zapisz zmiany</button></div><label>Nazwa wyświetlana<input value="" placeholder="Twoja nazwa" /></label><label>Bio<textarea placeholder="Napisz coś o sobie..."></textarea></label><label>Adres profilu<div class="input-prefix"><span>sqezen.lol/</span><input value="" placeholder="username" /></div></label></section><section class="panel preview-panel"><div class="panel-head"><div><span class="card-kicker">PODGLĄD NA ŻYWO</span><h2>Twój profil</h2></div><span class="live-dot">● LIVE</span></div><div class="preview-box"><div class="preview-avatar">?</div><strong>Twój profil</strong><small>Dodaj username</small><div class="preview-line"></div><div class="preview-link"></div><div class="preview-link"></div></div></section></div>`);
}

async function hydratePublicProfile(path) {
  if (!authClient || path === "/sqezz") return;
  const username = path.slice(1).toLowerCase();
  const { data } = await authClient.from("profiles").select("username,display_name,bio,avatar_url,background_color").eq("username", username).maybeSingle();
  if (!data) return;
  document.getElementById("app").innerHTML = publicProfile({ ...profile, username: data.username, displayName: data.display_name, bio: data.bio, avatar: data.avatar_url || "S" });
}

function render() {
  const path = routePath();
  document.title = path === "/sqezz" ? "Sqezz | sqezen" : path === "/dashboard" ? "Dashboard | sqezen" : "sqezen — Twój profil w internecie";
  const currentUser = authClient?.auth?.getUser;
  const reserved = ["/", "/sqezz", "/dashboard", "/claim", "/login", "/register"];
  document.getElementById("app").innerHTML = path === "/sqezz" ? publicProfile() : path === "/dashboard" ? dashboardReal() : path === "/claim" ? claimPage() : path === "/login" ? loginPage() : path === "/register" ? registerPage() : path === "/verify" ? verifyPage() : path === "/" ? landing() : publicProfile({ ...profile, username: path.slice(1) });
  if (!reserved.includes(path)) hydratePublicProfile(path);
  wireAuth(path);
}

const redirect = new URLSearchParams(window.location.search).get("redirect");
if (redirect) {
  history.replaceState(null, "", redirect);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || link.target === "_blank" || link.origin !== window.location.origin || link.hash) return;
  event.preventDefault();
  history.pushState(null, "", link.pathname + link.search);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});
window.addEventListener("popstate", render);
render();
