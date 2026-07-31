import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = ["ko", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = {
  ko: {
    translation: {
      common: {
        streamer: "스트리머",
        viewer: "시청자",
        signOut: "로그아웃",
        signingOut: "로그아웃 중",
        loading: "불러오는 중",
        connect: "연결",
        disconnect: "연결 해제",
        cancel: "취소",
        close: "닫기",
        retry: "다시 시도",
        refresh: "갱신",
        refreshing: "갱신 중",
        error: "오류",
        connected: "연결됨",
        notConnected: "미연결"
      },
      language: {
        label: "언어",
        ko: "한국어",
        en: "English"
      },
      app: {
        mainNavigation: "주요 메뉴",
        signOutFailed: "로그아웃하지 못했습니다. 다시 시도해 주세요.",
        support: "문의 및 오류 제보:",
        privacy: "개인정보 처리방침"
      },
      home: {
        description: "치지직과 Twitch 채팅에 시청자의 체스 레이팅을 표시합니다.",
        broadcastTitle: "방송 설정",
        broadcastDescription:
          "방송 채팅을 연결하고 범용 브라우저 소스 주소를 관리합니다.",
        streamerAction: "스트리머 화면",
        ratingTitle: "레이팅 연결",
        ratingDescription:
          "방송 플랫폼 계정과 Chess.com·Lichess 계정을 연결해 레이팅을 관리합니다.",
        viewerAction: "시청자 화면"
      },
      login: {
        title: "{{role}} 로그인",
        chzzk: "치지직으로 로그인",
        twitch: "Twitch로 로그인"
      },
      streamer: {
        title: "방송 오버레이",
        preview: "채팅 미리보기"
      },
      viewer: {
        title: "계정 연결"
      },
      route: {
        loading: "화면을 불러오는 중",
        notFound: "페이지를 찾을 수 없습니다",
        home: "홈으로"
      },
      badgePreference: {
        default: "기본 배지",
        error: "배지 선택 오류",
        loadFailed: "배지 정보를 불러오지 못했습니다.",
        saveFailed: "배지를 변경하지 못했습니다."
      },
      chessAccount: {
        loading: "계정 정보를 확인하고 있습니다.",
        disconnect: "연동 해제",
        lastUpdated: "마지막 갱신 {{date}}",
        refreshInMinutes: "{{count}}분 후 갱신",
        games: "{{count}}게임",
        highestApplied: "최고 레이팅 적용 중",
        noSupportedRatings: "지원하는 시간 형식의 레이팅이 없습니다.",
        requestFailed: "요청을 처리하지 못했습니다."
      },
      chesscom: {
        title: "Chess.com 계정",
        description: "Rapid, Blitz, Bullet 레이팅을 불러옵니다.",
        refreshTitle: "Chess.com 레이팅 갱신",
        disconnectConfirm:
          "Chess.com 계정 연동과 현재 채팅 배지를 해제할까요?",
        username: "Chess.com 사용자명",
        lookup: "계정 조회",
        verified: "Chess.com 계정 소유 인증이 완료되었습니다.",
        unverifiedNotice:
          "인증 전에는 이 레이팅이 채팅 오버레이에 표시되지 않습니다.",
        createCode: "인증 코드 생성",
        locationInstruction:
          "Chess.com 프로필 설정의 위치(Location)에 아래 코드를 정확히 입력하고 저장하세요.",
        copyCode: "인증 코드 복사",
        openProfileSettings: "프로필 설정 열기",
        confirmVerification: "입력 완료, 인증 확인",
        expiryNotice:
          "코드는 48시간 동안 유효합니다. Chess.com 공개 API 캐시로 인해 변경 사항 반영이 늦을 수 있습니다."
      },
      lichess: {
        title: "Lichess 계정",
        description: "Bullet, Blitz, Rapid, Classical 레이팅을 불러옵니다.",
        refreshTitle: "Lichess 레이팅 갱신",
        disconnectConfirm:
          "Lichess 계정 연동과 현재 Lichess 배지를 해제할까요?",
        connect: "Lichess로 연결",
        connected: "Lichess 계정이 연결되었습니다.",
        expired: "Lichess 연결 요청이 만료되었습니다. 다시 시도해 주세요.",
        failed: "Lichess 계정을 연결하지 못했습니다. 다시 시도해 주세요.",
        verified: "Lichess 계정 소유 인증이 완료되었습니다."
      },
      platformBadge: "플랫폼 배지",
      platforms: {
        title: "방송 플랫폼",
        loading: "연결 정보를 확인하고 있습니다.",
        noAccount: "연결된 계정 없음",
        permissionRequired: "채팅 권한 필요",
        permissionStatus: "권한 필요",
        grantPermission: "권한 연결",
        revokePermission: "권한 해제",
        reconnectRequired: "재연결 필요",
        connecting: "연결 중",
        alternativeRequired:
          "다른 로그인 계정을 연결한 후 해제할 수 있습니다.",
        chzzk: {
          name: "치지직",
          disconnectAccountConfirm:
            "치지직 계정 연결과 채팅 수집 권한을 모두 해제할까요?",
          disconnectPermissionConfirm:
            "치지직 채팅 수집 권한을 해제할까요? 치지직 로그인 계정 연결은 유지됩니다.",
          accountDisconnected: "치지직 연결을 해제했습니다.",
          permissionDisconnected: "치지직 채팅 수집 권한을 해제했습니다.",
          connectAccount: "치지직 계정 연결",
          disconnectAccount: "치지직 연결 해제",
          connectPermission: "치지직 채팅 수집 권한 연결",
          disconnectPermission: "치지직 채팅 수집 권한 해제",
          connected: "치지직 계정이 연결되었습니다.",
          streamerConnected:
            "치지직 연결과 채팅 수집 권한 설정을 완료했습니다.",
          conflict:
            "이미 다른 EloBadge 사용자가 연결한 치지직 계정입니다.",
          failed: "치지직 계정을 연결하지 못했습니다. 다시 시도해 주세요.",
          streamerFailed:
            "치지직 연결 또는 채팅 권한 설정을 완료하지 못했습니다."
        },
        twitch: {
          disconnectAccountConfirm:
            "Twitch 계정 연결과 채팅 수집 권한을 모두 해제할까요?",
          disconnectPermissionConfirm:
            "Twitch 채팅 수집 권한을 해제할까요? Twitch 로그인 계정 연결은 유지됩니다.",
          accountDisconnected: "Twitch 연결을 해제했습니다.",
          permissionDisconnected: "Twitch 채팅 수집 권한을 해제했습니다.",
          connectAccount: "Twitch 계정 연결",
          disconnectAccount: "Twitch 연결 해제",
          connectPermission: "Twitch 채팅 수집 권한 연결",
          disconnectPermission: "Twitch 채팅 수집 권한 해제",
          connected: "Twitch 계정이 연결되었습니다.",
          streamerConnected:
            "Twitch 연결과 채팅 수집 권한 설정을 완료했습니다.",
          denied: "Twitch 연결 요청을 취소했습니다.",
          expired: "Twitch 연결 요청이 만료되었습니다. 다시 시도해 주세요.",
          conflict:
            "이미 다른 EloBadge 사용자가 연결한 Twitch 계정입니다.",
          failed: "Twitch 계정을 연결하지 못했습니다. 다시 시도해 주세요.",
          streamerFailed:
            "Twitch 연결 또는 채팅 권한 설정을 완료하지 못했습니다."
        },
        loadFailed: "방송 플랫폼 연결 정보를 불러오지 못했습니다."
      },
      overlay: {
        title: "브라우저 소스 오버레이",
        description:
          "OBS Studio, XSplit 등 브라우저 소스를 지원하는 방송 프로그램에서 사용할 수 있습니다. 너비 600px에 최적화되어 있으며 높이는 방송 화면에 맞게 설정하세요.",
        signInFirst: "위에서 방송 플랫폼 계정으로 먼저 로그인하세요.",
        createUrl: "URL 생성",
        urlLabel: "브라우저 소스 URL",
        showUrl: "URL 표시",
        hideUrl: "URL 숨기기",
        copyUrl: "URL 복사",
        copied: "복사됨",
        enable: "활성화",
        disable: "비활성화",
        rotate: "재발급",
        rotateConfirm: "기존 오버레이 URL을 폐기하고 새로 발급할까요?",
        general: "기본 설정",
        badges: "배지 설정",
        background: "채팅 배경",
        colors: "채팅 색상",
        fonts: "채팅 폰트",
        maxWidth: "채팅 최대 너비",
        duration: "채팅 표시 시간",
        keep: "계속 유지",
        seconds: "{{count}}초",
        defaultSuffix: " (기본)",
        ratingBadge: "체스 레이팅 배지",
        ratingPolicy: {
          viewer_choice: "시청자 선택 따르기",
          chesscom_only: "Chess.com만 표시",
          lichess_only: "Lichess만 표시",
          hidden: "표시하지 않음"
        },
        forcedProviderNotice:
          "특정 플랫폼을 선택하면 해당 계정을 연결하지 않은 시청자의 체스 배지는 표시하지 않습니다.",
        allPlatformBadges: "전체 표시",
        platformBadges: {
          chzzk: "치지직 배지",
          twitch: "Twitch 배지"
        },
        visibleBadges: "표시할 배지",
        badgeKind: {
          role: "스트리머·매니저",
          subscription: "구독",
          donation: "후원",
          subscription_gift: "구독 선물",
          unknown: "기타"
        },
        twitchBadgeKind: {
          role: "스트리머·매니저·VIP",
          subscription: "구독·창립자",
          donation: "Bits",
          subscription_gift: "구독 선물",
          unknown: "글로벌·기타"
        },
        backgroundVisible: "배경 표시",
        backgroundColor: "배경 색상",
        customBackgroundColor: "직접 배경 색상 선택",
        backgroundOpacity: "배경 불투명도",
        nicknameVisible: "닉네임 표시",
        nicknameColor: "닉네임 색상",
        messageColor: "메시지 색상",
        colorMode: {
          fixed: "단일 색상",
          by_user: "사용자별",
          by_role: "역할별",
          message_by_role: "유형별"
        },
        customNicknameColor: "직접 닉네임 색상 선택",
        customMessageColor: "직접 메시지 색상 선택",
        role: {
          streamer: "스트리머",
          manager: "매니저",
          subscriber: "구독자",
          donator: "후원자",
          viewer: "일반 시청자"
        },
        font: "폰트",
        systemFont: "시스템 기본",
        fontPreview: "동해물과 백두산이 마르고 닳도록...",
        fontSize: "글자 크기",
        fontWeight: "글자 굵기",
        lineHeight: "줄 간격",
        save: "화면 설정 저장",
        reset: "기본값으로 초기화",
        resetConfirm: "채팅 화면 설정을 모두 기본값으로 초기화할까요?",
        requestFailed: "요청에 실패했습니다."
      },
      preview: {
        empty: "아직 표시할 메시지가 없습니다",
        nickname: "닉네임",
        nicknamePlaceholder: "시청자 닉네임",
        rating: "레이팅",
        optional: "선택 사항",
        role: "역할",
        roleLabel: "채팅 미리보기 역할",
        badgeType: "배지 유형",
        badgeLabel: "{{provider}} 배지",
        message: "메시지",
        messagePlaceholder: "미리보기 메시지 입력",
        add: "미리보기 추가"
      },
      authCallback: {
        missingCode: "로그인 코드가 없습니다.",
        loginFailed: "로그인에 실패했습니다.",
        loggingIn: "방송 플랫폼 계정으로 로그인하고 있습니다.",
        success: "계정 연결 완료",
        successDescription:
          "{{name}} 계정을 {{role}} 모드로 연결했습니다.",
        continue: "계속하기",
        failure: "계정 연결 실패",
        invalidCode: "로그인 코드가 만료되었거나 유효하지 않습니다."
      },
      api: {
        signInRequired: "EloBadge 로그인이 필요합니다.",
        requestFailed: "요청을 처리하지 못했습니다.",
        serverLoginFailed: "서버 로그인 확인에 실패했습니다.",
        adminRequired: "관리자 권한이 없는 계정입니다.",
        overlayLoadFailed: "오버레이 정보를 불러오지 못했습니다."
      },
      accountDeletion: {
        confirmation: "계정 삭제",
        title: "계정 삭제",
        description:
          "계정과 연결된 체스 정보 및 방송 설정을 영구 삭제합니다.",
        action: "EloBadge 계정 삭제",
        dialogTitle: "EloBadge 계정을 삭제할까요?",
        warning:
          "Chess.com·Lichess 연동, 레이팅, 오버레이 URL과 화면 설정이 모두 삭제됩니다. 기존 브라우저 소스 오버레이 주소도 즉시 작동을 멈춥니다.",
        close: "계정 삭제 창 닫기",
        instruction: "계속하려면 {{text}}를 입력하세요.",
        deleting: "삭제 중",
        permanentDelete: "영구 삭제",
        failed: "EloBadge 계정을 삭제하지 못했습니다."
      },
      privacy: {
        koreanOriginalNotice:
          "본 개인정보 처리방침은 대한민국 법률에 따른 한국어 원문입니다."
      }
    }
  },
  en: {
    translation: {
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
        label: "Language",
        ko: "한국어",
        en: "English"
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
    }
  }
} as const;

const LANGUAGE_STORAGE_KEY = "elobadge-language";

void i18n.use(initReactI18next).init({
  resources,
  lng: readInitialLanguage(),
  fallbackLng: "ko",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false
  }
});

function readInitialLanguage(): SupportedLanguage {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored === "ko" || stored === "en") {
    return stored;
  }

  return window.navigator.languages.some((language) =>
    language.toLowerCase().startsWith("ko")
  )
    ? "ko"
    : "en";
}

function applyLanguage(language: string): void {
  const supportedLanguage: SupportedLanguage = language.startsWith("en")
    ? "en"
    : "ko";
  document.documentElement.lang = supportedLanguage;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
}

applyLanguage(i18n.language);
i18n.on("languageChanged", applyLanguage);

export default i18n;
