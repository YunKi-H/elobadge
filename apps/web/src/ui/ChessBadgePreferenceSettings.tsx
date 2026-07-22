import { useEffect, useState } from "react";
import type { ChessProvider } from "@elobadge/core";
import { Check, LoaderCircle } from "lucide-react";
import {
  getChessBadgePreference,
  updateChessBadgePreference,
  type ChessBadgePreference
} from "../api/client";

export function ChessBadgePreferenceSettings() {
  const [state, setState] = useState<ChessBadgePreference | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = () => {
      void getChessBadgePreference()
        .then(setState)
        .catch((reason: unknown) => {
          setError(reason instanceof Error ? reason.message : "배지 정보를 불러오지 못했습니다.");
        });
    };
    load();
    window.addEventListener("elobadge:chess-badges-changed", load);
    return () => window.removeEventListener("elobadge:chess-badges-changed", load);
  }, []);

  if (!state && !error) {
    return null;
  }
  const available = (["chesscom", "lichess"] as const).filter(
    (provider) => state?.badges[provider]
  );
  if (available.length < 2 && !error) {
    return null;
  }

  const select = async (provider: ChessProvider) => {
    setSaving(true);
    setError(null);
    try {
      setState(await updateChessBadgePreference(provider));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "배지를 변경하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border-y border-white/10 py-8">
      <h2 className="text-xl font-semibold text-white">표시할 레이팅 배지</h2>
      <p className="mt-1 text-sm text-slate-400">
        두 플랫폼이 연결된 경우 채팅에서 기본으로 표시할 배지를 선택합니다.
      </p>
      {state ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {available.map((provider) => {
            const badge = state.badges[provider]!;
            const selected = state.preferredProvider === provider;
            return (
              <button
                key={provider}
                type="button"
                disabled={saving}
                onClick={() => void select(provider)}
                className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition ${selected ? "border-emerald-400 bg-emerald-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
              >
                <span>
                  <span className="block font-medium text-white">
                    {provider === "chesscom" ? "Chess.com" : "Lichess"}
                  </span>
                  <span className="mt-1 block text-sm text-slate-400">
                    {badge.value}{badge.provisional ? "?" : ""} · {badge.speed}
                  </span>
                </span>
                {saving && selected ? (
                  <LoaderCircle className="animate-spin text-slate-400" size={18} />
                ) : selected ? (
                  <Check className="text-emerald-300" size={18} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}
