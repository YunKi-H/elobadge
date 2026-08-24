const ptBR = {
  common: {
    streamer: "Streamer",
    viewer: "Espectador",
    signOut: "Sair",
    signingOut: "Saindo",
    loading: "Carregando",
    connect: "Conectar",
    disconnect: "Desconectar",
    cancel: "Cancelar",
    close: "Fechar",
    retry: "Tentar novamente",
    refresh: "Atualizar",
    refreshing: "Atualizando",
    error: "Erro",
    connected: "Conectado",
    notConnected: "Não conectado"
  },
  language: {
    label: "Idioma"
  },
  app: {
    mainNavigation: "Navegação principal",
    signOutFailed: "Não foi possível sair. Tente novamente.",
    support: "Contato e relatos de erros:",
    privacy: "Política de Privacidade"
  },
  home: {
    description:
      "Mostre o rating de xadrez dos espectadores ao lado das mensagens do chat da Chzzk e da Twitch.",
    broadcastTitle: "Configurações da transmissão",
    broadcastDescription:
      "Conecte os chats das transmissões e gerencie uma URL universal de fonte de navegador.",
    streamerAction: "Painel do streamer",
    ratingTitle: "Conectar ratings",
    ratingDescription:
      "Conecte suas contas de plataforma de transmissão, Chess.com e Lichess para gerenciar seus ratings.",
    viewerAction: "Painel do espectador"
  },
  login: {
    title: "Login de {{role}}",
    chzzk: "Continuar com Chzzk",
    twitch: "Continuar com Twitch"
  },
  streamer: {
    title: "Overlay da transmissão",
    preview: "Prévia do chat"
  },
  viewer: {
    title: "Conexões de contas"
  },
  route: {
    loading: "Carregando página",
    notFound: "Página não encontrada",
    home: "Voltar ao início"
  },
  customCssGuide: {
    title: "Guia de CSS personalizado",
    intro:
      "Use as classes e os atributos de dados disponibilizados pelo overlay para personalizar a aparência do chat. Seu CSS é aplicado da mesma forma à prévia e à fonte de navegador.",
    back: "Voltar ao painel do streamer",
    selectors: {
      title: "Seletores compatíveis",
      selector: "Seletor",
      target: "Elemento",
      items: {
        overlay: "Toda a área do overlay",
        messageList: "A lista de mensagens do chat",
        message: "Uma caixa de mensagem individual",
        metadata: "Badges da plataforma, badge de rating e nome de usuário",
        platformBadges: "O grupo de badges da plataforma",
        platformBadge: "Uma imagem de badge da Chzzk ou da Twitch",
        ratingBadge: "O contêiner do badge de rating do Chess.com ou Lichess",
        ratingBadgeContent: "O ícone e o número do badge de rating",
        nickname: "O nome do autor da mensagem",
        content: "O conteúdo da mensagem do chat",
        emote: "Uma imagem de emote dentro de uma mensagem"
      }
    },
    attributes: { title: "Atributos de dados" },
    variables: {
      title: "Variáveis CSS",
      description:
        "Elas contêm valores calculados com base nas configurações de aparência. Leia-as com var(--nome) ou substitua-as nos elementos compatíveis do overlay."
    },
    examples: {
      title: "Exemplos",
      roles: "Estilo por função do espectador",
      ratings: "Estilos dos badges de rating",
      bubble: "Ponta de balão de fala"
    },
    limits: {
      title: "Limitações",
      size: "O CSS é limitado a 20 KB em UTF-8.",
      selectors: "Os seletores devem começar por uma classe de overlay compatível.",
      resources: "url(), imagens externas e recursos externos não são permitidos.",
      atRules: "Regras como @import, @font-face e @keyframes não são permitidas.",
      disabled: "Desativar o CSS personalizado mantém o conteúdo salvo, mas não o aplica ao overlay."
    }
  },
  badgePreference: {
    default: "Badge padrão",
    error: "Erro ao selecionar o badge",
    loadFailed: "Não foi possível carregar as configurações do badge.",
    saveFailed: "Não foi possível alterar o badge."
  },
  chessAccount: {
    loading: "Verificando as informações da conta.",
    disconnect: "Desconectar",
    lastUpdated: "Última atualização: {{date}}",
    refreshInMinutes: "Atualização em {{count}} min",
    games_one: "{{count}} partida",
    games_other: "{{count}} partidas",
    highestApplied: "Maior rating em uso",
    noSupportedRatings: "Nenhum rating de ritmo de jogo compatível foi encontrado.",
    requestFailed: "Não foi possível concluir a solicitação."
  },
  chesscom: {
    title: "Conta do Chess.com",
    description: "Carrega os ratings de Rápida, Blitz e Bullet.",
    refreshTitle: "Atualizar ratings do Chess.com",
    disconnectConfirm:
      "Desconectar a conta do Chess.com e remover o badge atual do chat?",
    username: "Nome de usuário do Chess.com",
    lookup: "Buscar conta",
    verified: "A propriedade da conta do Chess.com foi verificada.",
    unverifiedNotice:
      "Este rating não aparecerá nos overlays de chat até que a propriedade da conta seja verificada.",
    createCode: "Criar código de verificação",
    locationInstruction:
      "Digite exatamente o código abaixo no campo Localização (Location) do seu perfil do Chess.com e salve.",
    copyCode: "Copiar código de verificação",
    openProfileSettings: "Abrir configurações do perfil",
    confirmVerification: "Já salvei, verificar agora",
    expiryNotice:
      "O código é válido por 48 horas. O cache da API pública do Chess.com pode atrasar as alterações do perfil."
  },
  lichess: {
    title: "Conta do Lichess",
    description: "Carrega os ratings de Bullet, Blitz, Rápida e Clássica.",
    refreshTitle: "Atualizar ratings do Lichess",
    disconnectConfirm:
      "Desconectar a conta do Lichess e remover o badge atual?",
    connect: "Conectar com Lichess",
    connected: "A conta do Lichess foi conectada.",
    expired: "A solicitação de conexão com o Lichess expirou. Tente novamente.",
    failed: "Não foi possível conectar a conta do Lichess. Tente novamente.",
    verified: "A propriedade da conta do Lichess foi verificada."
  },
  platformBadge: "Badges da plataforma",
  platforms: {
    title: "Plataformas de transmissão",
    loading: "Verificando as contas conectadas.",
    noAccount: "Nenhuma conta conectada",
    permissionRequired: "É necessária permissão para acessar o chat",
    permissionStatus: "Permissão necessária",
    grantPermission: "Autorizar",
    revokePermission: "Revogar",
    reconnectRequired: "É necessário reconectar",
    connecting: "Conectando",
    alternativeRequired:
      "Conecte outra conta de login antes de desconectar esta.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Desconectar a conta da Chzzk e revogar o acesso ao chat?",
      disconnectPermissionConfirm:
        "Revogar o acesso ao chat da Chzzk? A conta de login da Chzzk continuará conectada.",
      accountDisconnected: "A Chzzk foi desconectada.",
      permissionDisconnected: "O acesso ao chat da Chzzk foi revogado.",
      connectAccount: "Conectar conta da Chzzk",
      disconnectAccount: "Desconectar Chzzk",
      connectPermission: "Autorizar acesso ao chat da Chzzk",
      disconnectPermission: "Revogar acesso ao chat da Chzzk",
      connected: "A conta da Chzzk foi conectada.",
      streamerConnected:
        "A Chzzk e o acesso ao chat foram conectados.",
      conflict:
        "Esta conta da Chzzk já está conectada a outro usuário do EloBadge.",
      failed: "Não foi possível conectar a conta da Chzzk. Tente novamente.",
      streamerFailed:
        "Não foi possível concluir a conexão com a Chzzk ou a autorização do chat."
    },
    twitch: {
      disconnectAccountConfirm:
        "Desconectar a conta da Twitch e revogar o acesso ao chat?",
      disconnectPermissionConfirm:
        "Revogar o acesso ao chat da Twitch? A conta de login da Twitch continuará conectada.",
      accountDisconnected: "A Twitch foi desconectada.",
      permissionDisconnected: "O acesso ao chat da Twitch foi revogado.",
      connectAccount: "Conectar conta da Twitch",
      disconnectAccount: "Desconectar Twitch",
      connectPermission: "Autorizar acesso ao chat da Twitch",
      disconnectPermission: "Revogar acesso ao chat da Twitch",
      connected: "A conta da Twitch foi conectada.",
      streamerConnected:
        "A Twitch e o acesso ao chat foram conectados.",
      denied: "A solicitação de conexão com a Twitch foi cancelada.",
      expired: "A solicitação de conexão com a Twitch expirou. Tente novamente.",
      conflict:
        "Esta conta da Twitch já está conectada a outro usuário do EloBadge.",
      failed: "Não foi possível conectar a conta da Twitch. Tente novamente.",
      streamerFailed:
        "Não foi possível concluir a conexão com a Twitch ou a autorização do chat."
    },
    loadFailed: "Não foi possível carregar as conexões com as plataformas de transmissão."
  },
  overlay: {
    title: "Overlay de fonte de navegador",
    description:
      "Funciona com OBS Studio, XSplit e outros programas de transmissão compatíveis com fontes de navegador. Otimizado para uma largura de 600 px; ajuste a altura à sua cena.",
    signInFirst: "Entre com uma conta de plataforma de transmissão acima.",
    createUrl: "Criar URL",
    urlLabel: "URL da fonte de navegador",
    showUrl: "Mostrar URL",
    hideUrl: "Ocultar URL",
    copyUrl: "Copiar URL",
    copied: "Copiada",
    enable: "Ativar",
    disable: "Desativar",
    rotate: "Renovar URL",
    rotateConfirm:
      "Revogar a URL atual do overlay e gerar uma nova?",
    general: "Geral",
    badges: "Badges",
    background: "Fundo do chat",
    colors: "Cores do chat",
    fonts: "Fonte do chat",
    maxWidth: "Largura máxima do chat",
    alignment: "Alinhamento do chat",
    alignmentOption: {
      left: "Alinhar à esquerda",
      center: "Centralizar",
      right: "Alinhar à direita"
    },
    messageLayout: "Disposição do nome e da mensagem",
    messageLayoutOption: {
      inline: "Uma linha",
      stacked: "Nova linha",
      aligned: "Início alinhado",
      individual: "Alinhamento por mensagem"
    },
    nicknameSeparatorVisible: "Mostrar dois-pontos (:) depois do nome",
    alignedNicknameRightAligned: "Alinhar o nome à direita",
    messageBoxFilled: "Preencher a caixa do chat",
    customCssEnabled: "Usar CSS personalizado",
    customCss: "CSS personalizado",
    customCssGuide: "Guia de CSS personalizado",
    restoreCustomCss: "Restaurar o último CSS salvo",
    restoreCustomCssConfirm: "Restaurar o último CSS personalizado salvo?",
    clearCustomCss: "Limpar CSS personalizado",
    clearCustomCssConfirm: "Limpar todo o conteúdo do CSS personalizado?",
    unsavedChangesConfirm: "Há configurações de aparência não salvas. Sair desta página?",
    customCssPresets: "Carregar exemplo de CSS",
    applyCustomCssPresetConfirm: "Substituir o CSS atual pelo exemplo “{{name}}”?",
    customCssPreset: {
      defaults: "Estilo padrão",
      bubble: "Balão de fala",
      transparent: "Chat transparente",
      nickname: "Nome em destaque"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "O CSS personalizado deve ter no máximo 20 KB.",
    customCssError: {
      invalid_syntax: "Verifique a sintaxe do CSS.",
      at_rule_not_allowed: "Regras como @import e @font-face não são permitidas.",
      external_resource_not_allowed: "URLs externas e recursos de imagem não são permitidos.",
      selector_not_allowed: "Os seletores devem permanecer nos elementos compatíveis do overlay do EloBadge.",
      property_not_allowed: "O CSS contém uma propriedade bloqueada por segurança.",
      invalid_property_value: "O CSS contém um valor de propriedade não compatível com os navegadores.",
      too_large: "O CSS personalizado deve ter no máximo 20 KB."
    },
    duration: "Duração da mensagem",
    keep: "Manter indefinidamente",
    seconds_one: "{{count}} segundo",
    seconds_other: "{{count}} segundos",
    defaultSuffix: " (padrão)",
    ratingBadge: "Badge de rating de xadrez",
    ratingPolicy: {
      viewer_choice: "Usar a preferência do espectador",
      chesscom_only: "Somente Chess.com",
      lichess_only: "Somente Lichess",
      hidden: "Oculto"
    },
    forcedProviderNotice:
      "Quando uma plataforma específica é selecionada, espectadores sem uma conta nela não recebem um badge de xadrez.",
    allPlatformBadges: "Mostrar todos",
    platformBadges: {
      chzzk: "Badges da Chzzk",
      twitch: "Badges da Twitch"
    },
    visibleBadges: "Badges visíveis",
    badgeKind: {
      role: "Streamer e moderador",
      subscription: "Inscrição",
      donation: "Doação",
      subscription_gift: "Inscrição de presente",
      unknown: "Outros"
    },
    twitchBadgeKind: {
      role: "Streamer, moderador e VIP",
      subscription: "Inscrito e fundador",
      donation: "Bits",
      subscription_gift: "Inscrição de presente",
      unknown: "Globais e outros"
    },
    backgroundVisible: "Mostrar fundo",
    backgroundColor: "Cor de fundo",
    customBackgroundColor: "Escolher uma cor de fundo personalizada",
    backgroundOpacity: "Opacidade do fundo",
    nicknameVisible: "Mostrar nome",
    nicknameColor: "Cor do nome",
    messageColor: "Cor da mensagem",
    colorMode: {
      fixed: "Cor única",
      by_user: "Por usuário",
      by_role: "Por função",
      message_by_role: "Por tipo"
    },
    customNicknameColor: "Escolher uma cor personalizada para o nome",
    customMessageColor: "Escolher uma cor personalizada para a mensagem",
    role: {
      streamer: "Streamer",
      manager: "Moderador",
      subscriber: "Inscrito",
      donator: "Doador",
      viewer: "Espectador"
    },
    font: "Fonte",
    systemFont: "Fonte padrão do sistema",
    fontPreview: "Um pequeno jabuti xereta viu dez cegonhas felizes.",
    fontSize: "Tamanho da fonte",
    fontWeight: "Espessura da fonte",
    lineHeight: "Espaçamento entre linhas",
    save: "Salvar aparência",
    reset: "Restaurar padrões",
    resetConfirm: "Restaurar todas as configurações de aparência do chat?",
    requestFailed: "A solicitação falhou."
  },
  preview: {
    frameLabel: "Prévia do overlay do chat",
    empty: "Ainda não há mensagens de prévia",
    nickname: "Nome",
    nicknamePlaceholder: "Nome do espectador",
    rating: "Rating",
    optional: "Opcional",
    role: "Função",
    roleLabel: "Função na prévia do chat",
    badgeType: "Tipo de badge",
    badgeLabel: "Badge do {{provider}}",
    message: "Mensagem",
    messagePlaceholder: "Digite uma mensagem para a prévia",
    add: "Adicionar à prévia"
  },
  authCallback: {
    missingCode: "O código de login está ausente.",
    loginFailed: "Falha no login.",
    loggingIn: "Entrando com sua conta da plataforma de transmissão.",
    success: "Conta conectada",
    successDescription:
      "{{name}} foi conectado no modo {{role}}.",
    continue: "Continuar",
    failure: "Falha ao conectar a conta",
    invalidCode: "O código de login expirou ou é inválido."
  },
  api: {
    signInRequired: "Você precisa entrar no EloBadge.",
    requestFailed: "Não foi possível concluir a solicitação.",
    serverLoginFailed: "Não foi possível verificar o login no servidor.",
    adminRequired: "Esta conta não tem acesso de administrador.",
    overlayLoadFailed: "Não foi possível carregar o overlay."
  },
  accountDeletion: {
    confirmation: "EXCLUIR CONTA",
    title: "Excluir conta",
    description:
      "Exclua permanentemente seus dados de xadrez conectados e suas configurações de transmissão.",
    action: "Excluir conta do EloBadge",
    dialogTitle: "Excluir sua conta do EloBadge?",
    warning:
      "As conexões do Chess.com e Lichess, os ratings, as URLs do overlay e as configurações de aparência serão excluídos. As URLs existentes de fontes de navegador deixarão de funcionar imediatamente.",
    close: "Fechar a janela de exclusão da conta",
    instruction: "Digite {{text}} para continuar.",
    deleting: "Excluindo",
    permanentDelete: "Excluir permanentemente",
    failed: "Não foi possível excluir a conta do EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Esta Política de Privacidade é disponibilizada em coreano como versão oficial de acordo com a legislação da Coreia do Sul."
  }
} as const;

export default ptBR;
