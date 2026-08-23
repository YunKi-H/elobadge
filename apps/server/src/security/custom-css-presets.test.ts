import assert from "node:assert/strict";
import test from "node:test";
import { CUSTOM_CSS_PRESETS } from "../../../web/src/ui/custom-css-presets.js";
import { validateCustomCss } from "./custom-css.js";

for (const preset of CUSTOM_CSS_PRESETS) {
  test(`custom CSS preset "${preset.id}" passes strict validation`, () => {
    assert.deepEqual(
      validateCustomCss(preset.css, { validatePropertyValues: true }),
      { valid: true }
    );
  });
}
