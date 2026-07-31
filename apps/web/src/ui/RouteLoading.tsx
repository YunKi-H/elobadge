import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function RouteLoading() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-slate-300">
      <LoaderCircle className="mr-2 animate-spin" aria-hidden="true" size={18} />
      {t("route.loading")}
    </main>
  );
}
