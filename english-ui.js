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
    "Pracuję…": "Working…"
  }));
  const partMap = [["małe litery, cyfry i _", "lowercase letters, numbers and _"], ["bez nazwy", "untitled"], ["Przesuń link wyżej", "Move link up"], ["Przesuń link niżej", "Move link down"], ["Duplikuj link", "Duplicate link"], ["Usuń link", "Remove link"], ["Skopiuj link", "Copy link"], ["Otwórz menu", "Open menu"], ["Skopiuj adres", "Copy address"], ["Wysłaliśmy kod na ", "We sent a code to "], ["Wyślij ponownie za ", "Send again in "], ["Nie udało się", "Could not"]];
  const attrMap = new Map([["np. sqezen", "e.g. sqezen"], ["twoja_nazwa", "your_name"], ["Twoja nazwa", "Your name"], ["np. Mój GitHub", "e.g. My GitHub"], ["discord.gg/nazwa lub dowolny tekst", "discord.gg/name or any text"], ["https://.../avatar.png", "https://.../avatar.png"], ["np. Warszawa", "e.g. Warsaw"], ["https://.../background.mp4", "https://.../background.mp4"], ["https://.../track.mp3", "https://.../track.mp3"], ["Nazwa utworu", "Track name"], ["Nazwa wykonawcy", "Artist name"], ["Panel profilu", "Profile workspace"], ["Otwórz menu", "Open menu"], ["Skopiuj adres", "Copy address"], ["Skopiuj link", "Copy link"]]);
  const translate = (root = document) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.parentElement?.closest("[data-user-content]")) return;
      const original = node.nodeValue;
      const trimmed = original.trim();
      if (!trimmed) return;
      const translated = textMap.get(trimmed);
      const nextValue = translated
        ? original.replace(trimmed, translated)
        : partMap.reduce((value, [from, to]) => value.replaceAll(from, to), original);
      if (nextValue !== original) node.nodeValue = nextValue;
    });
    root.querySelectorAll?.("input, textarea, select").forEach((field) => {
      ["placeholder", "aria-label"].forEach((name) => { const value = field.getAttribute(name); if (value && attrMap.has(value)) field.setAttribute(name, attrMap.get(value)); });
      if (field.readOnly && textMap.has(field.value)) field.value = textMap.get(field.value);
    });
    document.documentElement.lang = "en";
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
      .forEach((root) => translate(root));
  };
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList" && record.addedNodes.length) {
        if (record.target === document.body || record.target === document.documentElement) record.addedNodes.forEach(queueRoot);
        else queueRoot(record.target);
      }
      if (record.type === "characterData") queueRoot(record.target);
    });
    if (!pendingRoots.size || queued) return;
    queued = true;
    requestAnimationFrame(flushTranslations);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  translate();
})();
