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

function layout(content) {
  return `<div class="noise"></div><header class="topbar"><a class="brand" href="/"><span class="brand-mark">s</span><span>sqezen</span></a><nav><a href="/">Start</a><a href="/dashboard">Dashboard</a><a class="nav-login" href="/dashboard">Zaloguj się <span>↗</span></a></nav></header><main>${content}</main><footer><span>sqezen © 2026</span><span>zbudowane dla twórców</span></footer>`;
}

function landing() {
  return layout(`<section class="hero"><div class="eyebrow"><span class="pulse"></span> Twoje miejsce w internecie</div><h1>Wszystko o Tobie.<br /><em>W jednym miejscu.</em></h1><p class="hero-copy">Stwórz minimalistyczny profil, który zbiera Twoje linki, projekty i społeczność. Prosto, szybko i po swojemu.</p><div class="hero-actions"><a class="button button-primary" href="/dashboard">Zacznij za darmo <span>→</span></a><a class="button button-ghost" href="/sqezz">Zobacz przykład <span>↗</span></a></div><div class="hero-note"><span>◉</span> Bez karty płatniczej&nbsp; · &nbsp;Gotowe w 60 sekund</div></section><section class="feature-grid"><article class="feature-card feature-wide"><div><span class="card-kicker">01 / Twój profil</span><h2>Niech Twoje<br /><span>linki mówią.</span></h2><p>Jedna estetyczna strona na wszystkie miejsca, w których można Cię znaleźć.</p></div><div class="mini-profile"><div class="mini-avatar">S</div><strong>sqezz</strong><small>tworzę rzeczy w internecie</small><div class="mini-link"></div><div class="mini-link short"></div></div></article><article class="feature-card accent"><span class="card-kicker">02 / Personalizacja</span><h2>Twój styl.<br />Twoje zasady.</h2><p>Kolory, tła, fonty i układ. Dopasuj profil do siebie.</p><div class="swatches"><i></i><i></i><i></i><i></i></div></article><article class="feature-card dark"><span class="card-kicker">03 / Analityka</span><h2>Wiesz, co<br /><span>działa.</span></h2><p>Sprawdzaj wyświetlenia i kliknięcia bez zbędnego chaosu.</p><div class="chart"><span style="height:32%"></span><span style="height:46%"></span><span style="height:38%"></span><span style="height:68%"></span><span style="height:54%"></span><span style="height:88%"></span><span style="height:72%"></span></div></article></section>`);
}

function publicProfile() {
  const links = profile.links.map((link) => `<a class="profile-link ${link.featured ? "featured" : ""}" href="${link.href}"><span class="link-icon">${link.icon}</span><span>${link.label}</span><span class="link-arrow">↗</span></a>`).join("");
  return `<div class="profile-page"><div class="profile-glow"></div><a class="profile-brand" href="/"><span class="brand-mark">s</span> sqezen</a><section class="profile-card"><div class="profile-avatar">${profile.avatar}</div><div class="verified">● VERIFIED</div><h1>${profile.displayName}</h1><p class="profile-handle">@${profile.username}</p><p class="profile-bio">${profile.bio}</p><div class="profile-meta"><span>⌖ ${profile.location}</span><span>◉ ${profile.views} wyświetleń</span></div><div class="profile-links">${links}</div><div class="profile-footer"><span>sqezen.lol/${profile.username}</span><button onclick="copyProfile()">⧉</button></div></section><p class="profile-report">Zgłoś profil</p></div>`;
}

function loginPage() {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / ACCOUNT</span><h1>Wróć do<br /><em>swojego miejsca.</em></h1><p>Zaloguj się, żeby edytować profil, linki i wygląd swojej strony.</p><a class="auth-back" href="/">← Wróć na stronę główną</a></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">LOGOWANIE</span><span class="auth-status">● SECURE</span></div><h2>Zaloguj się</h2><p class="auth-muted">Dostęp do Twojego profilu sqezen.</p><form id="login-form"><label>E-mail<input type="email" name="email" placeholder="ty@przyklad.pl" required /></label><label>Hasło<input type="password" name="password" placeholder="••••••••" required /></label><div class="auth-row"><label class="remember"><input type="checkbox" /> Zapamiętaj mnie</label><a href="#">Nie pamiętasz hasła?</a></div><button class="button button-primary auth-submit" type="submit">Zaloguj się <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form><div class="auth-divider"><span>albo</span></div><button class="oauth-button" type="button">◉ Kontynuuj z Google</button><p class="auth-switch">Nie masz konta? <a href="/register">Utwórz je za darmo</a></p></section></section>`);
}

