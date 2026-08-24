const zhCN = {
  common: {
    streamer: "主播",
    viewer: "观众",
    signOut: "退出登录",
    signingOut: "正在退出",
    loading: "加载中",
    connect: "连接",
    disconnect: "断开连接",
    cancel: "取消",
    close: "关闭",
    retry: "重试",
    refresh: "刷新",
    refreshing: "正在刷新",
    error: "错误",
    connected: "已连接",
    notConnected: "未连接"
  },
  language: {
    label: "语言"
  },
  app: {
    mainNavigation: "主导航",
    signOutFailed: "无法退出登录，请重试。",
    support: "联系与问题反馈：",
    privacy: "隐私政策"
  },
  home: {
    description:
      "在 Chzzk 和 Twitch 聊天消息旁显示观众的国际象棋等级分。",
    broadcastTitle: "直播设置",
    broadcastDescription:
      "连接直播聊天，并管理通用浏览器源 URL。",
    streamerAction: "主播控制台",
    ratingTitle: "关联等级分",
    ratingDescription:
      "关联直播平台、Chess.com 和 Lichess 账号以管理等级分。",
    viewerAction: "观众控制台"
  },
  login: {
    title: "{{role}}登录",
    chzzk: "使用 Chzzk 继续",
    twitch: "使用 Twitch 继续"
  },
  streamer: {
    title: "直播聊天叠加层",
    preview: "聊天预览"
  },
  viewer: {
    title: "账号关联"
  },
  route: {
    loading: "正在加载页面",
    notFound: "找不到页面",
    home: "返回首页"
  },
  customCssGuide: {
    title: "自定义 CSS 指南",
    intro:
      "使用叠加层提供的 class 和 data 属性来自定义聊天外观。自定义 CSS 会以相同方式应用于预览和浏览器源。",
    back: "返回主播控制台",
    selectors: {
      title: "支持的选择器",
      selector: "选择器",
      target: "目标",
      items: {
        overlay: "整个叠加层区域",
        messageList: "聊天消息列表",
        message: "单条聊天消息框",
        metadata: "平台徽章、等级分徽章和昵称",
        platformBadges: "平台徽章组",
        platformBadge: "单个 Chzzk 或 Twitch 徽章图片",
        ratingBadge: "Chess.com 或 Lichess 等级分徽章的外层",
        ratingBadgeContent: "等级分徽章的图标和数字",
        nickname: "聊天消息发送者的昵称",
        content: "聊天消息内容",
        emote: "聊天消息中的表情图片"
      }
    },
    attributes: { title: "Data 属性" },
    variables: {
      title: "CSS 变量",
      description:
        "这些变量包含根据外观设置计算出的值。可通过 var(--名称) 读取，或在支持的叠加层元素上覆盖。"
    },
    examples: {
      title: "示例",
      roles: "按观众身份设置样式",
      ratings: "等级分徽章样式",
      bubble: "对话气泡尾部"
    },
    limits: {
      title: "限制",
      size: "CSS 的 UTF-8 大小不得超过 20 KB。",
      selectors: "选择器必须以支持的叠加层 class 开头。",
      resources: "不允许使用 url()、外部图片和外部资源。",
      atRules: "不允许使用 @import、@font-face 和 @keyframes 等 at-rule。",
      disabled: "关闭自定义 CSS 后会保留内容，但不会将其应用到叠加层。"
    }
  },
  badgePreference: {
    default: "默认徽章",
    error: "徽章选择错误",
    loadFailed: "无法加载徽章设置。",
    saveFailed: "无法更改徽章。"
  },
  chessAccount: {
    loading: "正在检查账号信息。",
    disconnect: "断开连接",
    lastUpdated: "最后更新于 {{date}}",
    refreshInMinutes: "{{count}} 分钟后刷新",
    games_one: "{{count}} 局",
    games_other: "{{count}} 局",
    highestApplied: "当前使用的最高等级分",
    noSupportedRatings: "未找到支持的时限等级分。",
    requestFailed: "无法完成请求。"
  },
  chesscom: {
    title: "Chess.com 账号",
    description: "加载快棋、超快棋和子弹棋等级分。",
    refreshTitle: "刷新 Chess.com 等级分",
    disconnectConfirm:
      "要断开 Chess.com 账号并移除当前聊天徽章吗？",
    username: "Chess.com 用户名",
    lookup: "查找账号",
    verified: "Chess.com 账号所有权已验证。",
    unverifiedNotice:
      "账号所有权验证完成前，该等级分不会显示在聊天叠加层中。",
    createCode: "生成验证码",
    locationInstruction:
      "请将下方代码准确填入 Chess.com 个人资料的所在地（Location）字段并保存。",
    copyCode: "复制验证码",
    openProfileSettings: "打开个人资料设置",
    confirmVerification: "已保存，立即验证",
    expiryNotice:
      "验证码有效期为 48 小时。Chess.com 公共 API 缓存可能导致个人资料变更延迟生效。"
  },
  lichess: {
    title: "Lichess 账号",
    description: "加载子弹棋、超快棋、快棋和慢棋等级分。",
    refreshTitle: "刷新 Lichess 等级分",
    disconnectConfirm:
      "要断开 Lichess 账号并移除当前徽章吗？",
    connect: "使用 Lichess 连接",
    connected: "Lichess 账号已连接。",
    expired: "Lichess 连接请求已过期，请重试。",
    failed: "无法连接 Lichess 账号，请重试。",
    verified: "Lichess 账号所有权已验证。"
  },
  platformBadge: "平台徽章",
  platforms: {
    title: "直播平台",
    loading: "正在检查已连接的账号。",
    noAccount: "没有已连接的账号",
    permissionRequired: "需要聊天权限",
    permissionStatus: "需要授权",
    grantPermission: "授权",
    revokePermission: "撤销",
    reconnectRequired: "需要重新连接",
    connecting: "正在连接",
    alternativeRequired:
      "请先连接另一个登录账号，再断开此账号。",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "要断开 Chzzk 账号并撤销聊天访问权限吗？",
      disconnectPermissionConfirm:
        "要撤销 Chzzk 聊天访问权限吗？Chzzk 登录账号仍会保持连接。",
      accountDisconnected: "Chzzk 已断开连接。",
      permissionDisconnected: "Chzzk 聊天访问权限已撤销。",
      connectAccount: "连接 Chzzk 账号",
      disconnectAccount: "断开 Chzzk",
      connectPermission: "授权 Chzzk 聊天访问权限",
      disconnectPermission: "撤销 Chzzk 聊天访问权限",
      connected: "Chzzk 账号已连接。",
      streamerConnected:
        "Chzzk 账号及其聊天访问权限已连接。",
      conflict:
        "此 Chzzk 账号已连接到其他 EloBadge 用户。",
      failed: "无法连接 Chzzk 账号，请重试。",
      streamerFailed:
        "无法完成 Chzzk 连接或聊天授权。"
    },
    twitch: {
      disconnectAccountConfirm:
        "要断开 Twitch 账号并撤销聊天访问权限吗？",
      disconnectPermissionConfirm:
        "要撤销 Twitch 聊天访问权限吗？Twitch 登录账号仍会保持连接。",
      accountDisconnected: "Twitch 已断开连接。",
      permissionDisconnected: "Twitch 聊天访问权限已撤销。",
      connectAccount: "连接 Twitch 账号",
      disconnectAccount: "断开 Twitch",
      connectPermission: "授权 Twitch 聊天访问权限",
      disconnectPermission: "撤销 Twitch 聊天访问权限",
      connected: "Twitch 账号已连接。",
      streamerConnected:
        "Twitch 账号及其聊天访问权限已连接。",
      denied: "Twitch 连接请求已取消。",
      expired: "Twitch 连接请求已过期，请重试。",
      conflict:
        "此 Twitch 账号已连接到其他 EloBadge 用户。",
      failed: "无法连接 Twitch 账号，请重试。",
      streamerFailed:
        "无法完成 Twitch 连接或聊天授权。"
    },
    loadFailed: "无法加载直播平台连接信息。"
  },
  overlay: {
    title: "浏览器源叠加层",
    description:
      "适用于 OBS Studio、XSplit 以及其他支持浏览器源的直播软件。针对 600 px 宽度进行了优化；请根据场景调整高度。",
    signInFirst: "请先使用上方的直播平台账号登录。",
    createUrl: "创建 URL",
    urlLabel: "浏览器源 URL",
    showUrl: "显示 URL",
    hideUrl: "隐藏 URL",
    copyUrl: "复制 URL",
    copied: "已复制",
    enable: "启用",
    disable: "停用",
    rotate: "更换 URL",
    rotateConfirm:
      "要撤销当前叠加层 URL 并生成新 URL 吗？",
    general: "常规",
    badges: "徽章",
    background: "聊天背景",
    colors: "聊天颜色",
    fonts: "聊天字体",
    maxWidth: "聊天最大宽度",
    alignment: "聊天对齐方式",
    alignmentOption: {
      left: "左对齐",
      center: "居中对齐",
      right: "右对齐"
    },
    messageLayout: "昵称和消息布局",
    messageLayoutOption: {
      inline: "单行",
      stacked: "换行",
      aligned: "起始位置对齐",
      individual: "按消息分别对齐"
    },
    nicknameSeparatorVisible: "在昵称后显示冒号（:）",
    alignedNicknameRightAligned: "昵称右对齐",
    messageBoxFilled: "填充聊天框",
    customCssEnabled: "使用自定义 CSS",
    customCss: "自定义 CSS",
    customCssGuide: "自定义 CSS 指南",
    restoreCustomCss: "恢复上次保存的 CSS",
    restoreCustomCssConfirm: "要恢复上次保存的自定义 CSS 吗？",
    clearCustomCss: "清空自定义 CSS",
    clearCustomCssConfirm: "要清空所有自定义 CSS 内容吗？",
    unsavedChangesConfirm: "有未保存的外观设置。要离开此页面吗？",
    customCssPresets: "加载 CSS 示例",
    applyCustomCssPresetConfirm: "要用“{{name}}”示例替换当前 CSS 吗？",
    customCssPreset: {
      defaults: "默认样式",
      bubble: "对话气泡",
      transparent: "透明聊天",
      nickname: "突出昵称"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "自定义 CSS 不得超过 20 KB。",
    customCssError: {
      invalid_syntax: "请检查 CSS 语法。",
      at_rule_not_allowed: "不允许使用 @import 和 @font-face 等 at-rule。",
      external_resource_not_allowed: "不允许使用外部 URL 和图片资源。",
      selector_not_allowed: "选择器必须限制在支持的 EloBadge 叠加层元素内。",
      property_not_allowed: "CSS 中包含出于安全原因被禁用的属性。",
      invalid_property_value: "CSS 中包含浏览器不支持的属性值。",
      too_large: "自定义 CSS 不得超过 20 KB。"
    },
    duration: "消息显示时长",
    keep: "始终显示",
    seconds_one: "{{count}} 秒",
    seconds_other: "{{count}} 秒",
    defaultSuffix: "（默认）",
    ratingBadge: "国际象棋等级分徽章",
    ratingPolicy: {
      viewer_choice: "使用观众的选择",
      chesscom_only: "仅 Chess.com",
      lichess_only: "仅 Lichess",
      hidden: "隐藏"
    },
    forcedProviderNotice:
      "选择特定平台后，未关联该平台账号的观众不会显示国际象棋徽章。",
    allPlatformBadges: "全部显示",
    platformBadges: {
      chzzk: "Chzzk 徽章",
      twitch: "Twitch 徽章"
    },
    visibleBadges: "显示的徽章",
    badgeKind: {
      role: "主播和管理员",
      subscription: "订阅",
      donation: "赞助",
      subscription_gift: "赠送订阅",
      unknown: "其他"
    },
    twitchBadgeKind: {
      role: "主播、版主和 VIP",
      subscription: "订阅者和创始订阅者",
      donation: "Bits",
      subscription_gift: "赠送订阅",
      unknown: "全局及其他"
    },
    backgroundVisible: "显示背景",
    backgroundColor: "背景颜色",
    customBackgroundColor: "选择自定义背景颜色",
    backgroundOpacity: "背景透明度",
    nicknameVisible: "显示昵称",
    nicknameColor: "昵称颜色",
    messageColor: "消息颜色",
    colorMode: {
      fixed: "单一颜色",
      by_user: "按用户",
      by_role: "按身份",
      message_by_role: "按类型"
    },
    customNicknameColor: "选择自定义昵称颜色",
    customMessageColor: "选择自定义消息颜色",
    role: {
      streamer: "主播",
      manager: "管理员",
      subscriber: "订阅者",
      donator: "赞助者",
      viewer: "观众"
    },
    font: "字体",
    systemFont: "系统默认字体",
    fontPreview: "天地玄黄，宇宙洪荒，日月盈昃，辰宿列张。",
    fontSize: "字体大小",
    fontWeight: "字体粗细",
    lineHeight: "行间距",
    save: "保存外观",
    reset: "恢复默认设置",
    resetConfirm: "要将所有聊天外观设置恢复为默认值吗？",
    requestFailed: "请求失败。"
  },
  preview: {
    frameLabel: "聊天叠加层预览",
    empty: "暂无预览消息",
    nickname: "昵称",
    nicknamePlaceholder: "观众昵称",
    rating: "等级分",
    optional: "可选",
    role: "身份",
    roleLabel: "聊天预览身份",
    badgeType: "徽章类型",
    badgeLabel: "{{provider}} 徽章",
    message: "消息",
    messagePlaceholder: "输入预览消息",
    add: "添加预览"
  },
  authCallback: {
    missingCode: "缺少登录代码。",
    loginFailed: "登录失败。",
    loggingIn: "正在使用直播平台账号登录。",
    success: "账号已连接",
    successDescription:
      "{{name}} 已以{{role}}模式连接。",
    continue: "继续",
    failure: "账号连接失败",
    invalidCode: "登录代码已过期或无效。"
  },
  api: {
    signInRequired: "您必须登录 EloBadge。",
    requestFailed: "无法完成请求。",
    serverLoginFailed: "无法验证服务器登录。",
    adminRequired: "此账号没有管理员权限。",
    overlayLoadFailed: "无法加载叠加层。"
  },
  accountDeletion: {
    confirmation: "删除账号",
    title: "删除账号",
    description:
      "永久删除已关联的国际象棋数据和直播设置。",
    action: "删除 EloBadge 账号",
    dialogTitle: "要删除您的 EloBadge 账号吗？",
    warning:
      "Chess.com 和 Lichess 连接、等级分、叠加层 URL 以及外观设置都将被删除。现有的浏览器源 URL 会立即停止工作。",
    close: "关闭账号删除对话框",
    instruction: "请输入{{text}}以继续。",
    deleting: "正在删除",
    permanentDelete: "永久删除",
    failed: "无法删除 EloBadge 账号。"
  },
  privacy: {
    koreanOriginalNotice:
      "本隐私政策依据韩国法律以韩文版本作为具有约束力的正式版本。"
  }
} as const;

export default zhCN;
