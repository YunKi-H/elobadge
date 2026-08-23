import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BUBBLE_CUSTOM_CSS } from "./custom-css-presets";

const SELECTORS = [
  [".overlay", "overlay"],
  [".message-list", "messageList"],
  [".message", "message"],
  [".metadata", "metadata"],
  [".platform-badges", "platformBadges"],
  [".platform-badge", "platformBadge"],
  [".rating-badge", "ratingBadge"],
  [".rating-badge-content", "ratingBadgeContent"],
  [".nickname", "nickname"],
  [".content", "content"],
  [".emote", "emote"]
] as const;

const VARIABLES = [
  "--message-max-width",
  "--message-background",
  "--message-font-family",
  "--message-font-size",
  "--message-font-weight",
  "--message-line-height",
  "--badge-line-height",
  "--nickname-color",
  "--message-color"
] as const;

const ROLE_EXAMPLE = `.message[data-author-kind="subscriber"] {
  background: rgb(88 28 135 / 85%);
}

.message[data-author-kind="streamer"] .nickname {
  color: #34d399;
}`;

const RATING_EXAMPLE = `.rating-badge[data-provider="lichess"]
  .rating-badge-content {
  background: #111827;
  color: #ffffff;
}

.rating-badge[data-speed="rapid"] {
  transform: scale(1.05);
}`;

export function CustomCssGuidePage() {
  const { t } = useTranslation();

  return (
    <article className="mx-auto max-w-3xl text-slate-300">
      <header className="border-b border-white/10 pb-7">
        <Link
          to="/streamer"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          {t("customCssGuide.back")}
        </Link>
        <h1 className="mt-5 text-3xl font-semibold text-white">
          {t("customCssGuide.title")}
        </h1>
        <p className="mt-3 leading-7 text-slate-400">
          {t("customCssGuide.intro")}
        </p>
      </header>

      <GuideSection title={t("customCssGuide.selectors.title")}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 pr-5 font-medium">
                  {t("customCssGuide.selectors.selector")}
                </th>
                <th className="py-3 font-medium">
                  {t("customCssGuide.selectors.target")}
                </th>
              </tr>
            </thead>
            <tbody>
              {SELECTORS.map(([selector, key]) => (
                <tr key={selector} className="border-b border-white/5">
                  <td className="py-3 pr-5 align-top font-mono text-emerald-200">
                    {selector}
                  </td>
                  <td className="py-3 text-slate-300">
                    {t(`customCssGuide.selectors.items.${key}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection title={t("customCssGuide.attributes.title")}>
        <dl className="grid gap-4 text-sm sm:grid-cols-[11rem_1fr]">
          <Attribute
            name=".message[data-author-kind]"
            values="streamer, manager, subscriber, donator, viewer"
          />
          <Attribute name=".message[data-platform]" values="chzzk, twitch" />
          <Attribute
            name=".platform-badge[data-provider]"
            values="chzzk, twitch"
          />
          <Attribute
            name=".platform-badge[data-kind]"
            values="role, subscription, donation, subscription_gift, unknown"
          />
          <Attribute
            name=".rating-badge[data-provider]"
            values="chesscom, lichess"
          />
          <Attribute
            name=".rating-badge[data-speed]"
            values="bullet, blitz, rapid, classical"
          />
        </dl>
      </GuideSection>

      <GuideSection title={t("customCssGuide.variables.title")}>
        <p className="mb-4 leading-7 text-slate-400">
          {t("customCssGuide.variables.description")}
        </p>
        <div className="flex flex-wrap gap-2">
          {VARIABLES.map((variable) => (
            <code
              key={variable}
              className="rounded bg-slate-950 px-2 py-1 text-sm text-cyan-200 ring-1 ring-white/10"
            >
              {variable}
            </code>
          ))}
        </div>
      </GuideSection>

      <GuideSection title={t("customCssGuide.examples.title")}>
        <CodeExample
          title={t("customCssGuide.examples.roles")}
          code={ROLE_EXAMPLE}
        />
        <CodeExample
          title={t("customCssGuide.examples.ratings")}
          code={RATING_EXAMPLE}
        />
        <CodeExample
          title={t("customCssGuide.examples.bubble")}
          code={BUBBLE_CUSTOM_CSS}
        />
      </GuideSection>

      <GuideSection title={t("customCssGuide.limits.title")}>
        <ul className="grid gap-2 pl-5 text-sm leading-6 text-slate-400 marker:text-slate-600">
          <li>{t("customCssGuide.limits.size")}</li>
          <li>{t("customCssGuide.limits.selectors")}</li>
          <li>{t("customCssGuide.limits.resources")}</li>
          <li>{t("customCssGuide.limits.atRules")}</li>
          <li>{t("customCssGuide.limits.disabled")}</li>
        </ul>
      </GuideSection>
    </article>
  );
}

function GuideSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/10 py-7 last:border-b-0">
      <h2 className="mb-5 text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Attribute({ name, values }: { name: string; values: string }) {
  return (
    <>
      <dt className="font-mono text-emerald-200">{name}</dt>
      <dd className="break-words font-mono text-slate-400">{values}</dd>
    </>
  );
}

function CodeExample({ title, code }: { title: string; code: string }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="mb-2 text-sm font-medium text-slate-200">{title}</h3>
      <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm leading-6 text-slate-300 ring-1 ring-white/10">
        <code>{code}</code>
      </pre>
    </div>
  );
}
