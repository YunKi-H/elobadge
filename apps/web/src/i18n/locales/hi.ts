const hi = {
  common: {
    streamer: "स्ट्रीमर",
    viewer: "दर्शक",
    signOut: "साइन आउट",
    signingOut: "साइन आउट हो रहा है",
    loading: "लोड हो रहा है",
    connect: "कनेक्ट करें",
    disconnect: "डिस्कनेक्ट करें",
    cancel: "रद्द करें",
    close: "बंद करें",
    retry: "फिर से कोशिश करें",
    refresh: "रीफ़्रेश करें",
    refreshing: "रीफ़्रेश हो रहा है",
    error: "त्रुटि",
    connected: "कनेक्टेड",
    notConnected: "कनेक्ट नहीं है"
  },
  language: {
    label: "भाषा"
  },
  app: {
    mainNavigation: "मुख्य नेविगेशन",
    signOutFailed: "साइन आउट नहीं हो सका। कृपया फिर से कोशिश करें।",
    support: "संपर्क और त्रुटि रिपोर्ट:",
    privacy: "गोपनीयता नीति"
  },
  home: {
    description:
      "Chzzk और Twitch चैट संदेशों के साथ दर्शकों की शतरंज रेटिंग दिखाएँ।",
    broadcastTitle: "ब्रॉडकास्ट सेटिंग्स",
    broadcastDescription:
      "ब्रॉडकास्ट चैट कनेक्ट करें और एक यूनिवर्सल ब्राउज़र सोर्स URL प्रबंधित करें।",
    streamerAction: "स्ट्रीमर डैशबोर्ड",
    ratingTitle: "रेटिंग कनेक्ट करें",
    ratingDescription:
      "अपनी रेटिंग प्रबंधित करने के लिए ब्रॉडकास्ट प्लेटफ़ॉर्म, Chess.com और Lichess खाते कनेक्ट करें।",
    viewerAction: "दर्शक डैशबोर्ड"
  },
  login: {
    title: "{{role}} लॉगिन",
    chzzk: "Chzzk के साथ जारी रखें",
    twitch: "Twitch के साथ जारी रखें"
  },
  streamer: {
    title: "ब्रॉडकास्ट ओवरले",
    preview: "चैट प्रीव्यू"
  },
  viewer: {
    title: "खाता कनेक्शन"
  },
  route: {
    loading: "पेज लोड हो रहा है",
    notFound: "पेज नहीं मिला",
    home: "होम पर वापस जाएँ"
  },
  customCssGuide: {
    title: "कस्टम CSS गाइड",
    intro:
      "चैट का रूप बदलने के लिए ओवरले में दिए गए क्लास और डेटा एट्रिब्यूट का उपयोग करें। आपका CSS प्रीव्यू और ब्राउज़र सोर्स दोनों पर एक जैसा लागू होता है।",
    back: "स्ट्रीमर डैशबोर्ड पर वापस जाएँ",
    selectors: {
      title: "समर्थित सेलेक्टर",
      selector: "सेलेक्टर",
      target: "लक्ष्य",
      items: {
        overlay: "पूरा ओवरले क्षेत्र",
        messageList: "चैट संदेशों की सूची",
        message: "एक चैट संदेश बॉक्स",
        metadata: "प्लेटफ़ॉर्म बैज, रेटिंग बैज और निकनेम",
        platformBadges: "प्लेटफ़ॉर्म बैज का समूह",
        platformBadge: "एक Chzzk या Twitch बैज इमेज",
        ratingBadge: "Chess.com या Lichess रेटिंग बैज का बाहरी क्षेत्र",
        ratingBadgeContent: "रेटिंग बैज का आइकन और संख्या",
        nickname: "चैट लेखक का निकनेम",
        content: "चैट संदेश की सामग्री",
        emote: "चैट संदेश में इमोट इमेज"
      }
    },
    attributes: { title: "डेटा एट्रिब्यूट" },
    variables: {
      title: "CSS वेरिएबल",
      description:
        "इनमें अपीयरेंस सेटिंग्स से निकाले गए मान होते हैं। इन्हें var(--name) से पढ़ें या समर्थित ओवरले एलिमेंट पर ओवरराइड करें।"
    },
    examples: {
      title: "उदाहरण",
      roles: "दर्शक की भूमिका के अनुसार स्टाइल",
      ratings: "रेटिंग बैज स्टाइल",
      bubble: "स्पीच बबल की पूँछ"
    },
    limits: {
      title: "सीमाएँ",
      size: "UTF-8 में CSS की सीमा 20 KB है।",
      selectors: "सेलेक्टर किसी समर्थित ओवरले क्लास से शुरू होना चाहिए।",
      resources: "url(), बाहरी इमेज और बाहरी रिसोर्स की अनुमति नहीं है।",
      atRules: "@import, @font-face और @keyframes जैसे at-rule की अनुमति नहीं है।",
      disabled: "कस्टम CSS बंद करने पर उसका कंटेंट सुरक्षित रहता है, लेकिन ओवरले पर लागू नहीं होता।"
    }
  },
  badgePreference: {
    default: "डिफ़ॉल्ट बैज",
    error: "बैज चयन में त्रुटि",
    loadFailed: "बैज सेटिंग्स लोड नहीं हो सकीं।",
    saveFailed: "बैज बदला नहीं जा सका।"
  },
  chessAccount: {
    loading: "खाते की जानकारी जाँची जा रही है।",
    disconnect: "डिस्कनेक्ट करें",
    lastUpdated: "अंतिम अपडेट {{date}}",
    refreshInMinutes: "{{count}} मिनट में रीफ़्रेश",
    games_one: "{{count}} गेम",
    games_other: "{{count}} गेम",
    highestApplied: "सबसे अधिक रेटिंग उपयोग में है",
    noSupportedRatings: "समर्थित टाइम कंट्रोल की कोई रेटिंग नहीं मिली।",
    requestFailed: "अनुरोध पूरा नहीं हो सका।"
  },
  chesscom: {
    title: "Chess.com खाता",
    description: "Rapid, Blitz और Bullet रेटिंग लोड करता है।",
    refreshTitle: "Chess.com रेटिंग रीफ़्रेश करें",
    disconnectConfirm:
      "Chess.com खाता डिस्कनेक्ट करके मौजूदा चैट बैज हटाएँ?",
    username: "Chess.com यूज़रनेम",
    lookup: "खाता खोजें",
    verified: "Chess.com खाते के स्वामित्व की पुष्टि हो गई है।",
    unverifiedNotice:
      "स्वामित्व की पुष्टि होने तक यह रेटिंग चैट ओवरले में नहीं दिखाई देगी।",
    createCode: "वेरिफ़िकेशन कोड बनाएँ",
    locationInstruction:
      "नीचे दिया गया कोड अपने Chess.com प्रोफ़ाइल के Location फ़ील्ड में बिल्कुल सही दर्ज करके सेव करें।",
    copyCode: "वेरिफ़िकेशन कोड कॉपी करें",
    openProfileSettings: "प्रोफ़ाइल सेटिंग्स खोलें",
    confirmVerification: "मैंने सेव कर दिया है, अब पुष्टि करें",
    expiryNotice:
      "कोड 48 घंटे तक मान्य है। Chess.com के पब्लिक API कैश के कारण प्रोफ़ाइल में बदलाव दिखने में देर हो सकती है।"
  },
  lichess: {
    title: "Lichess खाता",
    description: "Bullet, Blitz, Rapid और Classical रेटिंग लोड करता है।",
    refreshTitle: "Lichess रेटिंग रीफ़्रेश करें",
    disconnectConfirm:
      "Lichess खाता डिस्कनेक्ट करके मौजूदा बैज हटाएँ?",
    connect: "Lichess से कनेक्ट करें",
    connected: "Lichess खाता कनेक्ट हो गया है।",
    expired: "Lichess कनेक्शन अनुरोध की समय-सीमा समाप्त हो गई। कृपया फिर से कोशिश करें।",
    failed: "Lichess खाता कनेक्ट नहीं हो सका। कृपया फिर से कोशिश करें।",
    verified: "Lichess खाते के स्वामित्व की पुष्टि हो गई है।"
  },
  platformBadge: "प्लेटफ़ॉर्म बैज",
  platforms: {
    title: "ब्रॉडकास्ट प्लेटफ़ॉर्म",
    loading: "कनेक्टेड खाते जाँचे जा रहे हैं।",
    noAccount: "कोई कनेक्टेड खाता नहीं",
    permissionRequired: "चैट अनुमति आवश्यक है",
    permissionStatus: "अनुमति आवश्यक है",
    grantPermission: "अनुमति दें",
    revokePermission: "अनुमति वापस लें",
    reconnectRequired: "फिर से कनेक्ट करना आवश्यक है",
    connecting: "कनेक्ट हो रहा है",
    alternativeRequired:
      "इस खाते को डिस्कनेक्ट करने से पहले कोई दूसरा लॉगिन खाता कनेक्ट करें।",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Chzzk खाता डिस्कनेक्ट करके चैट एक्सेस वापस लें?",
      disconnectPermissionConfirm:
        "Chzzk चैट एक्सेस वापस लें? Chzzk लॉगिन खाता कनेक्टेड रहेगा।",
      accountDisconnected: "Chzzk डिस्कनेक्ट हो गया है।",
      permissionDisconnected: "Chzzk चैट एक्सेस वापस ले लिया गया है।",
      connectAccount: "Chzzk खाता कनेक्ट करें",
      disconnectAccount: "Chzzk डिस्कनेक्ट करें",
      connectPermission: "Chzzk चैट एक्सेस की अनुमति दें",
      disconnectPermission: "Chzzk चैट एक्सेस वापस लें",
      connected: "Chzzk खाता कनेक्ट हो गया है।",
      streamerConnected:
        "Chzzk और उसका चैट एक्सेस कनेक्ट हो गया है।",
      conflict:
        "यह Chzzk खाता पहले से किसी अन्य EloBadge उपयोगकर्ता से कनेक्ट है।",
      failed: "Chzzk खाता कनेक्ट नहीं हो सका। कृपया फिर से कोशिश करें।",
      streamerFailed:
        "Chzzk कनेक्शन या चैट अनुमति पूरी नहीं हो सकी।"
    },
    twitch: {
      disconnectAccountConfirm:
        "Twitch खाता डिस्कनेक्ट करके चैट एक्सेस वापस लें?",
      disconnectPermissionConfirm:
        "Twitch चैट एक्सेस वापस लें? Twitch लॉगिन खाता कनेक्टेड रहेगा।",
      accountDisconnected: "Twitch डिस्कनेक्ट हो गया है।",
      permissionDisconnected: "Twitch चैट एक्सेस वापस ले लिया गया है।",
      connectAccount: "Twitch खाता कनेक्ट करें",
      disconnectAccount: "Twitch डिस्कनेक्ट करें",
      connectPermission: "Twitch चैट एक्सेस की अनुमति दें",
      disconnectPermission: "Twitch चैट एक्सेस वापस लें",
      connected: "Twitch खाता कनेक्ट हो गया है।",
      streamerConnected:
        "Twitch और उसका चैट एक्सेस कनेक्ट हो गया है।",
      denied: "Twitch कनेक्शन अनुरोध रद्द कर दिया गया।",
      expired: "Twitch कनेक्शन अनुरोध की समय-सीमा समाप्त हो गई। कृपया फिर से कोशिश करें।",
      conflict:
        "यह Twitch खाता पहले से किसी अन्य EloBadge उपयोगकर्ता से कनेक्ट है।",
      failed: "Twitch खाता कनेक्ट नहीं हो सका। कृपया फिर से कोशिश करें।",
      streamerFailed:
        "Twitch कनेक्शन या चैट अनुमति पूरी नहीं हो सकी।"
    },
    loadFailed: "ब्रॉडकास्ट प्लेटफ़ॉर्म कनेक्शन लोड नहीं हो सके।"
  },
  overlay: {
    title: "ब्राउज़र सोर्स ओवरले",
    description:
      "OBS Studio, XSplit और ब्राउज़र सोर्स समर्थित करने वाले अन्य ब्रॉडकास्ट सॉफ़्टवेयर के साथ काम करता है। 600 px चौड़ाई के लिए अनुकूलित है; ऊँचाई अपने सीन के अनुसार सेट करें।",
    signInFirst: "पहले ऊपर किसी ब्रॉडकास्ट प्लेटफ़ॉर्म खाते से साइन इन करें।",
    createUrl: "URL बनाएँ",
    urlLabel: "ब्राउज़र सोर्स URL",
    showUrl: "URL दिखाएँ",
    hideUrl: "URL छिपाएँ",
    copyUrl: "URL कॉपी करें",
    copied: "कॉपी हो गया",
    enable: "चालू करें",
    disable: "बंद करें",
    rotate: "URL फिर से जारी करें",
    rotateConfirm:
      "मौजूदा ओवरले URL रद्द करके नया URL जारी करें?",
    general: "सामान्य",
    badges: "बैज",
    background: "चैट बैकग्राउंड",
    colors: "चैट के रंग",
    fonts: "चैट फ़ॉन्ट",
    maxWidth: "चैट की अधिकतम चौड़ाई",
    alignment: "चैट अलाइनमेंट",
    alignmentOption: {
      left: "बाएँ अलाइन करें",
      center: "बीच में अलाइन करें",
      right: "दाएँ अलाइन करें"
    },
    messageLayout: "निकनेम और संदेश का लेआउट",
    messageLayoutOption: {
      inline: "एक लाइन",
      stacked: "नई लाइन",
      aligned: "शुरुआत अलाइन करें",
      individual: "हर संदेश को अलग अलाइन करें"
    },
    nicknameSeparatorVisible: "निकनेम के बाद कोलन (:) दिखाएँ",
    alignedNicknameRightAligned: "निकनेम को दाएँ अलाइन करें",
    messageBoxFilled: "चैट बॉक्स भरें",
    customCssEnabled: "कस्टम CSS उपयोग करें",
    customCss: "कस्टम CSS",
    customCssGuide: "कस्टम CSS गाइड",
    restoreCustomCss: "पिछला सेव किया हुआ CSS वापस लाएँ",
    restoreCustomCssConfirm: "पिछला सेव किया हुआ कस्टम CSS वापस लाएँ?",
    clearCustomCss: "कस्टम CSS साफ़ करें",
    clearCustomCssConfirm: "पूरा कस्टम CSS कंटेंट साफ़ करें?",
    unsavedChangesConfirm: "अपीयरेंस सेटिंग्स सेव नहीं हुई हैं। यह पेज छोड़ें?",
    customCssPresets: "CSS उदाहरण लोड करें",
    applyCustomCssPresetConfirm: "मौजूदा CSS को ‘{{name}}’ उदाहरण से बदलें?",
    customCssPreset: {
      defaults: "डिफ़ॉल्ट स्टाइल",
      bubble: "स्पीच बबल",
      transparent: "पारदर्शी चैट",
      nickname: "निकनेम हाइलाइट"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "कस्टम CSS 20 KB या उससे कम होना चाहिए।",
    customCssError: {
      invalid_syntax: "CSS सिंटैक्स जाँचें।",
      at_rule_not_allowed: "@import और @font-face जैसे at-rule की अनुमति नहीं है।",
      external_resource_not_allowed: "बाहरी URL, इमेज और रिसोर्स की अनुमति नहीं है।",
      selector_not_allowed: "सेलेक्टर समर्थित EloBadge ओवरले एलिमेंट के भीतर होने चाहिए।",
      property_not_allowed: "CSS में सुरक्षा कारणों से रोकी गई प्रॉपर्टी है।",
      invalid_property_value: "CSS में ऐसा प्रॉपर्टी मान है जिसे ब्राउज़र समर्थित नहीं करते।",
      too_large: "कस्टम CSS 20 KB या उससे कम होना चाहिए।"
    },
    duration: "संदेश दिखने की अवधि",
    keep: "हमेशा दिखाएँ",
    seconds_one: "{{count}} सेकंड",
    seconds_other: "{{count}} सेकंड",
    defaultSuffix: " (डिफ़ॉल्ट)",
    ratingBadge: "शतरंज रेटिंग बैज",
    ratingPolicy: {
      viewer_choice: "दर्शक की पसंद उपयोग करें",
      chesscom_only: "केवल Chess.com",
      lichess_only: "केवल Lichess",
      hidden: "छिपा हुआ"
    },
    forcedProviderNotice:
      "कोई विशेष प्लेटफ़ॉर्म चुनने पर उस प्लेटफ़ॉर्म का खाता न रखने वाले दर्शकों को शतरंज बैज नहीं मिलेगा।",
    allPlatformBadges: "सभी दिखाएँ",
    platformBadges: {
      chzzk: "Chzzk बैज",
      twitch: "Twitch बैज"
    },
    visibleBadges: "दिखने वाले बैज",
    badgeKind: {
      role: "स्ट्रीमर और मैनेजर",
      subscription: "सब्सक्रिप्शन",
      donation: "दान",
      subscription_gift: "गिफ़्ट सब्सक्रिप्शन",
      unknown: "अन्य"
    },
    twitchBadgeKind: {
      role: "ब्रॉडकास्टर, मॉडरेटर और VIP",
      subscription: "सब्सक्राइबर और फ़ाउंडर",
      donation: "Bits",
      subscription_gift: "गिफ़्ट सब्सक्रिप्शन",
      unknown: "ग्लोबल और अन्य"
    },
    backgroundVisible: "बैकग्राउंड दिखाएँ",
    backgroundColor: "बैकग्राउंड का रंग",
    customBackgroundColor: "अपना बैकग्राउंड रंग चुनें",
    backgroundOpacity: "बैकग्राउंड अपारदर्शिता",
    nicknameVisible: "निकनेम दिखाएँ",
    nicknameColor: "निकनेम का रंग",
    messageColor: "संदेश का रंग",
    colorMode: {
      fixed: "एक रंग",
      by_user: "हर उपयोगकर्ता के लिए",
      by_role: "भूमिका के अनुसार",
      message_by_role: "प्रकार के अनुसार"
    },
    customNicknameColor: "अपना निकनेम रंग चुनें",
    customMessageColor: "अपना संदेश रंग चुनें",
    role: {
      streamer: "स्ट्रीमर",
      manager: "मैनेजर",
      subscriber: "सब्सक्राइबर",
      donator: "दानदाता",
      viewer: "दर्शक"
    },
    font: "फ़ॉन्ट",
    systemFont: "सिस्टम डिफ़ॉल्ट",
    fontPreview: "पंचतंत्र की कहानियाँ हमें जीवन का ज्ञान देती हैं।",
    fontSize: "फ़ॉन्ट आकार",
    fontWeight: "फ़ॉन्ट वज़न",
    lineHeight: "लाइन स्पेसिंग",
    save: "अपीयरेंस सेव करें",
    reset: "डिफ़ॉल्ट पर रीसेट करें",
    resetConfirm: "चैट की सभी अपीयरेंस सेटिंग्स को डिफ़ॉल्ट पर रीसेट करें?",
    requestFailed: "अनुरोध विफल हो गया।"
  },
  preview: {
    frameLabel: "चैट ओवरले प्रीव्यू",
    empty: "अभी कोई प्रीव्यू संदेश नहीं है",
    nickname: "निकनेम",
    nicknamePlaceholder: "दर्शक का निकनेम",
    rating: "रेटिंग",
    optional: "वैकल्पिक",
    role: "भूमिका",
    roleLabel: "चैट प्रीव्यू की भूमिका",
    badgeType: "बैज प्रकार",
    badgeLabel: "{{provider}} बैज",
    message: "संदेश",
    messagePlaceholder: "प्रीव्यू संदेश दर्ज करें",
    add: "प्रीव्यू जोड़ें"
  },
  authCallback: {
    missingCode: "लॉगिन कोड उपलब्ध नहीं है।",
    loginFailed: "लॉगिन विफल हो गया।",
    loggingIn: "ब्रॉडकास्ट प्लेटफ़ॉर्म खाते से साइन इन हो रहा है।",
    success: "खाता कनेक्ट हो गया",
    successDescription:
      "{{name}} को {{role}} मोड में कनेक्ट किया गया।",
    continue: "जारी रखें",
    failure: "खाता कनेक्शन विफल हो गया",
    invalidCode: "लॉगिन कोड की समय-सीमा समाप्त हो गई है या वह अमान्य है।"
  },
  api: {
    signInRequired: "आपको EloBadge में साइन इन करना होगा।",
    requestFailed: "अनुरोध पूरा नहीं किया जा सका।",
    serverLoginFailed: "सर्वर लॉगिन सत्यापित नहीं हो सका।",
    adminRequired: "इस खाते के पास एडमिन एक्सेस नहीं है।",
    overlayLoadFailed: "ओवरले लोड नहीं हो सका।"
  },
  accountDeletion: {
    confirmation: "खाता हटाएँ",
    title: "खाता हटाएँ",
    description:
      "अपने कनेक्टेड शतरंज डेटा और ब्रॉडकास्ट सेटिंग्स को हमेशा के लिए हटाएँ।",
    action: "EloBadge खाता हटाएँ",
    dialogTitle: "अपना EloBadge खाता हटाएँ?",
    warning:
      "Chess.com और Lichess कनेक्शन, रेटिंग, ओवरले URL और अपीयरेंस सेटिंग्स हटा दी जाएँगी। मौजूदा ब्राउज़र सोर्स URL तुरंत काम करना बंद कर देंगे।",
    close: "खाता हटाने वाला डायलॉग बंद करें",
    instruction: "जारी रखने के लिए {{text}} दर्ज करें।",
    deleting: "हटाया जा रहा है",
    permanentDelete: "हमेशा के लिए हटाएँ",
    failed: "EloBadge खाता हटाया नहीं जा सका।"
  },
  privacy: {
    koreanOriginalNotice:
      "यह गोपनीयता नीति कोरियाई कानून के अंतर्गत कोरियाई भाषा में आधिकारिक संस्करण के रूप में उपलब्ध कराई गई है।"
  }
} as const;

export default hi;
