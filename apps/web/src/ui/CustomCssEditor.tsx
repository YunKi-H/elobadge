import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useMemo } from "react";
import { DEFAULT_CUSTOM_CSS_EXAMPLE } from "./custom-css-presets";

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
  errorId,
  label,
  onChange
}: {
  value: string;
  invalid: boolean;
  errorId?: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const extensions = useMemo(
    () => [
      css(),
      editorTheme,
      EditorView.contentAttributes.of({
        ...(errorId ? { "aria-describedby": errorId } : {}),
        "aria-invalid": invalid ? "true" : "false",
        "aria-label": label
      })
    ],
    [errorId, invalid, label]
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
