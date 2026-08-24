const uk = {
  common: {
    streamer: "Стример",
    viewer: "Глядач",
    signOut: "Вийти",
    signingOut: "Вихід",
    loading: "Завантаження",
    connect: "Підключити",
    disconnect: "Відключити",
    cancel: "Скасувати",
    close: "Закрити",
    retry: "Спробувати ще раз",
    refresh: "Оновити",
    refreshing: "Оновлення",
    error: "Помилка",
    connected: "Підключено",
    notConnected: "Не підключено"
  },
  language: {
    label: "Мова"
  },
  app: {
    mainNavigation: "Головна навігація",
    signOutFailed: "Не вдалося вийти. Спробуйте ще раз.",
    support: "Зв'язок і повідомлення про помилки:",
    privacy: "Політика конфіденційності"
  },
  home: {
    description:
      "Показуйте шаховий рейтинг глядачів поруч із повідомленнями чатів Chzzk і Twitch.",
    broadcastTitle: "Налаштування трансляції",
    broadcastDescription:
      "Підключайте чати трансляцій і керуйте універсальною URL-адресою браузерного джерела.",
    streamerAction: "Панель стримера",
    ratingTitle: "Підключення рейтингів",
    ratingDescription:
      "Підключіть облікові записи платформи трансляції, Chess.com і Lichess, щоб керувати рейтингами.",
    viewerAction: "Панель глядача"
  },
  login: {
    title: "Вхід як {{role}}",
    chzzk: "Продовжити через Chzzk",
    twitch: "Продовжити через Twitch"
  },
  streamer: {
    title: "Оверлей трансляції",
    preview: "Попередній перегляд чату"
  },
  viewer: {
    title: "Підключення облікових записів"
  },
  route: {
    loading: "Завантаження сторінки",
    notFound: "Сторінку не знайдено",
    home: "Повернутися на головну"
  },
  customCssGuide: {
    title: "Посібник із власного CSS",
    intro:
      "Використовуйте класи й атрибути даних, які надає оверлей, щоб налаштувати вигляд чату. Ваш CSS однаково застосовується до попереднього перегляду та браузерного джерела.",
    back: "Повернутися до панелі стримера",
    selectors: {
      title: "Підтримувані селектори",
      selector: "Селектор",
      target: "Ціль",
      items: {
        overlay: "Уся область оверлею",
        messageList: "Список повідомлень чату",
        message: "Окремий блок повідомлення чату",
        metadata: "Значки платформи, значок рейтингу та ім'я користувача",
        platformBadges: "Група значків платформи",
        platformBadge: "Окреме зображення значка Chzzk або Twitch",
        ratingBadge: "Зовнішній елемент значка рейтингу Chess.com або Lichess",
        ratingBadgeContent: "Піктограма й число на значку рейтингу",
        nickname: "Ім'я автора повідомлення",
        content: "Вміст повідомлення чату",
        emote: "Зображення емоції в повідомленні чату"
      }
    },
    attributes: { title: "Атрибути даних" },
    variables: {
      title: "Змінні CSS",
      description:
        "Вони містять значення, обчислені з налаштувань вигляду. Зчитуйте їх за допомогою var(--назва) або перевизначайте в підтримуваних елементах оверлею."
    },
    examples: {
      title: "Приклади",
      roles: "Стиль за роллю глядача",
      ratings: "Стилі значків рейтингу",
      bubble: "Хвостик текстової бульбашки"
    },
    limits: {
      title: "Обмеження",
      size: "Розмір CSS обмежено 20 КБ у UTF-8.",
      selectors: "Селектори мають починатися з підтримуваного класу оверлею.",
      resources: "url(), зовнішні зображення й зовнішні ресурси не дозволені.",
      atRules: "At-правила, як-от @import, @font-face і @keyframes, не дозволені.",
      disabled: "Вимкнення власного CSS зберігає його вміст, але не застосовує його до оверлею."
    }
  },
  badgePreference: {
    default: "Стандартний значок",
    error: "Помилка вибору значка",
    loadFailed: "Не вдалося завантажити налаштування значка.",
    saveFailed: "Не вдалося змінити значок."
  },
  chessAccount: {
    loading: "Перевірка даних облікового запису.",
    disconnect: "Відключити",
    lastUpdated: "Останнє оновлення: {{date}}",
    refreshInMinutes: "Оновлення через {{count}} хв",
    games_one: "{{count}} партія",
    games_few: "{{count}} партії",
    games_many: "{{count}} партій",
    games_other: "{{count}} партії",
    highestApplied: "Найвищий рейтинг, що використовується",
    noSupportedRatings: "Не знайдено рейтингу для підтримуваного контролю часу.",
    requestFailed: "Не вдалося виконати запит."
  },
  chesscom: {
    title: "Обліковий запис Chess.com",
    description: "Завантажує рейтинги Rapid, Blitz і Bullet.",
    refreshTitle: "Оновити рейтинги Chess.com",
    disconnectConfirm:
      "Відключити обліковий запис Chess.com і видалити його поточний значок із чату?",
    username: "Ім'я користувача Chess.com",
    lookup: "Знайти обліковий запис",
    verified: "Право власності на обліковий запис Chess.com підтверджено.",
    unverifiedNotice:
      "Цей рейтинг не з'явиться в оверлеях чату, доки право власності на обліковий запис не буде підтверджено.",
    createCode: "Створити код підтвердження",
    locationInstruction:
      "Точно введіть наведений нижче код у поле Розташування (Location) свого профілю Chess.com і збережіть зміни.",
    copyCode: "Копіювати код підтвердження",
    openProfileSettings: "Відкрити налаштування профілю",
    confirmVerification: "Збережено, підтвердити зараз",
    expiryNotice:
      "Код дійсний протягом 48 годин. Кеш загальнодоступного API Chess.com може затримувати відображення змін профілю."
  },
  lichess: {
    title: "Обліковий запис Lichess",
    description: "Завантажує рейтинги Bullet, Blitz, Rapid і Classical.",
    refreshTitle: "Оновити рейтинги Lichess",
    disconnectConfirm:
      "Відключити обліковий запис Lichess і видалити його поточний значок?",
    connect: "Підключити через Lichess",
    connected: "Обліковий запис Lichess підключено.",
    expired: "Термін дії запиту на підключення Lichess минув. Спробуйте ще раз.",
    failed: "Не вдалося підключити обліковий запис Lichess. Спробуйте ще раз.",
    verified: "Право власності на обліковий запис Lichess підтверджено."
  },
  platformBadge: "Значки платформи",
  platforms: {
    title: "Платформи трансляцій",
    loading: "Перевірка підключених облікових записів.",
    noAccount: "Немає підключеного облікового запису",
    permissionRequired: "Потрібен дозвіл на доступ до чату",
    permissionStatus: "Потрібен дозвіл",
    grantPermission: "Авторизувати",
    revokePermission: "Відкликати",
    reconnectRequired: "Потрібне повторне підключення",
    connecting: "Підключення",
    alternativeRequired:
      "Перш ніж відключити цей обліковий запис, підключіть інший обліковий запис для входу.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Відключити обліковий запис Chzzk і відкликати доступ до чату?",
      disconnectPermissionConfirm:
        "Відкликати доступ до чату Chzzk? Обліковий запис Chzzk для входу залишиться підключеним.",
      accountDisconnected: "Обліковий запис Chzzk відключено.",
      permissionDisconnected: "Доступ до чату Chzzk відкликано.",
      connectAccount: "Підключити обліковий запис Chzzk",
      disconnectAccount: "Відключити Chzzk",
      connectPermission: "Авторизувати доступ до чату Chzzk",
      disconnectPermission: "Відкликати доступ до чату Chzzk",
      connected: "Обліковий запис Chzzk підключено.",
      streamerConnected:
        "Обліковий запис Chzzk і доступ до його чату підключено.",
      conflict:
        "Цей обліковий запис Chzzk уже підключено до іншого користувача EloBadge.",
      failed: "Не вдалося підключити обліковий запис Chzzk. Спробуйте ще раз.",
      streamerFailed:
        "Не вдалося завершити підключення Chzzk або авторизацію чату."
    },
    twitch: {
      disconnectAccountConfirm:
        "Відключити обліковий запис Twitch і відкликати доступ до чату?",
      disconnectPermissionConfirm:
        "Відкликати доступ до чату Twitch? Обліковий запис Twitch для входу залишиться підключеним.",
      accountDisconnected: "Обліковий запис Twitch відключено.",
      permissionDisconnected: "Доступ до чату Twitch відкликано.",
      connectAccount: "Підключити обліковий запис Twitch",
      disconnectAccount: "Відключити Twitch",
      connectPermission: "Авторизувати доступ до чату Twitch",
      disconnectPermission: "Відкликати доступ до чату Twitch",
      connected: "Обліковий запис Twitch підключено.",
      streamerConnected:
        "Обліковий запис Twitch і доступ до його чату підключено.",
      denied: "Запит на підключення Twitch скасовано.",
      expired: "Термін дії запиту на підключення Twitch минув. Спробуйте ще раз.",
      conflict:
        "Цей обліковий запис Twitch уже підключено до іншого користувача EloBadge.",
      failed: "Не вдалося підключити обліковий запис Twitch. Спробуйте ще раз.",
      streamerFailed:
        "Не вдалося завершити підключення Twitch або авторизацію чату."
    },
    loadFailed: "Не вдалося завантажити підключення платформ трансляцій."
  },
  overlay: {
    title: "Оверлей браузерного джерела",
    description:
      "Працює з OBS Studio, XSplit та іншим програмним забезпеченням для трансляцій, яке підтримує браузерні джерела. Оптимізовано для ширини 600 px; налаштуйте висоту відповідно до своєї сцени.",
    signInFirst: "Спочатку ввійдіть вище через обліковий запис платформи трансляції.",
    createUrl: "Створити URL",
    urlLabel: "URL браузерного джерела",
    showUrl: "Показати URL",
    hideUrl: "Приховати URL",
    copyUrl: "Копіювати URL",
    copied: "Скопійовано",
    enable: "Увімкнути",
    disable: "Вимкнути",
    rotate: "Змінити URL",
    rotateConfirm:
      "Відкликати поточну URL-адресу оверлею та створити нову?",
    general: "Загальні",
    badges: "Значки",
    background: "Тло чату",
    colors: "Кольори чату",
    fonts: "Шрифт чату",
    maxWidth: "Максимальна ширина чату",
    alignment: "Вирівнювання чату",
    alignmentOption: {
      left: "Вирівняти ліворуч",
      center: "Вирівняти по центру",
      right: "Вирівняти праворуч"
    },
    messageLayout: "Розташування імені й повідомлення",
    messageLayoutOption: {
      inline: "Один рядок",
      stacked: "Новий рядок",
      aligned: "Вирівняний початок",
      individual: "Вирівнювання кожного повідомлення"
    },
    nicknameSeparatorVisible: "Показувати двокрапку (:) після імені",
    alignedNicknameRightAligned: "Вирівнювати ім'я праворуч",
    messageBoxFilled: "Заповнювати блок чату",
    customCssEnabled: "Використовувати власний CSS",
    customCss: "Власний CSS",
    customCssGuide: "Посібник із власного CSS",
    restoreCustomCss: "Відновити останній збережений CSS",
    restoreCustomCssConfirm: "Відновити останній збережений власний CSS?",
    clearCustomCss: "Очистити власний CSS",
    clearCustomCssConfirm: "Очистити весь вміст власного CSS?",
    unsavedChangesConfirm: "Є незбережені налаштування вигляду. Залишити цю сторінку?",
    customCssPresets: "Завантажити приклад CSS",
    applyCustomCssPresetConfirm: "Замінити поточний CSS прикладом «{{name}}»?",
    customCssPreset: {
      defaults: "Стандартний стиль",
      bubble: "Текстова бульбашка",
      transparent: "Прозорий чат",
      nickname: "Виділення імені"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Розмір власного CSS має бути не більше 20 КБ.",
    customCssError: {
      invalid_syntax: "Перевірте синтаксис CSS.",
      at_rule_not_allowed: "At-правила, як-от @import і @font-face, не дозволені.",
      external_resource_not_allowed: "Зовнішні URL-адреси й ресурси зображень не дозволені.",
      selector_not_allowed: "Селектори мають залишатися в межах підтримуваних елементів оверлею EloBadge.",
      property_not_allowed: "CSS містить властивість, заблоковану з міркувань безпеки.",
      invalid_property_value: "CSS містить значення властивості, яке не підтримується браузерами.",
      too_large: "Розмір власного CSS має бути не більше 20 КБ."
    },
    duration: "Тривалість показу повідомлення",
    keep: "Показувати без обмежень",
    seconds_one: "{{count}} секунда",
    seconds_few: "{{count}} секунди",
    seconds_many: "{{count}} секунд",
    seconds_other: "{{count}} секунди",
    defaultSuffix: " (стандартно)",
    ratingBadge: "Значок шахового рейтингу",
    ratingPolicy: {
      viewer_choice: "Використовувати вибір глядача",
      chesscom_only: "Лише Chess.com",
      lichess_only: "Лише Lichess",
      hidden: "Приховано"
    },
    forcedProviderNotice:
      "Якщо вибрано певну платформу, глядачі без облікового запису на ній не отримають шаховий значок.",
    allPlatformBadges: "Показати всі",
    platformBadges: {
      chzzk: "Значки Chzzk",
      twitch: "Значки Twitch"
    },
    visibleBadges: "Видимі значки",
    badgeKind: {
      role: "Стример і адміністратор",
      subscription: "Підписка",
      donation: "Пожертва",
      subscription_gift: "Подарункова підписка",
      unknown: "Інші"
    },
    twitchBadgeKind: {
      role: "Стример, модератор і VIP",
      subscription: "Підписник і засновник",
      donation: "Bits",
      subscription_gift: "Подарункова підписка",
      unknown: "Глобальні та інші"
    },
    backgroundVisible: "Показувати тло",
    backgroundColor: "Колір тла",
    customBackgroundColor: "Вибрати власний колір тла",
    backgroundOpacity: "Непрозорість тла",
    nicknameVisible: "Показувати ім'я",
    nicknameColor: "Колір імені",
    messageColor: "Колір повідомлення",
    colorMode: {
      fixed: "Один колір",
      by_user: "За користувачем",
      by_role: "За роллю",
      message_by_role: "За типом"
    },
    customNicknameColor: "Вибрати власний колір імені",
    customMessageColor: "Вибрати власний колір повідомлення",
    role: {
      streamer: "Стример",
      manager: "Адміністратор",
      subscriber: "Підписник",
      donator: "Благодійник",
      viewer: "Глядач"
    },
    font: "Шрифт",
    systemFont: "Стандартний системний шрифт",
    fontPreview: "Щастям б'єш жука в гаю й фон дзвенить із хащ.",
    fontSize: "Розмір шрифту",
    fontWeight: "Товщина шрифту",
    lineHeight: "Міжрядковий інтервал",
    save: "Зберегти вигляд",
    reset: "Відновити стандартні",
    resetConfirm: "Відновити стандартні значення всіх налаштувань вигляду чату?",
    requestFailed: "Запит не виконано."
  },
  preview: {
    frameLabel: "Попередній перегляд оверлею чату",
    empty: "Повідомлень для перегляду ще немає",
    nickname: "Ім'я",
    nicknamePlaceholder: "Ім'я глядача",
    rating: "Рейтинг",
    optional: "Необов'язково",
    role: "Роль",
    roleLabel: "Роль у попередньому перегляді чату",
    badgeType: "Тип значка",
    badgeLabel: "Значок {{provider}}",
    message: "Повідомлення",
    messagePlaceholder: "Введіть повідомлення для перегляду",
    add: "Додати до перегляду"
  },
  authCallback: {
    missingCode: "Код входу відсутній.",
    loginFailed: "Не вдалося ввійти.",
    loggingIn: "Вхід через обліковий запис платформи трансляції.",
    success: "Обліковий запис підключено",
    successDescription:
      "{{name}} підключено в режимі {{role}}.",
    continue: "Продовжити",
    failure: "Не вдалося підключити обліковий запис",
    invalidCode: "Термін дії коду входу минув або код недійсний."
  },
  api: {
    signInRequired: "Потрібно ввійти в EloBadge.",
    requestFailed: "Не вдалося виконати запит.",
    serverLoginFailed: "Не вдалося підтвердити вхід на сервері.",
    adminRequired: "Цей обліковий запис не має доступу адміністратора.",
    overlayLoadFailed: "Не вдалося завантажити оверлей."
  },
  accountDeletion: {
    confirmation: "ВИДАЛИТИ ОБЛІКОВИЙ ЗАПИС",
    title: "Видалити обліковий запис",
    description:
      "Назавжди видаліть підключені шахові дані й налаштування трансляції.",
    action: "Видалити обліковий запис EloBadge",
    dialogTitle: "Видалити ваш обліковий запис EloBadge?",
    warning:
      "Підключення Chess.com і Lichess, рейтинги, URL-адреси оверлею та налаштування вигляду буде видалено. Наявні URL-адреси браузерних джерел негайно припинять працювати.",
    close: "Закрити вікно видалення облікового запису",
    instruction: "Введіть {{text}}, щоб продовжити.",
    deleting: "Видалення",
    permanentDelete: "Видалити назавжди",
    failed: "Не вдалося видалити обліковий запис EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Цю Політику конфіденційності надано корейською мовою як юридично чинну версію відповідно до законодавства Південної Кореї."
  }
} as const;

export default uk;
