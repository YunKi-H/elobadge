import {
  isOverlayFontFamily,
  type ChessBadges,
  type ChessProvider,
  type OverlayAppearance,
  type StreamingPlatform
} from "@elobadge/core";
import { signOut } from "firebase/auth";
import { getFirebaseClientAuth } from "../firebase/client";
import i18n from "../i18n";

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const auth = getFirebaseClientAuth();
  await auth.authStateReady();
  const user = auth.currentUser;

  if (!user) {
    throw new Error(i18n.t("api.signInRequired"));
  }

  const idToken = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${idToken}`);
  headers.set("Accept-Language", i18n.resolvedLanguage ?? i18n.language);

  const response = await fetch(input, {
    ...init,
    headers
  });

  if (response.status === 401) {
    await signOut(auth).catch(() => undefined);
  }

  return response;
}

export interface CurrentApiUser {
  uid: string;
  provider: string | null;
  chzzkChannelId: string | null;
  email: string | null;
}

export type ChzzkSessionHealth =
  | "connecting"
  | "healthy_idle"
  | "healthy_active"
  | "reconnecting"
  | "subscription_failed"
  | "connection_failed"
  | "unknown";

export interface AdminStatus {
  generatedAt: string;
  database: {
    users: number;
    streamers: number;
    chatEnabledStreamers: number;
    activeOverlays: number;
  };
  runtime: {
    uptimeSeconds: number;
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
    chzzkSessions: {
      total: number;
      connected: number;
      subscribed: number;
      healthy: number;
      unhealthy: number;
      byHealth: Record<ChzzkSessionHealth, number>;
    };
    overlayConnections: {
      total: number;
      uniqueOverlays: number;
    };
  };
}

export type FirebaseSessionValidation =
  | "valid"
  | "invalid"
  | "unavailable";

export interface OverlayAccess {
  publicToken: string;
  active: boolean;
  url: string;
  appearance: OverlayAppearance;
}

export type CustomCssValidationReason =
  | "too_large"
  | "invalid_syntax"
  | "at_rule_not_allowed"
  | "external_resource_not_allowed"
  | "selector_not_allowed"
  | "property_not_allowed"
  | "invalid_property_value";

export class OverlayAppearanceUpdateError extends Error {
  constructor(
    message: string,
    readonly customCssReason: CustomCssValidationReason | null
  ) {
    super(message);
    this.name = "OverlayAppearanceUpdateError";
  }
}

export interface ChessComAccount {
  provider: "chesscom";
  username: string;
  profileUrl: string;
  avatarUrl: string | null;
  verified: boolean;
  selectedSpeed: "bullet" | "blitz" | "rapid" | null;
  ratingsFetchedAt: string | null;
  manualRefreshAvailableAt: string | null;
  ratings: Array<{
    speed: "bullet" | "blitz" | "rapid";
    value: number;
    ratingDeviation: number;
    providerUpdatedAt: string;
  }>;
}

export interface ChessComVerificationChallenge {
  code: string;
  expiresAt: string;
}

export interface LichessAccount {
  provider: "lichess";
  username: string;
  profileUrl: string;
  verified: true;
  selectedSpeed: "bullet" | "blitz" | "rapid" | "classical" | null;
  ratingsFetchedAt: string | null;
  manualRefreshAvailableAt: string | null;
  ratings: Array<{
    speed: "bullet" | "blitz" | "rapid" | "classical";
    value: number;
    ratingDeviation: number;
    provisional: boolean;
    games: number;
  }>;
}

export interface ChessBadgePreference {
  badges: ChessBadges;
  preferredProvider: ChessProvider | null;
}

export interface PlatformAccount {
  platform: StreamingPlatform;
  platformUserId: string;
  displayName: string;
}

export interface TwitchStreamerAuthorization {
  connected: boolean;
  platformUserId?: string;
  displayName?: string;
  expiresAt?: string;
  scopes?: string[];
  session?: TwitchChatSession | null;
}

export interface TwitchChatSession {
  health:
    | "connecting"
    | "healthy_idle"
    | "healthy_active"
    | "reconnecting"
    | "subscription_failed"
    | "connection_failed"
    | "authorization_revoked";
  connected: boolean;
  subscribed: boolean;
  lastChatAt: string | null;
  lastError: string | null;
}

export interface ChzzkStreamerAuthorization {
  connected: boolean;
  tokenStatus: "active" | "reauth_required" | null;
}

export async function getChzzkStreamerAuthorization(): Promise<ChzzkStreamerAuthorization> {
  const response = await authenticatedFetch(
    "/api/chzzk/streamer-authorization"
  );
  const body: unknown = await response.json().catch(() => null);
  const authorization =
    body && typeof body === "object"
      ? (body as { authorization?: unknown }).authorization
      : null;

  if (
    !response.ok ||
    !authorization ||
    typeof authorization !== "object" ||
    typeof (authorization as { connected?: unknown }).connected !== "boolean"
  ) {
    throw new Error(
      apiError(body, "치지직 채팅 권한 정보를 불러오지 못했습니다.")
    );
  }

  return authorization as ChzzkStreamerAuthorization;
}

export async function getPlatformAccounts(): Promise<PlatformAccount[]> {
  const response = await authenticatedFetch("/api/platform-accounts");
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isPlatformAccountsResponse(body)) {
    throw new Error(apiError(body, "방송 플랫폼 연결 정보를 불러오지 못했습니다."));
  }

  return body.accounts;
}

export async function startTwitchConnection(): Promise<string> {
  const response = await authenticatedFetch("/api/auth/twitch/start", {
    method: "POST"
  });
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { authorizationUrl?: unknown }).authorizationUrl !==
      "string"
  ) {
    throw new Error(apiError(body, "Twitch 연결을 시작하지 못했습니다."));
  }

  return (body as { authorizationUrl: string }).authorizationUrl;
}

export async function startChzzkConnection(
  streamer: boolean
): Promise<string> {
  const response = await authenticatedFetch("/api/auth/chzzk/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: streamer ? "streamer" : "viewer" })
  });
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { authorizationUrl?: unknown }).authorizationUrl !==
      "string"
  ) {
    throw new Error(apiError(body, "치지직 연결을 시작하지 못했습니다."));
  }

  return (body as { authorizationUrl: string }).authorizationUrl;
}

export async function disconnectTwitchAccount(): Promise<void> {
  const response = await authenticatedFetch("/api/platform-accounts/twitch", {
    method: "DELETE"
  });
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { disconnected?: unknown }).disconnected !== "number"
  ) {
    throw new Error(apiError(body, "Twitch 연결을 해제하지 못했습니다."));
  }
}

export async function getTwitchStreamerAuthorization(): Promise<TwitchStreamerAuthorization> {
  const response = await authenticatedFetch(
    "/api/twitch/streamer-authorization"
  );
  const body: unknown = await response.json().catch(() => null);
  const authorization =
    body && typeof body === "object"
      ? (body as { authorization?: unknown }).authorization
      : null;
  const session =
    body && typeof body === "object"
      ? (body as { session?: unknown }).session
      : null;

  if (
    !response.ok ||
    !authorization ||
    typeof authorization !== "object" ||
    typeof (authorization as { connected?: unknown }).connected !== "boolean"
  ) {
    throw new Error(
      apiError(body, "Twitch 채팅 권한 정보를 불러오지 못했습니다.")
    );
  }

  return {
    ...(authorization as TwitchStreamerAuthorization),
    session: isTwitchChatSession(session) ? session : null
  };
}

function isTwitchChatSession(value: unknown): value is TwitchChatSession {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { health?: unknown }).health === "string" &&
      typeof (value as { connected?: unknown }).connected === "boolean" &&
      typeof (value as { subscribed?: unknown }).subscribed === "boolean"
  );
}

export async function startTwitchStreamerAuthorization(): Promise<string> {
  const response = await authenticatedFetch(
    "/api/auth/twitch/streamer/start",
    { method: "POST" }
  );
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { authorizationUrl?: unknown }).authorizationUrl !==
      "string"
  ) {
    throw new Error(
      apiError(body, "Twitch 채팅 권한 연결을 시작하지 못했습니다.")
    );
  }

  return (body as { authorizationUrl: string }).authorizationUrl;
}

export async function disconnectTwitchStreamerAuthorization(): Promise<void> {
  const response = await authenticatedFetch(
    "/api/twitch/streamer-authorization",
    { method: "DELETE" }
  );
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { disconnected?: unknown }).disconnected !== "boolean"
  ) {
    throw new Error(
      apiError(body, "Twitch 채팅 권한을 해제하지 못했습니다.")
    );
  }
}

export async function getChessBadgePreference(): Promise<ChessBadgePreference> {
  const response = await authenticatedFetch("/api/chess/badge-preference");
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isChessBadgePreferenceResponse(body)) {
    throw new Error(apiError(body, "배지 선택 정보를 불러오지 못했습니다."));
  }
  return { badges: body.badges, preferredProvider: body.preferredProvider };
}

export async function updateChessBadgePreference(
  provider: ChessProvider
): Promise<ChessBadgePreference> {
  const response = await authenticatedFetch("/api/chess/badge-preference", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider })
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isChessBadgePreferenceResponse(body)) {
    throw new Error(apiError(body, "표시할 배지를 변경하지 못했습니다."));
  }
  return { badges: body.badges, preferredProvider: body.preferredProvider };
}

export async function getLichessAccount(): Promise<LichessAccount | null> {
  const response = await authenticatedFetch("/api/chess/lichess/account");
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isLichessAccountResponse(body)) {
    throw new Error(apiError(body, "Lichess 계정 정보를 불러오지 못했습니다."));
  }
  return body.account;
}

export async function startLichessConnection(): Promise<string> {
  const response = await authenticatedFetch("/api/auth/lichess/start", {
    method: "POST"
  });
  const body: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { authorizationUrl?: unknown }).authorizationUrl !== "string"
  ) {
    throw new Error(apiError(body, "Lichess 연결을 시작하지 못했습니다."));
  }
  return (body as { authorizationUrl: string }).authorizationUrl;
}

export async function refreshLichessAccount(): Promise<LichessAccount> {
  const response = await authenticatedFetch("/api/chess/lichess/account/refresh", {
    method: "POST"
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isLichessAccountResponse(body) || !body.account) {
    throw new Error(apiError(body, "Lichess 레이팅을 갱신하지 못했습니다."));
  }
  return body.account;
}

export async function disconnectLichessAccount(): Promise<void> {
  const response = await authenticatedFetch("/api/chess/lichess/account", {
    method: "DELETE"
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !isLichessAccountResponse(body) || body.account !== null) {
    throw new Error(apiError(body, "Lichess 계정 연동을 해제하지 못했습니다."));
  }
}

export async function disconnectChzzkConnection(
  disconnectAccount: boolean
): Promise<{
  revoked: boolean;
  disconnected: number;
}> {
  const response = await authenticatedFetch("/api/chzzk/connection", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disconnectAccount })
  });
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true ||
    typeof (body as { revoked?: unknown }).revoked !== "boolean" ||
    typeof (body as { disconnected?: unknown }).disconnected !== "number"
  ) {
    throw new Error(apiError(body, "치지직 연결을 해제하지 못했습니다."));
  }

  return body as { revoked: boolean; disconnected: number };
}

export async function deleteEloBadgeAccount(): Promise<void> {
  const response = await authenticatedFetch("/api/account", {
    method: "DELETE"
  });
  const body: unknown = await response.json().catch(() => null);

  if (
    !response.ok ||
    !body ||
    typeof body !== "object" ||
    (body as { ok?: unknown }).ok !== true
  ) {
    throw new Error(apiError(body, "EloBadge 계정을 삭제하지 못했습니다."));
  }
}

export async function getChessComAccount(): Promise<ChessComAccount | null> {
  const response = await authenticatedFetch("/api/chess/chesscom/account");
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComAccountResponse(body)) {
    throw new Error(apiError(body, "Chess.com 계정 정보를 불러오지 못했습니다."));
  }

  return body.account;
}

export async function linkChessComAccount(username: string): Promise<ChessComAccount> {
  const response = await authenticatedFetch("/api/chess/chesscom/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComAccountResponse(body) || !body.account) {
    throw new Error(apiError(body, "Chess.com 계정을 연결하지 못했습니다."));
  }

  return body.account;
}

export async function disconnectChessComAccount(): Promise<void> {
  const response = await authenticatedFetch("/api/chess/chesscom/account", {
    method: "DELETE"
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComAccountResponse(body) || body.account !== null) {
    throw new Error(apiError(body, "Chess.com 계정 연동을 해제하지 못했습니다."));
  }
}

export async function refreshChessComAccount(): Promise<ChessComAccount> {
  const response = await authenticatedFetch(
    "/api/chess/chesscom/account/refresh",
    { method: "POST" }
  );
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComAccountResponse(body) || !body.account) {
    throw new Error(apiError(body, "Chess.com 레이팅을 갱신하지 못했습니다."));
  }

  return body.account;
}

export async function createChessComVerification(): Promise<ChessComVerificationChallenge> {
  const response = await authenticatedFetch("/api/chess/chesscom/verification", {
    method: "POST"
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComVerificationResponse(body)) {
    throw new Error(apiError(body, "Chess.com 인증 코드를 생성하지 못했습니다."));
  }

  return body.verification;
}

export async function confirmChessComVerification(): Promise<ChessComAccount> {
  const response = await authenticatedFetch(
    "/api/chess/chesscom/verification/confirm",
    { method: "POST" }
  );
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isChessComAccountResponse(body) || !body.account) {
    throw new Error(apiError(body, "Chess.com 계정 인증에 실패했습니다."));
  }

  return body.account;
}

export async function getCurrentApiUser(): Promise<CurrentApiUser> {
  const response = await authenticatedFetch("/api/me");
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isCurrentUserResponse(body)) {
    throw new Error(i18n.t("api.serverLoginFailed"));
  }

  return body.user;
}

export async function getAdminStatus(): Promise<AdminStatus> {
  const response = await authenticatedFetch("/api/admin/status");
  const body: unknown = await response.json().catch(() => null);

  if (response.status === 403) {
    throw new Error(i18n.t("api.adminRequired"));
  }
  if (!response.ok || !isAdminStatusResponse(body)) {
    throw new Error(apiError(body, "운영 현황을 불러오지 못했습니다."));
  }

  return {
    generatedAt: body.generatedAt,
    database: body.database,
    runtime: body.runtime
  };
}

export async function validateCurrentFirebaseSession(): Promise<FirebaseSessionValidation> {
  try {
    const response = await authenticatedFetch("/api/me");

    if (response.status === 401) {
      return "invalid";
    }
    return response.ok ? "valid" : "unavailable";
  } catch (error) {
    return isInvalidFirebaseSessionError(error) ? "invalid" : "unavailable";
  }
}

export async function getOverlayAccess(): Promise<OverlayAccess | null> {
  const response = await authenticatedFetch("/api/overlay");
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isOverlayResponse(body)) {
    throw new Error(i18n.t("api.overlayLoadFailed"));
  }

  return body.overlay;
}

export async function enableOverlayAccess(): Promise<OverlayAccess> {
  return updateOverlayAccess("/api/overlay");
}

export async function rotateOverlayAccess(): Promise<OverlayAccess> {
  return updateOverlayAccess("/api/overlay/rotate");
}

export async function disableOverlayAccess(): Promise<OverlayAccess | null> {
  const response = await authenticatedFetch("/api/overlay/disable", {
    method: "POST"
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isOverlayResponse(body)) {
    throw new Error(apiError(body, "오버레이를 비활성화하지 못했습니다."));
  }

  return body.overlay;
}

export async function updateOverlayAppearance(
  appearance: OverlayAppearance
): Promise<OverlayAccess> {
  const response = await authenticatedFetch("/api/overlay/appearance", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appearance)
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isOverlayResponse(body) || !body.overlay) {
    throw new OverlayAppearanceUpdateError(
      apiError(body, "오버레이 화면 설정을 저장하지 못했습니다."),
      customCssValidationReason(body)
    );
  }

  return body.overlay;
}

function customCssValidationReason(
  value: unknown
): CustomCssValidationReason | null {
  if (!value || typeof value !== "object" || !("reason" in value)) {
    return null;
  }

  const reason = value.reason;

  return reason === "too_large" ||
    reason === "invalid_syntax" ||
    reason === "at_rule_not_allowed" ||
    reason === "external_resource_not_allowed" ||
    reason === "selector_not_allowed" ||
    reason === "property_not_allowed" ||
    reason === "invalid_property_value"
    ? reason
    : null;
}

async function updateOverlayAccess(path: string): Promise<OverlayAccess> {
  const response = await authenticatedFetch(path, { method: "POST" });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || !isOverlayResponse(body) || !body.overlay) {
    throw new Error(apiError(body, "오버레이 설정을 변경하지 못했습니다."));
  }

  return body.overlay;
}

function isCurrentUserResponse(
  value: unknown
): value is { ok: true; user: CurrentApiUser } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as {
    ok?: unknown;
    user?: Partial<CurrentApiUser>;
  };

  return (
    response.ok === true &&
    Boolean(response.user) &&
    typeof response.user?.uid === "string"
  );
}

function isPlatformAccountsResponse(
  value: unknown
): value is { ok: true; accounts: PlatformAccount[] } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as { ok?: unknown; accounts?: unknown };

  return (
    response.ok === true &&
    Array.isArray(response.accounts) &&
    response.accounts.every((account: unknown) => {
      if (!account || typeof account !== "object") {
        return false;
      }

      const candidate = account as Partial<PlatformAccount>;
      return (
        (candidate.platform === "chzzk" ||
          candidate.platform === "twitch") &&
        typeof candidate.platformUserId === "string" &&
        typeof candidate.displayName === "string"
      );
    })
  );
}

function isAdminStatusResponse(
  value: unknown
): value is { ok: true } & AdminStatus {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as {
    ok?: unknown;
    generatedAt?: unknown;
    database?: Record<string, unknown>;
    runtime?: {
      uptimeSeconds?: unknown;
      memory?: Record<string, unknown>;
      chzzkSessions?: Record<string, unknown>;
      overlayConnections?: Record<string, unknown>;
    };
  };

  return (
    response.ok === true &&
    typeof response.generatedAt === "string" &&
    hasNumericFields(response.database, [
      "users",
      "streamers",
      "chatEnabledStreamers",
      "activeOverlays"
    ]) &&
    typeof response.runtime?.uptimeSeconds === "number" &&
    hasNumericFields(response.runtime.memory, [
      "rssMb",
      "heapUsedMb",
      "heapTotalMb"
    ]) &&
    hasNumericFields(response.runtime.chzzkSessions, [
      "total",
      "connected",
      "subscribed",
      "healthy",
      "unhealthy"
    ]) &&
    Boolean(response.runtime.chzzkSessions?.byHealth) &&
    hasNumericFields(response.runtime.overlayConnections, [
      "total",
      "uniqueOverlays"
    ])
  );
}

function hasNumericFields(
  value: Record<string, unknown> | undefined,
  fields: string[]
): boolean {
  return Boolean(
    value &&
      fields.every((field) => typeof value[field] === "number")
  );
}

function isInvalidFirebaseSessionError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  return (
    error.code === "auth/id-token-revoked" ||
    error.code === "auth/invalid-user-token" ||
    error.code === "auth/user-disabled" ||
    error.code === "auth/user-token-expired"
  );
}

function isOverlayResponse(
  value: unknown
): value is { ok: true; overlay: OverlayAccess | null } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as {
    ok?: unknown;
    overlay?: Partial<OverlayAccess> | null;
  };

  if (response.ok !== true || response.overlay === undefined) {
    return false;
  }

  if (response.overlay === null) {
    return true;
  }

  return (
    typeof response.overlay.publicToken === "string" &&
    typeof response.overlay.active === "boolean" &&
    typeof response.overlay.url === "string" &&
    isOverlayAppearance(response.overlay.appearance)
  );
}

function isOverlayAppearance(value: unknown): value is OverlayAppearance {
  if (!value || typeof value !== "object") {
    return false;
  }

  const appearance = value as Partial<OverlayAppearance>;

  return (
    typeof appearance.messageMaxWidthPx === "number" &&
    Number.isInteger(appearance.messageMaxWidthPx) &&
    appearance.messageMaxWidthPx >= 300 &&
    appearance.messageMaxWidthPx <= 600 &&
    (appearance.chatAlignment === "left" ||
      appearance.chatAlignment === "center" ||
      appearance.chatAlignment === "right") &&
    (appearance.messageLayout === "inline" ||
      appearance.messageLayout === "stacked" ||
      appearance.messageLayout === "aligned" ||
      appearance.messageLayout === "individual") &&
    typeof appearance.nicknameSeparatorVisible === "boolean" &&
    typeof appearance.alignedNicknameRightAligned === "boolean" &&
    typeof appearance.messageBoxFilled === "boolean" &&
    typeof appearance.backgroundVisible === "boolean" &&
    typeof appearance.backgroundColor === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(appearance.backgroundColor) &&
    typeof appearance.backgroundOpacity === "number" &&
    Number.isInteger(appearance.backgroundOpacity) &&
    appearance.backgroundOpacity >= 0 &&
    appearance.backgroundOpacity <= 100 &&
    typeof appearance.chzzkBadgesVisible === "boolean" &&
    isChzzkBadgeVisibility(appearance.chzzkBadgeVisibility) &&
    typeof appearance.twitchBadgesVisible === "boolean" &&
    isChzzkBadgeVisibility(appearance.twitchBadgeVisibility) &&
    (appearance.ratingProviderPolicy === "viewer_choice" ||
      appearance.ratingProviderPolicy === "chesscom_only" ||
      appearance.ratingProviderPolicy === "lichess_only" ||
      appearance.ratingProviderPolicy === "hidden") &&
    typeof appearance.nicknameVisible === "boolean" &&
    (appearance.nicknameColorMode === "fixed" ||
      appearance.nicknameColorMode === "by_user" ||
      appearance.nicknameColorMode === "by_role") &&
    typeof appearance.nicknameColor === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(appearance.nicknameColor) &&
    isChatAuthorColors(appearance.nicknameRoleColors) &&
    (appearance.messageColorMode === "fixed" ||
      appearance.messageColorMode === "by_role") &&
    typeof appearance.messageColor === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(appearance.messageColor) &&
    isChatAuthorColors(appearance.messageRoleColors) &&
    isOverlayFontFamily(appearance.fontFamily) &&
    typeof appearance.fontSizePx === "number" &&
    Number.isInteger(appearance.fontSizePx) &&
    appearance.fontSizePx >= 12 &&
    appearance.fontSizePx <= 36 &&
    (appearance.fontWeight === 400 ||
      appearance.fontWeight === 500 ||
      appearance.fontWeight === 600 ||
      appearance.fontWeight === 700 ||
      appearance.fontWeight === 900) &&
    (appearance.fontLineHeight === 1.2 ||
      appearance.fontLineHeight === 1.4 ||
      appearance.fontLineHeight === 1.6) &&
    (appearance.messageDurationSeconds === 0 ||
      appearance.messageDurationSeconds === 10 ||
      appearance.messageDurationSeconds === 20 ||
      appearance.messageDurationSeconds === 30 ||
      appearance.messageDurationSeconds === 60)
  );
}

function isChzzkBadgeVisibility(
  value: unknown
): value is OverlayAppearance["chzzkBadgeVisibility"] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const visibility = value as Partial<
    OverlayAppearance["chzzkBadgeVisibility"]
  >;

  return [
    visibility.role,
    visibility.subscription,
    visibility.donation,
    visibility.subscription_gift,
    visibility.unknown
  ].every((visible) => typeof visible === "boolean");
}

function isChatAuthorColors(
  value: unknown
): value is OverlayAppearance["nicknameRoleColors"] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const colors = value as Partial<OverlayAppearance["nicknameRoleColors"]>;
  return [
    colors.streamer,
    colors.manager,
    colors.donator,
    colors.subscriber,
    colors.viewer
  ].every(
    (color) => typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color)
  );
}

function isChessComAccountResponse(
  value: unknown
): value is { ok: true; account: ChessComAccount | null } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as {
    ok?: unknown;
    account?: Partial<ChessComAccount> | null;
  };

  if (response.ok !== true || response.account === undefined) {
    return false;
  }

  if (response.account === null) {
    return true;
  }

  return (
    response.account.provider === "chesscom" &&
    typeof response.account.username === "string" &&
    typeof response.account.profileUrl === "string" &&
    typeof response.account.verified === "boolean" &&
    (response.account.ratingsFetchedAt === null ||
      typeof response.account.ratingsFetchedAt === "string") &&
    (response.account.manualRefreshAvailableAt === null ||
      typeof response.account.manualRefreshAvailableAt === "string") &&
    (response.account.selectedSpeed === null ||
      response.account.selectedSpeed === "bullet" ||
      response.account.selectedSpeed === "blitz" ||
      response.account.selectedSpeed === "rapid") &&
    Array.isArray(response.account.ratings)
  );
}

function isChessComVerificationResponse(
  value: unknown
): value is { ok: true; verification: ChessComVerificationChallenge } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as {
    ok?: unknown;
    verification?: Partial<ChessComVerificationChallenge>;
  };

  return (
    response.ok === true &&
    typeof response.verification?.code === "string" &&
    typeof response.verification.expiresAt === "string"
  );
}

function isLichessAccountResponse(
  value: unknown
): value is { ok: true; account: LichessAccount | null } {
  if (!value || typeof value !== "object") {
    return false;
  }
  const response = value as {
    ok?: unknown;
    account?: Partial<LichessAccount> | null;
  };
  if (response.ok !== true || response.account === undefined) {
    return false;
  }
  if (response.account === null) {
    return true;
  }
  return (
    response.account.provider === "lichess" &&
    typeof response.account.username === "string" &&
    typeof response.account.profileUrl === "string" &&
    response.account.verified === true &&
    (response.account.ratingsFetchedAt === null ||
      typeof response.account.ratingsFetchedAt === "string") &&
    (response.account.manualRefreshAvailableAt === null ||
      typeof response.account.manualRefreshAvailableAt === "string") &&
    (response.account.selectedSpeed === null ||
      response.account.selectedSpeed === "bullet" ||
      response.account.selectedSpeed === "blitz" ||
      response.account.selectedSpeed === "rapid" ||
      response.account.selectedSpeed === "classical") &&
    Array.isArray(response.account.ratings)
  );
}

function isChessBadgePreferenceResponse(value: unknown): value is {
  ok: true;
  badges: ChessBadges;
  preferredProvider: ChessProvider | null;
} {
  if (!value || typeof value !== "object") {
    return false;
  }
  const response = value as {
    ok?: unknown;
    badges?: unknown;
    preferredProvider?: unknown;
  };
  return (
    response.ok === true &&
    Boolean(response.badges) &&
    typeof response.badges === "object" &&
    (response.preferredProvider === null ||
      response.preferredProvider === "chesscom" ||
      response.preferredProvider === "lichess")
  );
}

function apiError(value: unknown, fallback: string): string {
  const english = i18n.resolvedLanguage === "en";

  if (
    value &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string" &&
    (!english || !/[가-힣]/.test(value.error))
  ) {
    return value.error;
  }

  return english ? i18n.t("api.requestFailed") : fallback;
}
