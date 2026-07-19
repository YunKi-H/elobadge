import { useState } from "react";
import { signOut } from "firebase/auth";
import { LoaderCircle, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteEloBadgeAccount } from "../api/client";
import { getFirebaseClientAuth } from "../firebase/client";

const CONFIRMATION_TEXT = "계정 삭제";

export function AccountDeletion() {
  const navigate = useNavigate();
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
    if (confirmation !== CONFIRMATION_TEXT) {
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
          : "EloBadge 계정을 삭제하지 못했습니다."
      );
      setDeleting(false);
    }
  };

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">계정 삭제</h2>
          <p className="mt-1 text-sm text-slate-400">
            계정과 연결된 체스 정보 및 방송 설정을 영구 삭제합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <Trash2 aria-hidden="true" size={16} />
          EloBadge 계정 삭제
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
                  EloBadge 계정을 삭제할까요?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Chess.com 연동, 레이팅, 오버레이 URL과 화면 설정이 모두
                  삭제됩니다. 기존 OBS 오버레이 주소도 즉시 작동을 멈춥니다.
                </p>
              </div>
              <button
                type="button"
                disabled={deleting}
                onClick={closeDialog}
                aria-label="계정 삭제 창 닫기"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm text-slate-300">
                계속하려면 <strong className="text-white">계정 삭제</strong>를
                입력하세요.
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
                취소
              </button>
              <button
                type="button"
                disabled={deleting || confirmation !== CONFIRMATION_TEXT}
                onClick={() => void deleteAccount()}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleting ? "삭제 중" : "영구 삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