function registerPage() {
  return layout(`<section class="auth-page"><div class="auth-copy"><span class="eyebrow"><span class="pulse"></span> SQEZEN / JOIN</span><h1>Zajmij swoje<br /><em>miejsce online.</em></h1><p>Załóż konto, wybierz nazwę i opublikuj swój profil w mniej niż minutę.</p><a class="auth-back" href="/">← Wróć na stronę główną</a></div><section class="auth-card"><div class="auth-card-top"><span class="card-kicker">NOWE KONTO</span><span class="auth-status">● FREE</span></div><h2>Stwórz profil</h2><p class="auth-muted">Najpierw konto, potem Twoja nazwa.</p><form id="register-form"><label>E-mail<input type="email" name="email" placeholder="ty@przyklad.pl" required /></label><label>Hasło<input type="password" name="password" placeholder="minimum 8 znaków" minlength="8" required /></label><button class="button button-primary auth-submit" type="submit">Dalej <span>→</span></button><p class="auth-feedback" id="auth-feedback"></p></form><p class="auth-switch">Masz już konto? <a href="/login">Zaloguj się</a></p></section></section>`);
}

function dashboard() {
  return layout(`<section class="dashboard"><div class="dashboard-heading"><div><span class="eyebrow">PANEL TWÓRCY</span><h1>Witaj, Sqezz <span>✦</span></h1><p>Twój profil wygląda dobrze. Co dziś zmieniamy?</p></div><a class="button button-primary" href="/sqezz">Zobacz profil <span>↗</span></a></div><div class="stats"><div><span>Wyświetlenia profilu</span><strong>1 248</strong><small class="up">↗ 18,4% w tym tygodniu</small></div><div><span>Kliknięcia linków</span><strong>386</strong><small class="up">↗ 9,2% w tym tygodniu</small></div><div><span>Najlepszy link</span><strong>YouTube</strong><small>142 kliknięcia</small></div></div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><span class="card-kicker">EDYTOR PROFILU</span><h2>Podstawowe informacje</h2></div><button class="save-button">Zapisz zmiany</button></div><label>Nazwa wyświetlana<input value="Sqezz" /></label><label>Bio<textarea>tworzę rzeczy w internecie ✦</textarea></label><label>Adres profilu<div class="input-prefix"><span>sqezen.lol/</span><input value="sqezz" /></div></label></section><section class="panel preview-panel"><div class="panel-head"><div><span class="card-kicker">PODGLĄD NA ŻYWO</span><h2>Twój profil</h2></div><span class="live-dot">● LIVE</span></div><div class="preview-box"><div class="preview-avatar">S</div><strong>Sqezz</strong><small>@sqezz</small><div class="preview-line"></div><div class="preview-link"></div><div class="preview-link"></div></div></section></div>`);
}

function copyProfile() {
  navigator.clipboard?.writeText(window.location.origin + "/sqezz");
  const button = document.querySelector(".profile-footer button");
  if (button) { button.textContent = "✓"; setTimeout(() => button.textContent = "⧉", 1400); }
}

function render() {
  const segments = window.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const routeSegments = segments[0] === "sqezzbio" ? segments.slice(1) : segments;
  const path = "/" + routeSegments.join("/") || "/";
  document.title = path === "/sqezz" ? "Sqezz | sqezen" : path === "/dashboard" ? "Dashboard | sqezen" : "sqezen — Twój profil w internecie";
  document.getElementById("app").innerHTML = path === "/sqezz" ? publicProfile() : path === "/dashboard" ? dashboard() : path === "/login" ? loginPage() : path === "/register" ? registerPage() : landing();
  const authForm = document.querySelector("#login-form, #register-form");
  if (authForm) authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = document.querySelector("#auth-feedback");
    if (feedback) feedback.textContent = "Połączę ten formularz z Supabase w następnym kroku.";
  });
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
