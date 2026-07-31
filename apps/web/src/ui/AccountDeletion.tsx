import { useState } from "react";
import { signOut } from "firebase/auth";
import { LoaderCircle, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { deleteEloBadgeAccount } from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";

export function AccountDeletion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirmationText = t("accountDeletion.confirmation");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  const closeDialog = () => {
    if (deleting) {
      return;
    }

    setDialogOpen(false);
    setConfirmation("");
  };

  const deleteAccount = async () => {
    if (confirmation !== confirmationText) {
      return;
    }

    setDeleting(true);

    try {
      await deleteEloBadgeAccount();
      await signOut(getFirebaseClientAuth()).catch(() => undefined);
      void navigate("/", { replace: true });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : t("accountDeletion.failed")
      );
      setDeleting(false);
    }
  };

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            {t("accountDeletion.title")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("accountDeletion.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <Trash2 aria-hidden="true" size={16} />
          {t("accountDeletion.action")}
        </button>
      </div>

      {dialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-deletion-title"
            className="w-full max-w-md rounded-md border border-white/15 bg-slate-950 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="account-deletion-title"
                  className="text-lg font-semibold text-white"
                >
                  {t("accountDeletion.dialogTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {t("accountDeletion.warning")}
                </p>
              </div>
              <button
                type="button"
                disabled={deleting}
                onClick={closeDialog}
                aria-label={t("accountDeletion.close")}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm text-slate-300">
                {t("accountDeletion.instruction", {
                  text: confirmationText
                })}
              </span>
              <input
                value={confirmation}
                disabled={deleting}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                className="mt-2 h-10 w-full rounded-md border border-white/15 bg-slate-900 px-3 text-white outline-none transition focus:border-red-400 disabled:opacity-50"
              />
            </label>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={closeDialog}
                className="h-9 rounded-md px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                disabled={deleting || confirmation !== confirmationText}
                onClick={() => void deleteAccount()}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleting
                  ? t("accountDeletion.deleting")
                  : t("accountDeletion.permanentDelete")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
