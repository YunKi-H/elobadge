const tr = {
  common: {
    streamer: "Yayıncı",
    viewer: "İzleyici",
    signOut: "Çıkış yap",
    signingOut: "Çıkış yapılıyor",
    loading: "Yükleniyor",
    connect: "Bağla",
    disconnect: "Bağlantıyı kes",
    cancel: "İptal",
    close: "Kapat",
    retry: "Tekrar dene",
    refresh: "Yenile",
    refreshing: "Yenileniyor",
    error: "Hata",
    connected: "Bağlı",
    notConnected: "Bağlı değil"
  },
  language: {
    label: "Dil"
  },
  app: {
    mainNavigation: "Ana gezinme",
    signOutFailed: "Çıkış yapılamadı. Lütfen tekrar deneyin.",
    support: "İletişim ve hata bildirimleri:",
    privacy: "Gizlilik Politikası"
  },
  home: {
    description:
      "İzleyicilerin satranç puanlarını Chzzk ve Twitch sohbet mesajlarının yanında gösterin.",
    broadcastTitle: "Yayın ayarları",
    broadcastDescription:
      "Yayın sohbetlerini bağlayın ve ortak bir tarayıcı kaynağı URL'sini yönetin.",
    streamerAction: "Yayıncı paneli",
    ratingTitle: "Puanları bağla",
    ratingDescription:
      "Puanlarınızı yönetmek için yayın platformu, Chess.com ve Lichess hesaplarınızı bağlayın.",
    viewerAction: "İzleyici paneli"
  },
  login: {
    title: "{{role}} girişi",
    chzzk: "Chzzk ile devam et",
    twitch: "Twitch ile devam et"
  },
  streamer: {
    title: "Yayın katmanı",
    preview: "Sohbet önizlemesi"
  },
  viewer: {
    title: "Hesap bağlantıları"
  },
  route: {
    loading: "Sayfa yükleniyor",
    notFound: "Sayfa bulunamadı",
    home: "Ana sayfaya dön"
  },
  customCssGuide: {
    title: "Özel CSS rehberi",
    intro:
      "Sohbet görünümünü özelleştirmek için katmanın sunduğu sınıfları ve veri özniteliklerini kullanın. CSS'niz önizlemeye ve tarayıcı kaynağına aynı şekilde uygulanır.",
    back: "Yayıncı paneline dön",
    selectors: {
      title: "Desteklenen seçiciler",
      selector: "Seçici",
      target: "Hedef",
      items: {
        overlay: "Katman alanının tamamı",
        messageList: "Sohbet mesajı listesi",
        message: "Tek bir sohbet mesajı kutusu",
        metadata: "Platform rozetleri, puan rozeti ve kullanıcı adı",
        platformBadges: "Platform rozeti grubu",
        platformBadge: "Tek bir Chzzk veya Twitch rozet görseli",
        ratingBadge: "Chess.com veya Lichess puan rozetinin dış öğesi",
        ratingBadgeContent: "Puan rozetinin simgesi ve sayısı",
        nickname: "Sohbet mesajını gönderen kullanıcının adı",
        content: "Sohbet mesajının içeriği",
        emote: "Sohbet mesajındaki ifade görseli"
      }
    },
    attributes: { title: "Veri öznitelikleri" },
    variables: {
      title: "CSS değişkenleri",
      description:
        "Bunlar görünüm ayarlarından hesaplanan değerleri içerir. var(--ad) ile okuyabilir veya desteklenen katman öğelerinde geçersiz kılabilirsiniz."
    },
    examples: {
      title: "Örnekler",
      roles: "İzleyici rolüne göre stil",
      ratings: "Puan rozeti stilleri",
      bubble: "Konuşma balonu kuyruğu"
    },
    limits: {
      title: "Sınırlamalar",
      size: "CSS, UTF-8 biçiminde 20 KB ile sınırlıdır.",
      selectors: "Seçiciler desteklenen bir katman sınıfıyla başlamalıdır.",
      resources: "url(), harici görseller ve harici kaynaklara izin verilmez.",
      atRules: "@import, @font-face ve @keyframes gibi at-rule ifadelerine izin verilmez.",
      disabled: "Özel CSS'yi kapatmak içeriği korur ancak katmana uygulamaz."
    }
  },
  badgePreference: {
    default: "Varsayılan rozet",
    error: "Rozet seçim hatası",
    loadFailed: "Rozet ayarları yüklenemedi.",
    saveFailed: "Rozet değiştirilemedi."
  },
  chessAccount: {
    loading: "Hesap bilgileri kontrol ediliyor.",
    disconnect: "Bağlantıyı kes",
    lastUpdated: "Son güncelleme: {{date}}",
    refreshInMinutes: "{{count}} dk. sonra yenile",
    games_one: "{{count}} oyun",
    games_other: "{{count}} oyun",
    highestApplied: "Kullanılan en yüksek puan",
    noSupportedRatings: "Desteklenen zaman kontrolü için puan bulunamadı.",
    requestFailed: "İstek tamamlanamadı."
  },
  chesscom: {
    title: "Chess.com hesabı",
    description: "Rapid, Blitz ve Bullet puanlarını yükler.",
    refreshTitle: "Chess.com puanlarını yenile",
    disconnectConfirm:
      "Chess.com hesabının bağlantısı kesilsin ve mevcut sohbet rozeti kaldırılsın mı?",
    username: "Chess.com kullanıcı adı",
    lookup: "Hesabı ara",
    verified: "Chess.com hesabının sahipliği doğrulandı.",
    unverifiedNotice:
      "Hesap sahipliği doğrulanana kadar bu puan sohbet katmanlarında görünmez.",
    createCode: "Doğrulama kodu oluştur",
    locationInstruction:
      "Aşağıdaki kodu Chess.com profilinizdeki Konum (Location) alanına eksiksiz olarak girip kaydedin.",
    copyCode: "Doğrulama kodunu kopyala",
    openProfileSettings: "Profil ayarlarını aç",
    confirmVerification: "Kaydettim, şimdi doğrula",
    expiryNotice:
      "Kod 48 saat geçerlidir. Chess.com'un herkese açık API önbelleği profil değişikliklerinin görünmesini geciktirebilir."
  },
  lichess: {
    title: "Lichess hesabı",
    description: "Bullet, Blitz, Rapid ve Classical puanlarını yükler.",
    refreshTitle: "Lichess puanlarını yenile",
    disconnectConfirm:
      "Lichess hesabının bağlantısı kesilsin ve mevcut rozet kaldırılsın mı?",
    connect: "Lichess ile bağlan",
    connected: "Lichess hesabı bağlandı.",
    expired: "Lichess bağlantı isteğinin süresi doldu. Lütfen tekrar deneyin.",
    failed: "Lichess hesabı bağlanamadı. Lütfen tekrar deneyin.",
    verified: "Lichess hesabının sahipliği doğrulandı."
  },
  platformBadge: "Platform rozetleri",
  platforms: {
    title: "Yayın platformları",
    loading: "Bağlı hesaplar kontrol ediliyor.",
    noAccount: "Bağlı hesap yok",
    permissionRequired: "Sohbet izni gerekli",
    permissionStatus: "İzin gerekli",
    grantPermission: "Yetkilendir",
    revokePermission: "İzni kaldır",
    reconnectRequired: "Yeniden bağlanmak gerekli",
    connecting: "Bağlanıyor",
    alternativeRequired:
      "Bu hesabın bağlantısını kesmeden önce başka bir giriş hesabı bağlayın.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Chzzk hesabının bağlantısı kesilsin ve sohbet erişimi kaldırılsın mı?",
      disconnectPermissionConfirm:
        "Chzzk sohbet erişimi kaldırılsın mı? Chzzk giriş hesabı bağlı kalır.",
      accountDisconnected: "Chzzk bağlantısı kesildi.",
      permissionDisconnected: "Chzzk sohbet erişimi kaldırıldı.",
      connectAccount: "Chzzk hesabını bağla",
      disconnectAccount: "Chzzk bağlantısını kes",
      connectPermission: "Chzzk sohbet erişimini yetkilendir",
      disconnectPermission: "Chzzk sohbet erişimini kaldır",
      connected: "Chzzk hesabı bağlandı.",
      streamerConnected:
        "Chzzk hesabı ve sohbet erişimi bağlandı.",
      conflict:
        "Bu Chzzk hesabı başka bir EloBadge kullanıcısına zaten bağlı.",
      failed: "Chzzk hesabı bağlanamadı. Lütfen tekrar deneyin.",
      streamerFailed:
        "Chzzk bağlantısı veya sohbet yetkilendirmesi tamamlanamadı."
    },
    twitch: {
      disconnectAccountConfirm:
        "Twitch hesabının bağlantısı kesilsin ve sohbet erişimi kaldırılsın mı?",
      disconnectPermissionConfirm:
        "Twitch sohbet erişimi kaldırılsın mı? Twitch giriş hesabı bağlı kalır.",
      accountDisconnected: "Twitch bağlantısı kesildi.",
      permissionDisconnected: "Twitch sohbet erişimi kaldırıldı.",
      connectAccount: "Twitch hesabını bağla",
      disconnectAccount: "Twitch bağlantısını kes",
      connectPermission: "Twitch sohbet erişimini yetkilendir",
      disconnectPermission: "Twitch sohbet erişimini kaldır",
      connected: "Twitch hesabı bağlandı.",
      streamerConnected:
        "Twitch hesabı ve sohbet erişimi bağlandı.",
      denied: "Twitch bağlantı isteği iptal edildi.",
      expired: "Twitch bağlantı isteğinin süresi doldu. Lütfen tekrar deneyin.",
      conflict:
        "Bu Twitch hesabı başka bir EloBadge kullanıcısına zaten bağlı.",
      failed: "Twitch hesabı bağlanamadı. Lütfen tekrar deneyin.",
      streamerFailed:
        "Twitch bağlantısı veya sohbet yetkilendirmesi tamamlanamadı."
    },
    loadFailed: "Yayın platformu bağlantıları yüklenemedi."
  },
  overlay: {
    title: "Tarayıcı kaynağı katmanı",
    description:
      "OBS Studio, XSplit ve tarayıcı kaynaklarını destekleyen diğer yayın yazılımlarıyla çalışır. 600 px genişlik için optimize edilmiştir; yüksekliği sahnenize göre ayarlayın.",
    signInFirst: "Önce yukarıdaki yayın platformu hesaplarından biriyle giriş yapın.",
    createUrl: "URL oluştur",
    urlLabel: "Tarayıcı kaynağı URL'si",
    showUrl: "URL'yi göster",
    hideUrl: "URL'yi gizle",
    copyUrl: "URL'yi kopyala",
    copied: "Kopyalandı",
    enable: "Etkinleştir",
    disable: "Devre dışı bırak",
    rotate: "URL'yi yenile",
    rotateConfirm:
      "Mevcut katman URL'si iptal edilip yeni bir URL oluşturulsun mu?",
    general: "Genel",
    badges: "Rozetler",
    background: "Sohbet arka planı",
    colors: "Sohbet renkleri",
    fonts: "Sohbet yazı tipi",
    maxWidth: "En fazla sohbet genişliği",
    alignment: "Sohbet hizalaması",
    alignmentOption: {
      left: "Sola hizala",
      center: "Ortala",
      right: "Sağa hizala"
    },
    messageLayout: "Kullanıcı adı ve mesaj düzeni",
    messageLayoutOption: {
      inline: "Tek satır",
      stacked: "Yeni satır",
      aligned: "Başlangıcı hizala",
      individual: "Mesaj başına hizalama"
    },
    nicknameSeparatorVisible: "Kullanıcı adından sonra iki nokta (:) göster",
    alignedNicknameRightAligned: "Kullanıcı adını sağa hizala",
    messageBoxFilled: "Sohbet kutusunu doldur",
    customCssEnabled: "Özel CSS kullan",
    customCss: "Özel CSS",
    customCssGuide: "Özel CSS rehberi",
    restoreCustomCss: "Son kaydedilen CSS'yi geri yükle",
    restoreCustomCssConfirm: "Son kaydedilen özel CSS geri yüklensin mi?",
    clearCustomCss: "Özel CSS'yi temizle",
    clearCustomCssConfirm: "Özel CSS içeriğinin tamamı temizlensin mi?",
    unsavedChangesConfirm: "Kaydedilmemiş görünüm ayarlarınız var. Bu sayfadan ayrılsın mı?",
    customCssPresets: "CSS örneği yükle",
    applyCustomCssPresetConfirm: "Mevcut CSS, “{{name}}” örneğiyle değiştirilsin mi?",
    customCssPreset: {
      defaults: "Varsayılan stil",
      bubble: "Konuşma balonu",
      transparent: "Şeffaf sohbet",
      nickname: "Kullanıcı adı vurgusu"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "Özel CSS en fazla 20 KB olabilir.",
    customCssError: {
      invalid_syntax: "CSS söz dizimini kontrol edin.",
      at_rule_not_allowed: "@import ve @font-face gibi at-rule ifadelerine izin verilmez.",
      external_resource_not_allowed: "Harici URL'lere ve görsel kaynaklarına izin verilmez.",
      selector_not_allowed: "Seçiciler desteklenen EloBadge katman öğeleriyle sınırlı kalmalıdır.",
      property_not_allowed: "CSS, güvenlik nedeniyle engellenen bir özellik içeriyor.",
      invalid_property_value: "CSS, tarayıcıların desteklemediği bir özellik değeri içeriyor.",
      too_large: "Özel CSS en fazla 20 KB olabilir."
    },
    duration: "Mesaj süresi",
    keep: "Süresiz göster",
    seconds_one: "{{count}} saniye",
    seconds_other: "{{count}} saniye",
    defaultSuffix: " (varsayılan)",
    ratingBadge: "Satranç puanı rozeti",
    ratingPolicy: {
      viewer_choice: "İzleyici tercihini kullan",
      chesscom_only: "Yalnızca Chess.com",
      lichess_only: "Yalnızca Lichess",
      hidden: "Gizli"
    },
    forcedProviderNotice:
      "Belirli bir platform seçildiğinde, o platformda hesabı olmayan izleyicilere satranç rozeti gösterilmez.",
    allPlatformBadges: "Tümünü göster",
    platformBadges: {
      chzzk: "Chzzk rozetleri",
      twitch: "Twitch rozetleri"
    },
    visibleBadges: "Görünür rozetler",
    badgeKind: {
      role: "Yayıncı ve yönetici",
      subscription: "Abonelik",
      donation: "Bağış",
      subscription_gift: "Hediye abonelik",
      unknown: "Diğer"
    },
    twitchBadgeKind: {
      role: "Yayıncı, moderatör ve VIP",
      subscription: "Abone ve kurucu",
      donation: "Bits",
      subscription_gift: "Hediye abonelik",
      unknown: "Global ve diğer"
    },
    backgroundVisible: "Arka planı göster",
    backgroundColor: "Arka plan rengi",
    customBackgroundColor: "Özel arka plan rengi seç",
    backgroundOpacity: "Arka plan opaklığı",
    nicknameVisible: "Kullanıcı adını göster",
    nicknameColor: "Kullanıcı adı rengi",
    messageColor: "Mesaj rengi",
    colorMode: {
      fixed: "Tek renk",
      by_user: "Kullanıcıya göre",
      by_role: "Role göre",
      message_by_role: "Türe göre"
    },
    customNicknameColor: "Özel kullanıcı adı rengi seç",
    customMessageColor: "Özel mesaj rengi seç",
    role: {
      streamer: "Yayıncı",
      manager: "Yönetici",
      subscriber: "Abone",
      donator: "Bağışçı",
      viewer: "İzleyici"
    },
    font: "Yazı tipi",
    systemFont: "Sistem varsayılanı",
    fontPreview: "Pijamalı hasta yağız şoföre çabucak güvendi.",
    fontSize: "Yazı tipi boyutu",
    fontWeight: "Yazı tipi kalınlığı",
    lineHeight: "Satır aralığı",
    save: "Görünümü kaydet",
    reset: "Varsayılana sıfırla",
    resetConfirm: "Tüm sohbet görünümü ayarları varsayılana sıfırlansın mı?",
    requestFailed: "İstek başarısız oldu."
  },
  preview: {
    frameLabel: "Sohbet katmanı önizlemesi",
    empty: "Henüz önizleme mesajı yok",
    nickname: "Kullanıcı adı",
    nicknamePlaceholder: "İzleyici kullanıcı adı",
    rating: "Puan",
    optional: "İsteğe bağlı",
    role: "Rol",
    roleLabel: "Sohbet önizleme rolü",
    badgeType: "Rozet türü",
    badgeLabel: "{{provider}} rozeti",
    message: "Mesaj",
    messagePlaceholder: "Bir önizleme mesajı girin",
    add: "Önizleme ekle"
  },
  authCallback: {
    missingCode: "Giriş kodu eksik.",
    loginFailed: "Giriş başarısız oldu.",
    loggingIn: "Yayın platformu hesabınızla giriş yapılıyor.",
    success: "Hesap bağlandı",
    successDescription:
      "{{name}}, {{role}} modunda bağlandı.",
    continue: "Devam et",
    failure: "Hesap bağlantısı başarısız oldu",
    invalidCode: "Giriş kodunun süresi dolmuş veya kod geçersiz."
  },
  api: {
    signInRequired: "EloBadge'e giriş yapmanız gerekir.",
    requestFailed: "İstek tamamlanamadı.",
    serverLoginFailed: "Sunucu girişi doğrulanamadı.",
    adminRequired: "Bu hesabın yönetici erişimi yok.",
    overlayLoadFailed: "Katman yüklenemedi."
  },
  accountDeletion: {
    confirmation: "HESABI SİL",
    title: "Hesabı sil",
    description:
      "Bağlı satranç verilerinizi ve yayın ayarlarınızı kalıcı olarak silin.",
    action: "EloBadge hesabını sil",
    dialogTitle: "EloBadge hesabınız silinsin mi?",
    warning:
      "Chess.com ve Lichess bağlantıları, puanlar, katman URL'leri ve görünüm ayarları silinir. Mevcut tarayıcı kaynağı URL'leri hemen çalışmayı durdurur.",
    close: "Hesap silme penceresini kapat",
    instruction: "Devam etmek için {{text}} yazın.",
    deleting: "Siliniyor",
    permanentDelete: "Kalıcı olarak sil",
    failed: "EloBadge hesabı silinemedi."
  },
  privacy: {
    koreanOriginalNotice:
      "Bu Gizlilik Politikası, Güney Kore yasaları kapsamında bağlayıcı sürüm olarak Korece sunulmaktadır."
  }
} as const;

export default tr;
