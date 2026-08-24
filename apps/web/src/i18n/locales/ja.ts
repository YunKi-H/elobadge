const ja = {
  common: {
    streamer: "配信者",
    viewer: "視聴者",
    signOut: "ログアウト",
    signingOut: "ログアウト中",
    loading: "読み込み中",
    connect: "連携",
    disconnect: "連携解除",
    cancel: "キャンセル",
    close: "閉じる",
    retry: "もう一度試す",
    refresh: "更新",
    refreshing: "更新中",
    error: "エラー",
    connected: "連携済み",
    notConnected: "未連携"
  },
  language: {
    label: "言語"
  },
  app: {
    mainNavigation: "メインナビゲーション",
    signOutFailed: "ログアウトできませんでした。もう一度お試しください。",
    support: "お問い合わせ・不具合報告：",
    privacy: "プライバシーポリシー"
  },
  home: {
    description:
      "ChzzkとTwitchのチャットメッセージの横に、視聴者のチェスレーティングを表示します。",
    broadcastTitle: "配信設定",
    broadcastDescription:
      "配信チャットを連携し、共通のブラウザソースURLを管理します。",
    streamerAction: "配信者ダッシュボード",
    ratingTitle: "レーティング連携",
    ratingDescription:
      "配信プラットフォーム、Chess.com、Lichessのアカウントを連携してレーティングを管理します。",
    viewerAction: "視聴者ダッシュボード"
  },
  login: {
    title: "{{role}}ログイン",
    chzzk: "Chzzkで続ける",
    twitch: "Twitchで続ける"
  },
  streamer: {
    title: "配信オーバーレイ",
    preview: "チャットプレビュー"
  },
  viewer: {
    title: "アカウント連携"
  },
  route: {
    loading: "ページを読み込み中",
    notFound: "ページが見つかりません",
    home: "ホームに戻る"
  },
  customCssGuide: {
    title: "カスタムCSSガイド",
    intro:
      "オーバーレイが提供するクラスとデータ属性を使って、チャットの外観をカスタマイズできます。CSSはプレビューとブラウザソースに同じように適用されます。",
    back: "配信者ダッシュボードに戻る",
    selectors: {
      title: "対応セレクター",
      selector: "セレクター",
      target: "対象",
      items: {
        overlay: "オーバーレイ領域全体",
        messageList: "チャットメッセージ一覧",
        message: "個別のチャットメッセージボックス",
        metadata: "プラットフォームバッジ、レーティングバッジ、ニックネーム",
        platformBadges: "プラットフォームバッジのグループ",
        platformBadge: "個別のChzzkまたはTwitchバッジ画像",
        ratingBadge: "Chess.comまたはLichessレーティングバッジの外枠",
        ratingBadgeContent: "レーティングバッジのアイコンと数値",
        nickname: "チャット投稿者のニックネーム",
        content: "チャットメッセージの内容",
        emote: "チャットメッセージ内のエモート画像"
      }
    },
    attributes: { title: "データ属性" },
    variables: {
      title: "CSS変数",
      description:
        "外観設定から計算された値が含まれます。var(--name)で参照するか、対応するオーバーレイ要素で上書きできます。"
    },
    examples: {
      title: "使用例",
      roles: "視聴者タイプ別のスタイル",
      ratings: "レーティングバッジのスタイル",
      bubble: "吹き出しのしっぽ"
    },
    limits: {
      title: "制限事項",
      size: "CSSはUTF-8で20 KBまでに制限されています。",
      selectors: "セレクターは対応するオーバーレイクラスから始める必要があります。",
      resources: "url()、外部画像、外部リソースは使用できません。",
      atRules: "@import、@font-face、@keyframesなどのat-ruleは使用できません。",
      disabled: "カスタムCSSをオフにしても内容は保持されますが、オーバーレイには適用されません。"
    }
  },
  badgePreference: {
    default: "デフォルトバッジ",
    error: "バッジ選択エラー",
    loadFailed: "バッジ設定を読み込めませんでした。",
    saveFailed: "バッジを変更できませんでした。"
  },
  chessAccount: {
    loading: "アカウント情報を確認しています。",
    disconnect: "連携解除",
    lastUpdated: "最終更新：{{date}}",
    refreshInMinutes: "{{count}}分後に更新",
    games_one: "{{count}}局",
    games_other: "{{count}}局",
    highestApplied: "使用中の最高レーティング",
    noSupportedRatings: "対応する持ち時間のレーティングが見つかりませんでした。",
    requestFailed: "リクエストを完了できませんでした。"
  },
  chesscom: {
    title: "Chess.comアカウント",
    description: "ラピッド、ブリッツ、バレットのレーティングを取得します。",
    refreshTitle: "Chess.comレーティングを更新",
    disconnectConfirm:
      "Chess.comアカウントの連携を解除し、現在のチャットバッジを削除しますか？",
    username: "Chess.comユーザー名",
    lookup: "アカウントを検索",
    verified: "Chess.comアカウントの所有権を確認済みです。",
    unverifiedNotice:
      "所有権が確認されるまで、このレーティングはチャットオーバーレイに表示されません。",
    createCode: "確認コードを作成",
    locationInstruction:
      "以下のコードをChess.comプロフィールの所在地（Location）欄に正確に入力して保存してください。",
    copyCode: "確認コードをコピー",
    openProfileSettings: "プロフィール設定を開く",
    confirmVerification: "保存しました。今すぐ確認",
    expiryNotice:
      "コードの有効期限は48時間です。Chess.comの公開APIキャッシュにより、プロフィールの変更が反映されるまで時間がかかる場合があります。"
  },
  lichess: {
    title: "Lichessアカウント",
    description: "バレット、ブリッツ、ラピッド、クラシカルのレーティングを取得します。",
    refreshTitle: "Lichessレーティングを更新",
    disconnectConfirm:
      "Lichessアカウントの連携を解除し、現在のバッジを削除しますか？",
    connect: "Lichessと連携",
    connected: "Lichessアカウントを連携しました。",
    expired: "Lichessとの連携リクエストが期限切れです。もう一度お試しください。",
    failed: "Lichessアカウントを連携できませんでした。もう一度お試しください。",
    verified: "Lichessアカウントの所有権を確認済みです。"
  },
  platformBadge: "プラットフォームバッジ",
  platforms: {
    title: "配信プラットフォーム",
    loading: "連携済みアカウントを確認しています。",
    noAccount: "連携済みアカウントはありません",
    permissionRequired: "チャット権限が必要です",
    permissionStatus: "権限が必要",
    grantPermission: "許可する",
    revokePermission: "取り消す",
    reconnectRequired: "再連携が必要です",
    connecting: "連携中",
    alternativeRequired:
      "このアカウントを解除する前に、別のログインアカウントを連携してください。",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Chzzkアカウントの連携を解除し、チャットアクセス権を取り消しますか？",
      disconnectPermissionConfirm:
        "Chzzkのチャットアクセス権を取り消しますか？Chzzkログインアカウントの連携は維持されます。",
      accountDisconnected: "Chzzkの連携を解除しました。",
      permissionDisconnected: "Chzzkのチャットアクセス権を取り消しました。",
      connectAccount: "Chzzkアカウントを連携",
      disconnectAccount: "Chzzkの連携を解除",
      connectPermission: "Chzzkのチャットアクセスを許可",
      disconnectPermission: "Chzzkのチャットアクセスを取り消す",
      connected: "Chzzkアカウントを連携しました。",
      streamerConnected:
        "Chzzkアカウントとチャットアクセス権を連携しました。",
      conflict:
        "このChzzkアカウントは別のEloBadgeユーザーにすでに連携されています。",
      failed: "Chzzkアカウントを連携できませんでした。もう一度お試しください。",
      streamerFailed:
        "Chzzkとの連携またはチャット権限の付与を完了できませんでした。"
    },
    twitch: {
      disconnectAccountConfirm:
        "Twitchアカウントの連携を解除し、チャットアクセス権を取り消しますか？",
      disconnectPermissionConfirm:
        "Twitchのチャットアクセス権を取り消しますか？Twitchログインアカウントの連携は維持されます。",
      accountDisconnected: "Twitchの連携を解除しました。",
      permissionDisconnected: "Twitchのチャットアクセス権を取り消しました。",
      connectAccount: "Twitchアカウントを連携",
      disconnectAccount: "Twitchの連携を解除",
      connectPermission: "Twitchのチャットアクセスを許可",
      disconnectPermission: "Twitchのチャットアクセスを取り消す",
      connected: "Twitchアカウントを連携しました。",
      streamerConnected:
        "Twitchアカウントとチャットアクセス権を連携しました。",
      denied: "Twitchとの連携リクエストがキャンセルされました。",
      expired: "Twitchとの連携リクエストが期限切れです。もう一度お試しください。",
      conflict:
        "このTwitchアカウントは別のEloBadgeユーザーにすでに連携されています。",
      failed: "Twitchアカウントを連携できませんでした。もう一度お試しください。",
      streamerFailed:
        "Twitchとの連携またはチャット権限の付与を完了できませんでした。"
    },
    loadFailed: "配信プラットフォームの連携情報を読み込めませんでした。"
  },
  overlay: {
    title: "ブラウザソースオーバーレイ",
    description:
      "OBS Studio、XSplitなど、ブラウザソースに対応した配信ソフトで利用できます。幅600 pxに最適化されています。高さはシーンに合わせて設定してください。",
    signInFirst: "上の配信プラットフォームアカウントでログインしてください。",
    createUrl: "URLを作成",
    urlLabel: "ブラウザソースURL",
    showUrl: "URLを表示",
    hideUrl: "URLを隠す",
    copyUrl: "URLをコピー",
    copied: "コピーしました",
    enable: "有効にする",
    disable: "無効にする",
    rotate: "URLを更新",
    rotateConfirm:
      "現在のオーバーレイURLを無効にして、新しいURLを発行しますか？",
    general: "基本設定",
    badges: "バッジ",
    background: "チャット背景",
    colors: "チャットカラー",
    fonts: "チャットフォント",
    maxWidth: "チャットの最大幅",
    alignment: "チャットの配置",
    alignmentOption: {
      left: "左揃え",
      center: "中央揃え",
      right: "右揃え"
    },
    messageLayout: "ニックネームとメッセージの配置",
    messageLayoutOption: {
      inline: "1行",
      stacked: "改行",
      aligned: "開始位置を揃える",
      individual: "メッセージごとに配置"
    },
    nicknameSeparatorVisible: "ニックネームの後にコロン（:）を表示",
    alignedNicknameRightAligned: "ニックネームを右揃え",
    messageBoxFilled: "チャットボックスを埋める",
    customCssEnabled: "カスタムCSSを使用",
    customCss: "カスタムCSS",
    customCssGuide: "カスタムCSSガイド",
    restoreCustomCss: "最後に保存したCSSを復元",
    restoreCustomCssConfirm: "最後に保存したカスタムCSSを復元しますか？",
    clearCustomCss: "カスタムCSSを消去",
    clearCustomCssConfirm: "カスタムCSSの内容をすべて消去しますか？",
    unsavedChangesConfirm: "保存されていない外観設定があります。このページを離れますか？",
    customCssPresets: "CSS例を読み込む",
    applyCustomCssPresetConfirm: "現在のCSSを「{{name}}」の例に置き換えますか？",
    customCssPreset: {
      defaults: "デフォルトスタイル",
      bubble: "吹き出し",
      transparent: "透明チャット",
      nickname: "ニックネーム強調"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "カスタムCSSは20 KB以下にしてください。",
    customCssError: {
      invalid_syntax: "CSSの構文を確認してください。",
      at_rule_not_allowed: "@importや@font-faceなどのat-ruleは使用できません。",
      external_resource_not_allowed: "外部URLや画像リソースは使用できません。",
      selector_not_allowed: "セレクターは対応するEloBadgeオーバーレイ要素の範囲内に限定してください。",
      property_not_allowed: "CSSにセキュリティ上使用できないプロパティが含まれています。",
      invalid_property_value: "CSSにブラウザが対応していないプロパティ値が含まれています。",
      too_large: "カスタムCSSは20 KB以下にしてください。"
    },
    duration: "メッセージ表示時間",
    keep: "常に表示",
    seconds_one: "{{count}}秒",
    seconds_other: "{{count}}秒",
    defaultSuffix: "（デフォルト）",
    ratingBadge: "チェスレーティングバッジ",
    ratingPolicy: {
      viewer_choice: "視聴者の設定を使用",
      chesscom_only: "Chess.comのみ",
      lichess_only: "Lichessのみ",
      hidden: "非表示"
    },
    forcedProviderNotice:
      "特定のプラットフォームを選ぶと、そのアカウントを連携していない視聴者にはチェスバッジが表示されません。",
    allPlatformBadges: "すべて表示",
    platformBadges: {
      chzzk: "Chzzkバッジ",
      twitch: "Twitchバッジ"
    },
    visibleBadges: "表示するバッジ",
    badgeKind: {
      role: "配信者と管理者",
      subscription: "サブスク",
      donation: "寄付",
      subscription_gift: "サブスクギフト",
      unknown: "その他"
    },
    twitchBadgeKind: {
      role: "配信者、モデレーター、VIP",
      subscription: "サブスクライバーとファウンダー",
      donation: "Bits",
      subscription_gift: "サブスクギフト",
      unknown: "グローバルとその他"
    },
    backgroundVisible: "背景を表示",
    backgroundColor: "背景色",
    customBackgroundColor: "カスタム背景色を選択",
    backgroundOpacity: "背景の不透明度",
    nicknameVisible: "ニックネームを表示",
    nicknameColor: "ニックネームの色",
    messageColor: "メッセージの色",
    colorMode: {
      fixed: "単色",
      by_user: "ユーザー別",
      by_role: "タイプ別",
      message_by_role: "種類別"
    },
    customNicknameColor: "カスタムニックネーム色を選択",
    customMessageColor: "カスタムメッセージ色を選択",
    role: {
      streamer: "配信者",
      manager: "管理者",
      subscriber: "サブスクライバー",
      donator: "寄付者",
      viewer: "視聴者"
    },
    font: "フォント",
    systemFont: "システムデフォルト",
    fontPreview: "いろはにほへと、ちりぬるを。わかよたれそ、つねならむ。",
    fontSize: "フォントサイズ",
    fontWeight: "フォントの太さ",
    lineHeight: "行間",
    save: "外観を保存",
    reset: "デフォルトに戻す",
    resetConfirm: "チャットの外観設定をすべてデフォルトに戻しますか？",
    requestFailed: "リクエストに失敗しました。"
  },
  preview: {
    frameLabel: "チャットオーバーレイのプレビュー",
    empty: "プレビューメッセージはまだありません",
    nickname: "ニックネーム",
    nicknamePlaceholder: "視聴者のニックネーム",
    rating: "レーティング",
    optional: "任意",
    role: "タイプ",
    roleLabel: "チャットプレビューのタイプ",
    badgeType: "バッジタイプ",
    badgeLabel: "{{provider}}バッジ",
    message: "メッセージ",
    messagePlaceholder: "プレビューメッセージを入力",
    add: "プレビューを追加"
  },
  authCallback: {
    missingCode: "ログインコードがありません。",
    loginFailed: "ログインに失敗しました。",
    loggingIn: "配信プラットフォームアカウントでログインしています。",
    success: "アカウントを連携しました",
    successDescription:
      "{{name}}を{{role}}モードで連携しました。",
    continue: "続ける",
    failure: "アカウント連携に失敗しました",
    invalidCode: "ログインコードが期限切れか無効です。"
  },
  api: {
    signInRequired: "EloBadgeにログインしてください。",
    requestFailed: "リクエストを完了できませんでした。",
    serverLoginFailed: "サーバーログインを確認できませんでした。",
    adminRequired: "このアカウントには管理者権限がありません。",
    overlayLoadFailed: "オーバーレイを読み込めませんでした。"
  },
  accountDeletion: {
    confirmation: "アカウントを削除",
    title: "アカウント削除",
    description:
      "連携したチェスデータと配信設定を完全に削除します。",
    action: "EloBadgeアカウントを削除",
    dialogTitle: "EloBadgeアカウントを削除しますか？",
    warning:
      "Chess.comとLichessの連携、レーティング、オーバーレイURL、外観設定が削除されます。既存のブラウザソースURLはすぐに使用できなくなります。",
    close: "アカウント削除ダイアログを閉じる",
    instruction: "続けるには{{text}}と入力してください。",
    deleting: "削除中",
    permanentDelete: "完全に削除",
    failed: "EloBadgeアカウントを削除できませんでした。"
  },
  privacy: {
    koreanOriginalNotice:
      "本プライバシーポリシーは、韓国法に基づき韓国語版を正式かつ優先される版として提供しています。"
  }
} as const;

export default ja;
