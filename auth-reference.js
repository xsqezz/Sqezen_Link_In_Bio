(() => {
  const escape = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const back = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';

  window.auth = (kind) => {
    const isRegister = kind === "register";
    const isCode = kind === "code";
    const pageType = isCode ? "verify" : isRegister ? "register" : "login";
    const pitchTitle = isCode ? "One last<br><em>step.</em>" : isRegister ? "Build your<br><em>space.</em>" : "Your page.<br><em>Your rules.</em>";
    const pitchCopy = isCode ? "Check your inbox for the 8-digit code and you’ll be ready to go." : isRegister ? "Bring your links, socials and personality together in one profile you can make your own." : "Pick up where you left off and keep shaping a page that feels like you.";
    const step = isCode ? "02 / VERIFY" : isRegister ? "01 / CREATE" : "ACCOUNT ACCESS";
    const cardTitle = isCode ? "Confirm your email" : isRegister ? "Create an account" : "Sign in";
    const cardIntro = isCode ? "Enter the 8-digit code we sent after registration." : isRegister ? "Let's start with your email and password." : "Enter your details to continue.";
    const form = isCode
      ? `<form id="code-form" class="stack-form"><label class="field-label">Verification code<input class="code-input" name="token" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{8}" maxlength="8" placeholder="00000000" required></label><button class="button button-primary button-wide" type="submit">Confirm email ${arrow}</button><button class="text-button" id="resend-code" type="button">Send a new code</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">The code expires after a few minutes. Check your spam folder too.</p><a class="back-link" href="/register">${back} Change registration details</a>`
      : isRegister
        ? `<form id="register-form" class="stack-form"><label class="field-label">Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label><label class="field-label">Password<input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="minimum 6 characters" required></label><button class="button button-primary button-wide" type="submit">Continue ${arrow}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Already have an account? <a href="/login">Sign in</a></p><a class="back-link" href="/">${back} Back to home</a>`
        : `<form id="login-form" class="stack-form"><label class="field-label">Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label><label class="field-label">Password<input name="password" type="password" autocomplete="current-password" placeholder="Your password" required></label><button class="button button-primary button-wide" type="submit">Sign in ${arrow}</button><p class="form-feedback" id="form-feedback" role="status" aria-live="polite"></p></form><p class="form-note">Don't have an account? <a href="/register">Create one</a></p><a class="back-link" href="/">${back} Back to home</a>`;
    const sellingPoints = `<div class="auth-reference-points"><span><i>✓</i> A profile that feels like you</span><span><i>✓</i> One simple link to share</span><span><i>✓</i> Links, style and personality together</span></div>`;
    return `<div class="auth-reference-page auth-reference-${pageType}"><div class="auth-reference-shell"><header class="auth-reference-header"><a class="auth-reference-brand" href="/" aria-label="sqezen home"><img src="/sqezen-logo-chrome.png" alt="sqezen"></a><a class="auth-reference-home" href="/">Back to home ${external}</a></header><main class="auth-reference-main"><section class="auth-reference-pitch"><p class="auth-reference-eyebrow"><i></i> SQEZEN / ${isCode ? "VERIFY" : isRegister ? "CREATE" : "SIGN IN"}</p><h1>${pitchTitle}</h1><p>${pitchCopy}</p>${sellingPoints}</section><section class="auth-card auth-reference-card"><div class="auth-reference-card-head"><span class="auth-reference-step">${step}</span></div><h2>${cardTitle}</h2><p class="form-intro">${cardIntro}</p>${form}</section></main><footer class="auth-reference-footer"><span>sqezen.lol</span><span>your space online</span></footer></div></div>`;
  };

  const route = window.location.pathname.replace(/\/+$/, "") || "/";
  if (["/login", "/register", "/register/code"].includes(route) && typeof window.rerenderAuth === "function") {
    window.rerenderAuth();
  }
})();
