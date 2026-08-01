import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  type ChatAuthorKind,
  DEFAULT_OVERLAY_APPEARANCE,
  type OverlayAppearance,
  type OverlayFontFamily,
  type OverlayChatAlignment,
  type OverlayFontLineHeight,
  type OverlayFontWeight,
  type OverlayMessageDurationSeconds,
  type PlatformBadgeKind,
  type RatingProviderPolicy,
  type StreamingPlatform
} from "@elobadge/core";
import {
  BadgeCheck,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  Link,
  PaintBucket,
  Palette,
  Power,
  RefreshCw,
  RotateCcw,
  Save,
  Type
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import {
  disableOverlayAccess,
  enableOverlayAccess,
  getOverlayAccess,
  rotateOverlayAccess,
  updateOverlayAppearance,
  type OverlayAccess
} from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";
import { overlayFontFamilyValue } from "./overlay-appearance";

type SettingsState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; overlay: OverlayAccess | null }
  | { status: "error"; message: string };

type AppearanceSection =
  | "general"
  | "badges"
  | "background"
  | "colors"
  | "fonts";

type ExpandedAppearanceSections = Record<AppearanceSection, boolean>;

const MESSAGE_COLOR_SWATCHES = [
  "#FFFFFF",
  "#E2E8F0",
  "#FDE047",
  "#86EFAC",
  "#7DD3FC"
] as const;

const BACKGROUND_COLOR_SWATCHES = [
  "#020617",
  "#0F172A",
  "#172554",
  "#052E16",
  "#3F1D2E"
] as const;

const NICKNAME_COLOR_SWATCHES = [
  "#7DD3FC",
  "#86EFAC",
  "#FDE047",
  "#FDA4AF",
  "#C4B5FD",
  "#FDBA74"
] as const;

const APPEARANCE_SECTIONS_STORAGE_KEY =
  "elobadge.streamer.appearance-sections";

const DEFAULT_EXPANDED_APPEARANCE_SECTIONS: ExpandedAppearanceSections = {
  general: true,
  badges: true,
  background: true,
  colors: true,
  fonts: true
};

const MESSAGE_DURATION_OPTIONS = [10, 20, 30, 60, 0] as const;

const CHAT_ALIGNMENT_OPTIONS: ReadonlyArray<{
  value: OverlayChatAlignment;
  icon: typeof AlignLeft;
}> = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight }
];

const FONT_FAMILY_OPTIONS: ReadonlyArray<{
  value: OverlayFontFamily;
  label: string;
}> = [
  { value: "system", label: "시스템 기본" },
  { value: "pretendard", label: "프리텐다드" },
  { value: "freesentation", label: "프리젠테이션" },
  { value: "paperlogy", label: "페이퍼로지" },
  { value: "noto_sans_kr", label: "본고딕" },
  { value: "aggro", label: "어그로체" },
  { value: "nanum_square", label: "나눔스퀘어" },
  { value: "nanum_square_neo", label: "나눔스퀘어 네오" },
  { value: "nanum_square_round", label: "나눔스퀘어 라운드" },
  { value: "jalnan", label: "여기어때 잘난체" },
  { value: "maru_buri", label: "마루 부리" },
  { value: "nanum_gothic", label: "나눔고딕" },
  { value: "nanum_myeongjo", label: "나눔명조" },
  { value: "chosun_gungseo", label: "조선궁서체" },
  { value: "mona12", label: "Mona12" },
  { value: "dohyeon", label: "도현체" }
];

const FONT_WEIGHT_OPTIONS: ReadonlyArray<OverlayFontWeight> = [
  400,
  500,
  600,
  700,
  900
];

const FONT_LINE_HEIGHT_OPTIONS: ReadonlyArray<OverlayFontLineHeight> = [
  1.2,
  1.4,
  1.6
];

const RATING_PROVIDER_POLICY_OPTIONS: ReadonlyArray<{
  value: RatingProviderPolicy;
  label: string;
}> = [
  { value: "viewer_choice", label: "시청자 선택 따르기" },
  { value: "chesscom_only", label: "Chess.com만 표시" },
  { value: "lichess_only", label: "Lichess만 표시" },
  { value: "hidden", label: "표시하지 않음" }
];

