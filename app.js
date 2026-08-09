const SUPABASE_URL = "https://wzdxgmzwxzfhegelqugy.supabase.co";
const SUPABASE_KEY = "sb_publishable_63IpIFewxY0qJ3Cx532LQA_vEwXoSwP";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function currentPath() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (redirect) history.replaceState(null, "", redirect);
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function navigate(path) {
  history.pushState(null, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}

function layout(content) {
  return `<div class="app-content">${content}<footer class="profile-footer"><span>sqezen.lol</span><span>profiles for people who build</span></footer></div>`;
}

function linkButton(href, label, external = false) {
  return `<a class="social-btn" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}<span class="external" aria-hidden="true">↗</span></a>`;
}

function landing() {
  return layout(`<div class="home-grid"><section class="home-intro"><p class="section-label">SQEZEN / YOUR SPACE ONLINE</p><h1>Twoje linki.<br /><span>Twoje miejsce.</span></h1><p class="tagline">Minimalistyczna bio-page dla twórców, developerów i graczy.</p><p class="about-copy">Zbierz wszystkie ważne linki w jednym spokojnym, szybkim profilu pod własną nazwą na <strong>sqezen.lol</strong>.</p></section><section class="login-form"><p class="section-label">ZALOGUJ SIĘ</p><p class="form-note intro-note">Edytuj swój profil, dodawaj linki i udostępniaj jedno proste miejsce.</p>${linkButton("/login", "Przejdź do logowania")}<p class="form-note">Nie masz konta? <a href="/register">Utwórz je</a></p></section></div>`);
}

function login() {
  return layout(`<section class="auth-panel"><p class="section-label">SQEZEN / ACCOUNT</p><h1>Zaloguj się</h1><p class="about-copy">Wróć do swojego profilu i zarządzaj linkami.</p><form id="login-form" class="stack-form"><label>E-mail<input name="email" type="email" autocomplete="email" required /></label><label>Hasło<input name="password" type="password" autocomplete="current-password" required /></label><button class="social-btn route-btn" type="submit">Zaloguj się <span class="external">↗</span></button><p class="form-feedback" id="form-feedback" role="status"></p></form><p class="form-note">Nie masz konta? <a href="/register">Zarejestruj się</a></p><a class="route-back" href="/">← Wróć</a></section>`);
}

function register() {
  return layout(`<section class="auth-panel"><p class="section-label">SQEZEN / JOIN</p><h1>Utwórz konto</h1><p class="about-copy">Załóż konto, potwierdź e-mail kodem i wybierz własną nazwę profilu.</p><form id="register-form" class="stack-form"><label>E-mail<input name="email" type="email" autocomplete="email" required /></label><label>Hasło<input name="password" type="password" minlength="8" autocomplete="new-password" required /></label><button class="social-btn route-btn" type="submit">Dalej <span class="external">↗</span></button><p class="form-feedback" id="form-feedback" role="status"></p></form><p class="form-note">Masz już konto? <a href="/login">Zaloguj się</a></p><a class="route-back" href="/">← Wróć</a></section>`);
}

function registerCode() {
  return layout(`<section class="auth-panel"><p class="section-label">SQEZEN / VERIFY</p><h1>Wpisz kod</h1><p class="about-copy">Kod weryfikacyjny znajdziesz w wiadomości e-mail wysłanej po rejestracji.</p><form id="code-form" class="stack-form"><label>8-cyfrowy kod<input name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" placeholder="00000000" required /></label><button class="social-btn route-btn" type="submit">Potwierdź e-mail <span class="external">↗</span></button><button class="text-button" id="resend-code" type="button">Wyślij kod ponownie</button><p class="form-feedback" id="form-feedback" role="status"></p></form><a class="route-back" href="/register">← Zmień dane</a></section>`);
}

function dashboard() {
  return layout(`<section class="dashboard-panel"><div class="dashboard-heading"><div><p class="section-label">SQEZEN / DASHBOARD</p><h1>Twój profil.</h1><p class="about-copy">Uzupełnij dane, które zobaczą osoby odwiedzające Twój adres.</p></div><button class="text-button" id="logout-button">Wyloguj</button></div><form id="profile-form" class="stack-form"><label>Nazwa użytkownika<input name="username" placeholder="np. sqezen" pattern="[a-z0-9_]{3,24}" minlength="3" maxlength="24" required /></label><label>Nazwa wyświetlana<input name="display_name" placeholder="Twoja nazwa" required /></label><label>Bio<textarea name="bio" placeholder="developer • gamer • digital chaos"></textarea></label><label>Link do profilu<input name="profile_url" placeholder="https://github.com/twojprofil" /></label><button class="social-btn route-btn" type="submit">Zapisz profil <span class="external">↗</span></button><p class="form-feedback" id="form-feedback" role="status"></p></form><p class="form-note" id="profile-preview"></p></section>`);
}

async function profile(username) {
  const { data } = await supabaseClient.from("profiles").select("id,username,display_name,bio,avatar_url").eq("username", username).maybeSingle();
  if (!data) return layout(`<section class="auth-panel"><p class="section-label">SQEZEN / PROFILE</p><h1>Nie znaleziono profilu</h1><p class="about-copy">Nazwa <strong>${escapeHtml(username)}</strong> nie jest jeszcze zajęta.</p>${linkButton("/", "Wróć na stronę główną")}</section>`);
  const { data: link } = await supabaseClient.from("links").select("title,url").eq("profile_id", data.id).order("position", { ascending: true }).limit(1).maybeSingle();
  const href = link?.url || "#";
  return layout(`<section class="public-profile"><div class="public-avatar">${escapeHtml((data.display_name || data.username)[0].toUpperCase())}</div><p class="section-label">SQEZEN / PROFILE</p><h1>${escapeHtml(data.display_name || data.username)}</h1><p class="tagline">@${escapeHtml(data.username)}</p><p class="about-copy">${escapeHtml(data.bio || "")}</p>${link ? linkButton(escapeHtml(href), escapeHtml(link.title || "Mój link"), true) : ""}<a class="route-back" href="/">sqezen.lol</a></section>`);
}

async function session() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

function feedback(message, error = false) {
  const node = document.querySelector("#form-feedback");
  if (node) { node.textContent = message; node.classList.toggle("error", error); }
}

async function wire(path) {
  const loginForm = document.querySelector("#login-form");
  if (loginForm) loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    feedback("Logowanie...");
    const { error } = await supabaseClient.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
    if (error) return feedback("Nieprawidłowy e-mail lub hasło.", true);
    navigate("/dashboard");
  });

  const registerForm = document.querySelector("#register-form");
  if (registerForm) registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(registerForm);
    feedback("Tworzenie konta...");
    const { data, error } = await supabaseClient.auth.signUp({ email: form.get("email"), password: form.get("password") });
    if (error) return feedback(error.message, true);
    if (data.session) navigate("/dashboard");
    else { sessionStorage.setItem("sqezen_email", String(form.get("email"))); navigate("/register/code"); }
  });

  const codeForm = document.querySelector("#code-form");
  if (codeForm) codeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = sessionStorage.getItem("sqezen_email");
    if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true);
    feedback("Sprawdzanie kodu...");
    const form = new FormData(codeForm);
    const { error } = await supabaseClient.auth.verifyOtp({ email, token: String(form.get("token")), type: "signup" });
    if (error) return feedback("Kod jest nieprawidłowy lub wygasł.", true);
    sessionStorage.removeItem("sqezen_email");
    navigate("/dashboard");
  });

  const resendCode = document.querySelector("#resend-code");
  if (resendCode) resendCode.addEventListener("click", async () => {
    const email = sessionStorage.getItem("sqezen_email");
    if (!email) return feedback("Wróć do rejestracji i wpisz e-mail.", true);
    feedback("Wysyłanie nowego kodu...");
    const { error } = await supabaseClient.auth.resend({ type: "signup", email });
    feedback(error ? "Nie udało się wysłać kodu ponownie." : "Nowy kod został wysłany.", Boolean(error));
  });

  const logout = document.querySelector("#logout-button");
  if (logout) logout.addEventListener("click", async () => { await supabaseClient.auth.signOut(); navigate("/"); });

  const profileForm = document.querySelector("#profile-form");
  if (profileForm) {
    const current = await session();
    if (!current) return navigate("/login");
    const { data } = await supabaseClient.from("profiles").select("*").eq("id", current.user.id).maybeSingle();
    if (data) for (const field of ["username", "display_name", "bio"]) if (profileForm.elements[field]) profileForm.elements[field].value = data[field] || "";
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(profileForm);
      const username = String(form.get("username")).trim().toLowerCase();
      feedback("Zapisywanie...");
      const { error } = await supabaseClient.from("profiles").upsert({ id: current.user.id, username, display_name: form.get("display_name"), bio: form.get("bio") || "" });
      if (error) return feedback(error.code === "23505" ? "Ta nazwa jest już zajęta." : error.message, true);
      await supabaseClient.from("links").delete().eq("profile_id", current.user.id);
      if (String(form.get("profile_url") || "").trim()) await supabaseClient.from("links").insert({ profile_id: current.user.id, title: "Mój link", url: String(form.get("profile_url")).trim(), icon: "↗", position: 0 });
      document.querySelector("#profile-preview").innerHTML = `Twój profil: <a href="/${encodeURIComponent(username)}">sqezen.lol/${escapeHtml(username)}</a>`;
      feedback("Profil zapisany.");
    });
  }
}

async function render() {
  const path = currentPath();
  const app = document.querySelector("#app");
  document.title = path === "/" ? "Sqezen — Twoje miejsce online" : `${path.slice(1)} — sqezen`;
  if (path === "/") app.innerHTML = landing();
  else if (path === "/login") app.innerHTML = login();
  else if (path === "/register") app.innerHTML = register();
  else if (path === "/register/code") app.innerHTML = registerCode();
  else if (path === "/dashboard") app.innerHTML = dashboard();
  else app.innerHTML = await profile(path.slice(1).split("/")[0].toLowerCase());
  await wire(path);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
  event.preventDefault();
  navigate(link.pathname);
});
window.addEventListener("popstate", render);
render();
