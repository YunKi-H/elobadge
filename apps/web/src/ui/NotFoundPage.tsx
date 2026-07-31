import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="py-16">
      <p className="text-sm font-medium text-slate-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">
        {t("route.notFound")}
      </h1>
      <Link
        to="/"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-slate-800 px-4 font-semibold text-white ring-1 ring-white/10 transition hover:bg-slate-700"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        {t("route.home")}
      </Link>
    </section>
  );
}
