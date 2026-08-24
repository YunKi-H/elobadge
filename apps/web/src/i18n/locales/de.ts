const de = {
  common: {
    streamer: "Streamer",
    viewer: "Zuschauer",
    signOut: "Abmelden",
    signingOut: "Abmeldung läuft",
    loading: "Wird geladen",
    connect: "Verbinden",
    disconnect: "Verbindung trennen",
    cancel: "Abbrechen",
    close: "Schließen",
    retry: "Erneut versuchen",
    refresh: "Aktualisieren",
    refreshing: "Wird aktualisiert",
    error: "Fehler",
    connected: "Verbunden",
    notConnected: "Nicht verbunden"
  },
  language: {
    label: "Sprache"
  },
  app: {
    mainNavigation: "Hauptnavigation",
    signOutFailed: "Abmeldung fehlgeschlagen. Bitte versuche es erneut.",
    support: "Kontakt und Fehlermeldungen:",
    privacy: "Datenschutzerklärung"
  },
  home: {
    description:
      "Zeigt die Schachwertungen der Zuschauer neben Chzzk- und Twitch-Chatnachrichten an.",
    broadcastTitle: "Übertragungseinstellungen",
    broadcastDescription:
      "Verbinde Übertragungschats und verwalte eine universelle Browserquellen-URL.",
    streamerAction: "Streamer-Dashboard",
    ratingTitle: "Wertungen verbinden",
    ratingDescription:
      "Verbinde Konten von Streaming-Plattformen, Chess.com und Lichess, um deine Wertungen zu verwalten.",
    viewerAction: "Zuschauer-Dashboard"
  },
  login: {
    title: "Anmeldung als {{role}}",
    chzzk: "Mit Chzzk fortfahren",
    twitch: "Mit Twitch fortfahren"
  },
  streamer: {
    title: "Übertragungs-Overlay",
    preview: "Chatvorschau"
  },
  viewer: {
    title: "Kontoverbindungen"
  },
  route: {
    loading: "Seite wird geladen",
    notFound: "Seite nicht gefunden",
    home: "Zurück zur Startseite"
  },
  customCssGuide: {
    title: "Anleitung für benutzerdefiniertes CSS",
    intro:
      "Verwende die vom Overlay bereitgestellten Klassen und Datenattribute, um das Aussehen des Chats anzupassen. Dein CSS wird identisch auf die Vorschau und die Browserquelle angewendet.",
    back: "Zurück zum Streamer-Dashboard",
    selectors: {
      title: "Unterstützte Selektoren",
      selector: "Selektor",
      target: "Ziel",
      items: {
        overlay: "Der gesamte Overlay-Bereich",
        messageList: "Die Liste der Chatnachrichten",
        message: "Ein einzelnes Chatnachrichtenfeld",
        metadata: "Plattformabzeichen, Wertungsabzeichen und Nickname",
        platformBadges: "Die Gruppe der Plattformabzeichen",
        platformBadge: "Ein einzelnes Chzzk- oder Twitch-Abzeichenbild",
        ratingBadge: "Der äußere Bereich eines Chess.com- oder Lichess-Wertungsabzeichens",
        ratingBadgeContent: "Symbol und Zahl des Wertungsabzeichens",
        nickname: "Der Nickname des Chatverfassers",
        content: "Der Inhalt der Chatnachricht",
        emote: "Ein Emote-Bild innerhalb einer Chatnachricht"
      }
    },
    attributes: { title: "Datenattribute" },
    variables: {
      title: "CSS-Variablen",
      description:
        "Diese enthalten aus den Darstellungseinstellungen berechnete Werte. Lies sie mit var(--name) aus oder überschreibe sie auf unterstützten Overlay-Elementen."
    },
    examples: {
      title: "Beispiele",
      roles: "Stil nach Zuschauerrolle",
      ratings: "Stile für Wertungsabzeichen",
      bubble: "Sprechblasen-Zeiger"
    },
    limits: {
      title: "Einschränkungen",
      size: "CSS ist in UTF-8 auf 20 KB begrenzt.",
      selectors: "Selektoren müssen mit einer unterstützten Overlay-Klasse beginnen.",
      resources: "url(), externe Bilder und externe Ressourcen sind nicht zulässig.",
      atRules: "At-Regeln wie @import, @font-face und @keyframes sind nicht zulässig.",
      disabled: "Wenn benutzerdefiniertes CSS deaktiviert wird, bleibt der Inhalt erhalten, wird aber nicht auf das Overlay angewendet."
    }
  },
  badgePreference: {
    default: "Standardabzeichen",
    error: "Fehler bei der Abzeichenauswahl",
    loadFailed: "Abzeicheneinstellungen konnten nicht geladen werden.",
    saveFailed: "Das Abzeichen konnte nicht geändert werden."
  },
  chessAccount: {
    loading: "Kontoinformationen werden geprüft.",
    disconnect: "Verbindung trennen",
    lastUpdated: "Zuletzt aktualisiert: {{date}}",
    refreshInMinutes: "Aktualisierung in {{count}} Min.",
    games_one: "{{count}} Partie",
    games_other: "{{count}} Partien",
    highestApplied: "Höchste Wertung wird verwendet",
    noSupportedRatings: "Es wurden keine Wertungen für unterstützte Bedenkzeiten gefunden.",
    requestFailed: "Die Anfrage konnte nicht abgeschlossen werden."
  },
  chesscom: {
    title: "Chess.com-Konto",
    description: "Lädt Rapid-, Blitz- und Bullet-Wertungen.",
    refreshTitle: "Chess.com-Wertungen aktualisieren",
    disconnectConfirm:
      "Chess.com-Konto trennen und das aktuelle Chatabzeichen entfernen?",
    username: "Chess.com-Benutzername",
    lookup: "Konto suchen",
    verified: "Die Inhaberschaft des Chess.com-Kontos wurde bestätigt.",
    unverifiedNotice:
      "Diese Wertung erscheint erst nach der Bestätigung der Inhaberschaft in Chat-Overlays.",
    createCode: "Bestätigungscode erstellen",
    locationInstruction:
      "Gib den folgenden Code exakt in das Feld „Location“ deines Chess.com-Profils ein und speichere ihn.",
    copyCode: "Bestätigungscode kopieren",
    openProfileSettings: "Profileinstellungen öffnen",
    confirmVerification: "Gespeichert, jetzt bestätigen",
    expiryNotice:
      "Der Code ist 48 Stunden gültig. Der Cache der öffentlichen Chess.com-API kann Profiländerungen verzögern."
  },
  lichess: {
    title: "Lichess-Konto",
    description: "Lädt Bullet-, Blitz-, Rapid- und Classical-Wertungen.",
    refreshTitle: "Lichess-Wertungen aktualisieren",
    disconnectConfirm:
      "Lichess-Konto trennen und das aktuelle Abzeichen entfernen?",
    connect: "Mit Lichess verbinden",
    connected: "Das Lichess-Konto wurde verbunden.",
    expired: "Die Lichess-Verbindungsanfrage ist abgelaufen. Bitte versuche es erneut.",
    failed: "Das Lichess-Konto konnte nicht verbunden werden. Bitte versuche es erneut.",
    verified: "Die Inhaberschaft des Lichess-Kontos wurde bestätigt."
  },
  platformBadge: "Plattformabzeichen",
  platforms: {
    title: "Streaming-Plattformen",
    loading: "Verbundene Konten werden geprüft.",
    noAccount: "Kein verbundenes Konto",
    permissionRequired: "Chatberechtigung erforderlich",
    permissionStatus: "Berechtigung erforderlich",
    grantPermission: "Autorisieren",
    revokePermission: "Widerrufen",
    reconnectRequired: "Erneute Verbindung erforderlich",
    connecting: "Verbindung wird hergestellt",
    alternativeRequired:
      "Verbinde ein anderes Anmeldekonto, bevor du dieses Konto trennst.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Chzzk-Konto trennen und den Chat-Zugriff widerrufen?",
      disconnectPermissionConfirm:
        "Chzzk-Chat-Zugriff widerrufen? Das Chzzk-Anmeldekonto bleibt verbunden.",
      accountDisconnected: "Chzzk wurde getrennt.",
      permissionDisconnected: "Der Chzzk-Chat-Zugriff wurde widerrufen.",
      connectAccount: "Chzzk-Konto verbinden",
      disconnectAccount: "Chzzk trennen",
      connectPermission: "Chzzk-Chat-Zugriff autorisieren",
      disconnectPermission: "Chzzk-Chat-Zugriff widerrufen",
      connected: "Das Chzzk-Konto wurde verbunden.",
      streamerConnected:
        "Chzzk und der zugehörige Chat-Zugriff wurden verbunden.",
      conflict:
        "Dieses Chzzk-Konto ist bereits mit einem anderen EloBadge-Benutzer verbunden.",
      failed: "Das Chzzk-Konto konnte nicht verbunden werden. Bitte versuche es erneut.",
      streamerFailed:
        "Die Chzzk-Verbindung oder Chat-Autorisierung konnte nicht abgeschlossen werden."
    },
    twitch: {
      disconnectAccountConfirm:
        "Twitch-Konto trennen und den Chat-Zugriff widerrufen?",
      disconnectPermissionConfirm:
        "Twitch-Chat-Zugriff widerrufen? Das Twitch-Anmeldekonto bleibt verbunden.",
      accountDisconnected: "Twitch wurde getrennt.",
      permissionDisconnected: "Der Twitch-Chat-Zugriff wurde widerrufen.",
      connectAccount: "Twitch-Konto verbinden",
      disconnectAccount: "Twitch trennen",
      connectPermission: "Twitch-Chat-Zugriff autorisieren",
      disconnectPermission: "Twitch-Chat-Zugriff widerrufen",
      connected: "Das Twitch-Konto wurde verbunden.",
      streamerConnected:
        "Twitch und der zugehörige Chat-Zugriff wurden verbunden.",
      denied: "Die Twitch-Verbindungsanfrage wurde abgebrochen.",
      expired: "Die Twitch-Verbindungsanfrage ist abgelaufen. Bitte versuche es erneut.",
      conflict:
        "Dieses Twitch-Konto ist bereits mit einem anderen EloBadge-Benutzer verbunden.",
      failed: "Das Twitch-Konto konnte nicht verbunden werden. Bitte versuche es erneut.",
      streamerFailed:
        "Die Twitch-Verbindung oder Chat-Autorisierung konnte nicht abgeschlossen werden."
    },
    loadFailed: "Verbindungen zu Streaming-Plattformen konnten nicht geladen werden."
  },
  overlay: {
    title: "Browserquellen-Overlay",
    description:
      "Funktioniert mit OBS Studio, XSplit und anderer Streaming-Software, die Browserquellen unterstützt. Für eine Breite von 600 px optimiert; passe die Höhe an deine Szene an.",
    signInFirst: "Melde dich oben zuerst mit einem Konto einer Streaming-Plattform an.",
    createUrl: "URL erstellen",
    urlLabel: "Browserquellen-URL",
    showUrl: "URL anzeigen",
    hideUrl: "URL ausblenden",
    copyUrl: "URL kopieren",
    copied: "Kopiert",
    enable: "Aktivieren",
    disable: "Deaktivieren",
    rotate: "URL erneuern",
    rotateConfirm:
      "Aktuelle Overlay-URL widerrufen und eine neue ausstellen?",
    general: "Allgemein",
    badges: "Abzeichen",
    background: "Chathintergrund",
    colors: "Chatfarben",
    fonts: "Chatschrift",
    maxWidth: "Maximale Chatbreite",
    alignment: "Chatausrichtung",
    alignmentOption: {
      left: "Linksbündig",
      center: "Zentriert",
      right: "Rechtsbündig"
    },
    messageLayout: "Anordnung von Nickname und Nachricht",
    messageLayoutOption: {
      inline: "Eine Zeile",
      stacked: "Neue Zeile",
      aligned: "Am Anfang ausgerichtet",
      individual: "Nach Nachrichtenbereich ausgerichtet"
    },
    nicknameSeparatorVisible: "Doppelpunkt (:) nach dem Nickname anzeigen",
    alignedNicknameRightAligned: "Nickname rechtsbündig ausrichten",
    messageBoxFilled: "Chatfeld ausfüllen",
    customCssEnabled: "Benutzerdefiniertes CSS verwenden",
    customCss: "Benutzerdefiniertes CSS",
    customCssGuide: "Anleitung für benutzerdefiniertes CSS",
    restoreCustomCss: "Zuletzt gespeichertes CSS wiederherstellen",
    restoreCustomCssConfirm: "Das zuletzt gespeicherte benutzerdefinierte CSS wiederherstellen?",
    clearCustomCss: "Benutzerdefiniertes CSS leeren",
    clearCustomCssConfirm: "Den gesamten benutzerdefinierten CSS-Inhalt löschen?",
    unsavedChangesConfirm: "Es gibt nicht gespeicherte Darstellungseinstellungen. Seite verlassen?",
    customCssPresets: "CSS-Beispiel laden",
    applyCustomCssPresetConfirm: "Aktuelles CSS durch das Beispiel „{{name}}“ ersetzen?",
    customCssPreset: {
      defaults: "Standardstil",
      bubble: "Sprechblase",
      transparent: "Transparenter Chat",
      nickname: "Nickname hervorheben"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Benutzerdefiniertes CSS darf höchstens 20 KB groß sein.",
    customCssError: {
      invalid_syntax: "Überprüfe die CSS-Syntax.",
      at_rule_not_allowed: "At-Regeln wie @import und @font-face sind nicht zulässig.",
      external_resource_not_allowed: "Externe URLs, Bilder und Ressourcen sind nicht zulässig.",
      selector_not_allowed: "Selektoren müssen innerhalb unterstützter EloBadge-Overlay-Elemente bleiben.",
      property_not_allowed: "Das CSS enthält eine aus Sicherheitsgründen gesperrte Eigenschaft.",
      invalid_property_value: "Das CSS enthält einen von Browsern nicht unterstützten Eigenschaftswert.",
      too_large: "Benutzerdefiniertes CSS darf höchstens 20 KB groß sein."
    },
    duration: "Anzeigedauer der Nachricht",
    keep: "Unbegrenzt anzeigen",
    seconds_one: "{{count}} Sekunde",
    seconds_other: "{{count}} Sekunden",
    defaultSuffix: " (Standard)",
    ratingBadge: "Schachwertungsabzeichen",
    ratingPolicy: {
      viewer_choice: "Zuschauerauswahl verwenden",
      chesscom_only: "Nur Chess.com",
      lichess_only: "Nur Lichess",
      hidden: "Ausgeblendet"
    },
    forcedProviderNotice:
      "Wenn eine bestimmte Plattform ausgewählt ist, erhalten Zuschauer ohne dieses Konto kein Schachabzeichen.",
    allPlatformBadges: "Alle anzeigen",
    platformBadges: {
      chzzk: "Chzzk-Abzeichen",
      twitch: "Twitch-Abzeichen"
    },
    visibleBadges: "Sichtbare Abzeichen",
    badgeKind: {
      role: "Streamer und Manager",
      subscription: "Abonnement",
      donation: "Spende",
      subscription_gift: "Geschenkabonnement",
      unknown: "Sonstige"
    },
    twitchBadgeKind: {
      role: "Streamer, Moderator und VIP",
      subscription: "Abonnent und Gründer",
      donation: "Bits",
      subscription_gift: "Geschenkabonnement",
      unknown: "Global und sonstige"
    },
    backgroundVisible: "Hintergrund anzeigen",
    backgroundColor: "Hintergrundfarbe",
    customBackgroundColor: "Eigene Hintergrundfarbe auswählen",
    backgroundOpacity: "Hintergrunddeckkraft",
    nicknameVisible: "Nickname anzeigen",
    nicknameColor: "Nickname-Farbe",
    messageColor: "Nachrichtenfarbe",
    colorMode: {
      fixed: "Einheitliche Farbe",
      by_user: "Nach Benutzer",
      by_role: "Nach Rolle",
      message_by_role: "Nach Typ"
    },
    customNicknameColor: "Eigene Nickname-Farbe auswählen",
    customMessageColor: "Eigene Nachrichtenfarbe auswählen",
    role: {
      streamer: "Streamer",
      manager: "Manager",
      subscriber: "Abonnent",
      donator: "Spender",
      viewer: "Zuschauer"
    },
    font: "Schriftart",
    systemFont: "Systemstandard",
    fontPreview: "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.",
    fontSize: "Schriftgröße",
    fontWeight: "Schriftstärke",
    lineHeight: "Zeilenabstand",
    save: "Darstellung speichern",
    reset: "Auf Standard zurücksetzen",
    resetConfirm: "Alle Chatdarstellungseinstellungen auf Standard zurücksetzen?",
    requestFailed: "Die Anfrage ist fehlgeschlagen."
  },
  preview: {
    frameLabel: "Chat-Overlay-Vorschau",
    empty: "Noch keine Vorschaunachrichten",
    nickname: "Nickname",
    nicknamePlaceholder: "Zuschauer-Nickname",
    rating: "Wertung",
    optional: "Optional",
    role: "Rolle",
    roleLabel: "Rolle in der Chatvorschau",
    badgeType: "Abzeichentyp",
    badgeLabel: "{{provider}}-Abzeichen",
    message: "Nachricht",
    messagePlaceholder: "Vorschaunachricht eingeben",
    add: "Vorschau hinzufügen"
  },
  authCallback: {
    missingCode: "Der Anmeldecode fehlt.",
    loginFailed: "Anmeldung fehlgeschlagen.",
    loggingIn: "Anmeldung mit dem Konto der Streaming-Plattform läuft.",
    success: "Konto verbunden",
    successDescription:
      "{{name}} wurde im Modus „{{role}}“ verbunden.",
    continue: "Fortfahren",
    failure: "Kontoverbindung fehlgeschlagen",
    invalidCode: "Der Anmeldecode ist abgelaufen oder ungültig."
  },
  api: {
    signInRequired: "Du musst dich bei EloBadge anmelden.",
    requestFailed: "Die Anfrage konnte nicht abgeschlossen werden.",
    serverLoginFailed: "Die Serveranmeldung konnte nicht bestätigt werden.",
    adminRequired: "Dieses Konto hat keinen Administratorzugriff.",
    overlayLoadFailed: "Das Overlay konnte nicht geladen werden."
  },
  accountDeletion: {
    confirmation: "KONTO LÖSCHEN",
    title: "Konto löschen",
    description:
      "Lösche dauerhaft deine verbundenen Schachdaten und Übertragungseinstellungen.",
    action: "EloBadge-Konto löschen",
    dialogTitle: "Dein EloBadge-Konto löschen?",
    warning:
      "Verbindungen zu Chess.com und Lichess, Wertungen, Overlay-URLs und Darstellungseinstellungen werden gelöscht. Bestehende Browserquellen-URLs funktionieren sofort nicht mehr.",
    close: "Dialog zur Kontolöschung schließen",
    instruction: "Gib zum Fortfahren {{text}} ein.",
    deleting: "Wird gelöscht",
    permanentDelete: "Dauerhaft löschen",
    failed: "Das EloBadge-Konto konnte nicht gelöscht werden."
  },
  privacy: {
    koreanOriginalNotice:
      "Diese Datenschutzerklärung wird nach koreanischem Recht in koreanischer Sprache als maßgebliche Fassung bereitgestellt."
  }
} as const;

export default de;
