const id = {
  common: {
    streamer: "Streamer",
    viewer: "Penonton",
    signOut: "Keluar",
    signingOut: "Sedang keluar",
    loading: "Memuat",
    connect: "Hubungkan",
    disconnect: "Putuskan",
    cancel: "Batal",
    close: "Tutup",
    retry: "Coba lagi",
    refresh: "Perbarui",
    refreshing: "Memperbarui",
    error: "Kesalahan",
    connected: "Terhubung",
    notConnected: "Tidak terhubung"
  },
  language: {
    label: "Bahasa"
  },
  app: {
    mainNavigation: "Navigasi utama",
    signOutFailed: "Tidak dapat keluar. Silakan coba lagi.",
    support: "Kontak dan laporan bug:",
    privacy: "Kebijakan Privasi"
  },
  home: {
    description:
      "Tampilkan rating catur penonton di samping pesan chat Chzzk dan Twitch.",
    broadcastTitle: "Pengaturan siaran",
    broadcastDescription:
      "Hubungkan chat siaran dan kelola URL sumber browser universal.",
    streamerAction: "Dasbor streamer",
    ratingTitle: "Hubungkan rating",
    ratingDescription:
      "Hubungkan akun platform siaran, Chess.com, dan Lichess untuk mengelola rating Anda.",
    viewerAction: "Dasbor penonton"
  },
  login: {
    title: "Login {{role}}",
    chzzk: "Lanjutkan dengan Chzzk",
    twitch: "Lanjutkan dengan Twitch"
  },
  streamer: {
    title: "Overlay siaran",
    preview: "Pratinjau chat"
  },
  viewer: {
    title: "Koneksi akun"
  },
  route: {
    loading: "Memuat halaman",
    notFound: "Halaman tidak ditemukan",
    home: "Kembali ke beranda"
  },
  customCssGuide: {
    title: "Panduan CSS khusus",
    intro:
      "Gunakan class dan atribut data yang disediakan overlay untuk menyesuaikan tampilan chat. CSS Anda diterapkan secara sama pada pratinjau dan sumber browser.",
    back: "Kembali ke dasbor streamer",
    selectors: {
      title: "Selector yang didukung",
      selector: "Selector",
      target: "Target",
      items: {
        overlay: "Seluruh area overlay",
        messageList: "Daftar pesan chat",
        message: "Satu kotak pesan chat",
        metadata: "Badge platform, badge rating, dan nama pengguna",
        platformBadges: "Grup badge platform",
        platformBadge: "Satu gambar badge Chzzk atau Twitch",
        ratingBadge: "Bagian luar badge rating Chess.com atau Lichess",
        ratingBadgeContent: "Ikon dan angka pada badge rating",
        nickname: "Nama pengguna pengirim chat",
        content: "Isi pesan chat",
        emote: "Gambar emote di dalam pesan chat"
      }
    },
    attributes: { title: "Atribut data" },
    variables: {
      title: "Variabel CSS",
      description:
        "Variabel ini berisi nilai yang dihitung dari pengaturan tampilan. Baca dengan var(--nama), atau timpa pada elemen overlay yang didukung."
    },
    examples: {
      title: "Contoh",
      roles: "Gaya berdasarkan peran penonton",
      ratings: "Gaya badge rating",
      bubble: "Ekor balon percakapan"
    },
    limits: {
      title: "Batasan",
      size: "CSS dibatasi hingga 20 KB dalam UTF-8.",
      selectors: "Selector harus dimulai dari class overlay yang didukung.",
      resources: "url(), gambar eksternal, dan sumber daya eksternal tidak diizinkan.",
      atRules: "At-rule seperti @import, @font-face, dan @keyframes tidak diizinkan.",
      disabled: "Menonaktifkan CSS khusus akan menyimpan isinya, tetapi tidak menerapkannya pada overlay."
    }
  },
  badgePreference: {
    default: "Badge utama",
    error: "Kesalahan pemilihan badge",
    loadFailed: "Tidak dapat memuat pengaturan badge.",
    saveFailed: "Tidak dapat mengubah badge."
  },
  chessAccount: {
    loading: "Memeriksa informasi akun.",
    disconnect: "Putuskan",
    lastUpdated: "Terakhir diperbarui {{date}}",
    refreshInMinutes: "Perbarui dalam {{count}} menit",
    games_one: "{{count}} permainan",
    games_other: "{{count}} permainan",
    highestApplied: "Rating tertinggi yang digunakan",
    noSupportedRatings: "Tidak ditemukan rating kontrol waktu yang didukung.",
    requestFailed: "Tidak dapat menyelesaikan permintaan."
  },
  chesscom: {
    title: "Akun Chess.com",
    description: "Memuat rating Rapid, Blitz, dan Bullet.",
    refreshTitle: "Perbarui rating Chess.com",
    disconnectConfirm:
      "Putuskan akun Chess.com dan hapus badge chat saat ini?",
    username: "Nama pengguna Chess.com",
    lookup: "Cari akun",
    verified: "Kepemilikan akun Chess.com telah diverifikasi.",
    unverifiedNotice:
      "Rating ini tidak akan muncul di overlay chat hingga kepemilikan akun diverifikasi.",
    createCode: "Buat kode verifikasi",
    locationInstruction:
      "Masukkan kode di bawah ini dengan tepat pada kolom Lokasi (Location) di profil Chess.com Anda, lalu simpan.",
    copyCode: "Salin kode verifikasi",
    openProfileSettings: "Buka pengaturan profil",
    confirmVerification: "Sudah disimpan, verifikasi sekarang",
    expiryNotice:
      "Kode berlaku selama 48 jam. Cache API publik Chess.com dapat menyebabkan perubahan profil terlambat terlihat."
  },
  lichess: {
    title: "Akun Lichess",
    description: "Memuat rating Bullet, Blitz, Rapid, dan Classical.",
    refreshTitle: "Perbarui rating Lichess",
    disconnectConfirm:
      "Putuskan akun Lichess dan hapus badge saat ini?",
    connect: "Hubungkan dengan Lichess",
    connected: "Akun Lichess telah terhubung.",
    expired: "Permintaan koneksi Lichess telah kedaluwarsa. Silakan coba lagi.",
    failed: "Tidak dapat menghubungkan akun Lichess. Silakan coba lagi.",
    verified: "Kepemilikan akun Lichess telah diverifikasi."
  },
  platformBadge: "Badge platform",
  platforms: {
    title: "Platform siaran",
    loading: "Memeriksa akun yang terhubung.",
    noAccount: "Tidak ada akun terhubung",
    permissionRequired: "Izin chat diperlukan",
    permissionStatus: "Izin diperlukan",
    grantPermission: "Izinkan",
    revokePermission: "Cabut",
    reconnectRequired: "Perlu dihubungkan kembali",
    connecting: "Menghubungkan",
    alternativeRequired:
      "Hubungkan akun login lain sebelum memutuskan akun ini.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Putuskan akun Chzzk dan cabut akses chat?",
      disconnectPermissionConfirm:
        "Cabut akses chat Chzzk? Akun login Chzzk akan tetap terhubung.",
      accountDisconnected: "Chzzk telah diputuskan.",
      permissionDisconnected: "Akses chat Chzzk telah dicabut.",
      connectAccount: "Hubungkan akun Chzzk",
      disconnectAccount: "Putuskan Chzzk",
      connectPermission: "Izinkan akses chat Chzzk",
      disconnectPermission: "Cabut akses chat Chzzk",
      connected: "Akun Chzzk telah terhubung.",
      streamerConnected:
        "Chzzk dan akses chat-nya telah terhubung.",
      conflict:
        "Akun Chzzk ini sudah terhubung dengan pengguna EloBadge lain.",
      failed: "Tidak dapat menghubungkan akun Chzzk. Silakan coba lagi.",
      streamerFailed:
        "Tidak dapat menyelesaikan koneksi Chzzk atau pemberian izin chat."
    },
    twitch: {
      disconnectAccountConfirm:
        "Putuskan akun Twitch dan cabut akses chat?",
      disconnectPermissionConfirm:
        "Cabut akses chat Twitch? Akun login Twitch akan tetap terhubung.",
      accountDisconnected: "Twitch telah diputuskan.",
      permissionDisconnected: "Akses chat Twitch telah dicabut.",
      connectAccount: "Hubungkan akun Twitch",
      disconnectAccount: "Putuskan Twitch",
      connectPermission: "Izinkan akses chat Twitch",
      disconnectPermission: "Cabut akses chat Twitch",
      connected: "Akun Twitch telah terhubung.",
      streamerConnected:
        "Twitch dan akses chat-nya telah terhubung.",
      denied: "Permintaan koneksi Twitch dibatalkan.",
      expired: "Permintaan koneksi Twitch telah kedaluwarsa. Silakan coba lagi.",
      conflict:
        "Akun Twitch ini sudah terhubung dengan pengguna EloBadge lain.",
      failed: "Tidak dapat menghubungkan akun Twitch. Silakan coba lagi.",
      streamerFailed:
        "Tidak dapat menyelesaikan koneksi Twitch atau pemberian izin chat."
    },
    loadFailed: "Tidak dapat memuat koneksi platform siaran."
  },
  overlay: {
    title: "Overlay sumber browser",
    description:
      "Berfungsi dengan OBS Studio, XSplit, dan perangkat lunak siaran lain yang mendukung sumber browser. Dioptimalkan untuk lebar 600 px; sesuaikan tinggi dengan scene Anda.",
    signInFirst: "Masuk terlebih dahulu dengan akun platform siaran di atas.",
    createUrl: "Buat URL",
    urlLabel: "URL sumber browser",
    showUrl: "Tampilkan URL",
    hideUrl: "Sembunyikan URL",
    copyUrl: "Salin URL",
    copied: "Disalin",
    enable: "Aktifkan",
    disable: "Nonaktifkan",
    rotate: "Ganti URL",
    rotateConfirm:
      "Cabut URL overlay saat ini dan terbitkan URL baru?",
    general: "Umum",
    badges: "Badge",
    background: "Latar belakang chat",
    colors: "Warna chat",
    fonts: "Font chat",
    maxWidth: "Lebar maksimum chat",
    alignment: "Perataan chat",
    alignmentOption: {
      left: "Rata kiri",
      center: "Rata tengah",
      right: "Rata kanan"
    },
    messageLayout: "Tata letak nama pengguna dan pesan",
    messageLayoutOption: {
      inline: "Satu baris",
      stacked: "Baris baru",
      aligned: "Awal sejajar",
      individual: "Perataan per pesan"
    },
    nicknameSeparatorVisible: "Tampilkan titik dua (:) setelah nama pengguna",
    alignedNicknameRightAligned: "Ratakan nama pengguna ke kanan",
    messageBoxFilled: "Penuhi kotak chat",
    customCssEnabled: "Gunakan CSS khusus",
    customCss: "CSS khusus",
    customCssGuide: "Panduan CSS khusus",
    restoreCustomCss: "Pulihkan CSS terakhir yang disimpan",
    restoreCustomCssConfirm: "Pulihkan CSS khusus terakhir yang disimpan?",
    clearCustomCss: "Hapus CSS khusus",
    clearCustomCssConfirm: "Hapus seluruh isi CSS khusus?",
    unsavedChangesConfirm: "Ada pengaturan tampilan yang belum disimpan. Tinggalkan halaman ini?",
    customCssPresets: "Muat contoh CSS",
    applyCustomCssPresetConfirm: "Ganti CSS saat ini dengan contoh “{{name}}”?",
    customCssPreset: {
      defaults: "Gaya bawaan",
      bubble: "Balon percakapan",
      transparent: "Chat transparan",
      nickname: "Sorotan nama pengguna"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "CSS khusus harus berukuran 20 KB atau kurang.",
    customCssError: {
      invalid_syntax: "Periksa sintaks CSS.",
      at_rule_not_allowed: "At-rule seperti @import dan @font-face tidak diizinkan.",
      external_resource_not_allowed: "URL eksternal dan sumber daya gambar tidak diizinkan.",
      selector_not_allowed: "Selector harus tetap berada dalam elemen overlay EloBadge yang didukung.",
      property_not_allowed: "CSS berisi properti yang diblokir demi keamanan.",
      invalid_property_value: "CSS berisi nilai properti yang tidak didukung browser.",
      too_large: "CSS khusus harus berukuran 20 KB atau kurang."
    },
    duration: "Durasi pesan",
    keep: "Tampilkan tanpa batas",
    seconds_one: "{{count}} detik",
    seconds_other: "{{count}} detik",
    defaultSuffix: " (bawaan)",
    ratingBadge: "Badge rating catur",
    ratingPolicy: {
      viewer_choice: "Gunakan pilihan penonton",
      chesscom_only: "Hanya Chess.com",
      lichess_only: "Hanya Lichess",
      hidden: "Disembunyikan"
    },
    forcedProviderNotice:
      "Jika platform tertentu dipilih, penonton yang tidak memiliki akun tersebut tidak akan mendapatkan badge catur.",
    allPlatformBadges: "Tampilkan semua",
    platformBadges: {
      chzzk: "Badge Chzzk",
      twitch: "Badge Twitch"
    },
    visibleBadges: "Badge yang ditampilkan",
    badgeKind: {
      role: "Streamer dan manajer",
      subscription: "Langganan",
      donation: "Donasi",
      subscription_gift: "Hadiah langganan",
      unknown: "Lainnya"
    },
    twitchBadgeKind: {
      role: "Broadcaster, moderator, dan VIP",
      subscription: "Subscriber dan founder",
      donation: "Bits",
      subscription_gift: "Hadiah langganan",
      unknown: "Global dan lainnya"
    },
    backgroundVisible: "Tampilkan latar belakang",
    backgroundColor: "Warna latar belakang",
    customBackgroundColor: "Pilih warna latar belakang khusus",
    backgroundOpacity: "Opasitas latar belakang",
    nicknameVisible: "Tampilkan nama pengguna",
    nicknameColor: "Warna nama pengguna",
    messageColor: "Warna pesan",
    colorMode: {
      fixed: "Satu warna",
      by_user: "Per pengguna",
      by_role: "Berdasarkan peran",
      message_by_role: "Berdasarkan jenis"
    },
    customNicknameColor: "Pilih warna khusus untuk nama pengguna",
    customMessageColor: "Pilih warna khusus untuk pesan",
    role: {
      streamer: "Streamer",
      manager: "Manajer",
      subscriber: "Subscriber",
      donator: "Donatur",
      viewer: "Penonton"
    },
    font: "Font",
    systemFont: "Font bawaan sistem",
    fontPreview: "Muharjo seorang xenofobia universal yang takut pada warga jazirah.",
    fontSize: "Ukuran font",
    fontWeight: "Ketebalan font",
    lineHeight: "Jarak antarbaris",
    save: "Simpan tampilan",
    reset: "Kembalikan ke bawaan",
    resetConfirm: "Kembalikan semua pengaturan tampilan chat ke bawaan?",
    requestFailed: "Permintaan gagal."
  },
  preview: {
    frameLabel: "Pratinjau overlay chat",
    empty: "Belum ada pesan pratinjau",
    nickname: "Nama pengguna",
    nicknamePlaceholder: "Nama pengguna penonton",
    rating: "Rating",
    optional: "Opsional",
    role: "Peran",
    roleLabel: "Peran pada pratinjau chat",
    badgeType: "Jenis badge",
    badgeLabel: "Badge {{provider}}",
    message: "Pesan",
    messagePlaceholder: "Masukkan pesan pratinjau",
    add: "Tambahkan pratinjau"
  },
  authCallback: {
    missingCode: "Kode login tidak tersedia.",
    loginFailed: "Login gagal.",
    loggingIn: "Masuk dengan akun platform siaran Anda.",
    success: "Akun terhubung",
    successDescription:
      "{{name}} terhubung dalam mode {{role}}.",
    continue: "Lanjutkan",
    failure: "Koneksi akun gagal",
    invalidCode: "Kode login telah kedaluwarsa atau tidak valid."
  },
  api: {
    signInRequired: "Anda harus masuk ke EloBadge.",
    requestFailed: "Permintaan tidak dapat diselesaikan.",
    serverLoginFailed: "Tidak dapat memverifikasi login server.",
    adminRequired: "Akun ini tidak memiliki akses administrator.",
    overlayLoadFailed: "Tidak dapat memuat overlay."
  },
  accountDeletion: {
    confirmation: "HAPUS AKUN",
    title: "Hapus akun",
    description:
      "Hapus secara permanen data catur yang terhubung dan pengaturan siaran Anda.",
    action: "Hapus akun EloBadge",
    dialogTitle: "Hapus akun EloBadge Anda?",
    warning:
      "Koneksi Chess.com dan Lichess, rating, URL overlay, dan pengaturan tampilan akan dihapus. URL sumber browser yang ada akan langsung berhenti berfungsi.",
    close: "Tutup dialog penghapusan akun",
    instruction: "Masukkan {{text}} untuk melanjutkan.",
    deleting: "Menghapus",
    permanentDelete: "Hapus permanen",
    failed: "Tidak dapat menghapus akun EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Kebijakan Privasi ini disediakan dalam bahasa Korea sebagai versi resmi berdasarkan hukum Korea Selatan."
  }
} as const;

export default id;
