import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_OVERLAY_APPEARANCE,
  OVERLAY_FONT_FAMILY_VALUES
} from "@elobadge/core";
import {
  generateOverlayPublicToken,
  parseOverlayAppearance,
  toStoredOverlayTheme
} from "./overlays.js";

test("overlay public tokens are URL-safe, random 256-bit values", () => {
  const tokens = new Set(
    Array.from({ length: 100 }, () => generateOverlayPublicToken())
  );

  assert.equal(tokens.size, 100);

  for (const token of tokens) {
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  }
});

test("overlay appearance accepts a complete valid document", () => {
  assert.deepEqual(
    parseOverlayAppearance({
      messageMaxWidthPx: 480,
      chatAlignment: "center",
      messageLayout: "stacked",
      nicknameSeparatorVisible: false,
      alignedNicknameRightAligned: true,
      messageBoxFilled: false,
      backgroundVisible: false,
      backgroundColor: "#abcdef",
      backgroundOpacity: 35,
      platformBadgesVisible: false,
      platformBadgeVisibility: {
        role: false,
        subscription: true,
        donation: false,
        subscription_gift: true,
        unknown: false
      },
      ratingProviderPolicy: "viewer_choice",
      nicknameVisible: false,
      nicknameColorMode: "by_user",
      nicknameColor: "#fedcba",
      nicknameRoleColors: {
        streamer: "#111111",
        manager: "#222222",
        donator: "#333333",
        subscriber: "#444444",
        viewer: "#555555"
      },
      messageColorMode: "by_role",
      messageColor: "#aabbcc",
      messageRoleColors: {
        streamer: "#111111",
        manager: "#222222",
        donator: "#333333",
        subscriber: "#444444",
        viewer: "#555555"
      },
      fontFamily: "paperlogy",
      fontSizePx: 24,
      fontWeight: 700,
      fontLineHeight: 1.6,
      messageDurationSeconds: 60
    }),
    {
      customCss: "",
      messageMaxWidthPx: 480,
      chatAlignment: "center",
      messageLayout: "stacked",
      nicknameSeparatorVisible: false,
      alignedNicknameRightAligned: true,
      messageBoxFilled: false,
      backgroundVisible: false,
      backgroundColor: "#ABCDEF",
      backgroundOpacity: 35,
      chzzkBadgesVisible: false,
      chzzkBadgeVisibility: {
        role: false,
        subscription: true,
        donation: false,
        subscription_gift: true,
        unknown: false
      },
      twitchBadgesVisible: false,
      twitchBadgeVisibility: {
        role: false,
        subscription: true,
        donation: false,
        subscription_gift: true,
        unknown: false
      },
      ratingProviderPolicy: "viewer_choice",
      nicknameVisible: false,
      nicknameColorMode: "by_user",
      nicknameColor: "#FEDCBA",
      nicknameRoleColors: {
        streamer: "#111111",
        manager: "#222222",
        donator: "#333333",
        subscriber: "#444444",
        viewer: "#555555"
      },
      messageColorMode: "by_role",
      messageColor: "#AABBCC",
      messageRoleColors: {
        streamer: "#111111",
        manager: "#222222",
        donator: "#333333",
        subscriber: "#444444",
        viewer: "#555555"
      },
      fontFamily: "paperlogy",
      fontSizePx: 24,
      fontWeight: 700,
      fontLineHeight: 1.6,
      messageDurationSeconds: 60
    }
  );
});

test("overlay appearance converts the previous shared badge settings", () => {
  const commonTheme = toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE);
  delete commonTheme.platformBadgeSettings;
  delete commonTheme.chatAlignment;
  delete commonTheme.messageLayout;
  delete commonTheme.nicknameSeparatorVisible;
  delete commonTheme.alignedNicknameRightAligned;
  delete commonTheme.messageBoxFilled;
  const storedTheme = {
    ...commonTheme,
    platformBadgesVisible: false,
    chzzkBadgesVisible: true,
    platformBadgeVisibility: {
      role: false,
      subscription: true,
      donation: false,
      subscription_gift: true,
      unknown: false
    },
    chzzkBadgeVisibility: {
      role: true,
      subscription: true,
      donation: true,
      subscription_gift: true,
      unknown: true
    }
  };

  assert.deepEqual(parseOverlayAppearance(storedTheme), {
    ...DEFAULT_OVERLAY_APPEARANCE,
    chzzkBadgesVisible: false,
    chzzkBadgeVisibility: {
      role: false,
      subscription: true,
      donation: false,
      subscription_gift: true,
      unknown: false
    },
    twitchBadgesVisible: false,
    twitchBadgeVisibility: {
      role: false,
      subscription: true,
      donation: false,
      subscription_gift: true,
      unknown: false
    }
  });

  assert.equal(
    parseOverlayAppearance({
      ...DEFAULT_OVERLAY_APPEARANCE,
      platformBadgesVisible: undefined,
      platformBadgeVisibility: undefined
    }),
    null
  );
});

test("legacy aligned overlays preserve their filled message boxes", () => {
  const storedTheme = toStoredOverlayTheme({
    ...DEFAULT_OVERLAY_APPEARANCE,
    messageLayout: "aligned"
  });
  delete storedTheme.messageBoxFilled;

  assert.equal(parseOverlayAppearance(storedTheme)?.messageBoxFilled, true);
});

test("stored overlay themes keep separate platform badge settings", () => {
  const stored = toStoredOverlayTheme({
    ...DEFAULT_OVERLAY_APPEARANCE,
    customCss: ".message { border-radius: 0; }"
  });

  assert.deepEqual(
    stored.platformBadgeSettings,
    {
      chzzk: {
        visible: true,
        visibility: DEFAULT_OVERLAY_APPEARANCE.chzzkBadgeVisibility
      },
      twitch: {
        visible: true,
        visibility: DEFAULT_OVERLAY_APPEARANCE.twitchBadgeVisibility
      }
    }
  );
  assert.equal("platformBadgesVisible" in stored, false);
  assert.equal("platformBadgeVisibility" in stored, false);
  assert.equal("chzzkBadgesVisible" in stored, false);
  assert.equal("chzzkBadgeVisibility" in stored, false);
  assert.equal(stored.customCss, ".message { border-radius: 0; }");
});

test("overlay appearance rejects incomplete and invalid documents", () => {
  assert.equal(parseOverlayAppearance({}), null);
  assert.equal(
    parseOverlayAppearance({
      ...toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE),
      fontFamily: "remote-font"
    }),
    null
  );
  assert.equal(
    parseOverlayAppearance({
      ...toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE),
      platformBadgeSettings: {
        chzzk: { visible: true, visibility: { donation: false } },
        twitch: {
          visible: true,
          visibility: DEFAULT_OVERLAY_APPEARANCE.twitchBadgeVisibility
        }
      }
    }),
    null
  );
  assert.equal(
    parseOverlayAppearance({
      ...toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE),
      customCss: "body { display: none; }"
    }),
    null
  );
});

test("overlay appearance accepts every supported font preset", () => {
  for (const fontFamily of OVERLAY_FONT_FAMILY_VALUES) {
    assert.equal(
      parseOverlayAppearance({
        ...toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE),
        fontFamily
      })?.fontFamily,
      fontFamily
    );
  }
});
