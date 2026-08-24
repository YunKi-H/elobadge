const vi = {
  common: {
    streamer: "Người phát sóng",
    viewer: "Người xem",
    signOut: "Đăng xuất",
    signingOut: "Đang đăng xuất",
    loading: "Đang tải",
    connect: "Kết nối",
    disconnect: "Ngắt kết nối",
    cancel: "Hủy",
    close: "Đóng",
    retry: "Thử lại",
    refresh: "Làm mới",
    refreshing: "Đang làm mới",
    error: "Lỗi",
    connected: "Đã kết nối",
    notConnected: "Chưa kết nối"
  },
  language: {
    label: "Ngôn ngữ"
  },
  app: {
    mainNavigation: "Điều hướng chính",
    signOutFailed: "Không thể đăng xuất. Vui lòng thử lại.",
    support: "Liên hệ và báo lỗi:",
    privacy: "Chính sách quyền riêng tư"
  },
  home: {
    description:
      "Hiển thị điểm xếp hạng cờ vua của người xem bên cạnh tin nhắn trò chuyện Chzzk và Twitch.",
    broadcastTitle: "Cài đặt phát sóng",
    broadcastDescription:
      "Kết nối các cuộc trò chuyện phát sóng và quản lý URL nguồn trình duyệt dùng chung.",
    streamerAction: "Bảng điều khiển người phát sóng",
    ratingTitle: "Kết nối điểm xếp hạng",
    ratingDescription:
      "Kết nối tài khoản nền tảng phát sóng, Chess.com và Lichess để quản lý điểm xếp hạng của bạn.",
    viewerAction: "Bảng điều khiển người xem"
  },
  login: {
    title: "Đăng nhập với vai trò {{role}}",
    chzzk: "Tiếp tục với Chzzk",
    twitch: "Tiếp tục với Twitch"
  },
  streamer: {
    title: "Lớp phủ phát sóng",
    preview: "Xem trước trò chuyện"
  },
  viewer: {
    title: "Kết nối tài khoản"
  },
  route: {
    loading: "Đang tải trang",
    notFound: "Không tìm thấy trang",
    home: "Quay về trang chủ"
  },
  customCssGuide: {
    title: "Hướng dẫn CSS tùy chỉnh",
    intro:
      "Sử dụng các lớp và thuộc tính dữ liệu do lớp phủ cung cấp để tùy chỉnh giao diện trò chuyện. CSS của bạn được áp dụng giống nhau cho bản xem trước và nguồn trình duyệt.",
    back: "Quay lại bảng điều khiển người phát sóng",
    selectors: {
      title: "Bộ chọn được hỗ trợ",
      selector: "Bộ chọn",
      target: "Mục tiêu",
      items: {
        overlay: "Toàn bộ khu vực lớp phủ",
        messageList: "Danh sách tin nhắn trò chuyện",
        message: "Một hộp tin nhắn trò chuyện riêng lẻ",
        metadata: "Huy hiệu nền tảng, huy hiệu điểm xếp hạng và biệt danh",
        platformBadges: "Nhóm huy hiệu nền tảng",
        platformBadge: "Một hình ảnh huy hiệu Chzzk hoặc Twitch",
        ratingBadge: "Phần ngoài của huy hiệu điểm xếp hạng Chess.com hoặc Lichess",
        ratingBadgeContent: "Biểu tượng và số trên huy hiệu điểm xếp hạng",
        nickname: "Biệt danh của người gửi tin nhắn",
        content: "Nội dung tin nhắn trò chuyện",
        emote: "Hình ảnh biểu cảm trong tin nhắn trò chuyện"
      }
    },
    attributes: { title: "Thuộc tính dữ liệu" },
    variables: {
      title: "Biến CSS",
      description:
        "Các biến này chứa giá trị được tính từ cài đặt giao diện. Đọc bằng var(--tên) hoặc ghi đè trên các phần tử lớp phủ được hỗ trợ."
    },
    examples: {
      title: "Ví dụ",
      roles: "Kiểu theo vai trò người xem",
      ratings: "Kiểu huy hiệu điểm xếp hạng",
      bubble: "Đuôi bong bóng thoại"
    },
    limits: {
      title: "Giới hạn",
      size: "CSS được giới hạn ở 20 KB theo UTF-8.",
      selectors: "Bộ chọn phải bắt đầu từ một lớp phủ được hỗ trợ.",
      resources: "Không cho phép url(), hình ảnh bên ngoài và tài nguyên bên ngoài.",
      atRules: "Không cho phép các quy tắc như @import, @font-face và @keyframes.",
      disabled: "Tắt CSS tùy chỉnh sẽ giữ lại nội dung nhưng không áp dụng vào lớp phủ."
    }
  },
  badgePreference: {
    default: "Huy hiệu mặc định",
    error: "Lỗi chọn huy hiệu",
    loadFailed: "Không thể tải cài đặt huy hiệu.",
    saveFailed: "Không thể thay đổi huy hiệu."
  },
  chessAccount: {
    loading: "Đang kiểm tra thông tin tài khoản.",
    disconnect: "Ngắt kết nối",
    lastUpdated: "Cập nhật lần cuối: {{date}}",
    refreshInMinutes: "Làm mới sau {{count}} phút",
    games_one: "{{count}} ván",
    games_other: "{{count}} ván",
    highestApplied: "Điểm xếp hạng cao nhất đang dùng",
    noSupportedRatings: "Không tìm thấy điểm xếp hạng ở thể loại thời gian được hỗ trợ.",
    requestFailed: "Không thể hoàn tất yêu cầu."
  },
  chesscom: {
    title: "Tài khoản Chess.com",
    description: "Tải điểm xếp hạng Rapid, Blitz và Bullet.",
    refreshTitle: "Làm mới điểm xếp hạng Chess.com",
    disconnectConfirm:
      "Ngắt kết nối tài khoản Chess.com và xóa huy hiệu trò chuyện hiện tại?",
    username: "Tên người dùng Chess.com",
    lookup: "Tìm tài khoản",
    verified: "Quyền sở hữu tài khoản Chess.com đã được xác minh.",
    unverifiedNotice:
      "Điểm xếp hạng này sẽ không xuất hiện trên lớp phủ trò chuyện cho đến khi quyền sở hữu tài khoản được xác minh.",
    createCode: "Tạo mã xác minh",
    locationInstruction:
      "Nhập chính xác mã bên dưới vào trường Vị trí (Location) trong hồ sơ Chess.com của bạn rồi lưu lại.",
    copyCode: "Sao chép mã xác minh",
    openProfileSettings: "Mở cài đặt hồ sơ",
    confirmVerification: "Tôi đã lưu, xác minh ngay",
    expiryNotice:
      "Mã có hiệu lực trong 48 giờ. Bộ nhớ đệm API công khai của Chess.com có thể làm chậm việc cập nhật thay đổi hồ sơ."
  },
  lichess: {
    title: "Tài khoản Lichess",
    description: "Tải điểm xếp hạng Bullet, Blitz, Rapid và Classical.",
    refreshTitle: "Làm mới điểm xếp hạng Lichess",
    disconnectConfirm:
      "Ngắt kết nối tài khoản Lichess và xóa huy hiệu hiện tại?",
    connect: "Kết nối với Lichess",
    connected: "Tài khoản Lichess đã được kết nối.",
    expired: "Yêu cầu kết nối Lichess đã hết hạn. Vui lòng thử lại.",
    failed: "Không thể kết nối tài khoản Lichess. Vui lòng thử lại.",
    verified: "Quyền sở hữu tài khoản Lichess đã được xác minh."
  },
  platformBadge: "Huy hiệu nền tảng",
  platforms: {
    title: "Nền tảng phát sóng",
    loading: "Đang kiểm tra các tài khoản đã kết nối.",
    noAccount: "Không có tài khoản đã kết nối",
    permissionRequired: "Cần quyền truy cập trò chuyện",
    permissionStatus: "Cần cấp quyền",
    grantPermission: "Cấp quyền",
    revokePermission: "Thu hồi",
    reconnectRequired: "Cần kết nối lại",
    connecting: "Đang kết nối",
    alternativeRequired:
      "Hãy kết nối một tài khoản đăng nhập khác trước khi ngắt kết nối tài khoản này.",
    chzzk: {
      name: "Chzzk",
      disconnectAccountConfirm:
        "Ngắt kết nối tài khoản Chzzk và thu hồi quyền truy cập trò chuyện?",
      disconnectPermissionConfirm:
        "Thu hồi quyền truy cập trò chuyện Chzzk? Tài khoản đăng nhập Chzzk vẫn được giữ kết nối.",
      accountDisconnected: "Chzzk đã được ngắt kết nối.",
      permissionDisconnected: "Quyền truy cập trò chuyện Chzzk đã bị thu hồi.",
      connectAccount: "Kết nối tài khoản Chzzk",
      disconnectAccount: "Ngắt kết nối Chzzk",
      connectPermission: "Cấp quyền truy cập trò chuyện Chzzk",
      disconnectPermission: "Thu hồi quyền truy cập trò chuyện Chzzk",
      connected: "Tài khoản Chzzk đã được kết nối.",
      streamerConnected:
        "Chzzk và quyền truy cập trò chuyện đã được kết nối.",
      conflict:
        "Tài khoản Chzzk này đã được liên kết với một người dùng EloBadge khác.",
      failed: "Không thể kết nối tài khoản Chzzk. Vui lòng thử lại.",
      streamerFailed:
        "Không thể hoàn tất kết nối Chzzk hoặc cấp quyền trò chuyện."
    },
    twitch: {
      disconnectAccountConfirm:
        "Ngắt kết nối tài khoản Twitch và thu hồi quyền truy cập trò chuyện?",
      disconnectPermissionConfirm:
        "Thu hồi quyền truy cập trò chuyện Twitch? Tài khoản đăng nhập Twitch vẫn được giữ kết nối.",
      accountDisconnected: "Twitch đã được ngắt kết nối.",
      permissionDisconnected: "Quyền truy cập trò chuyện Twitch đã bị thu hồi.",
      connectAccount: "Kết nối tài khoản Twitch",
      disconnectAccount: "Ngắt kết nối Twitch",
      connectPermission: "Cấp quyền truy cập trò chuyện Twitch",
      disconnectPermission: "Thu hồi quyền truy cập trò chuyện Twitch",
      connected: "Tài khoản Twitch đã được kết nối.",
      streamerConnected:
        "Twitch và quyền truy cập trò chuyện đã được kết nối.",
      denied: "Yêu cầu kết nối Twitch đã bị hủy.",
      expired: "Yêu cầu kết nối Twitch đã hết hạn. Vui lòng thử lại.",
      conflict:
        "Tài khoản Twitch này đã được liên kết với một người dùng EloBadge khác.",
      failed: "Không thể kết nối tài khoản Twitch. Vui lòng thử lại.",
      streamerFailed:
        "Không thể hoàn tất kết nối Twitch hoặc cấp quyền trò chuyện."
    },
    loadFailed: "Không thể tải các kết nối nền tảng phát sóng."
  },
  overlay: {
    title: "Lớp phủ nguồn trình duyệt",
    description:
      "Hoạt động với OBS Studio, XSplit và các phần mềm phát sóng khác hỗ trợ nguồn trình duyệt. Được tối ưu cho chiều rộng 600 px; hãy điều chỉnh chiều cao cho phù hợp với cảnh của bạn.",
    signInFirst: "Trước tiên, hãy đăng nhập bằng tài khoản nền tảng phát sóng ở trên.",
    createUrl: "Tạo URL",
    urlLabel: "URL nguồn trình duyệt",
    showUrl: "Hiện URL",
    hideUrl: "Ẩn URL",
    copyUrl: "Sao chép URL",
    copied: "Đã sao chép",
    enable: "Bật",
    disable: "Tắt",
    rotate: "Đổi URL",
    rotateConfirm:
      "Thu hồi URL lớp phủ hiện tại và cấp một URL mới?",
    general: "Chung",
    badges: "Huy hiệu",
    background: "Nền trò chuyện",
    colors: "Màu trò chuyện",
    fonts: "Phông chữ trò chuyện",
    maxWidth: "Chiều rộng tối đa của trò chuyện",
    alignment: "Căn chỉnh trò chuyện",
    alignmentOption: {
      left: "Căn trái",
      center: "Căn giữa",
      right: "Căn phải"
    },
    messageLayout: "Bố cục biệt danh và tin nhắn",
    messageLayoutOption: {
      inline: "Một dòng",
      stacked: "Dòng mới",
      aligned: "Căn điểm bắt đầu",
      individual: "Căn chỉnh từng tin nhắn"
    },
    nicknameSeparatorVisible: "Hiện dấu hai chấm (:) sau biệt danh",
    alignedNicknameRightAligned: "Căn phải biệt danh",
    messageBoxFilled: "Lấp đầy hộp trò chuyện",
    customCssEnabled: "Sử dụng CSS tùy chỉnh",
    customCss: "CSS tùy chỉnh",
    customCssGuide: "Hướng dẫn CSS tùy chỉnh",
    restoreCustomCss: "Khôi phục CSS đã lưu gần nhất",
    restoreCustomCssConfirm: "Khôi phục CSS tùy chỉnh đã lưu gần nhất?",
    clearCustomCss: "Xóa CSS tùy chỉnh",
    clearCustomCssConfirm: "Xóa toàn bộ nội dung CSS tùy chỉnh?",
    unsavedChangesConfirm: "Bạn có cài đặt giao diện chưa lưu. Rời khỏi trang này?",
    customCssPresets: "Tải ví dụ CSS",
    applyCustomCssPresetConfirm: "Thay CSS hiện tại bằng ví dụ “{{name}}”?",
    customCssPreset: {
      defaults: "Kiểu mặc định",
      bubble: "Bong bóng thoại",
      transparent: "Trò chuyện trong suốt",
      nickname: "Làm nổi bật biệt danh"
    },
    customCssSize: "{{current}} / {{maximum}}",
    customCssTooLarge: "CSS tùy chỉnh phải có dung lượng từ 20 KB trở xuống.",
    customCssError: {
      invalid_syntax: "Kiểm tra cú pháp CSS.",
      at_rule_not_allowed: "Không cho phép các quy tắc như @import và @font-face.",
      external_resource_not_allowed: "Không cho phép URL bên ngoài và tài nguyên hình ảnh.",
      selector_not_allowed: "Bộ chọn phải nằm trong các phần tử lớp phủ EloBadge được hỗ trợ.",
      property_not_allowed: "CSS chứa thuộc tính bị chặn vì lý do bảo mật.",
      invalid_property_value: "CSS chứa giá trị thuộc tính không được trình duyệt hỗ trợ.",
      too_large: "CSS tùy chỉnh phải có dung lượng từ 20 KB trở xuống."
    },
    duration: "Thời gian hiển thị tin nhắn",
    keep: "Hiển thị vô thời hạn",
    seconds_one: "{{count}} giây",
    seconds_other: "{{count}} giây",
    defaultSuffix: " (mặc định)",
    ratingBadge: "Huy hiệu điểm xếp hạng cờ vua",
    ratingPolicy: {
      viewer_choice: "Dùng lựa chọn của người xem",
      chesscom_only: "Chỉ Chess.com",
      lichess_only: "Chỉ Lichess",
      hidden: "Ẩn"
    },
    forcedProviderNotice:
      "Khi chọn một nền tảng cụ thể, người xem không có tài khoản trên nền tảng đó sẽ không nhận được huy hiệu cờ vua.",
    allPlatformBadges: "Hiện tất cả",
    platformBadges: {
      chzzk: "Huy hiệu Chzzk",
      twitch: "Huy hiệu Twitch"
    },
    visibleBadges: "Huy hiệu hiển thị",
    badgeKind: {
      role: "Người phát sóng và quản lý",
      subscription: "Đăng ký",
      donation: "Ủng hộ",
      subscription_gift: "Tặng đăng ký",
      unknown: "Khác"
    },
    twitchBadgeKind: {
      role: "Người phát sóng, người kiểm duyệt và VIP",
      subscription: "Người đăng ký và người sáng lập",
      donation: "Bits",
      subscription_gift: "Tặng đăng ký",
      unknown: "Toàn cầu và khác"
    },
    backgroundVisible: "Hiện nền",
    backgroundColor: "Màu nền",
    customBackgroundColor: "Chọn màu nền tùy chỉnh",
    backgroundOpacity: "Độ mờ của nền",
    nicknameVisible: "Hiện biệt danh",
    nicknameColor: "Màu biệt danh",
    messageColor: "Màu tin nhắn",
    colorMode: {
      fixed: "Một màu",
      by_user: "Theo người dùng",
      by_role: "Theo vai trò",
      message_by_role: "Theo loại"
    },
    customNicknameColor: "Chọn màu biệt danh tùy chỉnh",
    customMessageColor: "Chọn màu tin nhắn tùy chỉnh",
    role: {
      streamer: "Người phát sóng",
      manager: "Quản lý",
      subscriber: "Người đăng ký",
      donator: "Người ủng hộ",
      viewer: "Người xem"
    },
    font: "Phông chữ",
    systemFont: "Phông chữ mặc định của hệ thống",
    fontPreview: "Chú bé nhanh nhẹn mang chiếc hộp xanh qua phố vắng.",
    fontSize: "Cỡ chữ",
    fontWeight: "Độ đậm phông chữ",
    lineHeight: "Khoảng cách dòng",
    save: "Lưu giao diện",
    reset: "Đặt lại về mặc định",
    resetConfirm: "Đặt lại tất cả cài đặt giao diện trò chuyện về mặc định?",
    requestFailed: "Yêu cầu thất bại."
  },
  preview: {
    frameLabel: "Xem trước lớp phủ trò chuyện",
    empty: "Chưa có tin nhắn xem trước",
    nickname: "Biệt danh",
    nicknamePlaceholder: "Biệt danh người xem",
    rating: "Điểm xếp hạng",
    optional: "Không bắt buộc",
    role: "Vai trò",
    roleLabel: "Vai trò trong bản xem trước trò chuyện",
    badgeType: "Loại huy hiệu",
    badgeLabel: "Huy hiệu {{provider}}",
    message: "Tin nhắn",
    messagePlaceholder: "Nhập tin nhắn xem trước",
    add: "Thêm bản xem trước"
  },
  authCallback: {
    missingCode: "Thiếu mã đăng nhập.",
    loginFailed: "Đăng nhập thất bại.",
    loggingIn: "Đang đăng nhập bằng tài khoản nền tảng phát sóng của bạn.",
    success: "Đã kết nối tài khoản",
    successDescription:
      "{{name}} đã được kết nối ở chế độ {{role}}.",
    continue: "Tiếp tục",
    failure: "Kết nối tài khoản thất bại",
    invalidCode: "Mã đăng nhập đã hết hạn hoặc không hợp lệ."
  },
  api: {
    signInRequired: "Bạn phải đăng nhập vào EloBadge.",
    requestFailed: "Không thể hoàn tất yêu cầu.",
    serverLoginFailed: "Không thể xác minh đăng nhập máy chủ.",
    adminRequired: "Tài khoản này không có quyền quản trị viên.",
    overlayLoadFailed: "Không thể tải lớp phủ."
  },
  accountDeletion: {
    confirmation: "XÓA TÀI KHOẢN",
    title: "Xóa tài khoản",
    description:
      "Xóa vĩnh viễn dữ liệu cờ vua đã kết nối và cài đặt phát sóng của bạn.",
    action: "Xóa tài khoản EloBadge",
    dialogTitle: "Xóa tài khoản EloBadge của bạn?",
    warning:
      "Các kết nối Chess.com và Lichess, điểm xếp hạng, URL lớp phủ và cài đặt giao diện sẽ bị xóa. Các URL nguồn trình duyệt hiện có sẽ ngừng hoạt động ngay lập tức.",
    close: "Đóng hộp thoại xóa tài khoản",
    instruction: "Nhập {{text}} để tiếp tục.",
    deleting: "Đang xóa",
    permanentDelete: "Xóa vĩnh viễn",
    failed: "Không thể xóa tài khoản EloBadge."
  },
  privacy: {
    koreanOriginalNotice:
      "Chính sách quyền riêng tư này được cung cấp bằng tiếng Hàn và là phiên bản có giá trị pháp lý theo luật Hàn Quốc."
  }
} as const;

export default vi;
