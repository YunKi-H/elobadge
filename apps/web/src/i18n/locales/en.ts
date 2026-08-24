const en = {
  common: {
    streamer: "Streamer",
    viewer: "Viewer",
    signOut: "Sign out",
    signingOut: "Signing out",
    loading: "Loading",
    connect: "Connect",
    disconnect: "Disconnect",
    cancel: "Cancel",
    close: "Close",
    retry: "Try again",
    refresh: "Refresh",
    refreshing: "Refreshing",
    error: "Error",
    connected: "Connected",
    notConnected: "Not connected"
  },
  language: {
    label: "Language"
  },
  app: {
    mainNavigation: "Main navigation",
    signOutFailed: "Could not sign out. Please try again.",
    support: "Contact and bug reports:",
    privacy: "Privacy Policy"
  },
  home: {
    description:
      "Show viewers' chess ratings next to Chzzk and Twitch chat messages.",
    broadcastTitle: "Broadcast settings",
    broadcastDescription:
      "Connect broadcast chats and manage a universal browser source URL.",
    streamerAction: "Streamer dashboard",
    ratingTitle: "Connect ratings",
    ratingDescription:
      "Connect broadcast platform, Chess.com, and Lichess accounts to manage your ratings.",
    viewerAction: "Viewer dashboard"
  },
  login: {
    title: "{{role}} login",
    chzzk: "Continue with Chzzk",
    twitch: "Continue with Twitch"
  },
  streamer: {
    title: "Broadcast overlay",
    preview: "Chat preview"
  },
  viewer: {
    title: "Account connections"
  },
  route: {
    loading: "Loading page",
    notFound: "Page not found",
    home: "Back to home"
  },
  customCssGuide: {
    title: "Custom CSS guide",
    intro:
      "Use the classes and data attributes exposed by the overlay to customize chat appearance. Your CSS is applied identically to the preview and browser source.",
    back: "Back to streamer dashboard",
    selectors: {
      title: "Supported selectors",
      selector: "Selector",
      target: "Target",
      items: {
        overlay: "The entire overlay area",
        messageList: "The chat message list",
        message: "An individual chat message box",
        metadata: "Platform badges, rating badge, and nickname",
        platformBadges: "The platform badge group",
        platformBadge: "An individual Chzzk or Twitch badge image",
        ratingBadge: "The outer Chess.com or Lichess rating badge",
        ratingBadgeContent: "The rating badge icon and number",
        nickname: "The chat author's nickname",
        content: "The chat message content",
        emote: "An emote image inside a chat message"
      }
    },
    attributes: { title: "Data attributes" },
    variables: {
      title: "CSS variables",
      description:
        "These contain values calculated from the appearance settings. Read them with var(--name), or override them on supported overlay elements."
    },
    examples: {
      title: "Examples",
      roles: "Style by viewer role",
      ratings: "Rating badge styles",
      bubble: "Speech bubble tail"
    },
    limits: {
      title: "Limitations",
      size: "CSS is limited to 20 KB in UTF-8.",
      selectors: "Selectors must start from a supported overlay class.",
      resources: "url(), external images, and external resources are not allowed.",
      atRules: "At-rules such as @import, @font-face, and @keyframes are not allowed.",
      disabled: "Turning custom CSS off preserves the content but does not apply it to the overlay."
    }
  },
  badgePreference: {
    default: "Default badge",
    error: "Badge selection error",
    loadFailed: "Could not load badge settings.",
    saveFailed: "Could not change the badge."
  },
  chessAccount: {
    loading: "Checking account information.",
    disconnect: "Disconnect",
    lastUpdated: "Last updated {{date}}",
    refreshInMinutes: "Refresh in {{count}} min",
    games_one: "{{count}} game",
    games_other: "{{count}} games",
    highestApplied: "Highest rating in use",
    noSupportedRatings: "No supported time-control ratings were found.",
    requestFailed: "Could not complete the request."
  },
  chesscom: {
    title: "Chess.com account",
    description: "Loads Rapid, Blitz, and Bullet ratings.",
    refreshTitle: "Refresh Chess.com ratings",
    disconnectConfirm:
      "Disconnect the Chess.com account and remove its current chat badge?",
    username: "Chess.com username",
    lookup: "Look up account",
    verified: "Chess.com account ownership is verified.",
    unverifiedNotice:
      "This rating will not appear in chat overlays until ownership is verified.",
    createCode: "Create verification code",
    locationInstruction:
      "Enter the code below exactly in the Location field of your Chess.com profile and save it.",
    copyCode: "Copy verification code",
    openProfileSettings: "Open profile settings",
    confirmVerification: "I saved it, verify now",
    expiryNotice:
      "The code is valid for 48 hours. Chess.com's public API cache may delay profile changes."
  },
  lichess: {
    title: "Lichess account",
    description: "Loads Bullet, Blitz, Rapid, and Classical ratings.",
    refreshTitle: "Refresh Lichess ratings",
    disconnectConfirm:
      "Disconnect the Lichess account and remove its current badge?",
    connect: "Connect with Lichess",
    connected: "The Lichess account has been connected.",
    expired: "The Lichess connection request expired. Please try again.",
    failed: "Could not connect the Lichess account. Please try again.",
    verified: "Lichess account ownership is verified."
  },
  platformBadge: "Platform badges",
  platforms: {
    title: "Broadcast platforms",
    loading: "Checking connected accounts.",
    noAccount: "No connected account",
    permissionRequired: "Chat permission required",
    permissionStatus: "Permission required",
    grantPermission: "Authorize",
    revokePermission: "Revoke",
    reconnectRequired: "Reconnect required",
    connecting: "Connecting",
    alternativeRequired:
      "Connect another login account before disconnecting this one.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Disconnect the Chzzk account and revoke chat access?",
      disconnectPermissionConfirm:
        "Revoke Chzzk chat access? The Chzzk login account will remain connected.",
      accountDisconnected: "Chzzk has been disconnected.",
      permissionDisconnected: "Chzzk chat access has been revoked.",
      connectAccount: "Connect Chzzk account",
      disconnectAccount: "Disconnect Chzzk",
      connectPermission: "Authorize Chzzk chat access",
      disconnectPermission: "Revoke Chzzk chat access",
      connected: "The Chzzk account has been connected.",
      streamerConnected:
        "Chzzk and its chat access have been connected.",
      conflict:
        "This Chzzk account is already connected to another EloBadge user.",
      failed: "Could not connect the Chzzk account. Please try again.",
      streamerFailed:
        "Could not complete the Chzzk connection or chat authorization."
    },
    twitch: {
      disconnectAccountConfirm:
        "Disconnect the Twitch account and revoke chat access?",
      disconnectPermissionConfirm:
        "Revoke Twitch chat access? The Twitch login account will remain connected.",
      accountDisconnected: "Twitch has been disconnected.",
      permissionDisconnected: "Twitch chat access has been revoked.",
      connectAccount: "Connect Twitch account",
      disconnectAccount: "Disconnect Twitch",
      connectPermission: "Authorize Twitch chat access",
      disconnectPermission: "Revoke Twitch chat access",
      connected: "The Twitch account has been connected.",
      streamerConnected:
        "Twitch and its chat access have been connected.",
      denied: "The Twitch connection request was cancelled.",
      expired: "The Twitch connection request expired. Please try again.",
      conflict:
        "This Twitch account is already connected to another EloBadge user.",
      failed: "Could not connect the Twitch account. Please try again.",
      streamerFailed:
        "Could not complete the Twitch connection or chat authorization."
    },
    loadFailed: "Could not load broadcast platform connections."
  },
  overlay: {
    title: "Browser source overlay",
    description:
      "Works with OBS Studio, XSplit, and other broadcasting software that supports browser sources. Optimized for a width of 600 px; set the height to fit your scene.",
    signInFirst: "Sign in with a broadcast platform account above.",
    createUrl: "Create URL",
    urlLabel: "Browser source URL",
    showUrl: "Show URL",
    hideUrl: "Hide URL",
    copyUrl: "Copy URL",
    copied: "Copied",
    enable: "Enable",
    disable: "Disable",
    rotate: "Rotate URL",
    rotateConfirm:
      "Revoke the current overlay URL and issue a new one?",
    general: "General",
    badges: "Badges",
    background: "Chat background",
    colors: "Chat colors",
    fonts: "Chat font",
    maxWidth: "Maximum chat width",
    alignment: "Chat alignment",
    alignmentOption: {
      left: "Align left",
      center: "Align center",
      right: "Align right"
    },
    messageLayout: "Nickname and message layout",
    messageLayoutOption: {
      inline: "Single line",
      stacked: "New line",
      aligned: "Aligned start",
      individual: "Per-message alignment"
    },
    nicknameSeparatorVisible: "Show colon (:) after nickname",
    alignedNicknameRightAligned: "Align nickname right",
    messageBoxFilled: "Fill chat box",
    customCssEnabled: "Use custom CSS",
    customCss: "Custom CSS",
    customCssGuide: "Custom CSS guide",
    restoreCustomCss: "Restore last saved CSS",
    restoreCustomCssConfirm: "Restore the last saved custom CSS?",
    clearCustomCss: "Clear custom CSS",
    clearCustomCssConfirm: "Clear all custom CSS content?",
    unsavedChangesConfirm: "You have unsaved appearance settings. Leave this page?",
    customCssPresets: "Load CSS example",
    applyCustomCssPresetConfirm: "Replace the current CSS with the ‘{{name}}’ example?",
    customCssPreset: {
      defaults: "Default style",
      bubble: "Speech bubble",
      transparent: "Transparent chat",
      nickname: "Nickname highlight"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Custom CSS must be 20 KB or smaller.",
    customCssError: {
      invalid_syntax: "Check the CSS syntax.",
      at_rule_not_allowed: "At-rules such as @import and @font-face are not allowed.",
      external_resource_not_allowed: "External URLs and image resources are not allowed.",
      selector_not_allowed: "Selectors must stay within supported EloBadge overlay elements.",
      property_not_allowed: "The CSS contains a property that is blocked for security.",
      invalid_property_value: "The CSS contains a property value that browsers do not support.",
      too_large: "Custom CSS must be 20 KB or smaller."
    },
    duration: "Message duration",
    keep: "Keep indefinitely",
    seconds_one: "{{count}} second",
    seconds_other: "{{count}} seconds",
    defaultSuffix: " (default)",
    ratingBadge: "Chess rating badge",
    ratingPolicy: {
      viewer_choice: "Use viewer preference",
      chesscom_only: "Chess.com only",
      lichess_only: "Lichess only",
      hidden: "Hidden"
    },
    forcedProviderNotice:
      "When a specific platform is selected, viewers without that account will not receive a chess badge.",
    allPlatformBadges: "Show all",
    platformBadges: {
      chzzk: "Chzzk badges",
      twitch: "Twitch badges"
    },
    visibleBadges: "Visible badges",
    badgeKind: {
      role: "Streamer and manager",
      subscription: "Subscription",
      donation: "Donation",
      subscription_gift: "Subscription gift",
      unknown: "Other"
    },
    twitchBadgeKind: {
      role: "Broadcaster, moderator, and VIP",
      subscription: "Subscriber and founder",
      donation: "Bits",
      subscription_gift: "Subscription gift",
      unknown: "Global and other"
    },
    backgroundVisible: "Show background",
    backgroundColor: "Background color",
    customBackgroundColor: "Choose a custom background color",
    backgroundOpacity: "Background opacity",
    nicknameVisible: "Show nickname",
    nicknameColor: "Nickname color",
    messageColor: "Message color",
    colorMode: {
      fixed: "Single color",
      by_user: "Per user",
      by_role: "By role",
      message_by_role: "By type"
    },
    customNicknameColor: "Choose a custom nickname color",
    customMessageColor: "Choose a custom message color",
    role: {
      streamer: "Streamer",
      manager: "Manager",
      subscriber: "Subscriber",
      donator: "Donor",
      viewer: "Viewer"
    },
    font: "Font",
    systemFont: "System default",
    fontPreview: "The quick brown fox jumps over the lazy dog.",
    fontSize: "Font size",
    fontWeight: "Font weight",
    lineHeight: "Line spacing",
    save: "Save appearance",
    reset: "Reset to defaults",
    resetConfirm: "Reset all chat appearance settings to defaults?",
    requestFailed: "The request failed."
  },
  preview: {
    frameLabel: "Chat overlay preview",
    empty: "No preview messages yet",
    nickname: "Nickname",
    nicknamePlaceholder: "Viewer nickname",
    rating: "Rating",
    optional: "Optional",
    role: "Role",
    roleLabel: "Chat preview role",
    badgeType: "Badge type",
    badgeLabel: "{{provider}} badge",
    message: "Message",
    messagePlaceholder: "Enter a preview message",
    add: "Add preview"
  },
  authCallback: {
    missingCode: "The login code is missing.",
    loginFailed: "Login failed.",
    loggingIn: "Signing in with your broadcast platform account.",
    success: "Account connected",
    successDescription:
      "{{name}} was connected in {{role}} mode.",
    continue: "Continue",
    failure: "Account connection failed",
    invalidCode: "The login code is expired or invalid."
  },
  api: {
    signInRequired: "You must sign in to EloBadge.",
    requestFailed: "The request could not be completed.",
    serverLoginFailed: "Could not verify the server login.",
    adminRequired: "This account does not have administrator access.",
    overlayLoadFailed: "Could not load the overlay."
  },
  accountDeletion: {
    confirmation: "DELETE ACCOUNT",
    title: "Delete account",
    description:
      "Permanently delete your connected chess data and broadcast settings.",
    action: "Delete EloBadge account",
    dialogTitle: "Delete your EloBadge account?",
    warning:
      "Chess.com and Lichess connections, ratings, overlay URLs, and appearance settings will be deleted. Existing browser source URLs will stop working immediately.",
    close: "Close account deletion dialog",
    instruction: "Enter {{text}} to continue.",
    deleting: "Deleting",
    permanentDelete: "Delete permanently",
    failed: "Could not delete the EloBadge account."
  },
  privacy: {
    koreanOriginalNotice:
      "This Privacy Policy is provided in Korean as the governing version under Korean law."
  }
} as const;

export default en;
