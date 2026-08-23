import assert from "node:assert/strict";
import test from "node:test";
import { MAX_CUSTOM_CSS_BYTES } from "@elobadge/core";
import { validateCustomCss } from "./custom-css.js";

test("custom CSS accepts supported overlay selectors", () => {
  const result = validateCustomCss(`
    .message[data-author-kind="subscriber"] {
      background: rgb(0 0 0 / 80%);
      --message-color: #ffffff;
    }

    .message .nickname:hover,
    .rating-badge[data-provider="lichess"] {
      color: #facc15;
    }
  `);

  assert.deepEqual(result, { valid: true });
});

test("custom CSS rejects global and escaping selectors", () => {
  assert.deepEqual(validateCustomCss("body { display: none; }"), {
    valid: false,
    reason: "selector_not_allowed"
  });
  assert.deepEqual(validateCustomCss(".message + body { display: none; }"), {
    valid: false,
    reason: "selector_not_allowed"
  });
});

test("custom CSS rejects at-rules and external resources", () => {
  assert.deepEqual(
    validateCustomCss('@import url("https://example.com/style.css");'),
    { valid: false, reason: "at_rule_not_allowed" }
  );
  assert.deepEqual(
    validateCustomCss('.message { background: url("https://example.com/a.png"); }'),
    { valid: false, reason: "external_resource_not_allowed" }
  );
  assert.deepEqual(
    validateCustomCss(
      '.message { background-image: image-set("https://example.com/a.png" 1x); }'
    ),
    { valid: false, reason: "external_resource_not_allowed" }
  );
});

test("custom CSS rejects invalid syntax and oversized input", () => {
  assert.deepEqual(validateCustomCss(".message { color: red;"), {
    valid: false,
    reason: "invalid_syntax"
  });
  assert.deepEqual(validateCustomCss("가".repeat(MAX_CUSTOM_CSS_BYTES)), {
    valid: false,
    reason: "too_large"
  });
});
