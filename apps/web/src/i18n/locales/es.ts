const es = {
  common: {
    streamer: "Streamer",
    viewer: "Espectador",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión",
    loading: "Cargando",
    connect: "Conectar",
    disconnect: "Desconectar",
    cancel: "Cancelar",
    close: "Cerrar",
    retry: "Intentar de nuevo",
    refresh: "Actualizar",
    refreshing: "Actualizando",
    error: "Error",
    connected: "Conectado",
    notConnected: "No conectado"
  },
  language: {
    label: "Idioma"
  },
  app: {
    mainNavigation: "Navegación principal",
    signOutFailed: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
    support: "Contacto e informe de errores:",
    privacy: "Política de privacidad"
  },
  home: {
    description:
      "Muestra la puntuación de ajedrez de los espectadores junto a sus mensajes de chat de Chzzk y Twitch.",
    broadcastTitle: "Configuración de la transmisión",
    broadcastDescription:
      "Conecta los chats de las transmisiones y administra una URL universal de fuente de navegador.",
    streamerAction: "Panel del streamer",
    ratingTitle: "Conectar puntuaciones",
    ratingDescription:
      "Conecta tus cuentas de plataformas de transmisión, Chess.com y Lichess para administrar tus puntuaciones.",
    viewerAction: "Panel del espectador"
  },
  login: {
    title: "Inicio de sesión de {{role}}",
    chzzk: "Continuar con Chzzk",
    twitch: "Continuar con Twitch"
  },
  streamer: {
    title: "Overlay de transmisión",
    preview: "Vista previa del chat"
  },
  viewer: {
    title: "Conexiones de cuentas"
  },
  route: {
    loading: "Cargando página",
    notFound: "Página no encontrada",
    home: "Volver al inicio"
  },
  customCssGuide: {
    title: "Guía de CSS personalizado",
    intro:
      "Utiliza las clases y los atributos de datos que ofrece el overlay para personalizar la apariencia del chat. Tu CSS se aplica de la misma forma a la vista previa y a la fuente de navegador.",
    back: "Volver al panel del streamer",
    selectors: {
      title: "Selectores compatibles",
      selector: "Selector",
      target: "Objetivo",
      items: {
        overlay: "Toda el área del overlay",
        messageList: "La lista de mensajes del chat",
        message: "Un cuadro de mensaje individual",
        metadata: "Insignias de plataforma, insignia de puntuación y nombre de usuario",
        platformBadges: "El grupo de insignias de plataforma",
        platformBadge: "Una imagen de insignia de Chzzk o Twitch",
        ratingBadge: "El contenedor de la insignia de puntuación de Chess.com o Lichess",
        ratingBadgeContent: "El icono y el número de la insignia de puntuación",
        nickname: "El nombre del autor del mensaje",
        content: "El contenido del mensaje de chat",
        emote: "Una imagen de emoticono dentro de un mensaje"
      }
    },
    attributes: { title: "Atributos de datos" },
    variables: {
      title: "Variables CSS",
      description:
        "Contienen valores calculados a partir de la configuración de apariencia. Consúltalos con var(--nombre) o sobrescríbelos en los elementos compatibles del overlay."
    },
    examples: {
      title: "Ejemplos",
      roles: "Estilo según el rol del espectador",
      ratings: "Estilos de las insignias de puntuación",
      bubble: "Punta de bocadillo"
    },
    limits: {
      title: "Limitaciones",
      size: "El CSS está limitado a 20 KB en UTF-8.",
      selectors: "Los selectores deben comenzar por una clase de overlay compatible.",
      resources: "No se permiten url(), imágenes externas ni recursos externos.",
      atRules: "No se permiten reglas como @import, @font-face y @keyframes.",
      disabled: "Al desactivar el CSS personalizado se conserva su contenido, pero no se aplica al overlay."
    }
  },
  badgePreference: {
    default: "Insignia predeterminada",
    error: "Error al seleccionar la insignia",
    loadFailed: "No se pudo cargar la configuración de la insignia.",
    saveFailed: "No se pudo cambiar la insignia."
  },
  chessAccount: {
    loading: "Comprobando la información de la cuenta.",
    disconnect: "Desconectar",
    lastUpdated: "Última actualización: {{date}}",
    refreshInMinutes: "Actualización en {{count}} min",
    games_one: "{{count}} partida",
    games_other: "{{count}} partidas",
    highestApplied: "Puntuación más alta en uso",
    noSupportedRatings: "No se encontraron puntuaciones de ritmos de juego compatibles.",
    requestFailed: "No se pudo completar la solicitud."
  },
  chesscom: {
    title: "Cuenta de Chess.com",
    description: "Carga las puntuaciones de Rapid, Blitz y Bullet.",
    refreshTitle: "Actualizar puntuaciones de Chess.com",
    disconnectConfirm:
      "¿Desconectar la cuenta de Chess.com y eliminar su insignia actual del chat?",
    username: "Nombre de usuario de Chess.com",
    lookup: "Buscar cuenta",
    verified: "Se ha verificado la propiedad de la cuenta de Chess.com.",
    unverifiedNotice:
      "Esta puntuación no aparecerá en los overlays de chat hasta que se verifique la propiedad de la cuenta.",
    createCode: "Crear código de verificación",
    locationInstruction:
      "Introduce exactamente el siguiente código en el campo Ubicación (Location) de tu perfil de Chess.com y guarda los cambios.",
    copyCode: "Copiar código de verificación",
    openProfileSettings: "Abrir configuración del perfil",
    confirmVerification: "Ya lo he guardado, verificar ahora",
    expiryNotice:
      "El código es válido durante 48 horas. La caché de la API pública de Chess.com puede retrasar los cambios del perfil."
  },
  lichess: {
    title: "Cuenta de Lichess",
    description: "Carga las puntuaciones de Bullet, Blitz, Rapid y Clásica.",
    refreshTitle: "Actualizar puntuaciones de Lichess",
    disconnectConfirm:
      "¿Desconectar la cuenta de Lichess y eliminar su insignia actual?",
    connect: "Conectar con Lichess",
    connected: "La cuenta de Lichess se ha conectado.",
    expired: "La solicitud de conexión con Lichess ha caducado. Inténtalo de nuevo.",
    failed: "No se pudo conectar la cuenta de Lichess. Inténtalo de nuevo.",
    verified: "Se ha verificado la propiedad de la cuenta de Lichess."
  },
  platformBadge: "Insignias de plataforma",
  platforms: {
    title: "Plataformas de transmisión",
    loading: "Comprobando las cuentas conectadas.",
    noAccount: "No hay ninguna cuenta conectada",
    permissionRequired: "Se requiere permiso para acceder al chat",
    permissionStatus: "Permiso requerido",
    grantPermission: "Autorizar",
    revokePermission: "Revocar",
    reconnectRequired: "Es necesario volver a conectar",
    connecting: "Conectando",
    alternativeRequired:
      "Conecta otra cuenta de inicio de sesión antes de desconectar esta.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "¿Desconectar la cuenta de Chzzk y revocar el acceso al chat?",
      disconnectPermissionConfirm:
        "¿Revocar el acceso al chat de Chzzk? La cuenta de inicio de sesión de Chzzk seguirá conectada.",
      accountDisconnected: "Chzzk se ha desconectado.",
      permissionDisconnected: "Se ha revocado el acceso al chat de Chzzk.",
      connectAccount: "Conectar cuenta de Chzzk",
      disconnectAccount: "Desconectar Chzzk",
      connectPermission: "Autorizar acceso al chat de Chzzk",
      disconnectPermission: "Revocar acceso al chat de Chzzk",
      connected: "La cuenta de Chzzk se ha conectado.",
      streamerConnected:
        "Chzzk y su acceso al chat se han conectado.",
      conflict:
        "Esta cuenta de Chzzk ya está conectada a otro usuario de EloBadge.",
      failed: "No se pudo conectar la cuenta de Chzzk. Inténtalo de nuevo.",
      streamerFailed:
        "No se pudo completar la conexión con Chzzk o la autorización del chat."
    },
    twitch: {
      disconnectAccountConfirm:
        "¿Desconectar la cuenta de Twitch y revocar el acceso al chat?",
      disconnectPermissionConfirm:
        "¿Revocar el acceso al chat de Twitch? La cuenta de inicio de sesión de Twitch seguirá conectada.",
      accountDisconnected: "Twitch se ha desconectado.",
      permissionDisconnected: "Se ha revocado el acceso al chat de Twitch.",
      connectAccount: "Conectar cuenta de Twitch",
      disconnectAccount: "Desconectar Twitch",
      connectPermission: "Autorizar acceso al chat de Twitch",
      disconnectPermission: "Revocar acceso al chat de Twitch",
      connected: "La cuenta de Twitch se ha conectado.",
      streamerConnected:
        "Twitch y su acceso al chat se han conectado.",
      denied: "La solicitud de conexión con Twitch se ha cancelado.",
      expired: "La solicitud de conexión con Twitch ha caducado. Inténtalo de nuevo.",
      conflict:
        "Esta cuenta de Twitch ya está conectada a otro usuario de EloBadge.",
      failed: "No se pudo conectar la cuenta de Twitch. Inténtalo de nuevo.",
      streamerFailed:
        "No se pudo completar la conexión con Twitch o la autorización del chat."
    },
    loadFailed: "No se pudieron cargar las conexiones con las plataformas de transmisión."
  },
  overlay: {
    title: "Overlay de fuente de navegador",
    description:
      "Funciona con OBS Studio, XSplit y otros programas de transmisión compatibles con fuentes de navegador. Está optimizado para un ancho de 600 px; ajusta la altura a tu escena.",
    signInFirst: "Inicia sesión con una cuenta de plataforma de transmisión arriba.",
    createUrl: "Crear URL",
    urlLabel: "URL de la fuente de navegador",
    showUrl: "Mostrar URL",
    hideUrl: "Ocultar URL",
    copyUrl: "Copiar URL",
    copied: "Copiada",
    enable: "Activar",
    disable: "Desactivar",
    rotate: "Renovar URL",
    rotateConfirm:
      "¿Revocar la URL actual del overlay y generar una nueva?",
    general: "General",
    badges: "Insignias",
    background: "Fondo del chat",
    colors: "Colores del chat",
    fonts: "Fuente del chat",
    maxWidth: "Ancho máximo del chat",
    alignment: "Alineación del chat",
    alignmentOption: {
      left: "Alinear a la izquierda",
      center: "Centrar",
      right: "Alinear a la derecha"
    },
    messageLayout: "Disposición del nombre y el mensaje",
    messageLayoutOption: {
      inline: "Una línea",
      stacked: "Nueva línea",
      aligned: "Inicio alineado",
      individual: "Alineación por mensaje"
    },
    nicknameSeparatorVisible: "Mostrar dos puntos (:) después del nombre",
    alignedNicknameRightAligned: "Alinear el nombre a la derecha",
    messageBoxFilled: "Rellenar el cuadro del chat",
    customCssEnabled: "Usar CSS personalizado",
    customCss: "CSS personalizado",
    customCssGuide: "Guía de CSS personalizado",
    restoreCustomCss: "Restaurar el último CSS guardado",
    restoreCustomCssConfirm: "¿Restaurar el último CSS personalizado guardado?",
    clearCustomCss: "Borrar CSS personalizado",
    clearCustomCssConfirm: "¿Borrar todo el contenido del CSS personalizado?",
    unsavedChangesConfirm: "Hay ajustes de apariencia sin guardar. ¿Quieres salir de esta página?",
    customCssPresets: "Cargar ejemplo de CSS",
    applyCustomCssPresetConfirm: "¿Reemplazar el CSS actual por el ejemplo «{{name}}»?",
    customCssPreset: {
      defaults: "Estilo predeterminado",
      bubble: "Bocadillo",
      transparent: "Chat transparente",
      nickname: "Nombre destacado"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "El CSS personalizado debe ocupar 20 KB o menos.",
    customCssError: {
      invalid_syntax: "Comprueba la sintaxis del CSS.",
      at_rule_not_allowed: "No se permiten reglas como @import y @font-face.",
      external_resource_not_allowed: "No se permiten URL externas ni recursos de imagen.",
      selector_not_allowed: "Los selectores deben limitarse a los elementos compatibles del overlay de EloBadge.",
      property_not_allowed: "El CSS contiene una propiedad bloqueada por motivos de seguridad.",
      invalid_property_value: "El CSS contiene un valor de propiedad no compatible con los navegadores.",
      too_large: "El CSS personalizado debe ocupar 20 KB o menos."
    },
    duration: "Duración del mensaje",
    keep: "Mantener indefinidamente",
    seconds_one: "{{count}} segundo",
    seconds_other: "{{count}} segundos",
    defaultSuffix: " (predeterminado)",
    ratingBadge: "Insignia de puntuación de ajedrez",
    ratingPolicy: {
      viewer_choice: "Usar la preferencia del espectador",
      chesscom_only: "Solo Chess.com",
      lichess_only: "Solo Lichess",
      hidden: "Oculta"
    },
    forcedProviderNotice:
      "Cuando se selecciona una plataforma específica, los espectadores sin una cuenta en ella no reciben una insignia de ajedrez.",
    allPlatformBadges: "Mostrar todas",
    platformBadges: {
      chzzk: "Insignias de Chzzk",
      twitch: "Insignias de Twitch"
    },
    visibleBadges: "Insignias visibles",
    badgeKind: {
      role: "Streamer y administrador",
      subscription: "Suscripción",
      donation: "Donación",
      subscription_gift: "Suscripción regalada",
      unknown: "Otras"
    },
    twitchBadgeKind: {
      role: "Streamer, moderador y VIP",
      subscription: "Suscriptor y fundador",
      donation: "Bits",
      subscription_gift: "Suscripción regalada",
      unknown: "Globales y otras"
    },
    backgroundVisible: "Mostrar fondo",
    backgroundColor: "Color de fondo",
    customBackgroundColor: "Elegir un color de fondo personalizado",
    backgroundOpacity: "Opacidad del fondo",
    nicknameVisible: "Mostrar nombre",
    nicknameColor: "Color del nombre",
    messageColor: "Color del mensaje",
    colorMode: {
      fixed: "Un solo color",
      by_user: "Por usuario",
      by_role: "Por rol",
      message_by_role: "Por tipo"
    },
    customNicknameColor: "Elegir un color de nombre personalizado",
    customMessageColor: "Elegir un color de mensaje personalizado",
    role: {
      streamer: "Streamer",
      manager: "Administrador",
      subscriber: "Suscriptor",
      donator: "Donante",
      viewer: "Espectador"
    },
    font: "Fuente",
    systemFont: "Fuente predeterminada del sistema",
    fontPreview: "El veloz murciélago hindú comía feliz cardillo y kiwi.",
    fontSize: "Tamaño de fuente",
    fontWeight: "Grosor de fuente",
    lineHeight: "Interlineado",
    save: "Guardar apariencia",
    reset: "Restablecer valores predeterminados",
    resetConfirm: "¿Restablecer todos los ajustes de apariencia del chat?",
    requestFailed: "La solicitud ha fallado."
  },
  preview: {
    frameLabel: "Vista previa del overlay de chat",
    empty: "Aún no hay mensajes de vista previa",
    nickname: "Nombre",
    nicknamePlaceholder: "Nombre del espectador",
    rating: "Puntuación",
    optional: "Opcional",
    role: "Rol",
    roleLabel: "Rol en la vista previa del chat",
    badgeType: "Tipo de insignia",
    badgeLabel: "Insignia de {{provider}}",
    message: "Mensaje",
    messagePlaceholder: "Introduce un mensaje de vista previa",
    add: "Añadir a la vista previa"
  },
  authCallback: {
    missingCode: "Falta el código de inicio de sesión.",
    loginFailed: "Error al iniciar sesión.",
    loggingIn: "Iniciando sesión con tu cuenta de plataforma de transmisión.",
    success: "Cuenta conectada",
    successDescription:
      "{{name}} se ha conectado en modo {{role}}.",
    continue: "Continuar",
    failure: "Error al conectar la cuenta",
    invalidCode: "El código de inicio de sesión ha caducado o no es válido."
  },
  api: {
    signInRequired: "Debes iniciar sesión en EloBadge.",
    requestFailed: "No se pudo completar la solicitud.",
    serverLoginFailed: "No se pudo verificar el inicio de sesión en el servidor.",
    adminRequired: "Esta cuenta no tiene acceso de administrador.",
    overlayLoadFailed: "No se pudo cargar el overlay."
  },
  accountDeletion: {
    confirmation: "ELIMINAR CUENTA",
    title: "Eliminar cuenta",
    description:
      "Elimina permanentemente los datos de ajedrez conectados y la configuración de transmisión.",
    action: "Eliminar cuenta de EloBadge",
    dialogTitle: "¿Eliminar tu cuenta de EloBadge?",
    warning:
      "Se eliminarán las conexiones con Chess.com y Lichess, las puntuaciones, las URL del overlay y la configuración de apariencia. Las URL existentes de fuentes de navegador dejarán de funcionar inmediatamente.",
    close: "Cerrar el diálogo de eliminación de cuenta",
    instruction: "Introduce {{text}} para continuar.",
    deleting: "Eliminando",
    permanentDelete: "Eliminar permanentemente",
    failed: "No se pudo eliminar la cuenta de EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Esta Política de privacidad se proporciona en coreano como versión oficial conforme a la legislación de Corea del Sur."
  }
} as const;

export default es;
