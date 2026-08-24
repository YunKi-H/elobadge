const pl = {
  common: {
    streamer: "Streamer",
    viewer: "Widz",
    signOut: "Wyloguj się",
    signingOut: "Wylogowywanie",
    loading: "Wczytywanie",
    connect: "Połącz",
    disconnect: "Odłącz",
    cancel: "Anuluj",
    close: "Zamknij",
    retry: "Spróbuj ponownie",
    refresh: "Odśwież",
    refreshing: "Odświeżanie",
    error: "Błąd",
    connected: "Połączono",
    notConnected: "Nie połączono"
  },
  language: {
    label: "Język"
  },
  app: {
    mainNavigation: "Nawigacja główna",
    signOutFailed: "Nie udało się wylogować. Spróbuj ponownie.",
    support: "Kontakt i zgłaszanie błędów:",
    privacy: "Polityka prywatności"
  },
  home: {
    description:
      "Wyświetlaj ranking szachowy widzów obok wiadomości na czacie Chzzk i Twitch.",
    broadcastTitle: "Ustawienia transmisji",
    broadcastDescription:
      "Połącz czaty transmisji i zarządzaj uniwersalnym adresem URL źródła przeglądarkowego.",
    streamerAction: "Panel streamera",
    ratingTitle: "Połącz rankingi",
    ratingDescription:
      "Połącz konta platform streamingowych, Chess.com i Lichess, aby zarządzać swoimi rankingami.",
    viewerAction: "Panel widza"
  },
  login: {
    title: "Logowanie jako {{role}}",
    chzzk: "Kontynuuj przez Chzzk",
    twitch: "Kontynuuj przez Twitch"
  },
  streamer: {
    title: "Nakładka transmisji",
    preview: "Podgląd czatu"
  },
  viewer: {
    title: "Połączenia kont"
  },
  route: {
    loading: "Wczytywanie strony",
    notFound: "Nie znaleziono strony",
    home: "Wróć na stronę główną"
  },
  customCssGuide: {
    title: "Przewodnik po niestandardowym CSS",
    intro:
      "Użyj klas i atrybutów danych udostępnianych przez nakładkę, aby dostosować wygląd czatu. Twój CSS jest stosowany tak samo w podglądzie i źródle przeglądarkowym.",
    back: "Wróć do panelu streamera",
    selectors: {
      title: "Obsługiwane selektory",
      selector: "Selektor",
      target: "Element docelowy",
      items: {
        overlay: "Cały obszar nakładki",
        messageList: "Lista wiadomości na czacie",
        message: "Pojedyncze pole wiadomości",
        metadata: "Odznaki platformy, odznaka rankingu i pseudonim",
        platformBadges: "Grupa odznak platformy",
        platformBadge: "Pojedynczy obraz odznaki Chzzk lub Twitch",
        ratingBadge: "Zewnętrzny element odznaki rankingu Chess.com lub Lichess",
        ratingBadgeContent: "Ikona i liczba na odznace rankingu",
        nickname: "Pseudonim autora wiadomości",
        content: "Treść wiadomości na czacie",
        emote: "Obraz emotki w wiadomości na czacie"
      }
    },
    attributes: { title: "Atrybuty danych" },
    variables: {
      title: "Zmienne CSS",
      description:
        "Zawierają wartości obliczone na podstawie ustawień wyglądu. Odczytaj je za pomocą var(--nazwa) lub nadpisz w obsługiwanych elementach nakładki."
    },
    examples: {
      title: "Przykłady",
      roles: "Styl według roli widza",
      ratings: "Style odznak rankingu",
      bubble: "Ogon dymka dialogowego"
    },
    limits: {
      title: "Ograniczenia",
      size: "Rozmiar CSS jest ograniczony do 20 KB w kodowaniu UTF-8.",
      selectors: "Selektory muszą zaczynać się od obsługiwanej klasy nakładki.",
      resources: "Funkcja url(), zewnętrzne obrazy i zasoby nie są dozwolone.",
      atRules: "Reguły takie jak @import, @font-face i @keyframes nie są dozwolone.",
      disabled: "Wyłączenie niestandardowego CSS zachowuje jego treść, ale nie stosuje go do nakładki."
    }
  },
  badgePreference: {
    default: "Domyślna odznaka",
    error: "Błąd wyboru odznaki",
    loadFailed: "Nie udało się wczytać ustawień odznaki.",
    saveFailed: "Nie udało się zmienić odznaki."
  },
  chessAccount: {
    loading: "Sprawdzanie informacji o koncie.",
    disconnect: "Odłącz",
    lastUpdated: "Ostatnia aktualizacja: {{date}}",
    refreshInMinutes: "Odświeżenie za {{count}} min",
    games_one: "{{count}} partia",
    games_few: "{{count}} partie",
    games_many: "{{count}} partii",
    games_other: "{{count}} partii",
    highestApplied: "Najwyższy używany ranking",
    noSupportedRatings: "Nie znaleziono rankingu dla obsługiwanego tempa gry.",
    requestFailed: "Nie udało się zrealizować żądania."
  },
  chesscom: {
    title: "Konto Chess.com",
    description: "Wczytuje rankingi Rapid, Blitz i Bullet.",
    refreshTitle: "Odśwież rankingi Chess.com",
    disconnectConfirm:
      "Odłączyć konto Chess.com i usunąć jego obecną odznakę z czatu?",
    username: "Nazwa użytkownika Chess.com",
    lookup: "Wyszukaj konto",
    verified: "Własność konta Chess.com została zweryfikowana.",
    unverifiedNotice:
      "Ten ranking nie pojawi się na nakładkach czatu, dopóki własność konta nie zostanie zweryfikowana.",
    createCode: "Utwórz kod weryfikacyjny",
    locationInstruction:
      "Wpisz poniższy kod dokładnie w polu Lokalizacja (Location) w profilu Chess.com i zapisz zmiany.",
    copyCode: "Kopiuj kod weryfikacyjny",
    openProfileSettings: "Otwórz ustawienia profilu",
    confirmVerification: "Zapisano, zweryfikuj teraz",
    expiryNotice:
      "Kod jest ważny przez 48 godzin. Pamięć podręczna publicznego API Chess.com może opóźnić widoczność zmian profilu."
  },
  lichess: {
    title: "Konto Lichess",
    description: "Wczytuje rankingi Bullet, Blitz, Rapid i Classical.",
    refreshTitle: "Odśwież rankingi Lichess",
    disconnectConfirm:
      "Odłączyć konto Lichess i usunąć jego obecną odznakę?",
    connect: "Połącz przez Lichess",
    connected: "Konto Lichess zostało połączone.",
    expired: "Żądanie połączenia z Lichess wygasło. Spróbuj ponownie.",
    failed: "Nie udało się połączyć konta Lichess. Spróbuj ponownie.",
    verified: "Własność konta Lichess została zweryfikowana."
  },
  platformBadge: "Odznaki platformy",
  platforms: {
    title: "Platformy streamingowe",
    loading: "Sprawdzanie połączonych kont.",
    noAccount: "Brak połączonego konta",
    permissionRequired: "Wymagane uprawnienie do czatu",
    permissionStatus: "Wymagane uprawnienie",
    grantPermission: "Autoryzuj",
    revokePermission: "Cofnij",
    reconnectRequired: "Wymagane ponowne połączenie",
    connecting: "Łączenie",
    alternativeRequired:
      "Przed odłączeniem tego konta połącz inne konto logowania.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Odłączyć konto Chzzk i cofnąć dostęp do czatu?",
      disconnectPermissionConfirm:
        "Cofnąć dostęp do czatu Chzzk? Konto logowania Chzzk pozostanie połączone.",
      accountDisconnected: "Konto Chzzk zostało odłączone.",
      permissionDisconnected: "Dostęp do czatu Chzzk został cofnięty.",
      connectAccount: "Połącz konto Chzzk",
      disconnectAccount: "Odłącz Chzzk",
      connectPermission: "Autoryzuj dostęp do czatu Chzzk",
      disconnectPermission: "Cofnij dostęp do czatu Chzzk",
      connected: "Konto Chzzk zostało połączone.",
      streamerConnected:
        "Konto Chzzk i dostęp do jego czatu zostały połączone.",
      conflict:
        "To konto Chzzk jest już połączone z innym użytkownikiem EloBadge.",
      failed: "Nie udało się połączyć konta Chzzk. Spróbuj ponownie.",
      streamerFailed:
        "Nie udało się ukończyć połączenia z Chzzk lub autoryzacji czatu."
    },
    twitch: {
      disconnectAccountConfirm:
        "Odłączyć konto Twitch i cofnąć dostęp do czatu?",
      disconnectPermissionConfirm:
        "Cofnąć dostęp do czatu Twitch? Konto logowania Twitch pozostanie połączone.",
      accountDisconnected: "Konto Twitch zostało odłączone.",
      permissionDisconnected: "Dostęp do czatu Twitch został cofnięty.",
      connectAccount: "Połącz konto Twitch",
      disconnectAccount: "Odłącz Twitch",
      connectPermission: "Autoryzuj dostęp do czatu Twitch",
      disconnectPermission: "Cofnij dostęp do czatu Twitch",
      connected: "Konto Twitch zostało połączone.",
      streamerConnected:
        "Konto Twitch i dostęp do jego czatu zostały połączone.",
      denied: "Żądanie połączenia z Twitch zostało anulowane.",
      expired: "Żądanie połączenia z Twitch wygasło. Spróbuj ponownie.",
      conflict:
        "To konto Twitch jest już połączone z innym użytkownikiem EloBadge.",
      failed: "Nie udało się połączyć konta Twitch. Spróbuj ponownie.",
      streamerFailed:
        "Nie udało się ukończyć połączenia z Twitch lub autoryzacji czatu."
    },
    loadFailed: "Nie udało się wczytać połączeń z platformami streamingowymi."
  },
  overlay: {
    title: "Nakładka źródła przeglądarkowego",
    description:
      "Działa z OBS Studio, XSplit i innymi programami do transmisji obsługującymi źródła przeglądarkowe. Zoptymalizowana dla szerokości 600 px; dostosuj wysokość do swojej sceny.",
    signInFirst: "Najpierw zaloguj się powyżej za pomocą konta platformy streamingowej.",
    createUrl: "Utwórz URL",
    urlLabel: "URL źródła przeglądarkowego",
    showUrl: "Pokaż URL",
    hideUrl: "Ukryj URL",
    copyUrl: "Kopiuj URL",
    copied: "Skopiowano",
    enable: "Włącz",
    disable: "Wyłącz",
    rotate: "Zmień URL",
    rotateConfirm:
      "Unieważnić obecny URL nakładki i wygenerować nowy?",
    general: "Ogólne",
    badges: "Odznaki",
    background: "Tło czatu",
    colors: "Kolory czatu",
    fonts: "Czcionka czatu",
    maxWidth: "Maksymalna szerokość czatu",
    alignment: "Wyrównanie czatu",
    alignmentOption: {
      left: "Wyrównaj do lewej",
      center: "Wyśrodkuj",
      right: "Wyrównaj do prawej"
    },
    messageLayout: "Układ pseudonimu i wiadomości",
    messageLayoutOption: {
      inline: "Jeden wiersz",
      stacked: "Nowy wiersz",
      aligned: "Wyrównany początek",
      individual: "Wyrównanie każdej wiadomości"
    },
    nicknameSeparatorVisible: "Pokaż dwukropek (:) po pseudonimie",
    alignedNicknameRightAligned: "Wyrównaj pseudonim do prawej",
    messageBoxFilled: "Wypełnij pole czatu",
    customCssEnabled: "Użyj niestandardowego CSS",
    customCss: "Niestandardowy CSS",
    customCssGuide: "Przewodnik po niestandardowym CSS",
    restoreCustomCss: "Przywróć ostatni zapisany CSS",
    restoreCustomCssConfirm: "Przywrócić ostatni zapisany niestandardowy CSS?",
    clearCustomCss: "Wyczyść niestandardowy CSS",
    clearCustomCssConfirm: "Wyczyścić całą treść niestandardowego CSS?",
    unsavedChangesConfirm: "Masz niezapisane ustawienia wyglądu. Opuścić tę stronę?",
    customCssPresets: "Wczytaj przykład CSS",
    applyCustomCssPresetConfirm: "Zastąpić obecny CSS przykładem „{{name}}”?",
    customCssPreset: {
      defaults: "Styl domyślny",
      bubble: "Dymek dialogowy",
      transparent: "Przezroczysty czat",
      nickname: "Wyróżnienie pseudonimu"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Niestandardowy CSS nie może przekraczać 20 KB.",
    customCssError: {
      invalid_syntax: "Sprawdź składnię CSS.",
      at_rule_not_allowed: "Reguły takie jak @import i @font-face nie są dozwolone.",
      external_resource_not_allowed: "Zewnętrzne adresy URL i zasoby obrazów nie są dozwolone.",
      selector_not_allowed: "Selektory muszą pozostać w obrębie obsługiwanych elementów nakładki EloBadge.",
      property_not_allowed: "CSS zawiera właściwość zablokowaną ze względów bezpieczeństwa.",
      invalid_property_value: "CSS zawiera wartość właściwości nieobsługiwaną przez przeglądarki.",
      too_large: "Niestandardowy CSS nie może przekraczać 20 KB."
    },
    duration: "Czas wyświetlania wiadomości",
    keep: "Wyświetlaj bez ograniczeń",
    seconds_one: "{{count}} sekunda",
    seconds_few: "{{count}} sekundy",
    seconds_many: "{{count}} sekund",
    seconds_other: "{{count}} sekundy",
    defaultSuffix: " (domyślne)",
    ratingBadge: "Odznaka rankingu szachowego",
    ratingPolicy: {
      viewer_choice: "Użyj wyboru widza",
      chesscom_only: "Tylko Chess.com",
      lichess_only: "Tylko Lichess",
      hidden: "Ukryta"
    },
    forcedProviderNotice:
      "Po wybraniu konkretnej platformy widzowie bez połączonego konta na tej platformie nie otrzymają odznaki szachowej.",
    allPlatformBadges: "Pokaż wszystkie",
    platformBadges: {
      chzzk: "Odznaki Chzzk",
      twitch: "Odznaki Twitch"
    },
    visibleBadges: "Widoczne odznaki",
    badgeKind: {
      role: "Streamer i administrator",
      subscription: "Subskrypcja",
      donation: "Darowizna",
      subscription_gift: "Podarowana subskrypcja",
      unknown: "Inne"
    },
    twitchBadgeKind: {
      role: "Nadawca, moderator i VIP",
      subscription: "Subskrybent i założyciel",
      donation: "Bits",
      subscription_gift: "Podarowana subskrypcja",
      unknown: "Globalne i inne"
    },
    backgroundVisible: "Pokaż tło",
    backgroundColor: "Kolor tła",
    customBackgroundColor: "Wybierz niestandardowy kolor tła",
    backgroundOpacity: "Krycie tła",
    nicknameVisible: "Pokaż pseudonim",
    nicknameColor: "Kolor pseudonimu",
    messageColor: "Kolor wiadomości",
    colorMode: {
      fixed: "Jeden kolor",
      by_user: "Według użytkownika",
      by_role: "Według roli",
      message_by_role: "Według typu"
    },
    customNicknameColor: "Wybierz niestandardowy kolor pseudonimu",
    customMessageColor: "Wybierz niestandardowy kolor wiadomości",
    role: {
      streamer: "Streamer",
      manager: "Administrator",
      subscriber: "Subskrybent",
      donator: "Darczyńca",
      viewer: "Widz"
    },
    font: "Czcionka",
    systemFont: "Domyślna czcionka systemowa",
    fontPreview: "Pchnąć w tę łódź jeża lub ośm skrzyń fig.",
    fontSize: "Rozmiar czcionki",
    fontWeight: "Grubość czcionki",
    lineHeight: "Odstęp między wierszami",
    save: "Zapisz wygląd",
    reset: "Przywróć domyślne",
    resetConfirm: "Przywrócić domyślne wartości wszystkich ustawień wyglądu czatu?",
    requestFailed: "Żądanie nie powiodło się."
  },
  preview: {
    frameLabel: "Podgląd nakładki czatu",
    empty: "Brak wiadomości podglądu",
    nickname: "Pseudonim",
    nicknamePlaceholder: "Pseudonim widza",
    rating: "Ranking",
    optional: "Opcjonalne",
    role: "Rola",
    roleLabel: "Rola w podglądzie czatu",
    badgeType: "Typ odznaki",
    badgeLabel: "Odznaka {{provider}}",
    message: "Wiadomość",
    messagePlaceholder: "Wpisz wiadomość podglądu",
    add: "Dodaj podgląd"
  },
  authCallback: {
    missingCode: "Brakuje kodu logowania.",
    loginFailed: "Logowanie nie powiodło się.",
    loggingIn: "Logowanie za pomocą konta platformy streamingowej.",
    success: "Konto połączone",
    successDescription:
      "Połączono {{name}} w trybie {{role}}.",
    continue: "Kontynuuj",
    failure: "Nie udało się połączyć konta",
    invalidCode: "Kod logowania wygasł lub jest nieprawidłowy."
  },
  api: {
    signInRequired: "Musisz zalogować się do EloBadge.",
    requestFailed: "Nie udało się zrealizować żądania.",
    serverLoginFailed: "Nie udało się zweryfikować logowania na serwerze.",
    adminRequired: "To konto nie ma uprawnień administratora.",
    overlayLoadFailed: "Nie udało się wczytać nakładki."
  },
  accountDeletion: {
    confirmation: "USUŃ KONTO",
    title: "Usuń konto",
    description:
      "Trwale usuń połączone dane szachowe i ustawienia transmisji.",
    action: "Usuń konto EloBadge",
    dialogTitle: "Usunąć konto EloBadge?",
    warning:
      "Połączenia z Chess.com i Lichess, rankingi, adresy URL nakładek i ustawienia wyglądu zostaną usunięte. Istniejące adresy URL źródeł przeglądarkowych natychmiast przestaną działać.",
    close: "Zamknij okno usuwania konta",
    instruction: "Wpisz {{text}}, aby kontynuować.",
    deleting: "Usuwanie",
    permanentDelete: "Usuń trwale",
    failed: "Nie udało się usunąć konta EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Niniejsza Polityka prywatności jest udostępniana w języku koreańskim jako wiążąca wersja zgodnie z prawem Korei Południowej."
  }
} as const;

export default pl;
