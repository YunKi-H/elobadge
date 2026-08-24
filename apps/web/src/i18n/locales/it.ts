const it = {
  common: {
    streamer: "Streamer",
    viewer: "Spettatore",
    signOut: "Esci",
    signingOut: "Disconnessione",
    loading: "Caricamento",
    connect: "Collega",
    disconnect: "Scollega",
    cancel: "Annulla",
    close: "Chiudi",
    retry: "Riprova",
    refresh: "Aggiorna",
    refreshing: "Aggiornamento",
    error: "Errore",
    connected: "Collegato",
    notConnected: "Non collegato"
  },
  language: {
    label: "Lingua"
  },
  app: {
    mainNavigation: "Navigazione principale",
    signOutFailed: "Impossibile uscire. Riprova.",
    support: "Contatti e segnalazioni di errori:",
    privacy: "Informativa sulla privacy"
  },
  home: {
    description:
      "Mostra il rating scacchistico degli spettatori accanto ai messaggi della chat di Chzzk e Twitch.",
    broadcastTitle: "Impostazioni della trasmissione",
    broadcastDescription:
      "Collega le chat delle trasmissioni e gestisci un URL universale per la sorgente browser.",
    streamerAction: "Dashboard streamer",
    ratingTitle: "Collega i rating",
    ratingDescription:
      "Collega gli account della piattaforma di streaming, Chess.com e Lichess per gestire i tuoi rating.",
    viewerAction: "Dashboard spettatore"
  },
  login: {
    title: "Accesso {{role}}",
    chzzk: "Continua con Chzzk",
    twitch: "Continua con Twitch"
  },
  streamer: {
    title: "Overlay della trasmissione",
    preview: "Anteprima della chat"
  },
  viewer: {
    title: "Collegamenti degli account"
  },
  route: {
    loading: "Caricamento della pagina",
    notFound: "Pagina non trovata",
    home: "Torna alla pagina iniziale"
  },
  customCssGuide: {
    title: "Guida al CSS personalizzato",
    intro:
      "Usa le classi e gli attributi dati esposti dall'overlay per personalizzare l'aspetto della chat. Il CSS viene applicato allo stesso modo all'anteprima e alla sorgente browser.",
    back: "Torna alla dashboard streamer",
    selectors: {
      title: "Selettori supportati",
      selector: "Selettore",
      target: "Elemento",
      items: {
        overlay: "L'intera area dell'overlay",
        messageList: "L'elenco dei messaggi della chat",
        message: "Un singolo riquadro di messaggio",
        metadata: "Badge della piattaforma, badge del rating e nome utente",
        platformBadges: "Il gruppo di badge della piattaforma",
        platformBadge: "Una singola immagine di badge Chzzk o Twitch",
        ratingBadge: "L'elemento esterno del badge di rating Chess.com o Lichess",
        ratingBadgeContent: "L'icona e il numero del badge di rating",
        nickname: "Il nome dell'autore del messaggio",
        content: "Il contenuto del messaggio della chat",
        emote: "Un'immagine emote all'interno di un messaggio"
      }
    },
    attributes: { title: "Attributi dati" },
    variables: {
      title: "Variabili CSS",
      description:
        "Contengono i valori calcolati dalle impostazioni dell'aspetto. Leggili con var(--nome) oppure sovrascrivili negli elementi supportati dell'overlay."
    },
    examples: {
      title: "Esempi",
      roles: "Stile in base al ruolo dello spettatore",
      ratings: "Stili dei badge di rating",
      bubble: "Coda del fumetto"
    },
    limits: {
      title: "Limitazioni",
      size: "Il CSS è limitato a 20 KB in UTF-8.",
      selectors: "I selettori devono iniziare da una classe dell'overlay supportata.",
      resources: "url(), immagini esterne e risorse esterne non sono consentiti.",
      atRules: "Le regole come @import, @font-face e @keyframes non sono consentite.",
      disabled: "La disattivazione del CSS personalizzato ne conserva il contenuto, ma non lo applica all'overlay."
    }
  },
  badgePreference: {
    default: "Badge predefinito",
    error: "Errore nella selezione del badge",
    loadFailed: "Impossibile caricare le impostazioni del badge.",
    saveFailed: "Impossibile modificare il badge."
  },
  chessAccount: {
    loading: "Verifica delle informazioni dell'account.",
    disconnect: "Scollega",
    lastUpdated: "Ultimo aggiornamento: {{date}}",
    refreshInMinutes: "Aggiornamento tra {{count}} min",
    games_one: "{{count}} partita",
    games_other: "{{count}} partite",
    highestApplied: "Rating più alto in uso",
    noSupportedRatings: "Non è stato trovato alcun rating per i tempi di gioco supportati.",
    requestFailed: "Impossibile completare la richiesta."
  },
  chesscom: {
    title: "Account Chess.com",
    description: "Carica i rating Rapid, Blitz e Bullet.",
    refreshTitle: "Aggiorna i rating Chess.com",
    disconnectConfirm:
      "Scollegare l'account Chess.com e rimuovere il badge attuale dalla chat?",
    username: "Nome utente Chess.com",
    lookup: "Cerca account",
    verified: "La proprietà dell'account Chess.com è stata verificata.",
    unverifiedNotice:
      "Questo rating non apparirà negli overlay della chat finché la proprietà dell'account non sarà verificata.",
    createCode: "Crea codice di verifica",
    locationInstruction:
      "Inserisci esattamente il codice seguente nel campo Località (Location) del tuo profilo Chess.com e salva.",
    copyCode: "Copia codice di verifica",
    openProfileSettings: "Apri le impostazioni del profilo",
    confirmVerification: "Ho salvato, verifica ora",
    expiryNotice:
      "Il codice è valido per 48 ore. La cache dell'API pubblica di Chess.com può ritardare la visualizzazione delle modifiche al profilo."
  },
  lichess: {
    title: "Account Lichess",
    description: "Carica i rating Bullet, Blitz, Rapid e Classical.",
    refreshTitle: "Aggiorna i rating Lichess",
    disconnectConfirm:
      "Scollegare l'account Lichess e rimuovere il badge attuale?",
    connect: "Collega con Lichess",
    connected: "L'account Lichess è stato collegato.",
    expired: "La richiesta di collegamento a Lichess è scaduta. Riprova.",
    failed: "Impossibile collegare l'account Lichess. Riprova.",
    verified: "La proprietà dell'account Lichess è stata verificata."
  },
  platformBadge: "Badge della piattaforma",
  platforms: {
    title: "Piattaforme di streaming",
    loading: "Verifica degli account collegati.",
    noAccount: "Nessun account collegato",
    permissionRequired: "È necessaria l'autorizzazione alla chat",
    permissionStatus: "Autorizzazione necessaria",
    grantPermission: "Autorizza",
    revokePermission: "Revoca",
    reconnectRequired: "È necessario ricollegarsi",
    connecting: "Collegamento",
    alternativeRequired:
      "Collega un altro account di accesso prima di scollegare questo.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Scollegare l'account Chzzk e revocare l'accesso alla chat?",
      disconnectPermissionConfirm:
        "Revocare l'accesso alla chat Chzzk? L'account di accesso Chzzk rimarrà collegato.",
      accountDisconnected: "Chzzk è stato scollegato.",
      permissionDisconnected: "L'accesso alla chat Chzzk è stato revocato.",
      connectAccount: "Collega account Chzzk",
      disconnectAccount: "Scollega Chzzk",
      connectPermission: "Autorizza l'accesso alla chat Chzzk",
      disconnectPermission: "Revoca l'accesso alla chat Chzzk",
      connected: "L'account Chzzk è stato collegato.",
      streamerConnected:
        "Chzzk e il relativo accesso alla chat sono stati collegati.",
      conflict:
        "Questo account Chzzk è già collegato a un altro utente EloBadge.",
      failed: "Impossibile collegare l'account Chzzk. Riprova.",
      streamerFailed:
        "Impossibile completare il collegamento a Chzzk o l'autorizzazione della chat."
    },
    twitch: {
      disconnectAccountConfirm:
        "Scollegare l'account Twitch e revocare l'accesso alla chat?",
      disconnectPermissionConfirm:
        "Revocare l'accesso alla chat Twitch? L'account di accesso Twitch rimarrà collegato.",
      accountDisconnected: "Twitch è stato scollegato.",
      permissionDisconnected: "L'accesso alla chat Twitch è stato revocato.",
      connectAccount: "Collega account Twitch",
      disconnectAccount: "Scollega Twitch",
      connectPermission: "Autorizza l'accesso alla chat Twitch",
      disconnectPermission: "Revoca l'accesso alla chat Twitch",
      connected: "L'account Twitch è stato collegato.",
      streamerConnected:
        "Twitch e il relativo accesso alla chat sono stati collegati.",
      denied: "La richiesta di collegamento a Twitch è stata annullata.",
      expired: "La richiesta di collegamento a Twitch è scaduta. Riprova.",
      conflict:
        "Questo account Twitch è già collegato a un altro utente EloBadge.",
      failed: "Impossibile collegare l'account Twitch. Riprova.",
      streamerFailed:
        "Impossibile completare il collegamento a Twitch o l'autorizzazione della chat."
    },
    loadFailed: "Impossibile caricare i collegamenti alle piattaforme di streaming."
  },
  overlay: {
    title: "Overlay della sorgente browser",
    description:
      "Funziona con OBS Studio, XSplit e altri software di streaming che supportano le sorgenti browser. Ottimizzato per una larghezza di 600 px; imposta l'altezza in base alla scena.",
    signInFirst: "Accedi prima con uno degli account della piattaforma di streaming qui sopra.",
    createUrl: "Crea URL",
    urlLabel: "URL della sorgente browser",
    showUrl: "Mostra URL",
    hideUrl: "Nascondi URL",
    copyUrl: "Copia URL",
    copied: "Copiato",
    enable: "Attiva",
    disable: "Disattiva",
    rotate: "Cambia URL",
    rotateConfirm:
      "Revocare l'URL attuale dell'overlay e generarne uno nuovo?",
    general: "Generale",
    badges: "Badge",
    background: "Sfondo della chat",
    colors: "Colori della chat",
    fonts: "Carattere della chat",
    maxWidth: "Larghezza massima della chat",
    alignment: "Allineamento della chat",
    alignmentOption: {
      left: "Allinea a sinistra",
      center: "Allinea al centro",
      right: "Allinea a destra"
    },
    messageLayout: "Disposizione del nome e del messaggio",
    messageLayoutOption: {
      inline: "Riga singola",
      stacked: "Nuova riga",
      aligned: "Inizio allineato",
      individual: "Allineamento per messaggio"
    },
    nicknameSeparatorVisible: "Mostra i due punti (:) dopo il nome",
    alignedNicknameRightAligned: "Allinea il nome a destra",
    messageBoxFilled: "Riempi il riquadro della chat",
    customCssEnabled: "Usa CSS personalizzato",
    customCss: "CSS personalizzato",
    customCssGuide: "Guida al CSS personalizzato",
    restoreCustomCss: "Ripristina l'ultimo CSS salvato",
    restoreCustomCssConfirm: "Ripristinare l'ultimo CSS personalizzato salvato?",
    clearCustomCss: "Cancella CSS personalizzato",
    clearCustomCssConfirm: "Cancellare tutto il contenuto del CSS personalizzato?",
    unsavedChangesConfirm: "Sono presenti impostazioni dell'aspetto non salvate. Uscire dalla pagina?",
    customCssPresets: "Carica esempio CSS",
    applyCustomCssPresetConfirm: "Sostituire il CSS attuale con l'esempio «{{name}}»?",
    customCssPreset: {
      defaults: "Stile predefinito",
      bubble: "Fumetto",
      transparent: "Chat trasparente",
      nickname: "Nome evidenziato"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Il CSS personalizzato deve avere una dimensione massima di 20 KB.",
    customCssError: {
      invalid_syntax: "Controlla la sintassi CSS.",
      at_rule_not_allowed: "Le regole come @import e @font-face non sono consentite.",
      external_resource_not_allowed: "Gli URL esterni e le risorse di immagini non sono consentiti.",
      selector_not_allowed: "I selettori devono rimanere all'interno degli elementi supportati dell'overlay EloBadge.",
      property_not_allowed: "Il CSS contiene una proprietà bloccata per motivi di sicurezza.",
      invalid_property_value: "Il CSS contiene un valore di proprietà non supportato dai browser.",
      too_large: "Il CSS personalizzato deve avere una dimensione massima di 20 KB."
    },
    duration: "Durata del messaggio",
    keep: "Mantieni sempre",
    seconds_one: "{{count}} secondo",
    seconds_other: "{{count}} secondi",
    defaultSuffix: " (predefinito)",
    ratingBadge: "Badge del rating scacchistico",
    ratingPolicy: {
      viewer_choice: "Usa la preferenza dello spettatore",
      chesscom_only: "Solo Chess.com",
      lichess_only: "Solo Lichess",
      hidden: "Nascosto"
    },
    forcedProviderNotice:
      "Quando viene selezionata una piattaforma specifica, gli spettatori senza un account su tale piattaforma non ricevono un badge scacchistico.",
    allPlatformBadges: "Mostra tutti",
    platformBadges: {
      chzzk: "Badge Chzzk",
      twitch: "Badge Twitch"
    },
    visibleBadges: "Badge visibili",
    badgeKind: {
      role: "Streamer e amministratore",
      subscription: "Abbonamento",
      donation: "Donazione",
      subscription_gift: "Abbonamento regalato",
      unknown: "Altro"
    },
    twitchBadgeKind: {
      role: "Streamer, moderatore e VIP",
      subscription: "Abbonato e fondatore",
      donation: "Bits",
      subscription_gift: "Abbonamento regalato",
      unknown: "Globale e altro"
    },
    backgroundVisible: "Mostra sfondo",
    backgroundColor: "Colore dello sfondo",
    customBackgroundColor: "Scegli un colore di sfondo personalizzato",
    backgroundOpacity: "Opacità dello sfondo",
    nicknameVisible: "Mostra nome",
    nicknameColor: "Colore del nome",
    messageColor: "Colore del messaggio",
    colorMode: {
      fixed: "Colore singolo",
      by_user: "Per utente",
      by_role: "Per ruolo",
      message_by_role: "Per tipo"
    },
    customNicknameColor: "Scegli un colore personalizzato per il nome",
    customMessageColor: "Scegli un colore personalizzato per il messaggio",
    role: {
      streamer: "Streamer",
      manager: "Amministratore",
      subscriber: "Abbonato",
      donator: "Donatore",
      viewer: "Spettatore"
    },
    font: "Carattere",
    systemFont: "Carattere predefinito di sistema",
    fontPreview: "Quel vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja!",
    fontSize: "Dimensione del carattere",
    fontWeight: "Spessore del carattere",
    lineHeight: "Interlinea",
    save: "Salva aspetto",
    reset: "Ripristina impostazioni predefinite",
    resetConfirm: "Ripristinare tutte le impostazioni dell'aspetto della chat?",
    requestFailed: "La richiesta non è riuscita."
  },
  preview: {
    frameLabel: "Anteprima dell'overlay della chat",
    empty: "Nessun messaggio di anteprima",
    nickname: "Nome",
    nicknamePlaceholder: "Nome dello spettatore",
    rating: "Rating",
    optional: "Facoltativo",
    role: "Ruolo",
    roleLabel: "Ruolo nell'anteprima della chat",
    badgeType: "Tipo di badge",
    badgeLabel: "Badge {{provider}}",
    message: "Messaggio",
    messagePlaceholder: "Inserisci un messaggio di anteprima",
    add: "Aggiungi anteprima"
  },
  authCallback: {
    missingCode: "Manca il codice di accesso.",
    loginFailed: "Accesso non riuscito.",
    loggingIn: "Accesso con l'account della piattaforma di streaming.",
    success: "Account collegato",
    successDescription:
      "{{name}} è stato collegato in modalità {{role}}.",
    continue: "Continua",
    failure: "Collegamento dell'account non riuscito",
    invalidCode: "Il codice di accesso è scaduto o non è valido."
  },
  api: {
    signInRequired: "Devi accedere a EloBadge.",
    requestFailed: "Impossibile completare la richiesta.",
    serverLoginFailed: "Impossibile verificare l'accesso al server.",
    adminRequired: "Questo account non dispone dell'accesso amministratore.",
    overlayLoadFailed: "Impossibile caricare l'overlay."
  },
  accountDeletion: {
    confirmation: "ELIMINA ACCOUNT",
    title: "Elimina account",
    description:
      "Elimina definitivamente i dati scacchistici collegati e le impostazioni della trasmissione.",
    action: "Elimina account EloBadge",
    dialogTitle: "Eliminare il tuo account EloBadge?",
    warning:
      "I collegamenti a Chess.com e Lichess, i rating, gli URL degli overlay e le impostazioni dell'aspetto verranno eliminati. Gli URL esistenti delle sorgenti browser smetteranno immediatamente di funzionare.",
    close: "Chiudi la finestra di eliminazione dell'account",
    instruction: "Inserisci {{text}} per continuare.",
    deleting: "Eliminazione",
    permanentDelete: "Elimina definitivamente",
    failed: "Impossibile eliminare l'account EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "La presente Informativa sulla privacy è fornita in coreano come versione legalmente vincolante ai sensi della legge sudcoreana."
  }
} as const;

export default it;
