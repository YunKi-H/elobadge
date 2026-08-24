const ru = {
  common: {
    streamer: "Стример",
    viewer: "Зритель",
    signOut: "Выйти",
    signingOut: "Выход",
    loading: "Загрузка",
    connect: "Подключить",
    disconnect: "Отключить",
    cancel: "Отмена",
    close: "Закрыть",
    retry: "Повторить",
    refresh: "Обновить",
    refreshing: "Обновление",
    error: "Ошибка",
    connected: "Подключено",
    notConnected: "Не подключено"
  },
  language: {
    label: "Язык"
  },
  app: {
    mainNavigation: "Главная навигация",
    signOutFailed: "Не удалось выйти. Повторите попытку.",
    support: "Связь и сообщения об ошибках:",
    privacy: "Политика конфиденциальности"
  },
  home: {
    description:
      "Показывает шахматный рейтинг зрителей рядом с сообщениями чата Chzzk и Twitch.",
    broadcastTitle: "Настройки трансляции",
    broadcastDescription:
      "Подключайте чаты трансляций и управляйте универсальным URL источника браузера.",
    streamerAction: "Панель стримера",
    ratingTitle: "Подключение рейтингов",
    ratingDescription:
      "Подключите аккаунты стриминговой платформы, Chess.com и Lichess для управления рейтингами.",
    viewerAction: "Панель зрителя"
  },
  login: {
    title: "Вход: {{role}}",
    chzzk: "Продолжить с Chzzk",
    twitch: "Продолжить с Twitch"
  },
  streamer: {
    title: "Оверлей трансляции",
    preview: "Предпросмотр чата"
  },
  viewer: {
    title: "Подключения аккаунтов"
  },
  route: {
    loading: "Загрузка страницы",
    notFound: "Страница не найдена",
    home: "На главную"
  },
  customCssGuide: {
    title: "Руководство по пользовательскому CSS",
    intro:
      "Используйте классы и атрибуты данных оверлея, чтобы настроить внешний вид чата. CSS одинаково применяется к предпросмотру и источнику браузера.",
    back: "Вернуться в панель стримера",
    selectors: {
      title: "Поддерживаемые селекторы",
      selector: "Селектор",
      target: "Элемент",
      items: {
        overlay: "Вся область оверлея",
        messageList: "Список сообщений чата",
        message: "Отдельный блок сообщения чата",
        metadata: "Значки платформы, рейтинга и никнейм",
        platformBadges: "Группа значков платформы",
        platformBadge: "Отдельное изображение значка Chzzk или Twitch",
        ratingBadge: "Внешняя область значка рейтинга Chess.com или Lichess",
        ratingBadgeContent: "Значок и число рейтинга",
        nickname: "Никнейм автора сообщения",
        content: "Текст сообщения чата",
        emote: "Изображение эмоции в сообщении чата"
      }
    },
    attributes: { title: "Атрибуты данных" },
    variables: {
      title: "Переменные CSS",
      description:
        "Они содержат значения, рассчитанные из настроек оформления. Читайте их через var(--name) или переопределяйте в поддерживаемых элементах оверлея."
    },
    examples: {
      title: "Примеры",
      roles: "Стиль по роли зрителя",
      ratings: "Стили значков рейтинга",
      bubble: "Хвост облачка сообщения"
    },
    limits: {
      title: "Ограничения",
      size: "Размер CSS в кодировке UTF-8 ограничен 20 КБ.",
      selectors: "Селекторы должны начинаться с поддерживаемого класса оверлея.",
      resources: "Нельзя использовать url(), внешние изображения и ресурсы.",
      atRules: "Нельзя использовать директивы @import, @font-face, @keyframes и другие at-правила.",
      disabled: "При отключении пользовательского CSS его содержимое сохраняется, но не применяется к оверлею."
    }
  },
  badgePreference: {
    default: "Значок по умолчанию",
    error: "Ошибка выбора значка",
    loadFailed: "Не удалось загрузить настройки значка.",
    saveFailed: "Не удалось изменить значок."
  },
  chessAccount: {
    loading: "Проверка данных аккаунта.",
    disconnect: "Отключить",
    lastUpdated: "Последнее обновление: {{date}}",
    refreshInMinutes: "Обновление через {{count}} мин.",
    games_one: "{{count}} партия",
    games_few: "{{count}} партии",
    games_many: "{{count}} партий",
    games_other: "{{count}} партии",
    highestApplied: "Используется самый высокий рейтинг",
    noSupportedRatings: "Рейтинги для поддерживаемых контролей времени не найдены.",
    requestFailed: "Не удалось выполнить запрос."
  },
  chesscom: {
    title: "Аккаунт Chess.com",
    description: "Загружает рейтинги Rapid, Blitz и Bullet.",
    refreshTitle: "Обновить рейтинги Chess.com",
    disconnectConfirm:
      "Отключить аккаунт Chess.com и удалить текущий значок из чата?",
    username: "Имя пользователя Chess.com",
    lookup: "Найти аккаунт",
    verified: "Владение аккаунтом Chess.com подтверждено.",
    unverifiedNotice:
      "Рейтинг появится в оверлее чата только после подтверждения владения аккаунтом.",
    createCode: "Создать код подтверждения",
    locationInstruction:
      "Точно введите приведённый ниже код в поле Location профиля Chess.com и сохраните изменения.",
    copyCode: "Скопировать код подтверждения",
    openProfileSettings: "Открыть настройки профиля",
    confirmVerification: "Сохранено — проверить сейчас",
    expiryNotice:
      "Код действует 48 часов. Из-за кеша публичного API Chess.com изменения профиля могут отображаться с задержкой."
  },
  lichess: {
    title: "Аккаунт Lichess",
    description: "Загружает рейтинги Bullet, Blitz, Rapid и Classical.",
    refreshTitle: "Обновить рейтинги Lichess",
    disconnectConfirm:
      "Отключить аккаунт Lichess и удалить текущий значок?",
    connect: "Подключить Lichess",
    connected: "Аккаунт Lichess подключён.",
    expired: "Запрос на подключение Lichess истёк. Повторите попытку.",
    failed: "Не удалось подключить аккаунт Lichess. Повторите попытку.",
    verified: "Владение аккаунтом Lichess подтверждено."
  },
  platformBadge: "Значки платформы",
  platforms: {
    title: "Стриминговые платформы",
    loading: "Проверка подключённых аккаунтов.",
    noAccount: "Нет подключённого аккаунта",
    permissionRequired: "Требуется доступ к чату",
    permissionStatus: "Требуется разрешение",
    grantPermission: "Разрешить",
    revokePermission: "Отозвать",
    reconnectRequired: "Требуется переподключение",
    connecting: "Подключение",
    alternativeRequired:
      "Подключите другой аккаунт для входа, прежде чем отключать этот.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Отключить аккаунт Chzzk и отозвать доступ к чату?",
      disconnectPermissionConfirm:
        "Отозвать доступ к чату Chzzk? Аккаунт Chzzk для входа останется подключённым.",
      accountDisconnected: "Chzzk отключён.",
      permissionDisconnected: "Доступ к чату Chzzk отозван.",
      connectAccount: "Подключить аккаунт Chzzk",
      disconnectAccount: "Отключить Chzzk",
      connectPermission: "Разрешить доступ к чату Chzzk",
      disconnectPermission: "Отозвать доступ к чату Chzzk",
      connected: "Аккаунт Chzzk подключён.",
      streamerConnected:
        "Chzzk и доступ к его чату подключены.",
      conflict:
        "Этот аккаунт Chzzk уже подключён к другому пользователю EloBadge.",
      failed: "Не удалось подключить аккаунт Chzzk. Повторите попытку.",
      streamerFailed:
        "Не удалось завершить подключение Chzzk или авторизацию чата."
    },
    twitch: {
      disconnectAccountConfirm:
        "Отключить аккаунт Twitch и отозвать доступ к чату?",
      disconnectPermissionConfirm:
        "Отозвать доступ к чату Twitch? Аккаунт Twitch для входа останется подключённым.",
      accountDisconnected: "Twitch отключён.",
      permissionDisconnected: "Доступ к чату Twitch отозван.",
      connectAccount: "Подключить аккаунт Twitch",
      disconnectAccount: "Отключить Twitch",
      connectPermission: "Разрешить доступ к чату Twitch",
      disconnectPermission: "Отозвать доступ к чату Twitch",
      connected: "Аккаунт Twitch подключён.",
      streamerConnected:
        "Twitch и доступ к его чату подключены.",
      denied: "Запрос на подключение Twitch отменён.",
      expired: "Запрос на подключение Twitch истёк. Повторите попытку.",
      conflict:
        "Этот аккаунт Twitch уже подключён к другому пользователю EloBadge.",
      failed: "Не удалось подключить аккаунт Twitch. Повторите попытку.",
      streamerFailed:
        "Не удалось завершить подключение Twitch или авторизацию чата."
    },
    loadFailed: "Не удалось загрузить подключения стриминговых платформ."
  },
  overlay: {
    title: "Оверлей источника браузера",
    description:
      "Работает с OBS Studio, XSplit и другими программами для трансляций, поддерживающими источники браузера. Оптимизирован для ширины 600 пикселей; установите высоту под свою сцену.",
    signInFirst: "Сначала войдите выше через аккаунт стриминговой платформы.",
    createUrl: "Создать URL",
    urlLabel: "URL источника браузера",
    showUrl: "Показать URL",
    hideUrl: "Скрыть URL",
    copyUrl: "Скопировать URL",
    copied: "Скопировано",
    enable: "Включить",
    disable: "Отключить",
    rotate: "Обновить URL",
    rotateConfirm:
      "Отозвать текущий URL оверлея и выпустить новый?",
    general: "Основные",
    badges: "Значки",
    background: "Фон чата",
    colors: "Цвета чата",
    fonts: "Шрифт чата",
    maxWidth: "Максимальная ширина чата",
    alignment: "Выравнивание чата",
    alignmentOption: {
      left: "По левому краю",
      center: "По центру",
      right: "По правому краю"
    },
    messageLayout: "Расположение никнейма и сообщения",
    messageLayoutOption: {
      inline: "В одну строку",
      stacked: "С новой строки",
      aligned: "Общее начало",
      individual: "Раздельное выравнивание"
    },
    nicknameSeparatorVisible: "Показывать двоеточие (:) после никнейма",
    alignedNicknameRightAligned: "Выровнять никнейм по правому краю",
    messageBoxFilled: "Заполнять блок чата",
    customCssEnabled: "Использовать пользовательский CSS",
    customCss: "Пользовательский CSS",
    customCssGuide: "Руководство по пользовательскому CSS",
    restoreCustomCss: "Восстановить последнее сохранённое CSS",
    restoreCustomCssConfirm: "Восстановить последнее сохранённое пользовательское CSS?",
    clearCustomCss: "Очистить пользовательский CSS",
    clearCustomCssConfirm: "Удалить всё содержимое пользовательского CSS?",
    unsavedChangesConfirm: "Есть несохранённые настройки оформления. Покинуть страницу?",
    customCssPresets: "Загрузить пример CSS",
    applyCustomCssPresetConfirm: "Заменить текущий CSS примером «{{name}}»?",
    customCssPreset: {
      defaults: "Стандартный стиль",
      bubble: "Облачко сообщения",
      transparent: "Прозрачный чат",
      nickname: "Выделение никнейма"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Размер пользовательского CSS не должен превышать 20 КБ.",
    customCssError: {
      invalid_syntax: "Проверьте синтаксис CSS.",
      at_rule_not_allowed: "At-правила, такие как @import и @font-face, не разрешены.",
      external_resource_not_allowed: "Внешние URL, изображения и ресурсы не разрешены.",
      selector_not_allowed: "Селекторы не должны выходить за пределы поддерживаемых элементов оверлея EloBadge.",
      property_not_allowed: "CSS содержит свойство, заблокированное по соображениям безопасности.",
      invalid_property_value: "CSS содержит значение свойства, которое не поддерживается браузерами.",
      too_large: "Размер пользовательского CSS не должен превышать 20 КБ."
    },
    duration: "Время показа сообщения",
    keep: "Показывать без ограничения",
    seconds_one: "{{count}} секунда",
    seconds_few: "{{count}} секунды",
    seconds_many: "{{count}} секунд",
    seconds_other: "{{count}} секунды",
    defaultSuffix: " (по умолчанию)",
    ratingBadge: "Значок шахматного рейтинга",
    ratingPolicy: {
      viewer_choice: "Учитывать выбор зрителя",
      chesscom_only: "Только Chess.com",
      lichess_only: "Только Lichess",
      hidden: "Скрыто"
    },
    forcedProviderNotice:
      "Если выбрана определённая платформа, зрители без аккаунта на ней не получат шахматный значок.",
    allPlatformBadges: "Показывать все",
    platformBadges: {
      chzzk: "Значки Chzzk",
      twitch: "Значки Twitch"
    },
    visibleBadges: "Видимые значки",
    badgeKind: {
      role: "Стример и менеджер",
      subscription: "Подписка",
      donation: "Пожертвование",
      subscription_gift: "Подарочная подписка",
      unknown: "Другое"
    },
    twitchBadgeKind: {
      role: "Стример, модератор и VIP",
      subscription: "Подписчик и основатель",
      donation: "Bits",
      subscription_gift: "Подарочная подписка",
      unknown: "Глобальные и другие"
    },
    backgroundVisible: "Показывать фон",
    backgroundColor: "Цвет фона",
    customBackgroundColor: "Выбрать свой цвет фона",
    backgroundOpacity: "Прозрачность фона",
    nicknameVisible: "Показывать никнейм",
    nicknameColor: "Цвет никнейма",
    messageColor: "Цвет сообщения",
    colorMode: {
      fixed: "Один цвет",
      by_user: "Для каждого пользователя",
      by_role: "По роли",
      message_by_role: "По типу"
    },
    customNicknameColor: "Выбрать свой цвет никнейма",
    customMessageColor: "Выбрать свой цвет сообщения",
    role: {
      streamer: "Стример",
      manager: "Менеджер",
      subscriber: "Подписчик",
      donator: "Жертвователь",
      viewer: "Зритель"
    },
    font: "Шрифт",
    systemFont: "Системный",
    fontPreview: "Съешь же ещё этих мягких французских булок, да выпей чаю.",
    fontSize: "Размер шрифта",
    fontWeight: "Толщина шрифта",
    lineHeight: "Межстрочный интервал",
    save: "Сохранить оформление",
    reset: "Сбросить настройки",
    resetConfirm: "Сбросить все настройки оформления чата?",
    requestFailed: "Запрос завершился с ошибкой."
  },
  preview: {
    frameLabel: "Предпросмотр оверлея чата",
    empty: "Сообщений для предпросмотра пока нет",
    nickname: "Никнейм",
    nicknamePlaceholder: "Никнейм зрителя",
    rating: "Рейтинг",
    optional: "Необязательно",
    role: "Роль",
    roleLabel: "Роль в предпросмотре чата",
    badgeType: "Тип значка",
    badgeLabel: "Значок {{provider}}",
    message: "Сообщение",
    messagePlaceholder: "Введите сообщение для предпросмотра",
    add: "Добавить в предпросмотр"
  },
  authCallback: {
    missingCode: "Код входа отсутствует.",
    loginFailed: "Не удалось войти.",
    loggingIn: "Выполняется вход через аккаунт стриминговой платформы.",
    success: "Аккаунт подключён",
    successDescription:
      "{{name}} подключён в режиме «{{role}}».",
    continue: "Продолжить",
    failure: "Не удалось подключить аккаунт",
    invalidCode: "Код входа истёк или недействителен."
  },
  api: {
    signInRequired: "Необходимо войти в EloBadge.",
    requestFailed: "Не удалось выполнить запрос.",
    serverLoginFailed: "Не удалось подтвердить вход на сервере.",
    adminRequired: "У этого аккаунта нет прав администратора.",
    overlayLoadFailed: "Не удалось загрузить оверлей."
  },
  accountDeletion: {
    confirmation: "УДАЛИТЬ АККАУНТ",
    title: "Удаление аккаунта",
    description:
      "Безвозвратно удалите подключённые шахматные данные и настройки трансляции.",
    action: "Удалить аккаунт EloBadge",
    dialogTitle: "Удалить аккаунт EloBadge?",
    warning:
      "Подключения Chess.com и Lichess, рейтинги, URL оверлея и настройки оформления будут удалены. Существующие URL источника браузера сразу перестанут работать.",
    close: "Закрыть окно удаления аккаунта",
    instruction: "Чтобы продолжить, введите {{text}}.",
    deleting: "Удаление",
    permanentDelete: "Удалить безвозвратно",
    failed: "Не удалось удалить аккаунт EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Настоящая Политика конфиденциальности предоставлена на корейском языке, и эта версия является определяющей в соответствии с законодательством Республики Корея."
  }
} as const;

export default ru;
