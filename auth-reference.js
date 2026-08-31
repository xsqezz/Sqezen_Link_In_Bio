(() => {
  const escape = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const back = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';

  window.auth = (kind) => {
    const isRegister = kind === "register";
    const isCode = kind === "code";
    const pageType = isCode ? "verify" : isRegister ? "register" : "login";
    const pitchTitle = isCode ? "Confirm your<br><em>email.</em>" : isRegister ? "Build your<br><em>space.</em>" : "Welcome<br><em>back.</em>";
    const pitchCopy = isCode ? "One quick step and your new profile is ready to share." : isRegister ? "Create a profile that feels like you. One clean address for everything you do online." : "Sign in to manage your profile, links and personal space.";
    const step = isCode ? "02 / VERIFY" : isRegister ? "01 / CREATE" : "ACCOUNT ACCESS";
    const cardTitle = isCode ? "Confirm your email" : isRegister ? "Create an account" : "Sign in";
    const cardIntro = isCode ? "Enter the 8-digit code we sent after registration." : isRegister ? "Let's start with your email and password." : "Enter your details to continue.";
    const form = isCode
      ? `<form id="code-form" class="stack-form"><label class="field-label">Verification code<input class="code-input" name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" placeholder="00000000" required></label><button class="button button-primary button-wide" type="submit">Confirm email ${arrow}</button><button class="text-button" id="resend-code" type="button">Send a new code</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">The code expires after a few minutes. Check your spam folder too.</p><a class="back-link" href="/register">${back} Change registration details</a>`
      : isRegister
        ? `<form id="register-form" class="stack-form"><label class="field-label">Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label><label class="field-label">Password<input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="minimum 6 characters" required></label><button class="button button-primary button-wide" type="submit">Continue ${arrow}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Already have an account? <a href="/login">Sign in</a></p><a class="back-link" href="/">${back} Back to home</a>`
        : `<form id="login-form" class="stack-form"><label class="field-label">Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label><label class="field-label">Password<input name="password" type="password" autocomplete="current-password" placeholder="Your password" required></label><button class="button button-primary button-wide" type="submit">Sign in ${arrow}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Don't have an account? <a href="/register">Create one</a></p><a class="back-link" href="/">${back} Back to home</a>`;
    const sideActions = isCode
      ? `<a class="button button-ghost" href="/register">Change details ${arrow}</a><a class="button button-primary" href="/login">Sign in ${arrow}</a>`
      : isRegister
        ? `<a class="button button-ghost" href="/login">Sign in ${arrow}</a><a class="button button-primary" href="/register">Create profile ${arrow}</a>`
        : `<a class="button button-ghost" href="/login">Sign in ${arrow}</a><a class="button button-primary" href="/register">Create profile ${arrow}</a>`;
    return `<div class="auth-reference-page auth-reference-${pageType}"><div class="auth-reference-shell"><header class="auth-reference-header"><a class="auth-reference-brand" href="/">sqezen</a><a class="auth-reference-home" href="/">Back to home ${external}</a></header><main class="auth-reference-main"><section class="auth-reference-pitch"><p class="auth-reference-eyebrow">SQEZEN / ${isCode ? "VERIFY" : isRegister ? "CREATE" : "SIGN IN"}</p><h1>${pitchTitle}</h1><p>${pitchCopy}</p><div class="auth-reference-actions">${sideActions}</div></section><section class="auth-card auth-reference-card"><div class="auth-reference-card-head"><span class="auth-reference-step">${step}</span></div><h2>${cardTitle}</h2><p class="form-intro">${cardIntro}</p>${form}</section></main><footer class="auth-reference-footer"><span>sqezen.lol</span><span>your space online</span></footer></div></div>`;
  };

  window.dispatchEvent(new Event("popstate"));
})();
