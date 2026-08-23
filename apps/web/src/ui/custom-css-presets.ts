export type CustomCssPresetId =
  | "defaults"
  | "bubble"
  | "transparent"
  | "nickname";

export interface CustomCssPreset {
  id: CustomCssPresetId;
  css: string;
}

export const DEFAULT_CUSTOM_CSS_EXAMPLE = `/* EloBadge default style example */
.message-list {
  max-width: 600px;
}

.message {
  border-radius: 0.375rem;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
}

.nickname {
  color: #7dd3fc;
}

.content {
  color: #ffffff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 85%);
}

.platform-badges,
.rating-badge {
  height: 1.4em;
}`;

export const BUBBLE_CUSTOM_CSS = `/* Speech bubble */
.message {
  position: relative;
  margin-bottom: 8px;
  border-radius: 16px;
  background: #f8fafc;
  box-shadow: 0 6px 18px rgb(0 0 0 / 28%);
}

.message::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 18px;
  border-width: 8px 8px 0;
  border-style: solid;
  border-color: #f8fafc transparent transparent;
}

.nickname {
  color: #0369a1;
}

.content {
  color: #0f172a;
  text-shadow: none;
}`;

export const CUSTOM_CSS_PRESETS: readonly CustomCssPreset[] = [
  {
    id: "defaults",
    css: DEFAULT_CUSTOM_CSS_EXAMPLE
  },
  {
    id: "bubble",
    css: BUBBLE_CUSTOM_CSS
  },
  {
    id: "transparent",
    css: `/* Transparent chat */
.message {
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.content {
  color: #ffffff;
  text-shadow:
    0 1px 2px rgb(0 0 0 / 95%),
    0 2px 6px rgb(0 0 0 / 75%);
}`
  },
  {
    id: "nickname",
    css: `/* Highlight nickname */
.nickname {
  display: inline-block;
  padding: 0.05em 0.4em;
  border-radius: 0.3em;
  background: rgb(16 185 129 / 22%);
  color: #a7f3d0;
  font-weight: 700;
}`
  }
] as const;
