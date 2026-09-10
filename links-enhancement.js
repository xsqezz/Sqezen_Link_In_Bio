(() => {
  const platforms = [
    ["snapchat", "Snapchat", "snapchat.com/add/..."], ["youtube", "YouTube", "youtube.com/@..."], ["discord", "Discord", "discord.gg/..."], ["spotify", "Spotify", "open.spotify.com/user/..."],
    ["instagram", "Instagram", "instagram.com/..."], ["x", "X", "x.com/..."], ["tiktok", "TikTok", "tiktok.com/@..."], ["telegram", "Telegram", "t.me/..."],
    ["soundcloud", "SoundCloud", "soundcloud.com/..."], ["paypal", "PayPal", "paypal.me/..."], ["github", "GitHub", "github.com/..."], ["roblox", "Roblox", "roblox.com/users/.../profile"],
    ["xbox", "Xbox", "xbox.com/play/user/..."], ["gitlab", "GitLab", "gitlab.com/..."], ["twitch", "Twitch", "twitch.tv/..."], ["reddit", "Reddit", "reddit.com/u/..."],
    ["namemc", "NameMC", "namemc.com/profile/..."], ["steam", "Steam", "steamcommunity.com/id/..."], ["threads", "Threads", "threads.net/@..."],
    ["linkedin", "LinkedIn", "linkedin.com/in/..."], ["pinterest", "Pinterest", "pinterest.com/..."], ["email", "Email", "name@example.com"], ["facebook", "Facebook", "facebook.com/..."],
    ["website", "Custom URL", "https://example.com"]
  ];
  const escape = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const platformByName = (name) => platforms.find(([value]) => value === name) || platforms[platforms.length - 1];
  const platformDomains = new Map([
    ["snapchat.com", "snapchat"], ["youtube.com", "youtube"], ["youtu.be", "youtube"], ["discord.gg", "discord"], ["discord.com", "discord"],
    ["open.spotify.com", "spotify"], ["instagram.com", "instagram"], ["x.com", "x"], ["twitter.com", "x"], ["tiktok.com", "tiktok"],
    ["t.me", "telegram"], ["soundcloud.com", "soundcloud"], ["paypal.me", "paypal"], ["github.com", "github"], ["roblox.com", "roblox"],
    ["xbox.com", "xbox"], ["gitlab.com", "gitlab"], ["twitch.tv", "twitch"], ["reddit.com", "reddit"], ["namemc.com", "namemc"],
    ["steamcommunity.com", "steam"], ["threads.net", "threads"], ["linkedin.com", "linkedin"], ["pinterest.com", "pinterest"], ["facebook.com", "facebook"]
  ]);
  const detectPlatform = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return null;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return { value: "email", label: "Email", url: `mailto:${raw}` };
    if (!/[.:/]/.test(raw)) return null;
    const normalized = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw.replace(/^\/\//, "")}`;
    try {
      const parsed = new URL(normalized);
      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return null;
      if (parsed.protocol === "mailto:") return { value: "email", label: "Email", url: parsed.href };
      const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
      for (const [domain, platformName] of platformDomains) {
        if (hostname === domain || hostname.endsWith(`.${domain}`)) {
          const [platformValue, label] = platformByName(platformName);
          return { value: platformValue, label, url: parsed.href };
        }
      }
      return { value: "website", label: "Website", url: parsed.href };
    } catch {
      return null;
    }
  };
  const glyph = (name, className = "") => { const [value] = platformByName(name); const markup = window.icon ? window.icon(value) : ""; return `<span class="platform-glyph ${className}" data-platform-glyph="${escape(value)}" aria-hidden="true">${markup}</span>`; };
  const placeholderFor = (name, mode = "link") => mode === "text" ? "Write the text shown on your profile..." : platformByName(name)[2];
  const platformPicker = () => `<section class="link-platform-picker" aria-labelledby="link-platform-title"><div class="link-platform-heading"><span>${window.icon ? window.icon("link") : "↗"}</span><div><h3 id="link-platform-title">Add a social profile</h3><p>Pick a platform to add it to your profile.</p></div></div><div class="link-platform-grid">${platforms.map(([value, label]) => `<button class="platform-button" type="button" data-platform-preset="${escape(value)}" title="Add ${escape(label)}"><span>${glyph(value)}</span><small>${escape(label)}</small></button>`).join("")}</div></section>`;
  const closeModal = () => { const modal = document.querySelector("[data-social-modal]"); if (!modal) return; document.body.classList.remove("social-modal-open"); modal.classList.add("is-closing"); setTimeout(() => modal.remove(), 160); };
  const openModal = (preset, opener) => {
    closeModal();
    const [value, label] = platformByName(preset);
    const title = value === "website" ? "Add Custom URL" : `Add ${label} Social`;
    const modal = document.createElement("div");
    modal.className = "social-modal-backdrop";
    modal.dataset.socialModal = "true";
    modal.innerHTML = `<section class="social-modal" role="dialog" aria-modal="true" aria-labelledby="social-modal-title"><header class="social-modal-head"><h2 id="social-modal-title">${escape(title)}</h2><button class="social-modal-close" type="button" data-social-modal-close aria-label="Close">×</button></header><div class="social-modal-body"><label class="social-modal-label" for="social-modal-input">Social Mode <span class="social-modal-help" title="Choose whether this item opens a link or only displays text.">?</span></label><div class="social-mode-switch" role="tablist" aria-label="Social mode"><button type="button" class="is-active" data-social-mode="link" role="tab" aria-selected="true">${window.icon ? window.icon("link") : "↗"}<span>Link</span></button><button type="button" data-social-mode="text" role="tab" aria-selected="false"><span class="social-text-icon">A</span><span>Text</span></button></div><label class="social-modal-input-wrap" for="social-modal-input"><span>${glyph(value, "social-modal-glyph")}</span><input id="social-modal-input" class="social-modal-input" data-social-modal-input type="text" autocomplete="url" placeholder="${escape(placeholderFor(value))}" aria-describedby="social-modal-feedback"></label><p class="social-modal-feedback" id="social-modal-feedback" data-social-modal-feedback role="status" aria-live="polite"></p><footer class="social-modal-footer"><button class="button button-small button-ghost social-modal-add" type="button" data-social-modal-add>Add</button><a class="social-modal-help-link" href="mailto:support@sqezen.lol">Need help?</a></footer></div></section>`;
    document.body.append(modal);
    document.body.classList.add("social-modal-open");
    const input = modal.querySelector("[data-social-modal-input]");
    const setMode = (mode) => { modal.dataset.mode = mode; modal.querySelectorAll("[data-social-mode]").forEach((button) => { const active = button.dataset.socialMode === mode; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); }); input.placeholder = placeholderFor(value, mode); input.autocomplete = mode === "link" ? "url" : "off"; };
    modal.querySelectorAll("[data-social-mode]").forEach((button) => button.addEventListener("click", () => { setMode(button.dataset.socialMode); input.focus(); }));
    modal.querySelector("[data-social-modal-close]").addEventListener("click", closeModal);
    modal.querySelector("[data-social-modal-add]").addEventListener("click", () => { const content = input.value.trim(); const feedback = modal.querySelector("[data-social-modal-feedback]"); if (!content) { feedback.textContent = modal.dataset.mode === "text" ? "Write some text first." : "Add a link first."; input.classList.add("has-error"); input.focus(); return; } addPreset(value, content); closeModal(); opener?.focus(); });
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    input.addEventListener("input", () => { input.classList.remove("has-error"); modal.querySelector("[data-social-modal-feedback]").textContent = ""; });
    setMode("link");
    requestAnimationFrame(() => input.focus());
  };
  const linkCardSummary = (item) => {
    if (item.dataset.linkCardReady) return;
    item.dataset.linkCardReady = "true";
    item.classList.add("link-card");
    const title = item.querySelector("[data-link-title]");
    const url = item.querySelector("[data-link-url]");
    const icon = item.querySelector("[data-link-icon]");
    const currentIcon = () => icon?.value || "website";
    const summary = document.createElement("div");
    summary.className = "link-card-summary";
    summary.innerHTML = `<span class="link-card-grip" aria-hidden="true">⋮⋮</span><span class="link-card-brand" data-link-brand>${glyph(currentIcon())}</span><span class="link-card-summary-copy"><strong data-link-summary-title>${escape(title?.value || "Untitled link")}</strong><span data-link-summary-url>${escape(url?.value || "Add an address")}</span></span><span class="link-card-summary-actions"><button type="button" data-link-card-edit aria-label="Edit link">✎</button><a data-link-card-open href="#" target="_blank" rel="noopener noreferrer" aria-label="Open link">↗</a><button type="button" data-link-action="remove" aria-label="Remove link">×</button></span>`;
    item.insertBefore(summary, item.firstElementChild);
    const refresh = () => { const name = title?.value?.trim() || "Untitled link"; const address = url?.value?.trim() || "Add an address"; summary.querySelector("[data-link-summary-title]").textContent = name; summary.querySelector("[data-link-summary-url]").textContent = address; summary.querySelector("[data-link-brand]").innerHTML = glyph(currentIcon()); const open = summary.querySelector("[data-link-card-open]"); const detected = detectPlatform(address); const normalized = detected?.url || "#"; open.href = normalized; open.classList.toggle("is-disabled", normalized === "#"); };
    const autoDetect = () => {
      const detected = detectPlatform(url?.value);
      if (!detected) return refresh();
      if (icon && icon.dataset.userSelected !== "true") icon.value = detected.value;
      if (title && title.dataset.userEdited !== "true" && (!title.value.trim() || title.value === title.dataset.autoLabel)) {
        title.value = detected.label;
        title.dataset.autoLabel = detected.label;
      }
      item.dataset.detectedPlatform = detected.value;
      refresh();
    };
    title?.addEventListener("input", (event) => { if (event.isTrusted) title.dataset.userEdited = "true"; });
    icon?.addEventListener("change", (event) => { if (event.isTrusted) icon.dataset.userSelected = "true"; });
    url?.addEventListener("input", autoDetect);
    url?.addEventListener("change", autoDetect);
    [title, url, icon].filter(Boolean).forEach((field) => { field.addEventListener("input", refresh); field.addEventListener("change", refresh); });
    summary.querySelector("[data-link-card-edit]").addEventListener("click", () => { item.classList.toggle("is-editing"); if (item.classList.contains("is-editing")) title?.focus(); });
    autoDetect();
  };
  const enhance = () => { const panel = document.querySelector('[data-tab-panel="links"]'); const list = document.querySelector("#links-list"); if (!panel || !list) return; if (!panel.querySelector(".link-platform-picker")) { const tip = panel.querySelector(".link-tip"); tip?.insertAdjacentHTML("afterend", platformPicker()); if (tip) tip.style.display = "none"; const add = panel.querySelector("#add-link"); if (add) add.textContent = "Add custom URL"; } list.classList.add("links-editor-enhanced"); list.querySelectorAll("[data-link-item]").forEach(linkCardSummary); };
  const addPreset = (preset, content = "") => {
    const list = document.querySelector("#links-list");
    if (!list) return;
    const isEmpty = (item) => !item.querySelector("[data-link-title]")?.value && !item.querySelector("[data-link-url]")?.value;
    const removeExtraEmptyItems = (items) => items.slice(1).forEach((item) => item.remove());
    const fill = (item) => {
      if (!item) return;
      const [value, label] = platformByName(preset);
      const title = item.querySelector("[data-link-title]");
      const url = item.querySelector("[data-link-url]");
      const icon = item.querySelector("[data-link-icon]");
      if (title) {
        title.value = label;
        title.dataset.autoLabel = label;
      }
      if (url) url.value = content;
      if (icon) {
        if (![...icon.options].some((option) => option.value === value)) icon.append(new Option(label, value));
        icon.value = value;
      }
      linkCardSummary(item);
      item.classList.add("is-editing");
      title?.focus();
      [title, url, icon].filter(Boolean).forEach((field) => field.dispatchEvent(new Event("input", { bubbles: true })));
    };
    const emptyItems = [...list.querySelectorAll("[data-link-item]")].filter(isEmpty);
    if (emptyItems.length) {
      removeExtraEmptyItems(emptyItems);
      fill(emptyItems[0]);
      return;
    }
    document.querySelector("#add-link")?.click();
    requestAnimationFrame(() => {
      const addedItems = [...list.querySelectorAll("[data-link-item]")].filter(isEmpty);
      if (!addedItems.length) return;
      removeExtraEmptyItems(addedItems);
      fill(addedItems[0]);
    });
  };
  document.addEventListener("click", (event) => {
    const preset = event.target.closest?.("[data-platform-preset]");
    if (preset) {
      event.preventDefault();
      openModal(preset.dataset.platformPreset, preset);
      return;
    }
    if (event.target.closest?.("#add-link,[data-link-action='duplicate']")) queueMicrotask(enhance);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.querySelector("[data-social-modal]")) closeModal(); });
  enhance();
  window.detectLinkPlatform = detectPlatform;
  window.SqezenLinks = { enhance, detectPlatform };
})();