const CHAT_AUTHOR_KIND_OPTIONS: ReadonlyArray<{
  kind: ChatAuthorKind;
  label: string;
}> = [
  { kind: "streamer", label: "스트리머" },
  { kind: "manager", label: "매니저" },
  { kind: "subscriber", label: "구독자" },
  { kind: "donator", label: "후원자" },
  { kind: "viewer", label: "일반 시청자" }
];

const PLATFORM_BADGE_KIND_OPTIONS: ReadonlyArray<{
  kind: PlatformBadgeKind;
  label: string;
}> = [
  { kind: "role", label: "스트리머·매니저" },
  { kind: "subscription", label: "구독" },
  { kind: "donation", label: "후원" },
  { kind: "subscription_gift", label: "구독 선물" },
  { kind: "unknown", label: "기타" }
];

export function OverlaySettings({
  onAppearanceChange,
  connectedPlatforms = []
}: {
  onAppearanceChange: (appearance: OverlayAppearance) => void;
  connectedPlatforms?: StreamingPlatform[];
}) {
  const { t } = useTranslation();
  const [state, setState] = useState<SettingsState>({ status: "loading" });
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlVisible, setUrlVisible] = useState(false);
  const [appearanceDirty, setAppearanceDirty] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    readExpandedAppearanceSections
  );

  useEffect(() => {
    return onAuthStateChanged(getFirebaseClientAuth(), (user) => {
      setUrlVisible(false);

      if (!user) {
        setState({ status: "signed_out" });
        return;
      }

      void getOverlayAccess()
        .then((overlay) => {
          setState({ status: "ready", overlay });
          if (overlay) {
            onAppearanceChange(overlay.appearance);
          }
        })
        .catch((error: unknown) => {
          setExpandedSections({ ...DEFAULT_EXPANDED_APPEARANCE_SECTIONS });
          setState(toErrorState(error, t("overlay.requestFailed")));
        });
    });
  }, [onAppearanceChange, t]);

  const runUpdate = async (operation: () => Promise<OverlayAccess | null>) => {
    setUpdating(true);
    setCopied(false);
    setUrlVisible(false);

    try {
      const overlay = await operation();
      setState({ status: "ready", overlay });
      setAppearanceDirty(false);
      if (overlay) {
        onAppearanceChange(overlay.appearance);
      }
    } catch (error) {
      setExpandedSections({ ...DEFAULT_EXPANDED_APPEARANCE_SECTIONS });
      setState(toErrorState(error, t("overlay.requestFailed")));
    } finally {
      setUpdating(false);
    }
  };

  const overlay = state.status === "ready" ? state.overlay : null;

  const updateAppearanceDraft = (patch: Partial<OverlayAppearance>) => {
    if (!overlay) {
      return;
    }

    const appearance = { ...overlay.appearance, ...patch };
    setState({
      status: "ready",
      overlay: { ...overlay, appearance }
    });
    setAppearanceDirty(true);
    onAppearanceChange(appearance);
  };

  const toggleAppearanceSection = (section: AppearanceSection) => {
    setExpandedSections((current) => {
      const next = { ...current, [section]: !current[section] };

      try {
        window.localStorage.setItem(
          APPEARANCE_SECTIONS_STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch {
        // The disclosure still works when browser storage is unavailable.
      }

      return next;
    });
  };

  const updateRoleColor = (kind: ChatAuthorKind, color: string) => {
    if (!overlay) {
      return;
    }

    updateAppearanceDraft({
      nicknameRoleColors: {
        ...overlay.appearance.nicknameRoleColors,
        [kind]: color.toUpperCase()
      }
    });
  };

  const updateMessageRoleColor = (kind: ChatAuthorKind, color: string) => {
    if (!overlay) {
      return;
    }

    updateAppearanceDraft({
      messageRoleColors: {
        ...overlay.appearance.messageRoleColors,
        [kind]: color.toUpperCase()
      }
    });
  };

  const updateBadgeVisibility = (
    platform: StreamingPlatform,
    kind: PlatformBadgeKind,
    visible: boolean
  ) => {
    if (!overlay) {
      return;
    }

    const visibilityKey = platform === "chzzk"
      ? "chzzkBadgeVisibility"
      : "twitchBadgeVisibility";
    updateAppearanceDraft({
      [visibilityKey]: {
        ...overlay.appearance[visibilityKey],
        [kind]: visible
      }
    });
  };

  const updatePlatformBadgesVisible = (
    platform: StreamingPlatform,
    visible: boolean
  ) => updateAppearanceDraft(
    platform === "chzzk"
      ? { chzzkBadgesVisible: visible }
      : { twitchBadgesVisible: visible }
  );

  return (
    <section className="mb-10 max-w-2xl border-y border-white/10 py-6">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Link aria-hidden="true" className="text-emerald-300" size={20} />
          <h2 className="text-lg font-semibold text-white">
            {t("overlay.title")}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {t("overlay.description")}
        </p>
      </div>

      {state.status === "loading" ? (
        <p className="text-sm text-slate-400">{t("common.loading")}</p>
      ) : null}

      {state.status === "signed_out" ? (
        <p className="text-sm text-slate-400">
          {t("overlay.signInFirst")}
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="text-sm text-red-300">{state.message}</p>
      ) : null}

      {state.status === "ready" && !overlay ? (
        <button
          type="button"
          disabled={updating}
          onClick={() => void runUpdate(enableOverlayAccess)}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
        >
          <Power aria-hidden="true" size={18} />
          {t("overlay.createUrl")}
        </button>
      ) : null}

      {overlay ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              aria-label={t("overlay.urlLabel")}
              readOnly
              value={urlVisible ? overlay.url : "********************"}
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />
            <button
              type="button"
              title={urlVisible ? t("overlay.hideUrl") : t("overlay.showUrl")}
              aria-label={urlVisible ? t("overlay.hideUrl") : t("overlay.showUrl")}
              aria-pressed={urlVisible}
              onClick={() => setUrlVisible((current) => !current)}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-white hover:bg-slate-700"
            >
              {urlVisible ? (
                <EyeOff aria-hidden="true" size={18} />
              ) : (
                <Eye aria-hidden="true" size={18} />
              )}
            </button>
            <button
              type="button"
              title={t("overlay.copyUrl")}
              aria-label={t("overlay.copyUrl")}
              onClick={() => {
                void navigator.clipboard.writeText(overlay.url).then(() => setCopied(true));
              }}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-white hover:bg-slate-700"
            >
              <Copy aria-hidden="true" size={18} />
            </button>
          </div>
          {copied ? (
            <p className="text-sm text-emerald-300">{t("overlay.copied")}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {!overlay.active ? (
              <button
                type="button"
                disabled={updating}
                onClick={() => void runUpdate(enableOverlayAccess)}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 font-semibold text-slate-950 disabled:opacity-50"
              >
                <Power aria-hidden="true" size={17} />
                {t("overlay.enable")}
              </button>
            ) : null}
            <button
              type="button"
              disabled={updating}
              onClick={() => {
                if (window.confirm(t("overlay.rotateConfirm"))) {
                  void runUpdate(rotateOverlayAccess);
                }
              }}
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 font-semibold text-white disabled:opacity-50"
            >
              <RefreshCw aria-hidden="true" size={17} />
              {t("overlay.rotate")}
            </button>
            {overlay.active ? (
              <button
                type="button"
                disabled={updating}
                onClick={() => void runUpdate(disableOverlayAccess)}
                className="inline-flex items-center gap-2 rounded-md bg-red-950 px-3 py-2 font-semibold text-red-200 disabled:opacity-50"
              >
                <Power aria-hidden="true" size={17} />
                {t("overlay.disable")}
              </button>
            ) : null}
          </div>

          <div className="border-t border-white/10">
            <SettingsDisclosure
              id="overlay-general-settings"
              title={t("overlay.general")}
              icon={<Clock3 aria-hidden="true" size={18} />}
              expanded={expandedSections.general}
              onToggle={() => toggleAppearanceSection("general")}
            >
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  <span className="flex items-center justify-between gap-4">
                    {t("overlay.maxWidth")}
                    <output className="tabular-nums text-slate-400">
                      {overlay.appearance.messageMaxWidthPx}px
                    </output>
                  </span>
                  <input
                    type="range"
                    min={300}
                    max={600}
                    step={10}
                    value={overlay.appearance.messageMaxWidthPx}
                    onChange={(event) =>
                      updateAppearanceDraft({
                        messageMaxWidthPx: Number(event.target.value)
                      })
                    }
                    className="w-full accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 text-sm font-medium text-slate-200">
                  {t("overlay.duration")}
                  <select
                    value={overlay.appearance.messageDurationSeconds}
                    onChange={(event) =>
                      updateAppearanceDraft({
                        messageDurationSeconds: Number(
                          event.target.value
                        ) as OverlayMessageDurationSeconds
                      })
                    }
                    className="h-9 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-emerald-400"
                  >
                    {MESSAGE_DURATION_OPTIONS.map((seconds) => (
                      <option key={seconds} value={seconds}>
                        {seconds === 0
                          ? t("overlay.keep")
                          : `${t("overlay.seconds", { count: seconds })}${seconds === 20 ? t("overlay.defaultSuffix") : ""}`}
                      </option>
                    ))}
                  </select>
                </label>

                <fieldset className="grid gap-2">
                  <legend className="text-sm font-medium text-slate-200">
                    {t("overlay.alignment")}
                  </legend>
                  <div className="grid h-10 grid-cols-3 overflow-hidden rounded-md border border-white/10 bg-slate-950 p-1">
                    {CHAT_ALIGNMENT_OPTIONS.map(({ value, icon: Icon }) => {
                      const selected = overlay.appearance.chatAlignment === value;
                      const label = t(`overlay.alignmentOption.${value}`);
                      return (
                        <button
                          key={value}
                          type="button"
                          title={label}
                          aria-label={label}
                          aria-pressed={selected}
                          onClick={() =>
                            updateAppearanceDraft({ chatAlignment: value })
                          }
                          className={`inline-flex min-w-0 items-center justify-center rounded-sm transition ${selected ? "bg-emerald-400/15 text-emerald-200" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
                        >
                          <Icon aria-hidden="true" size={18} />
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
            </SettingsDisclosure>

            <SettingsDisclosure
              id="overlay-badge-settings"
              title={t("overlay.badges")}
              icon={<BadgeCheck aria-hidden="true" size={18} />}
              expanded={expandedSections.badges}
              onToggle={() => toggleAppearanceSection("badges")}
            >
                <RatingProviderPolicySelect
                  value={overlay.appearance.ratingProviderPolicy}
                  onChange={(ratingProviderPolicy) =>
                    updateAppearanceDraft({ ratingProviderPolicy })
                  }
                />
                <p className="text-xs leading-5 text-slate-400">
                  {t("overlay.forcedProviderNotice")}
                </p>

                {connectedPlatforms.length > 0 ? (
                  <div className="space-y-6 border-t border-white/10 pt-5">
                    {connectedPlatforms.map((platform) => (
                      <PlatformBadgeSettings
                        key={platform}
                        platform={platform}
                        appearance={overlay.appearance}
                        onVisibleChange={(visible) =>
                          updatePlatformBadgesVisible(platform, visible)
                        }
                        onKindChange={(kind, visible) =>
                          updateBadgeVisibility(platform, kind, visible)
                        }
                      />
                    ))}
                  </div>
                ) : null}
            </SettingsDisclosure>

            <SettingsDisclosure
              id="overlay-background-settings"
              title={t("overlay.background")}
              icon={<PaintBucket aria-hidden="true" size={18} />}
              expanded={expandedSections.background}
              onToggle={() => toggleAppearanceSection("background")}
            >
              <label className="flex items-center justify-between gap-4 text-sm font-medium text-slate-200">
                {t("overlay.backgroundVisible")}
                <input
                  type="checkbox"
                  checked={overlay.appearance.backgroundVisible}
                  onChange={(event) =>
                    updateAppearanceDraft({
                      backgroundVisible: event.target.checked
                    })
                  }
                  className="size-4 accent-emerald-500"
                />
              </label>

              <fieldset
                disabled={!overlay.appearance.backgroundVisible}
                className="disabled:opacity-40"
              >
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  {t("overlay.backgroundColor")}
                </legend>
                <div className="flex flex-wrap items-center gap-2">
                  {BACKGROUND_COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      aria-label={`${t("overlay.backgroundColor")} ${color}`}
                      aria-pressed={overlay.appearance.backgroundColor === color}
                      onClick={() =>
                        updateAppearanceDraft({ backgroundColor: color })
                      }
                      className={`size-8 rounded-md border transition ${overlay.appearance.backgroundColor === color ? "border-emerald-400 ring-2 ring-emerald-400/30" : "border-white/20"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    title={t("overlay.customBackgroundColor")}
                    aria-label={t("overlay.customBackgroundColor")}
                    value={overlay.appearance.backgroundColor}
                    onChange={(event) =>
                      updateAppearanceDraft({
                        backgroundColor: event.target.value.toUpperCase()
                      })
                    }
                    className="size-8 cursor-pointer rounded-md border border-white/20 bg-transparent p-0.5"
                  />
                </div>
              </fieldset>

              <label className="grid gap-2 text-sm font-medium text-slate-200">
                <span className="flex items-center justify-between gap-4">
                  {t("overlay.backgroundOpacity")}
                  <output className="tabular-nums text-slate-400">
                    {overlay.appearance.backgroundOpacity}%
                  </output>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  disabled={!overlay.appearance.backgroundVisible}
                  value={overlay.appearance.backgroundOpacity}
                  onChange={(event) =>
                    updateAppearanceDraft({
                      backgroundOpacity: Number(event.target.value)
                    })
                  }
                  className="w-full accent-emerald-500 disabled:opacity-40"
                />
              </label>
            </SettingsDisclosure>

            <SettingsDisclosure
              id="overlay-color-settings"
              title={t("overlay.colors")}
              icon={<Palette aria-hidden="true" size={18} />}
              expanded={expandedSections.colors}
              onToggle={() => toggleAppearanceSection("colors")}
            >
              <div className="space-y-5">
              <label className="flex items-center justify-between gap-4 text-sm font-medium text-slate-200">
                {t("overlay.nicknameVisible")}
                <input
                  type="checkbox"
                  checked={overlay.appearance.nicknameVisible}
                  onChange={(event) =>
                    updateAppearanceDraft({
                      nicknameVisible: event.target.checked
                    })
                  }
                  className="size-4 accent-emerald-500"
                />
              </label>

              <fieldset
                disabled={!overlay.appearance.nicknameVisible}
                className="disabled:opacity-40"
              >
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  {t("overlay.nicknameColor")}
                </legend>
                <div className="inline-flex rounded-md bg-slate-950 p-1 ring-1 ring-white/10">
                  {([
                    ["fixed", "fixed"],
                    ["by_user", "by_user"],
                    ["by_role", "by_role"]
                  ] as const).map(([mode, labelKey]) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={overlay.appearance.nicknameColorMode === mode}
                      onClick={() =>
                        updateAppearanceDraft({ nicknameColorMode: mode })
                      }
                      className={`h-8 rounded px-3 text-sm font-medium transition ${overlay.appearance.nicknameColorMode === mode ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"}`}
                    >
                      {t(`overlay.colorMode.${labelKey}`)}
                    </button>
                  ))}
                </div>

                {overlay.appearance.nicknameColorMode === "fixed" ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {NICKNAME_COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        title={color}
                        aria-label={`${t("overlay.nicknameColor")} ${color}`}
                        aria-pressed={overlay.appearance.nicknameColor === color}
                        onClick={() =>
                          updateAppearanceDraft({ nicknameColor: color })
                        }
                        className={`size-8 rounded-md border transition ${overlay.appearance.nicknameColor === color ? "border-emerald-400 ring-2 ring-emerald-400/30" : "border-white/20"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      title={t("overlay.customNicknameColor")}
                      aria-label={t("overlay.customNicknameColor")}
                      value={overlay.appearance.nicknameColor}
                      onChange={(event) =>
                        updateAppearanceDraft({
                          nicknameColor: event.target.value.toUpperCase()
                        })
                      }
                      className="size-8 cursor-pointer rounded-md border border-white/20 bg-transparent p-0.5"
                    />
                  </div>
                ) : null}

                {overlay.appearance.nicknameColorMode === "by_role" ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {CHAT_AUTHOR_KIND_OPTIONS.map(({ kind }) => (
                      <label
                        key={kind}
                        className="flex h-10 items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-300"
                      >
                        {t(`overlay.role.${kind}`)}
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500">
                            {overlay.appearance.nicknameRoleColors[kind]}
                          </span>
                          <input
                            type="color"
                            aria-label={`${t(`overlay.role.${kind}`)} ${t("overlay.nicknameColor")}`}
                            value={overlay.appearance.nicknameRoleColors[kind]}
                            onChange={(event) =>
                              updateRoleColor(kind, event.target.value)
                            }
                            className="size-7 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </fieldset>

              <fieldset className="border-t border-white/10 pt-5">
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  {t("overlay.messageColor")}
                </legend>
                <div className="inline-flex rounded-md bg-slate-950 p-1 ring-1 ring-white/10">
                  {([
                    ["fixed", "fixed"],
                    ["by_role", "message_by_role"]
                  ] as const).map(([mode, labelKey]) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={overlay.appearance.messageColorMode === mode}
                      onClick={() =>
                        updateAppearanceDraft({ messageColorMode: mode })
                      }
                      className={`h-8 rounded px-3 text-sm font-medium transition ${overlay.appearance.messageColorMode === mode ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"}`}
                    >
                      {t(`overlay.colorMode.${labelKey}`)}
                    </button>
                  ))}
                </div>

                {overlay.appearance.messageColorMode === "fixed" ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {MESSAGE_COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        title={color}
                        aria-label={`${t("overlay.messageColor")} ${color}`}
                        aria-pressed={overlay.appearance.messageColor === color}
                        onClick={() =>
                          updateAppearanceDraft({ messageColor: color })
                        }
                        className={`size-8 rounded-md border transition ${overlay.appearance.messageColor === color ? "border-emerald-400 ring-2 ring-emerald-400/30" : "border-white/20"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      title={t("overlay.customMessageColor")}
                      aria-label={t("overlay.customMessageColor")}
                      value={overlay.appearance.messageColor}
                      onChange={(event) =>
                        updateAppearanceDraft({
                          messageColor: event.target.value.toUpperCase()
                        })
                      }
                      className="size-8 cursor-pointer rounded-md border border-white/20 bg-transparent p-0.5"
                    />
                  </div>
                ) : null}

                {overlay.appearance.messageColorMode === "by_role" ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {CHAT_AUTHOR_KIND_OPTIONS.map(({ kind }) => (
                      <label
                        key={kind}
                        className="flex h-10 items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-300"
                      >
                        {t(`overlay.role.${kind}`)}
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500">
                            {overlay.appearance.messageRoleColors[kind]}
                          </span>
                          <input
                            type="color"
                            aria-label={`${t(`overlay.role.${kind}`)} ${t("overlay.messageColor")}`}
                            value={overlay.appearance.messageRoleColors[kind]}
                            onChange={(event) =>
                              updateMessageRoleColor(kind, event.target.value)
                            }
                            className="size-7 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </fieldset>
              </div>
            </SettingsDisclosure>

            <SettingsDisclosure
              id="overlay-font-settings"
              title={t("overlay.fonts")}
              icon={<Type aria-hidden="true" size={18} />}
              expanded={expandedSections.fonts}
              onToggle={() => toggleAppearanceSection("fonts")}
            >
              <FontFamilySelect
                value={overlay.appearance.fontFamily}
                onChange={(fontFamily) =>
                  updateAppearanceDraft({ fontFamily })
                }
              />

              <label className="grid gap-2 text-sm font-medium text-slate-200">
                <span className="flex items-center justify-between gap-4">
                  {t("overlay.fontSize")}
                  <output className="tabular-nums text-slate-400">
                    {overlay.appearance.fontSizePx}px
                  </output>
                </span>
                <input
                  type="range"
                  min={12}
                  max={36}
                  step={1}
                  value={overlay.appearance.fontSizePx}
                  onChange={(event) =>
                    updateAppearanceDraft({
                      fontSizePx: Number(event.target.value)
                    })
                  }
                  className="w-full accent-emerald-500"
                />
              </label>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-200">
                  {t("overlay.fontWeight")}
                </legend>
                <div className="inline-flex flex-wrap rounded-md bg-slate-950 p-1 ring-1 ring-white/10">
                  {FONT_WEIGHT_OPTIONS.map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      aria-pressed={overlay.appearance.fontWeight === weight}
                      onClick={() =>
                        updateAppearanceDraft({ fontWeight: weight })
                      }
                      className={`h-8 rounded px-3 text-sm transition ${overlay.appearance.fontWeight === weight ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"}`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex items-center justify-between gap-4 text-sm font-medium text-slate-200">
                {t("overlay.lineHeight")}
                <select
                  value={overlay.appearance.fontLineHeight}
                  onChange={(event) =>
                    updateAppearanceDraft({
                      fontLineHeight: Number(
                        event.target.value
                      ) as OverlayFontLineHeight
                    })
                  }
                  className="h-9 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-emerald-400"
                >
                  {FONT_LINE_HEIGHT_OPTIONS.map((lineHeight) => (
                    <option key={lineHeight} value={lineHeight}>
                      {lineHeight}
                    </option>
                  ))}
                </select>
              </label>
            </SettingsDisclosure>

            <div className="flex flex-wrap gap-2 pt-5">
                <button
                  type="button"
                  disabled={!appearanceDirty || updating}
                  onClick={() =>
                    void runUpdate(() =>
                      updateOverlayAppearance(overlay.appearance)
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-500 px-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Save aria-hidden="true" size={17} />
                  {t("overlay.save")}
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => {
                    if (
                      window.confirm(
                        t("overlay.resetConfirm")
                      )
                    ) {
                      void runUpdate(() =>
                        updateOverlayAppearance({
                          ...DEFAULT_OVERLAY_APPEARANCE
                        })
                      );
                    }
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-800 px-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw aria-hidden="true" size={17} />
                  {t("overlay.reset")}
                </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PlatformBadgeSettings({
  platform,
  appearance,
  onVisibleChange,
  onKindChange
}: {
  platform: StreamingPlatform;
  appearance: OverlayAppearance;
  onVisibleChange: (visible: boolean) => void;
  onKindChange: (kind: PlatformBadgeKind, visible: boolean) => void;
}) {
  const { t } = useTranslation();
  const visible = platform === "chzzk"
    ? appearance.chzzkBadgesVisible
    : appearance.twitchBadgesVisible;
  const visibility = platform === "chzzk"
    ? appearance.chzzkBadgeVisibility
    : appearance.twitchBadgeVisibility;
  const kindTranslation = platform === "chzzk"
    ? "overlay.badgeKind"
    : "overlay.twitchBadgeKind";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-white">
          {t(`overlay.platformBadges.${platform}`)}
        </h3>
        <label className="flex shrink-0 items-center gap-2 text-sm text-slate-300">
          {t("overlay.allPlatformBadges")}
          <input
            type="checkbox"
            checked={visible}
            onChange={(event) => onVisibleChange(event.target.checked)}
            className="size-4 accent-emerald-500"
          />
        </label>
      </div>

      <fieldset disabled={!visible} className="disabled:opacity-40">
        <legend className="mb-3 text-sm font-medium text-slate-200">
          {t("overlay.visibleBadges")}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PLATFORM_BADGE_KIND_OPTIONS.map(({ kind }) => (
            <label
              key={kind}
              className="flex h-10 items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-300"
            >
              {t(`${kindTranslation}.${kind}`)}
              <input
                type="checkbox"
                checked={visibility[kind]}
                onChange={(event) => onKindChange(kind, event.target.checked)}
                className="size-4 accent-emerald-500"
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function SettingsDisclosure({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children
}: {
  id: string;
  title: string;
  icon: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/10 py-4">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-2 text-sky-300">
          {icon}
          <span className="font-semibold text-white">{title}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded ? (
        <div id={id} className="mt-4 space-y-5 pl-0 sm:pl-7">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function FontFamilySelect({
  value,
  onChange
}: {
  value: OverlayFontFamily;
  onChange: (value: OverlayFontFamily) => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption =
    FONT_FAMILY_OPTIONS.find((option) => option.value === value);
  const selectedLabel = selectedOption?.value === "system"
    ? t("overlay.systemFont")
    : selectedOption?.label ?? t("overlay.systemFont");
  const previewText = t("overlay.fontPreview");

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [expanded]);

  return (
    <div ref={containerRef} className="relative grid gap-2">
      <span className="text-sm font-medium text-slate-200">
        {t("overlay.font")}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls="overlay-font-options"
        onClick={() => setExpanded((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-left text-base text-white outline-none transition hover:border-white/25 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/30"
      >
        <span
          className="min-w-0 truncate"
          style={{ fontFamily: overlayFontFamilyValue(value) }}
        >
          {selectedLabel} - {previewText}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded ? (
        <div
          id="overlay-font-options"
          role="listbox"
          aria-label={t("overlay.fonts")}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto overscroll-contain rounded-md border border-white/10 bg-slate-950 py-1 shadow-xl shadow-black/40"
        >
          {FONT_FAMILY_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setExpanded(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left text-base transition ${selected ? "bg-emerald-400/10 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span
                  className="min-w-0 truncate"
                  style={{ fontFamily: overlayFontFamilyValue(option.value) }}
                >
                  {option.value === "system"
                    ? t("overlay.systemFont")
                    : option.label}{" "}
                  - {previewText}
                </span>
                {selected ? (
                  <Check aria-hidden="true" size={17} className="shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function RatingProviderPolicySelect({
  value,
  onChange
}: {
  value: RatingProviderPolicy;
  onChange: (value: RatingProviderPolicy) => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = t(`overlay.ratingPolicy.${value}`);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [expanded]);

  return (
    <div ref={containerRef} className="relative grid gap-2">
      <span className="text-sm font-medium text-slate-200">
        {t("overlay.ratingBadge")}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls="overlay-rating-provider-options"
        onClick={() => setExpanded((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-left text-base text-white outline-none transition hover:border-white/25 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/30"
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded ? (
        <div
          id="overlay-rating-provider-options"
          role="listbox"
          aria-label={t("overlay.ratingBadge")}
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-white/10 bg-slate-950 py-1 shadow-xl shadow-black/40"
        >
          {RATING_PROVIDER_POLICY_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setExpanded(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left text-base transition ${selected ? "bg-emerald-400/10 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="min-w-0 truncate">
                  {t(`overlay.ratingPolicy.${option.value}`)}
                </span>
                {selected ? (
                  <Check aria-hidden="true" size={17} className="shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function readExpandedAppearanceSections(): ExpandedAppearanceSections {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_SECTIONS_STORAGE_KEY);

    if (!stored) {
      return { ...DEFAULT_EXPANDED_APPEARANCE_SECTIONS };
    }

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") {
      return { ...DEFAULT_EXPANDED_APPEARANCE_SECTIONS };
    }

    const sections = parsed as Partial<ExpandedAppearanceSections>;

    return {
      general:
        typeof sections.general === "boolean" ? sections.general : true,
      badges: typeof sections.badges === "boolean" ? sections.badges : true,
      background:
        typeof sections.background === "boolean" ? sections.background : true,
      colors: typeof sections.colors === "boolean" ? sections.colors : true,
      fonts: typeof sections.fonts === "boolean" ? sections.fonts : true
    };
  } catch {
    return { ...DEFAULT_EXPANDED_APPEARANCE_SECTIONS };
  }
}

function toErrorState(error: unknown, fallback: string): SettingsState {
  return {
    status: "error",
    message: error instanceof Error ? error.message : fallback
  };
}
