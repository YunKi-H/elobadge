import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useMemo } from "react";

const DEFAULT_CUSTOM_CSS_EXAMPLE = `/* EloBadge default style example */
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

const editorTheme = EditorView.theme({
  "&": {
    fontSize: "14px"
  },
  ".cm-content": {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    lineHeight: "1.6",
    padding: "12px 0"
  },
  ".cm-gutters": {
    borderRight: "1px solid rgb(255 255 255 / 0.08)"
  },
  ".cm-placeholder": {
    color: "rgb(148 163 184 / 0.62)"
  },
  ".cm-scroller": {
    overflow: "auto"
  }
});

export function CustomCssEditor({
  value,
  invalid,
  label,
  onChange
}: {
  value: string;
  invalid: boolean;
  label: string;
  onChange: (value: string) => void;
}) {
  const extensions = useMemo(
    () => [
      css(),
      editorTheme,
      EditorView.contentAttributes.of({
        "aria-invalid": invalid ? "true" : "false",
        "aria-label": label
      })
    ],
    [invalid, label]
  );

  return (
    <div
      className={`overflow-hidden rounded-md border bg-[#282c34] transition ${invalid ? "border-red-400/70 focus-within:border-red-300" : "border-white/10 focus-within:border-emerald-400"}`}
    >
      <CodeMirror
        value={value}
        height="280px"
        placeholder={DEFAULT_CUSTOM_CSS_EXAMPLE}
        theme={oneDark}
        extensions={extensions}
        basicSetup={{
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          lineNumbers: true
        }}
        indentWithTab={false}
        onChange={onChange}
      />
    </div>
  );
}
