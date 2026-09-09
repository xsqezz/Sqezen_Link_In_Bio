(() => {
  const textMap = new Map(Object.entries({
    "O projekcie": "About",
    "Zaloguj się": "Sign in",
    "Stwórz profil": "Create profile",
    "Zacznij za darmo": "Start for free",
    "Zarezerwuj nazwę": "Reserve your name",
    "Twój panel": "Your workspace",
    "Profil": "Profile",
    "Linki": "Links",
    "Wygląd": "Appearance",
    "Konto": "Account",
    "Profil Discord": "Discord profile",
    "Pokaż swój Discord.": "Show your Discord.",
    "Połącz konto, aby wyświetlać status i aktywność na profilu.": "Connect your account to show status and activity on your profile.",
    "Twoje konto": "Your account",
    "Ładowanie…": "Loading…",
    "Twoje dane są prywatne": "Your data stays private",
    "Twój profil": "Your profile",
    "Twój klimat.": "Your look.",
    "Konto i adres.": "Account and address.",
    "Zbuduj swój profil.": "Build your profile.",
    "Twoje odnośniki.": "Your links.",
    "Tło, karta, typografia i kolory — wszystko pod Twoją kontrolą.": "Background, card, type and colors — all under your control.",
    "Ustaw informacje, które zobaczą osoby odwiedzające Twój adres.": "Set the information people see on your address.",
    "Dodawaj, testuj i układaj linki w kolejności, którą lubisz.": "Add, test and arrange links in your preferred order.",
    "Sprawdź e-mail i skopiuj publiczny adres profilu.": "Check your email and copy your public profile address.",
    "To pojawi się na samej górze Twojego profilu.": "This appears at the top of your profile.",
    "Nazwa użytkownika": "Username",
    "Nazwa wyświetlana": "Display name",
    "Bio": "Bio",
    "Avatar": "Avatar",
    "Twoja nazwa": "Your name",
    "Krótko i konkretnie.": "Keep it short and clear.",
    "Może zawierać spacje i wielkie litery.": "Spaces and uppercase letters are allowed.",
    "Nazwa musi mieć 3–24 znaki: małe litery, cyfry lub _.": "Use 3–24 characters: lowercase letters, numbers or _.",
    "Wpisz nazwę wyświetlaną.": "Enter a display name.",
    "Twoja nazwa": "Your name",
    "Twoje odnośniki": "Your links",
    "Dodaj link": "Add link",
    "W polu adresu możesz wkleić domenę, zaproszenie Discord albo zwykły tekst. Kolejność zmienisz strzałkami.": "Paste a domain, Discord invite or plain text into the address field. Reorder links with the arrows.",
    "Nazwa / etykieta": "Name / label",
    "Adres lub tekst": "Address or text",
    "Ikona": "Icon",
    "Dodaj dowolny tekst — przed otwarciem zamienimy go w adres.": "Add any text — we will turn it into an address before opening it.",
    "Wygląd": "Appearance",
    "Resetuj": "Reset",
    "Materiały": "Materials",
    "Tło, muzyka i dodatkowe detale.": "Background, audio and extra details.",
    "Tło obrazu / wideo": "Image / video background",
    "Audio profilu": "Profile audio",
    "Wybierz plik MP3 z komputera albo wklej bezpośredni adres audio. Dynamic embed sam wyszuka lyrics po metadanych utworu.": "Choose an MP3 from your computer or paste a direct audio URL. Dynamic embed automatically looks up lyrics from the track metadata.",
    "Informacje o utworze": "Track info",
    "Szczegóły utworu": "Track details",
    "Tytuł utworu": "Track title",
    "Wykonawca": "Artist",
    "Tytuł i wykonawca pokażą się w Dynamic embed i pomogą znaleźć lyrics automatycznie.": "The title and artist appear in Dynamic embed and help find lyrics automatically.",
    "Własny tekst na żywo (opcjonalnie)": "Custom live lyrics (optional)",
    "Dynamic embed najpierw wyszukuje lyrics po tytule, wykonawcy lub nazwie pliku. Wklej LRC tylko jako własny fallback.": "Dynamic embed looks up lyrics by title, artist or filename first. Paste LRC only as a custom fallback.",
    "Własny kursor": "Custom cursor",
    "Lokalizacja": "Location",
    "Wygodne": "Comfortable",
    "Karta profilu": "Profile card",
    "Rozmiar i intensywność powierzchni.": "Surface size and intensity.",
    "Przezroczystość": "Opacity",
    "Szerokość": "Width",
    "Efekt tła": "Background effect",
    "Efekt nazwy": "Name effect",
    "Kolor i ton": "Color and tone",
    "Stwórz paletę pasującą do Twojej osoby.": "Create a palette that fits your style.",
    "Akcent": "Accent",
    "Tekst": "Text",
    "Karta": "Card",
    "Przyciski": "Buttons",
    "Tekst przycisków": "Button text",
    "Włącz gradient tła": "Enable background gradient",
    "Połącz wybrane kolory w delikatne tło.": "Blend the selected colors into a subtle background.",
    "Układ i detale": "Layout and details",
    "Ostatnie szlify wyglądu strony.": "The final touches for your page.",
    "Wyrównanie": "Alignment",
    "Wyśrodkowane": "Centered",
    "Do lewej": "Left aligned",
    "Odstępy": "Spacing",
    "Kompaktowe": "Compact",
    "Przestronne": "Airy",
    "Styl przycisków": "Button style",
    "Pełne": "Solid",
    "Kontur": "Outline",
    "Font": "Font",
    "Systemowy": "System",
    "Pokaż @username": "Show @username",
    "Nick nad nazwą.": "Handle above the name.",
    "Pokaż branding": "Show branding",
    "Stopka sqezen.": "sqezen footer.",
    "E-mail": "Email",
    "Publiczny adres": "Public address",
    "Twoje dane są obsługiwane przez Supabase.": "Your data is handled by Supabase.",
    "Twoje konto jest chronione": "Your account is protected",
    "Sesja i hasło są obsługiwane przez Supabase. sqezen nie przechowuje haseł.": "Your session and password are handled by Supabase. sqezen never stores passwords.",
    "Zapisz wszystkie zmiany": "Save all changes",
    "Tak widzą Cię inni": "How others see you",
    "na żywo": "live",
    "Zmiany są widoczne tutaj od razu. Opublikują się po zapisaniu.": "Changes appear here instantly. They go live after saving.",
    "Zmiany są widoczne od razu.": "Changes appear here instantly.",
    "public profile": "public profile",
    "made with": "made with",
    "Ten profil nie ma jeszcze linków.": "This profile has no links yet.",
    "Nie znaleziono profilu.": "Profile not found.",
    "Nie udało się wczytać profilu.": "Could not load this profile.",
    "Spróbuj ponownie za chwilę.": "Please try again in a moment.",
    "nie jest jeszcze zajęta.": "is not taken yet.",
    "Stwórz własny profil": "Create your own profile",
    "zalogowane konto": "signed-in account",
    "Ustaw nazwę użytkownika": "Set a username",
    "zapisano przed chwilą": "saved just now",
    "Zapisuję wszystkie zmiany…": "Saving all changes…",
    "Wszystkie zmiany zostały zapisane.": "All changes saved.",
    "Profil zapisany, ale nie udało się odświeżyć linków.": "Profile saved, but links could not be refreshed.",
    "Profil zapisany, ale linki mają problem z zapisem.": "Profile saved, but links could not be stored.",
    "Adres skopiowany.": "Address copied.",
    "Nie udało się skopiować adresu.": "Could not copy the address.",
    "W polu adresu możesz wkleić domenę": "Paste a domain",
    "Kod wygasa po kilku minutach. Sprawdź również folder Spam.": "The code expires after a few minutes. Check your spam folder too.",
    "Nowy kod wysłany. Sprawdź skrzynkę i Spam.": "New code sent. Check your inbox and spam.",
    "Wysyłanie nowego kodu…": "Sending a new code…",
    "Sprawdzanie kodu…": "Checking the code…",
    "Kod jest nieprawidłowy.": "The code is invalid.",
    "Kod wygasł. Wyślij nowy.": "The code expired. Send a new one.",
    "Nieprawidłowy e-mail lub hasło.": "Invalid email or password.",
    "To konto już istnieje. Zaloguj się.": "This account already exists. Sign in.",
    "Za dużo prób. Odczekaj chwilę.": "Too many attempts. Wait a moment.",
    "Nie udało się połączyć z serwerem.": "Could not connect to the server.",
    "Ta nazwa użytkownika jest już zajęta.": "That username is already taken.",
    "Sprawdź adres linku": "Check the link address",
    "Coś poszło nie tak. Spróbuj ponownie.": "Something went wrong. Please try again.",
    "zaloguj się": "sign in",
    "stwórz profil": "create profile",
    "Tożsamość": "Identity",
    "Nazwa użytkownika i bio": "Username & Bio",
    "Preferencje": "Preferences",
    "Efekty nazwy": "Name effects",
    "Twoja strona": "Your site",
    "Personalizacja kursora": "Cursor personalization",
    "Bezpośredni adres do zdjęcia profilowego.": "Direct URL to your profile image.",
    "Ustaw swój avatar.": "Set your avatar.",
    "Wybierz bezpośredni adres zdjęcia profilowego.": "Choose a direct URL for your profile image.",
    "Adres lub tekst": "Address or text",
    "Tytuł": "Title",
    "Strona / link": "Website / link",
    "Brak": "None",
    "Subtelny noise": "Subtle noise",
    "Delikatna siatka": "Subtle grid",
    "Miękki spotlight": "Soft spotlight",
    "Delikatny glow": "Subtle glow",
    "Najlepiej obraz 32×32 px.": "Best as a 32×32 px image.",
    "Odwiedzający uruchamiają ręcznie.": "Visitors start it manually.",
    "Ustaw profil dokładnie tak, jak chcesz go pokazywać.": "Set your profile exactly how you want it to appear.",
    "Efekt nazwy i cząsteczki": "Name effect and particles",
    "Animacja nazwy oraz delikatne punkty światła.": "Name animation and subtle points of light.",
    "Ożyw swoją nazwę.": "Bring your name to life.",
    "Połącz animację nazwy z delikatnymi cząsteczkami.": "Combine name animation with subtle particles.",
    "Dopasuj kartę profilu.": "Customize your profile card.",
    "Ustaw rozmiar, przezroczystość i efekty powierzchni.": "Set the size, opacity and surface effects.",
    "Zbuduj swoją paletę.": "Build your palette.",
    "Dobierz kolory akcentu, tekstu, karty i przycisków.": "Choose your accent, text, card and button colors.",
    "Dopracuj szczegóły.": "Polish the details.",
    "Wybierz układ, odstępy, font i styl przycisków.": "Choose the layout, spacing, font and button style.",
    "Dodaj materiały profilu.": "Add profile materials.",
    "Pliki używane przez Twój profil.": "Files used by your profile.",
    "Zarządzaj tłem, audio, avatarem i własnym kursorem.": "Manage your background, audio, avatar and custom cursor.",
    "Osadź kartę profilu.": "Embed your profile card.",
    "Skopiuj zwykły embed z pełną kartą Twojego profilu.": "Copy a standard embed with your full profile card.",
    "Zbuduj dynamiczny embed.": "Build a dynamic embed.",
    "Ustaw układ kafelków i osadź profil z dodatkowymi modułami.": "Arrange the tiles and embed your profile with extra modules.",
    "Ustaw kolor efektów.": "Set your effect color.",
    "Dobierz kolor efektów, które nie mają własnej stałej palety.": "Choose a color for effects without a fixed palette.",
    "Cząsteczki kursora": "Cursor particles",
    "Kolor efektów": "Effect colors",
    "Zwykły embed": "Standard embed",
    "Dynamic embed": "Dynamic embed",
    "Kreator embedu": "Embed builder",
    "Wybierz wariant embedu i ustaw jego układ.": "Choose an embed variant and arrange it.",
    "Pozycja embedu": "Embed position",
    "Otwórz edytor w pełnym rozmiarze i przeciągnij wybrany wariant.": "Open the full-size editor and drag the selected variant.",
    "Edytuj pozycję": "Edit position",
    "Edytuj Dynamic w pełnym wymiarze": "Edit Dynamic full-size",
    "Edytuj Standard w pełnym wymiarze": "Edit Standard full-size",
    "Otwórz pełnoekranowy edytor, aby ustawić układ elementów.": "Open the full-size editor to arrange the elements.",
    "Otwórz pełnoekranowy edytor, aby ustawić pozycję karty profilu.": "Open the full-size editor to position the profile card.",
    "Odznaki": "Badges",
    "Wróć": "Back",
    "Otwórz profil": "Open profile",
    "Wyloguj": "Sign out",
    "Zmień dane": "Change details",
    "Potwierdź kod": "Confirm code",
    "Wyślij kod ponownie": "Send a new code",
    "Kod z wiadomości": "Verification code",
    "Wróć na stronę główną": "Back to home",
    "Nie masz konta?": "Don't have an account?",
    "Masz już konto?": "Already have an account?",
    "Zaczniemy od e-maila i hasła.": "Let's start with your email and password.",
    "Twoje dane są obsługiwane bezpiecznie przez Supabase.": "Your details are handled securely by Supabase.",
    "Wpisz kod": "Enter the code",
    "Potwierdź swój e-mail": "Confirm your email",
    "Wpisz 8-cyfrowy kod z wiadomości. Nie używamy linków, więc zawsze wiesz, co potwierdzasz.": "Enter the 8-digit code from your email. We do not use links, so you always know what you are confirming.",
    "Wysłaliśmy kod na": "We sent a code to",
    "Wróć do rejestracji i wpisz e-mail.": "Return to registration and enter your email.",
    "Wpisz dokładnie 8 cyfr z wiadomości.": "Enter exactly 8 digits from the email.",
    "Sprawdzanie kodu…": "Checking the code…",
    "Tworzenie konta…": "Creating your account…",
    "Logowanie…": "Signing in…",
    "Zapisywanie…": "Saving…",
    "Pracuję…": "Working…",
    "Zrób to po swojemu.": "Make it yours.",
    "Zrób to po swojemu": "Make it yours",
    "online teraz": "online now",
    "Witaj": "Welcome",
    "z powrotem.": "back.",
    "Zbuduj swoją": "Build your",
    "przestrzeń.": "space.",
    "Potwierdź swój": "Confirm your",
    "e-mail.": "email.",
    "Zaloguj się, aby zarządzać profilem, linkami i swoją przestrzenią.": "Sign in to manage your profile, links and personal space.",
    "Stwórz profil, który jest naprawdę Twój. Jeden prosty adres do wszystkiego, co robisz online.": "Create a profile that feels like you. One clean address for everything you do online.",
    "Jeszcze jeden krok i nowy profil będzie gotowy do udostępnienia.": "One quick step and your new profile is ready to share.",
    "Wpisz dane, aby kontynuować.": "Enter your details to continue.",
    "Wpisz 8-cyfrowy kod wysłany po rejestracji.": "Enter the 8-digit code we sent after registration.",
    "Hasło": "Password",
    "Kontynuuj": "Continue",
    "Utwórz konto": "Create an account",
    "Utwórz je": "Create one",
    "Potwierdź e-mail": "Confirm email",
    "Zmień dane rejestracji": "Change registration details",
    "SQEZEN / LOGOWANIE": "SQEZEN / SIGN IN",
    "DOSTĘP DO KONTA": "ACCOUNT ACCESS",
    "SQEZEN / UTWÓRZ": "SQEZEN / CREATE",
    "01 / UTWÓRZ": "01 / CREATE",
    "SQEZEN / WERYFIKACJA": "SQEZEN / VERIFY",
    "02 / WERYFIKACJA": "02 / VERIFY",
    "Twoja przestrzeń online": "your space online",
    "Upuść plik tutaj": "Drop a file here",
    "lub wybierz plik lokalny. Tymczasowy podgląd powstanie bez konwersji do Base64.": "or choose a local file. A temporary preview is created without converting it to Base64.",
    "Wybierz plik": "Choose file",
    "albo": "or",
    "Wklej bezpośredni URL": "Paste a direct URL",
    "Adres musi prowadzić bezpośrednio do pliku. Linki z Discorda mogą wymagać wybrania pliku lokalnego.": "The URL must point directly to a file. Discord links can require choosing a local file instead.",
    "Nie wybrano jeszcze assetu.": "No asset selected yet.",
    "Obecnie wybrano plik lokalny.": "A local file is currently selected.",
    "Obecnie wybrano bezpośredni URL.": "A direct URL is currently selected.",
    "Anuluj": "Cancel",
    "Użyj assetu": "Use asset",
    "Wybierz plik lokalny zamiast wklejać dane Base64.": "Choose a local file instead of pasting Base64 data.",
    "Gotowe": "Ready",
    "Zmiany zapisują się automatycznie.": "Changes save automatically.",
    "Przeciągaj lub skaluj profil, połączenia, Discord presence, odtwarzacz muzyki albo Live lyrics. Zsynchronizowane wersy dodasz w ustawieniach audio.": "Drag or resize profile, Connections, Discord presence, music player or Live lyrics. Add synced lines in Audio settings.",
    "Przeciągaj lub skaluj kartę profilu, aby umieścić ją w dowolnym miejscu strony.": "Drag or resize the profile card to place it anywhere on the page."
  }));
  const partMap = [["małe litery, cyfry i _", "lowercase letters, numbers and _"], ["bez nazwy", "untitled"], ["Przesuń link wyżej", "Move link up"], ["Przesuń link niżej", "Move link down"], ["Duplikuj link", "Duplicate link"], ["Usuń link", "Remove link"], ["Skopiuj link", "Copy link"], ["Otwórz menu", "Open menu"], ["Skopiuj adres", "Copy address"], ["Wysłaliśmy kod na ", "We sent a code to "], ["Wyślij ponownie za ", "Send again in "], ["Nie udało się", "Could not"], [" — gotowy do użycia.", " — ready to use."]];
  const attrMap = new Map([["np. sqezen", "e.g. sqezen"], ["twoja_nazwa", "your_name"], ["Twoja nazwa", "Your name"], ["np. Mój GitHub", "e.g. My GitHub"], ["discord.gg/nazwa lub dowolny tekst", "discord.gg/name or any text"], ["https://.../avatar.png", "https://.../avatar.png"], ["np. Warszawa", "e.g. Warsaw"], ["https://.../background.mp4", "https://.../background.mp4"], ["https://.../track.mp3", "https://.../track.mp3"], ["Nazwa utworu", "Track name"], ["Nazwa wykonawcy", "Artist name"], ["Panel profilu", "Profile workspace"], ["Otwórz menu", "Open menu"], ["Skopiuj adres", "Copy address"], ["Skopiuj link", "Copy link"], ["Twoje hasło", "Your password"], ["minimum 6 znaków", "minimum 6 characters"], ["ty@example.com", "you@example.com"]]);
  const dictionaries = Object.freeze({
    en: Object.freeze({
      "nav.profile": "Profile",
      "nav.links": "Links",
      "nav.appearance": "Appearance",
      "nav.account": "Account",
      "actions.openProfile": "Open profile",
      "actions.signOut": "Sign out",
      "editor.arrange": "Arrange your embed",
      "editor.arrangeStandard": "Arrange your standard embed",
      "editor.back": "Back to builder",
      "save.ready": "Ready",
      "save.pending": "Pending changes",
      "save.syncing": "Saving changes",
      "save.saved": "All changes saved",
      "save.error": "Changes could not be saved"
    }),
    pl: Object.freeze({
      "nav.profile": "Profil",
      "nav.links": "Linki",
      "nav.appearance": "Wygląd",
      "nav.account": "Konto",
      "actions.openProfile": "Otwórz profil",
      "actions.signOut": "Wyloguj",
      "editor.arrange": "Ustaw swój embed",
      "editor.arrangeStandard": "Ustaw standardowy embed",
      "editor.back": "Wróć do kreatora",
      "save.ready": "Gotowe",
      "save.pending": "Zmiany oczekują na zapis",
      "save.syncing": "Zapisywanie zmian",
      "save.saved": "Wszystkie zmiany zapisane",
      "save.error": "Nie udało się zapisać zmian"
    })
  });
  const reverseTextMap = new Map(Array.from(textMap, ([polish, english]) => [english, polish]));
  const reversePartMap = partMap.map(([polish, english]) => [english, polish]);
  const reverseAttrMap = new Map(Array.from(attrMap, ([polish, english]) => [english, polish]));
  const originalText = new WeakMap();
  const lastAppliedText = new WeakMap();
  const originalAttributes = new WeakMap();
  const originalValues = new WeakMap();
  const storageKey = "sqezen_locale";
  const supportedLocales = new Set(["en", "pl"]);
  let locale = "en";
  try {
    const saved = localStorage.getItem(storageKey);
    if (supportedLocales.has(saved)) locale = saved;
  } catch {}

  const translateLegacyText = (value, targetLocale = locale) => {
    const original = String(value || "");
    const trimmed = original.trim();
    if (!trimmed) return original;
    const exactMap = targetLocale === "en" ? textMap : reverseTextMap;
    const parts = targetLocale === "en" ? partMap : reversePartMap;
    const exact = exactMap.get(trimmed);
    return exact ? original.replace(trimmed, exact) : parts.reduce((result, [from, to]) => result.replaceAll(from, to), original);
  };

  const getElements = (root, selector) => {
    const elements = [];
    if (root instanceof Element && root.matches(selector)) elements.push(root);
    root.querySelectorAll?.(selector).forEach((element) => elements.push(element));
    return elements;
  };

  const t = (key, values = {}) => {
    const template = dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  };

  const ensureLocaleControl = () => {
    const allowed = new Set(["/", "/login", "/register", "/register/code", "/dashboard"]);
    const route = document.body?.dataset.route || location.pathname.replace(/\/+$/, "") || "/";
    let control = document.querySelector("[data-locale-toggle]");
    if (!allowed.has(route)) {
      control?.remove();
      return;
    }
    if (!control) {
      control = document.createElement("button");
      control.type = "button";
      control.className = "locale-toggle";
      control.dataset.localeToggle = "true";
      control.addEventListener("click", () => setLocale(locale === "en" ? "pl" : "en"));
    }
    const inlineHost = route === "/dashboard"
      ? document.querySelector(".dashboard-topbar-actions")
      : route.startsWith("/login") || route.startsWith("/register")
        ? document.querySelector(".auth-reference-header")
        : null;
    const host = inlineHost || document.body;
    if (control.parentElement !== host) host.prepend(control);
    control.classList.toggle("is-inline", Boolean(inlineHost));
    const label = locale === "en" ? "EN / PL" : "PL / EN";
    const ariaLabel = locale === "en" ? "Switch language to Polish" : "Zmień język na angielski";
    if (control.textContent !== label) control.textContent = label;
    if (control.getAttribute("aria-label") !== ariaLabel) control.setAttribute("aria-label", ariaLabel);
    if (control.title !== ariaLabel) control.title = ariaLabel;
  };

  const apply = (root = document) => {
    [[".dashboard-nav-list [data-dashboard-tab='identity'] > span", "nav.profile"], [".dashboard-nav-list [data-dashboard-tab='links'] > span", "nav.links"], [".dashboard-nav-list [data-dashboard-tab='profile-card'] > span", "nav.appearance"], [".dashboard-nav-list [data-dashboard-tab='account'] > span", "nav.account"]].forEach(([selector, key]) => {
      getElements(root, selector).forEach((element) => element.dataset.i18n = key);
    });
    getElements(root, ".public-handle,.public-card h1,.public-bio,.profile-link-title,.embed-profile-handle,.embed-profile-card h1,.embed-profile-bio,.dynamic-lyrics-line,.discord-profile-identity,.discord-activity-copy").forEach((element) => {
      element.dataset.userContent = "true";
    });
    getElements(root, "[data-i18n]").forEach((element) => {
      const value = t(element.dataset.i18n);
      if (element.textContent !== value) element.textContent = value;
    });
    [["data-i18n-placeholder", "placeholder"], ["data-i18n-aria-label", "aria-label"], ["data-i18n-title", "title"]].forEach(([dataName, attribute]) => {
      getElements(root, `[${dataName}]`).forEach((element) => {
        const value = t(element.getAttribute(dataName));
        if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
      });
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.parentElement?.closest("[data-user-content],[data-i18n],[aria-hidden='true'],.cursor-glow,.site-cursor")) return;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const nextValue = translateLegacyText(originalText.get(node), locale);
      lastAppliedText.set(node, nextValue);
      if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    });
    getElements(root, "input,textarea,select").forEach((field) => {
      let originals = originalAttributes.get(field);
      if (!originals) {
        originals = new Map();
        originalAttributes.set(field, originals);
      }
      ["placeholder", "aria-label", "title"].forEach((name) => {
        const current = field.getAttribute(name);
        if (current != null && !originals.has(name)) originals.set(name, current);
        const source = originals.get(name);
        if (source == null) return;
        const map = locale === "en" ? attrMap : reverseAttrMap;
        const nextValue = map.get(source) || translateLegacyText(source, locale);
        if (current !== nextValue) field.setAttribute(name, nextValue);
      });
      if (field.readOnly) {
        if (!originalValues.has(field)) originalValues.set(field, field.value);
        const nextValue = translateLegacyText(originalValues.get(field), locale);
        if (field.value !== nextValue) field.value = nextValue;
      }
    });
    document.documentElement.lang = locale;
    const route = document.body?.dataset.route || location.pathname.replace(/\/+$/, "") || "/";
    const routeTitles = {
      en: { "/": "sqezen — your space online", "/login": "Sign in — sqezen", "/register": "Create an account — sqezen", "/register/code": "Confirm your email — sqezen", "/dashboard": "Workspace — sqezen" },
      pl: { "/": "sqezen — twoja przestrzeń online", "/login": "Logowanie — sqezen", "/register": "Utwórz konto — sqezen", "/register/code": "Potwierdź e-mail — sqezen", "/dashboard": "Panel — sqezen" }
    };
    const pageTitle = routeTitles[locale][route];
    if (pageTitle && document.title !== pageTitle) document.title = pageTitle;
    ensureLocaleControl();
  };
  let queued = false;
  const pendingRoots = new Set();
  const queueRoot = (node) => {
    const root = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    if (!root || root.closest("[aria-hidden='true'],.cursor-effects,.cursor-glow,.site-cursor")) return;
    pendingRoots.add(root);
  };
  const flushTranslations = () => {
    queued = false;
    const roots = Array.from(pendingRoots);
    pendingRoots.clear();
    roots
      .filter((root) => !roots.some((other) => other !== root && other.contains(root)))
      .forEach((root) => apply(root));
  };
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList" && record.addedNodes.length) {
        record.addedNodes.forEach(queueRoot);
      }
      if (record.type === "characterData") {
        const applied = lastAppliedText.get(record.target);
        if (record.target.nodeValue !== applied) originalText.set(record.target, record.target.nodeValue);
        queueRoot(record.target);
      }
    });
    if (!pendingRoots.size || queued) return;
    queued = true;
    queueMicrotask(flushTranslations);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  const setLocale = (nextLocale) => {
    if (!supportedLocales.has(nextLocale)) return false;
    locale = nextLocale;
    try { localStorage.setItem(storageKey, locale); } catch {}
    apply(document);
    window.dispatchEvent(new CustomEvent("sqezen:localechange", { detail: { locale } }));
    return true;
  };
  window.sqezenI18n = {
    get locale() { return locale; },
    t,
    apply,
    registerRoot: apply,
    translateText: (value) => translateLegacyText(value, locale),
    setLocale,
    toggle: () => setLocale(locale === "en" ? "pl" : "en")
  };
  apply(document);
})();
