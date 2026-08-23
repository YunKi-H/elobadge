import { lexer, parse, walk, type CssNode, type Selector } from "css-tree";
import { MAX_CUSTOM_CSS_BYTES } from "@elobadge/core";

const ALLOWED_ROOT_CLASSES = new Set([
  "overlay",
  "message-list",
  "message",
  "metadata",
  "platform-badges",
  "platform-badge",
  "rating-badge",
  "rating-badge-content",
  "nickname",
  "content",
  "emote"
]);

export type CustomCssValidationError =
  | "too_large"
  | "invalid_syntax"
  | "at_rule_not_allowed"
  | "external_resource_not_allowed"
  | "selector_not_allowed"
  | "property_not_allowed"
  | "invalid_property_value";

export type CustomCssValidationResult =
  | { valid: true }
  | { valid: false; reason: CustomCssValidationError };

interface CustomCssValidationOptions {
  validatePropertyValues?: boolean;
}

class CustomCssError extends Error {
  constructor(readonly reason: CustomCssValidationError) {
    super(reason);
  }
}

export function validateCustomCss(
  css: string,
  options: CustomCssValidationOptions = {}
): CustomCssValidationResult {
  if (Buffer.byteLength(css, "utf8") > MAX_CUSTOM_CSS_BYTES) {
    return { valid: false, reason: "too_large" };
  }

  if (/<\/?style\b/i.test(css)) {
    return { valid: false, reason: "invalid_syntax" };
  }

  if (!hasBalancedSyntax(css)) {
    return { valid: false, reason: "invalid_syntax" };
  }

  let ast: CssNode;

  try {
    ast = parse(css, {
      context: "stylesheet",
      parseCustomProperty: true,
      onParseError(error) {
        throw error;
      }
    });

    walk(ast, {
      visit: "Atrule",
      enter() {
        throw new CustomCssError("at_rule_not_allowed");
      }
    });
    walk(ast, {
      visit: "Url",
      enter() {
        throw new CustomCssError("external_resource_not_allowed");
      }
    });
    walk(ast, {
      visit: "Function",
      enter(node) {
        const name = node.name.toLowerCase();

        if (
          name === "image" ||
          name === "image-set" ||
          name === "-webkit-image-set" ||
          name === "src"
        ) {
          throw new CustomCssError("external_resource_not_allowed");
        }

        if (name === "expression") {
          throw new CustomCssError("property_not_allowed");
        }
      }
    });
    walk(ast, {
      visit: "Declaration",
      enter(node) {
        const property = node.property.toLowerCase();

        if (property === "behavior" || property === "-moz-binding") {
          throw new CustomCssError("property_not_allowed");
        }

        if (
          options.validatePropertyValues &&
          !property.startsWith("--") &&
          lexer.getProperty(property) &&
          !lexer.matchProperty(property, node.value).matched
        ) {
          throw new CustomCssError("invalid_property_value");
        }
      }
    });
    walk(ast, {
      visit: "Rule",
      enter(node) {
        if (node.prelude.type !== "SelectorList") {
          throw new CustomCssError("selector_not_allowed");
        }

        for (const selector of node.prelude.children) {
          if (selector.type !== "Selector" || !hasAllowedRoot(selector)) {
            throw new CustomCssError("selector_not_allowed");
          }
        }
      }
    });
  } catch (error) {
    return {
      valid: false,
      reason:
        error instanceof CustomCssError ? error.reason : "invalid_syntax"
    };
  }

  return { valid: true };
}

export function shouldRejectCustomCss(
  result: CustomCssValidationResult,
  enabled: boolean
): boolean {
  return (
    !result.valid && (enabled || result.reason === "too_large")
  );
}

function hasAllowedRoot(selector: Selector): boolean {
  const first = selector.children.first;

  if (
    first?.type !== "ClassSelector" ||
    !ALLOWED_ROOT_CLASSES.has(first.name)
  ) {
    return false;
  }

  let valid = true;
  walk(selector, {
    visit: "Combinator",
    enter(node) {
      if (node.name === "+" || node.name === "~") {
        valid = false;
      }
    }
  });
  return valid;
}

function hasBalancedSyntax(css: string): boolean {
  const pairs: Record<string, string> = { "{": "}", "(": ")", "[": "]" };
  const stack: string[] = [];
  let quote: '"' | "'" | null = null;
  let escaped = false;
  let inComment = false;

  for (let index = 0; index < css.length; index += 1) {
    const character = css[index]!;
    const next = css[index + 1];

    if (inComment) {
      if (character === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === "/" && next === "*") {
      inComment = true;
      index += 1;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character in pairs) {
      stack.push(pairs[character]!);
    } else if (character === "}" || character === ")" || character === "]") {
      if (stack.pop() !== character) {
        return false;
      }
    }
  }

  return stack.length === 0 && quote === null && !inComment && !escaped;
}
