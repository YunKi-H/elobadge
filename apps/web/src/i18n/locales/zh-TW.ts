const zhTW = {
  common: {
    streamer: "實況主",
    viewer: "觀眾",
    signOut: "登出",
    signingOut: "正在登出",
    loading: "載入中",
    connect: "連線",
    disconnect: "中斷連線",
    cancel: "取消",
    close: "關閉",
    retry: "再試一次",
    refresh: "重新整理",
    refreshing: "正在重新整理",
    error: "錯誤",
    connected: "已連線",
    notConnected: "未連線"
  },
  language: {
    label: "語言"
  },
  app: {
    mainNavigation: "主導覽",
    signOutFailed: "無法登出，請再試一次。",
    support: "聯絡與錯誤回報：",
    privacy: "隱私權政策"
  },
  home: {
    description:
      "在 Chzzk 和 Twitch 聊天訊息旁顯示觀眾的西洋棋等級分。",
    broadcastTitle: "實況設定",
    broadcastDescription:
      "連接實況聊天室並管理通用的瀏覽器來源網址。",
    streamerAction: "實況主控制台",
    ratingTitle: "連結等級分",
    ratingDescription:
      "連結實況平台、Chess.com 和 Lichess 帳號以管理您的等級分。",
    viewerAction: "觀眾控制台"
  },
  login: {
    title: "{{role}}登入",
    chzzk: "使用 Chzzk 繼續",
    twitch: "使用 Twitch 繼續"
  },
  streamer: {
    title: "實況聊天圖層",
    preview: "聊天預覽"
  },
  viewer: {
    title: "帳號連結"
  },
  route: {
    loading: "正在載入頁面",
    notFound: "找不到頁面",
    home: "返回首頁"
  },
  customCssGuide: {
    title: "自訂 CSS 指南",
    intro:
      "使用聊天圖層提供的 class 和 data 屬性來自訂聊天外觀。您的 CSS 會以相同方式套用至預覽與瀏覽器來源。",
    back: "返回實況主控制台",
    selectors: {
      title: "支援的選擇器",
      selector: "選擇器",
      target: "目標",
      items: {
        overlay: "整個聊天圖層區域",
        messageList: "聊天訊息清單",
        message: "單則聊天訊息框",
        metadata: "平台徽章、等級分徽章與暱稱",
        platformBadges: "平台徽章群組",
        platformBadge: "單一 Chzzk 或 Twitch 徽章圖片",
        ratingBadge: "Chess.com 或 Lichess 等級分徽章的外框",
        ratingBadgeContent: "等級分徽章的圖示與數字",
        nickname: "聊天訊息作者的暱稱",
        content: "聊天訊息內容",
        emote: "聊天訊息中的表情圖片"
      }
    },
    attributes: { title: "Data 屬性" },
    variables: {
      title: "CSS 變數",
      description:
        "這些變數包含根據外觀設定計算的值。可使用 var(--名稱) 讀取，或在支援的聊天圖層元素上覆寫。"
    },
    examples: {
      title: "範例",
      roles: "依觀眾身分設定樣式",
      ratings: "等級分徽章樣式",
      bubble: "對話框尾端"
    },
    limits: {
      title: "限制",
      size: "CSS 的 UTF-8 大小上限為 20 KB。",
      selectors: "選擇器必須以支援的聊天圖層 class 開頭。",
      resources: "不允許使用 url()、外部圖片與外部資源。",
      atRules: "不允許使用 @import、@font-face 和 @keyframes 等 at-rule。",
      disabled: "關閉自訂 CSS 後會保留內容，但不會套用到聊天圖層。"
    }
  },
  badgePreference: {
    default: "預設徽章",
    error: "徽章選擇錯誤",
    loadFailed: "無法載入徽章設定。",
    saveFailed: "無法變更徽章。"
  },
  chessAccount: {
    loading: "正在檢查帳號資訊。",
    disconnect: "中斷連線",
    lastUpdated: "最後更新於 {{date}}",
    refreshInMinutes: "{{count}} 分鐘後重新整理",
    games_one: "{{count}} 局",
    games_other: "{{count}} 局",
    highestApplied: "目前使用的最高等級分",
    noSupportedRatings: "找不到支援的時限等級分。",
    requestFailed: "無法完成要求。"
  },
  chesscom: {
    title: "Chess.com 帳號",
    description: "載入快棋、超快棋與子彈棋等級分。",
    refreshTitle: "重新整理 Chess.com 等級分",
    disconnectConfirm:
      "要中斷 Chess.com 帳號連線並移除目前的聊天徽章嗎？",
    username: "Chess.com 使用者名稱",
    lookup: "搜尋帳號",
    verified: "Chess.com 帳號擁有權已驗證。",
    unverifiedNotice:
      "在帳號擁有權完成驗證前，此等級分不會顯示於聊天圖層。",
    createCode: "建立驗證碼",
    locationInstruction:
      "請將下方代碼完整輸入 Chess.com 個人檔案的所在地（Location）欄位並儲存。",
    copyCode: "複製驗證碼",
    openProfileSettings: "開啟個人檔案設定",
    confirmVerification: "已儲存，立即驗證",
    expiryNotice:
      "驗證碼有效期限為 48 小時。Chess.com 公開 API 的快取可能導致個人檔案變更延遲生效。"
  },
  lichess: {
    title: "Lichess 帳號",
    description: "載入子彈棋、超快棋、快棋與慢棋等級分。",
    refreshTitle: "重新整理 Lichess 等級分",
    disconnectConfirm:
      "要中斷 Lichess 帳號連線並移除目前的徽章嗎？",
    connect: "使用 Lichess 連線",
    connected: "Lichess 帳號已連線。",
    expired: "Lichess 連線要求已逾時，請再試一次。",
    failed: "無法連接 Lichess 帳號，請再試一次。",
    verified: "Lichess 帳號擁有權已驗證。"
  },
  platformBadge: "平台徽章",
  platforms: {
    title: "實況平台",
    loading: "正在檢查已連線的帳號。",
    noAccount: "沒有已連線的帳號",
    permissionRequired: "需要聊天權限",
    permissionStatus: "需要授權",
    grantPermission: "授權",
    revokePermission: "撤銷",
    reconnectRequired: "需要重新連線",
    connecting: "正在連線",
    alternativeRequired:
      "請先連結另一個登入帳號，再中斷此帳號的連線。",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "要中斷 Chzzk 帳號連線並撤銷聊天存取權嗎？",
      disconnectPermissionConfirm:
        "要撤銷 Chzzk 聊天存取權嗎？Chzzk 登入帳號會保持連線。",
      accountDisconnected: "Chzzk 已中斷連線。",
      permissionDisconnected: "Chzzk 聊天存取權已撤銷。",
      connectAccount: "連接 Chzzk 帳號",
      disconnectAccount: "中斷 Chzzk 連線",
      connectPermission: "授權 Chzzk 聊天存取權",
      disconnectPermission: "撤銷 Chzzk 聊天存取權",
      connected: "Chzzk 帳號已連線。",
      streamerConnected:
        "Chzzk 帳號及其聊天存取權已連線。",
      conflict:
        "此 Chzzk 帳號已連結至其他 EloBadge 使用者。",
      failed: "無法連接 Chzzk 帳號，請再試一次。",
      streamerFailed:
        "無法完成 Chzzk 連線或聊天授權。"
    },
    twitch: {
      disconnectAccountConfirm:
        "要中斷 Twitch 帳號連線並撤銷聊天存取權嗎？",
      disconnectPermissionConfirm:
        "要撤銷 Twitch 聊天存取權嗎？Twitch 登入帳號會保持連線。",
      accountDisconnected: "Twitch 已中斷連線。",
      permissionDisconnected: "Twitch 聊天存取權已撤銷。",
      connectAccount: "連接 Twitch 帳號",
      disconnectAccount: "中斷 Twitch 連線",
      connectPermission: "授權 Twitch 聊天存取權",
      disconnectPermission: "撤銷 Twitch 聊天存取權",
      connected: "Twitch 帳號已連線。",
      streamerConnected:
        "Twitch 帳號及其聊天存取權已連線。",
      denied: "Twitch 連線要求已取消。",
      expired: "Twitch 連線要求已逾時，請再試一次。",
      conflict:
        "此 Twitch 帳號已連結至其他 EloBadge 使用者。",
      failed: "無法連接 Twitch 帳號，請再試一次。",
      streamerFailed:
        "無法完成 Twitch 連線或聊天授權。"
    },
    loadFailed: "無法載入實況平台連線資訊。"
  },
  overlay: {
    title: "瀏覽器來源聊天圖層",
    description:
      "適用於 OBS Studio、XSplit 及其他支援瀏覽器來源的實況軟體。已針對 600 px 寬度最佳化；請依場景調整高度。",
    signInFirst: "請先使用上方的實況平台帳號登入。",
    createUrl: "建立網址",
    urlLabel: "瀏覽器來源網址",
    showUrl: "顯示網址",
    hideUrl: "隱藏網址",
    copyUrl: "複製網址",
    copied: "已複製",
    enable: "啟用",
    disable: "停用",
    rotate: "更換網址",
    rotateConfirm:
      "要撤銷目前的聊天圖層網址並產生新網址嗎？",
    general: "一般",
    badges: "徽章",
    background: "聊天背景",
    colors: "聊天顏色",
    fonts: "聊天字型",
    maxWidth: "聊天最大寬度",
    alignment: "聊天對齊方式",
    alignmentOption: {
      left: "靠左對齊",
      center: "置中對齊",
      right: "靠右對齊"
    },
    messageLayout: "暱稱與訊息配置",
    messageLayoutOption: {
      inline: "單行",
      stacked: "換行",
      aligned: "起始位置對齊",
      individual: "依訊息分別對齊"
    },
    nicknameSeparatorVisible: "在暱稱後顯示冒號（:）",
    alignedNicknameRightAligned: "暱稱靠右對齊",
    messageBoxFilled: "填滿聊天框",
    customCssEnabled: "使用自訂 CSS",
    customCss: "自訂 CSS",
    customCssGuide: "自訂 CSS 指南",
    restoreCustomCss: "還原上次儲存的 CSS",
    restoreCustomCssConfirm: "要還原上次儲存的自訂 CSS 嗎？",
    clearCustomCss: "清除自訂 CSS",
    clearCustomCssConfirm: "要清除所有自訂 CSS 內容嗎？",
    unsavedChangesConfirm: "有尚未儲存的外觀設定。要離開此頁面嗎？",
    customCssPresets: "載入 CSS 範例",
    applyCustomCssPresetConfirm: "要以「{{name}}」範例取代目前的 CSS 嗎？",
    customCssPreset: {
      defaults: "預設樣式",
      bubble: "對話框",
      transparent: "透明聊天",
      nickname: "突顯暱稱"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "自訂 CSS 不得超過 20 KB。",
    customCssError: {
      invalid_syntax: "請檢查 CSS 語法。",
      at_rule_not_allowed: "不允許使用 @import 和 @font-face 等 at-rule。",
      external_resource_not_allowed: "不允許使用外部網址與圖片資源。",
      selector_not_allowed: "選擇器必須限制在支援的 EloBadge 聊天圖層元素內。",
      property_not_allowed: "CSS 包含基於安全性而封鎖的屬性。",
      invalid_property_value: "CSS 包含瀏覽器不支援的屬性值。",
      too_large: "自訂 CSS 不得超過 20 KB。"
    },
    duration: "訊息顯示時間",
    keep: "永久顯示",
    seconds_one: "{{count}} 秒",
    seconds_other: "{{count}} 秒",
    defaultSuffix: "（預設）",
    ratingBadge: "西洋棋等級分徽章",
    ratingPolicy: {
      viewer_choice: "使用觀眾的選擇",
      chesscom_only: "僅 Chess.com",
      lichess_only: "僅 Lichess",
      hidden: "隱藏"
    },
    forcedProviderNotice:
      "選擇特定平台後，未連結該平台帳號的觀眾不會顯示西洋棋徽章。",
    allPlatformBadges: "全部顯示",
    platformBadges: {
      chzzk: "Chzzk 徽章",
      twitch: "Twitch 徽章"
    },
    visibleBadges: "顯示的徽章",
    badgeKind: {
      role: "實況主與管理員",
      subscription: "訂閱",
      donation: "贊助",
      subscription_gift: "贈送訂閱",
      unknown: "其他"
    },
    twitchBadgeKind: {
      role: "實況主、版主與 VIP",
      subscription: "訂閱者與創始訂閱者",
      donation: "Bits",
      subscription_gift: "贈送訂閱",
      unknown: "全域與其他"
    },
    backgroundVisible: "顯示背景",
    backgroundColor: "背景顏色",
    customBackgroundColor: "選擇自訂背景顏色",
    backgroundOpacity: "背景不透明度",
    nicknameVisible: "顯示暱稱",
    nicknameColor: "暱稱顏色",
    messageColor: "訊息顏色",
    colorMode: {
      fixed: "單一顏色",
      by_user: "依使用者",
      by_role: "依身分",
      message_by_role: "依類型"
    },
    customNicknameColor: "選擇自訂暱稱顏色",
    customMessageColor: "選擇自訂訊息顏色",
    role: {
      streamer: "實況主",
      manager: "管理員",
      subscriber: "訂閱者",
      donator: "贊助者",
      viewer: "觀眾"
    },
    font: "字型",
    systemFont: "系統預設字型",
    fontPreview: "天地玄黃，宇宙洪荒，日月盈昃，辰宿列張。",
    fontSize: "字型大小",
    fontWeight: "字型粗細",
    lineHeight: "行距",
    save: "儲存外觀",
    reset: "還原預設值",
    resetConfirm: "要將所有聊天外觀設定還原為預設值嗎？",
    requestFailed: "要求失敗。"
  },
  preview: {
    frameLabel: "聊天圖層預覽",
    empty: "目前沒有預覽訊息",
    nickname: "暱稱",
    nicknamePlaceholder: "觀眾暱稱",
    rating: "等級分",
    optional: "選填",
    role: "身分",
    roleLabel: "聊天預覽身分",
    badgeType: "徽章類型",
    badgeLabel: "{{provider}} 徽章",
    message: "訊息",
    messagePlaceholder: "輸入預覽訊息",
    add: "新增預覽"
  },
  authCallback: {
    missingCode: "缺少登入代碼。",
    loginFailed: "登入失敗。",
    loggingIn: "正在使用您的實況平台帳號登入。",
    success: "帳號已連線",
    successDescription:
      "{{name}} 已以{{role}}模式連線。",
    continue: "繼續",
    failure: "帳號連線失敗",
    invalidCode: "登入代碼已逾時或無效。"
  },
  api: {
    signInRequired: "您必須登入 EloBadge。",
    requestFailed: "無法完成要求。",
    serverLoginFailed: "無法驗證伺服器登入。",
    adminRequired: "此帳號沒有管理員權限。",
    overlayLoadFailed: "無法載入聊天圖層。"
  },
  accountDeletion: {
    confirmation: "刪除帳號",
    title: "刪除帳號",
    description:
      "永久刪除已連結的西洋棋資料與實況設定。",
    action: "刪除 EloBadge 帳號",
    dialogTitle: "要刪除您的 EloBadge 帳號嗎？",
    warning:
      "Chess.com 與 Lichess 連線、等級分、聊天圖層網址及外觀設定都會被刪除。現有的瀏覽器來源網址將立即停止運作。",
    close: "關閉帳號刪除對話框",
    instruction: "請輸入{{text}}以繼續。",
    deleting: "正在刪除",
    permanentDelete: "永久刪除",
    failed: "無法刪除 EloBadge 帳號。"
  },
  privacy: {
    koreanOriginalNotice:
      "本隱私權政策依韓國法律以韓文版本作為具有約束力的正式版本。"
  }
} as const;

export default zhTW;
