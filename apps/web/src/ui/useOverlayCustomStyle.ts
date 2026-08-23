import { useEffect } from "react";

const CUSTOM_STYLE_ATTRIBUTE = "data-overlay-custom-style";

export function useOverlayCustomStyle(
  targetDocument: Document | null,
  customCss: string
) {
  useEffect(() => {
    if (!targetDocument || customCss.length === 0) {
      return;
    }

    const style = targetDocument.createElement("style");
    style.setAttribute(CUSTOM_STYLE_ATTRIBUTE, "");
    style.textContent = customCss;
    targetDocument.head.append(style);

    return () => style.remove();
  }, [customCss, targetDocument]);
}

export const OVERLAY_CUSTOM_STYLE_SELECTOR = `[${CUSTOM_STYLE_ATTRIBUTE}]`;
