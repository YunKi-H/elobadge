const fr = {
  common: {
    streamer: "Streamer",
    viewer: "Spectateur",
    signOut: "Se déconnecter",
    signingOut: "Déconnexion",
    loading: "Chargement",
    connect: "Connecter",
    disconnect: "Déconnecter",
    cancel: "Annuler",
    close: "Fermer",
    retry: "Réessayer",
    refresh: "Actualiser",
    refreshing: "Actualisation",
    error: "Erreur",
    connected: "Connecté",
    notConnected: "Non connecté"
  },
  language: {
    label: "Langue"
  },
  app: {
    mainNavigation: "Navigation principale",
    signOutFailed: "Impossible de se déconnecter. Veuillez réessayer.",
    support: "Contact et signalement de bugs :",
    privacy: "Politique de confidentialité"
  },
  home: {
    description:
      "Affichez le classement d'échecs des spectateurs à côté de leurs messages sur Chzzk et Twitch.",
    broadcastTitle: "Paramètres de diffusion",
    broadcastDescription:
      "Connectez les chats de diffusion et gérez une URL universelle de source navigateur.",
    streamerAction: "Tableau de bord streamer",
    ratingTitle: "Connecter les classements",
    ratingDescription:
      "Connectez vos comptes de plateforme de diffusion, Chess.com et Lichess pour gérer vos classements.",
    viewerAction: "Tableau de bord spectateur"
  },
  login: {
    title: "Connexion {{role}}",
    chzzk: "Continuer avec Chzzk",
    twitch: "Continuer avec Twitch"
  },
  streamer: {
    title: "Overlay de diffusion",
    preview: "Aperçu du chat"
  },
  viewer: {
    title: "Connexions des comptes"
  },
  route: {
    loading: "Chargement de la page",
    notFound: "Page introuvable",
    home: "Retour à l'accueil"
  },
  customCssGuide: {
    title: "Guide du CSS personnalisé",
    intro:
      "Utilisez les classes et les attributs de données exposés par l'overlay pour personnaliser l'apparence du chat. Votre CSS s'applique de la même manière à l'aperçu et à la source navigateur.",
    back: "Retour au tableau de bord streamer",
    selectors: {
      title: "Sélecteurs pris en charge",
      selector: "Sélecteur",
      target: "Élément ciblé",
      items: {
        overlay: "Toute la zone de l'overlay",
        messageList: "La liste des messages du chat",
        message: "Une boîte de message individuelle",
        metadata: "Les badges de plateforme, le badge de classement et le pseudo",
        platformBadges: "Le groupe de badges de plateforme",
        platformBadge: "Une image de badge Chzzk ou Twitch",
        ratingBadge: "Le contour du badge de classement Chess.com ou Lichess",
        ratingBadgeContent: "L'icône et le nombre du badge de classement",
        nickname: "Le pseudo de l'auteur du message",
        content: "Le contenu du message",
        emote: "Une émoticône dans un message"
      }
    },
    attributes: { title: "Attributs de données" },
    variables: {
      title: "Variables CSS",
      description:
        "Elles contiennent les valeurs calculées à partir des paramètres d'apparence. Lisez-les avec var(--nom) ou remplacez-les sur les éléments pris en charge de l'overlay."
    },
    examples: {
      title: "Exemples",
      roles: "Style selon le rôle du spectateur",
      ratings: "Styles des badges de classement",
      bubble: "Pointe de bulle de dialogue"
    },
    limits: {
      title: "Limitations",
      size: "Le CSS est limité à 20 Ko en UTF-8.",
      selectors: "Les sélecteurs doivent commencer par une classe d'overlay prise en charge.",
      resources: "url(), les images externes et les ressources externes ne sont pas autorisées.",
      atRules: "Les règles telles que @import, @font-face et @keyframes ne sont pas autorisées.",
      disabled: "La désactivation du CSS personnalisé conserve son contenu, mais ne l'applique pas à l'overlay."
    }
  },
  badgePreference: {
    default: "Badge par défaut",
    error: "Erreur de sélection du badge",
    loadFailed: "Impossible de charger les paramètres du badge.",
    saveFailed: "Impossible de modifier le badge."
  },
  chessAccount: {
    loading: "Vérification des informations du compte.",
    disconnect: "Déconnecter",
    lastUpdated: "Dernière mise à jour : {{date}}",
    refreshInMinutes: "Actualisation dans {{count}} min",
    games_one: "{{count}} partie",
    games_other: "{{count}} parties",
    highestApplied: "Classement le plus élevé utilisé",
    noSupportedRatings: "Aucun classement pris en charge n'a été trouvé.",
    requestFailed: "Impossible de terminer la requête."
  },
  chesscom: {
    title: "Compte Chess.com",
    description: "Charge les classements Rapid, Blitz et Bullet.",
    refreshTitle: "Actualiser les classements Chess.com",
    disconnectConfirm:
      "Déconnecter le compte Chess.com et supprimer son badge actuel du chat ?",
    username: "Nom d'utilisateur Chess.com",
    lookup: "Rechercher le compte",
    verified: "La propriété du compte Chess.com est vérifiée.",
    unverifiedNotice:
      "Ce classement ne s'affichera pas dans les overlays de chat tant que la propriété du compte ne sera pas vérifiée.",
    createCode: "Créer un code de vérification",
    locationInstruction:
      "Saisissez exactement le code ci-dessous dans le champ Localisation (Location) de votre profil Chess.com, puis enregistrez.",
    copyCode: "Copier le code de vérification",
    openProfileSettings: "Ouvrir les paramètres du profil",
    confirmVerification: "J'ai enregistré, vérifier maintenant",
    expiryNotice:
      "Le code est valable 48 heures. Le cache de l'API publique de Chess.com peut retarder la prise en compte des modifications du profil."
  },
  lichess: {
    title: "Compte Lichess",
    description: "Charge les classements Bullet, Blitz, Rapid et Classique.",
    refreshTitle: "Actualiser les classements Lichess",
    disconnectConfirm:
      "Déconnecter le compte Lichess et supprimer son badge actuel ?",
    connect: "Se connecter avec Lichess",
    connected: "Le compte Lichess a été connecté.",
    expired: "La demande de connexion à Lichess a expiré. Veuillez réessayer.",
    failed: "Impossible de connecter le compte Lichess. Veuillez réessayer.",
    verified: "La propriété du compte Lichess est vérifiée."
  },
  platformBadge: "Badges de plateforme",
  platforms: {
    title: "Plateformes de diffusion",
    loading: "Vérification des comptes connectés.",
    noAccount: "Aucun compte connecté",
    permissionRequired: "Autorisation d'accès au chat requise",
    permissionStatus: "Autorisation requise",
    grantPermission: "Autoriser",
    revokePermission: "Révoquer",
    reconnectRequired: "Reconnexion requise",
    connecting: "Connexion",
    alternativeRequired:
      "Connectez un autre compte de connexion avant de déconnecter celui-ci.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Déconnecter le compte Chzzk et révoquer l'accès au chat ?",
      disconnectPermissionConfirm:
        "Révoquer l'accès au chat Chzzk ? Le compte de connexion Chzzk restera connecté.",
      accountDisconnected: "Chzzk a été déconnecté.",
      permissionDisconnected: "L'accès au chat Chzzk a été révoqué.",
      connectAccount: "Connecter un compte Chzzk",
      disconnectAccount: "Déconnecter Chzzk",
      connectPermission: "Autoriser l'accès au chat Chzzk",
      disconnectPermission: "Révoquer l'accès au chat Chzzk",
      connected: "Le compte Chzzk a été connecté.",
      streamerConnected:
        "Chzzk et son accès au chat ont été connectés.",
      conflict:
        "Ce compte Chzzk est déjà connecté à un autre utilisateur EloBadge.",
      failed: "Impossible de connecter le compte Chzzk. Veuillez réessayer.",
      streamerFailed:
        "Impossible de terminer la connexion à Chzzk ou l'autorisation du chat."
    },
    twitch: {
      disconnectAccountConfirm:
        "Déconnecter le compte Twitch et révoquer l'accès au chat ?",
      disconnectPermissionConfirm:
        "Révoquer l'accès au chat Twitch ? Le compte de connexion Twitch restera connecté.",
      accountDisconnected: "Twitch a été déconnecté.",
      permissionDisconnected: "L'accès au chat Twitch a été révoqué.",
      connectAccount: "Connecter un compte Twitch",
      disconnectAccount: "Déconnecter Twitch",
      connectPermission: "Autoriser l'accès au chat Twitch",
      disconnectPermission: "Révoquer l'accès au chat Twitch",
      connected: "Le compte Twitch a été connecté.",
      streamerConnected:
        "Twitch et son accès au chat ont été connectés.",
      denied: "La demande de connexion à Twitch a été annulée.",
      expired: "La demande de connexion à Twitch a expiré. Veuillez réessayer.",
      conflict:
        "Ce compte Twitch est déjà connecté à un autre utilisateur EloBadge.",
      failed: "Impossible de connecter le compte Twitch. Veuillez réessayer.",
      streamerFailed:
        "Impossible de terminer la connexion à Twitch ou l'autorisation du chat."
    },
    loadFailed: "Impossible de charger les connexions aux plateformes de diffusion."
  },
  overlay: {
    title: "Overlay de source navigateur",
    description:
      "Compatible avec OBS Studio, XSplit et les autres logiciels de diffusion prenant en charge les sources navigateur. Optimisé pour une largeur de 600 px ; adaptez la hauteur à votre scène.",
    signInFirst: "Connectez-vous d'abord avec un compte de plateforme de diffusion ci-dessus.",
    createUrl: "Créer l'URL",
    urlLabel: "URL de la source navigateur",
    showUrl: "Afficher l'URL",
    hideUrl: "Masquer l'URL",
    copyUrl: "Copier l'URL",
    copied: "Copiée",
    enable: "Activer",
    disable: "Désactiver",
    rotate: "Renouveler l'URL",
    rotateConfirm:
      "Révoquer l'URL actuelle de l'overlay et en générer une nouvelle ?",
    general: "Général",
    badges: "Badges",
    background: "Arrière-plan du chat",
    colors: "Couleurs du chat",
    fonts: "Police du chat",
    maxWidth: "Largeur maximale du chat",
    alignment: "Alignement du chat",
    alignmentOption: {
      left: "Aligner à gauche",
      center: "Centrer",
      right: "Aligner à droite"
    },
    messageLayout: "Disposition du pseudo et du message",
    messageLayoutOption: {
      inline: "Une seule ligne",
      stacked: "Nouvelle ligne",
      aligned: "Début aligné",
      individual: "Alignement par message"
    },
    nicknameSeparatorVisible: "Afficher les deux-points (:) après le pseudo",
    alignedNicknameRightAligned: "Aligner le pseudo à droite",
    messageBoxFilled: "Remplir la boîte de chat",
    customCssEnabled: "Utiliser le CSS personnalisé",
    customCss: "CSS personnalisé",
    customCssGuide: "Guide du CSS personnalisé",
    restoreCustomCss: "Restaurer le dernier CSS enregistré",
    restoreCustomCssConfirm: "Restaurer le dernier CSS personnalisé enregistré ?",
    clearCustomCss: "Effacer le CSS personnalisé",
    clearCustomCssConfirm: "Effacer tout le contenu du CSS personnalisé ?",
    unsavedChangesConfirm: "Certains paramètres d'apparence ne sont pas enregistrés. Quitter cette page ?",
    customCssPresets: "Charger un exemple CSS",
    applyCustomCssPresetConfirm: "Remplacer le CSS actuel par l'exemple « {{name}} » ?",
    customCssPreset: {
      defaults: "Style par défaut",
      bubble: "Bulle de dialogue",
      transparent: "Chat transparent",
      nickname: "Pseudo mis en évidence"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Le CSS personnalisé doit faire au maximum 20 Ko.",
    customCssError: {
      invalid_syntax: "Vérifiez la syntaxe CSS.",
      at_rule_not_allowed: "Les règles telles que @import et @font-face ne sont pas autorisées.",
      external_resource_not_allowed: "Les URL externes et les ressources d'image ne sont pas autorisées.",
      selector_not_allowed: "Les sélecteurs doivent rester dans les éléments d'overlay EloBadge pris en charge.",
      property_not_allowed: "Le CSS contient une propriété bloquée pour des raisons de sécurité.",
      invalid_property_value: "Le CSS contient une valeur de propriété non prise en charge par les navigateurs.",
      too_large: "Le CSS personnalisé doit faire au maximum 20 Ko."
    },
    duration: "Durée d'affichage du message",
    keep: "Conserver indéfiniment",
    seconds_one: "{{count}} seconde",
    seconds_other: "{{count}} secondes",
    defaultSuffix: " (par défaut)",
    ratingBadge: "Badge de classement aux échecs",
    ratingPolicy: {
      viewer_choice: "Utiliser le choix du spectateur",
      chesscom_only: "Chess.com uniquement",
      lichess_only: "Lichess uniquement",
      hidden: "Masqué"
    },
    forcedProviderNotice:
      "Lorsqu'une plateforme précise est sélectionnée, les spectateurs sans compte sur celle-ci ne reçoivent pas de badge d'échecs.",
    allPlatformBadges: "Tout afficher",
    platformBadges: {
      chzzk: "Badges Chzzk",
      twitch: "Badges Twitch"
    },
    visibleBadges: "Badges visibles",
    badgeKind: {
      role: "Streamer et manager",
      subscription: "Abonnement",
      donation: "Don",
      subscription_gift: "Abonnement offert",
      unknown: "Autre"
    },
    twitchBadgeKind: {
      role: "Diffuseur, modérateur et VIP",
      subscription: "Abonné et fondateur",
      donation: "Bits",
      subscription_gift: "Abonnement offert",
      unknown: "Global et autre"
    },
    backgroundVisible: "Afficher l'arrière-plan",
    backgroundColor: "Couleur de l'arrière-plan",
    customBackgroundColor: "Choisir une couleur d'arrière-plan personnalisée",
    backgroundOpacity: "Opacité de l'arrière-plan",
    nicknameVisible: "Afficher le pseudo",
    nicknameColor: "Couleur du pseudo",
    messageColor: "Couleur du message",
    colorMode: {
      fixed: "Couleur unique",
      by_user: "Par utilisateur",
      by_role: "Par rôle",
      message_by_role: "Par type"
    },
    customNicknameColor: "Choisir une couleur de pseudo personnalisée",
    customMessageColor: "Choisir une couleur de message personnalisée",
    role: {
      streamer: "Streamer",
      manager: "Manager",
      subscriber: "Abonné",
      donator: "Donateur",
      viewer: "Spectateur"
    },
    font: "Police",
    systemFont: "Police système par défaut",
    fontPreview: "Portez ce vieux whisky au juge blond qui fume.",
    fontSize: "Taille de police",
    fontWeight: "Épaisseur de police",
    lineHeight: "Interligne",
    save: "Enregistrer l'apparence",
    reset: "Rétablir les valeurs par défaut",
    resetConfirm: "Rétablir tous les paramètres d'apparence du chat par défaut ?",
    requestFailed: "La requête a échoué."
  },
  preview: {
    frameLabel: "Aperçu de l'overlay de chat",
    empty: "Aucun message d'aperçu pour le moment",
    nickname: "Pseudo",
    nicknamePlaceholder: "Pseudo du spectateur",
    rating: "Classement",
    optional: "Facultatif",
    role: "Rôle",
    roleLabel: "Rôle dans l'aperçu du chat",
    badgeType: "Type de badge",
    badgeLabel: "Badge {{provider}}",
    message: "Message",
    messagePlaceholder: "Saisissez un message d'aperçu",
    add: "Ajouter à l'aperçu"
  },
  authCallback: {
    missingCode: "Le code de connexion est manquant.",
    loginFailed: "Échec de la connexion.",
    loggingIn: "Connexion avec votre compte de plateforme de diffusion.",
    success: "Compte connecté",
    successDescription:
      "{{name}} a été connecté en mode {{role}}.",
    continue: "Continuer",
    failure: "Échec de la connexion du compte",
    invalidCode: "Le code de connexion a expiré ou n'est pas valide."
  },
  api: {
    signInRequired: "Vous devez vous connecter à EloBadge.",
    requestFailed: "La requête n'a pas pu être effectuée.",
    serverLoginFailed: "Impossible de vérifier la connexion au serveur.",
    adminRequired: "Ce compte ne dispose pas d'un accès administrateur.",
    overlayLoadFailed: "Impossible de charger l'overlay."
  },
  accountDeletion: {
    confirmation: "SUPPRIMER LE COMPTE",
    title: "Supprimer le compte",
    description:
      "Supprimez définitivement vos données d'échecs connectées et vos paramètres de diffusion.",
    action: "Supprimer le compte EloBadge",
    dialogTitle: "Supprimer votre compte EloBadge ?",
    warning:
      "Les connexions Chess.com et Lichess, les classements, les URL d'overlay et les paramètres d'apparence seront supprimés. Les URL de source navigateur existantes cesseront immédiatement de fonctionner.",
    close: "Fermer la boîte de dialogue de suppression du compte",
    instruction: "Saisissez {{text}} pour continuer.",
    deleting: "Suppression",
    permanentDelete: "Supprimer définitivement",
    failed: "Impossible de supprimer le compte EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "La présente politique de confidentialité est fournie en coréen, qui constitue la version de référence conformément au droit coréen."
  }
} as const;

export default fr;
