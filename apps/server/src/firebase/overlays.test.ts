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
      backgroundVisible: false,
      backgroundColor: "#abcdef",
      backgroundOpacity: 35,
      chzzkBadgesVisible: false,
      chzzkBadgeVisibility: {
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
      messageMaxWidthPx: 480,
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

test("overlay appearance reads platform-neutral badge fields first", () => {
  const storedTheme = {
    ...toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE),
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
    }
  });
});

test("stored overlay themes use only platform-neutral badge fields", () => {
  const stored = toStoredOverlayTheme(DEFAULT_OVERLAY_APPEARANCE);

  assert.equal(stored.platformBadgesVisible, true);
  assert.deepEqual(
    stored.platformBadgeVisibility,
    DEFAULT_OVERLAY_APPEARANCE.chzzkBadgeVisibility
  );
  assert.equal("chzzkBadgesVisible" in stored, false);
  assert.equal("chzzkBadgeVisibility" in stored, false);
});

test("overlay appearance rejects incomplete and invalid documents", () => {
  assert.equal(parseOverlayAppearance({}), null);
  assert.equal(
    parseOverlayAppearance({
      ...DEFAULT_OVERLAY_APPEARANCE,
      fontFamily: "remote-font"
    }),
    null
  );
  assert.equal(
    parseOverlayAppearance({
      ...DEFAULT_OVERLAY_APPEARANCE,
      chzzkBadgeVisibility: { donation: false }
    }),
    null
  );
});

test("overlay appearance accepts every supported font preset", () => {
  for (const fontFamily of OVERLAY_FONT_FAMILY_VALUES) {
    assert.equal(
      parseOverlayAppearance({
        ...DEFAULT_OVERLAY_APPEARANCE,
        fontFamily
      })?.fontFamily,
      fontFamily
    );
  }
});
