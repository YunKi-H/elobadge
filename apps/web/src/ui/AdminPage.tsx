import {
  Activity,
  Clock3,
  Database,
  LoaderCircle,
  MemoryStick,
  MonitorUp,
  RadioTower,
  RefreshCw,
  UsersRound
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAdminStatus, type AdminStatus } from "../api/client";

export function AdminPage() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setStatus(await getAdminStatus());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "운영 현황을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void getAdminStatus()
      .then((nextStatus) => {
        if (active) {
          setStatus(nextStatus);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(errorMessage(loadError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-sm font-medium text-emerald-300">관리자</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">운영 현황</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            누적 데이터는 화면을 새로고침할 때만 Firestore에서 집계합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadStatus()}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-800 px-4 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" size={17} />
          ) : (
            <RefreshCw aria-hidden="true" size={17} />
          )}
          새로고침
        </button>
      </header>

      {error ? (
        <div className="mt-6 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {status ? (
        <>
          <section className="py-7">
            <div className="mb-4 flex items-center gap-2">
              <Database aria-hidden="true" size={18} className="text-sky-300" />
              <h2 className="font-semibold text-white">누적 현황</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                icon={UsersRound}
                label="전체 사용자"
                value={status.database.users}
              />
              <Metric
                icon={RadioTower}
                label="등록 스트리머"
                value={status.database.streamers}
              />
              <Metric
                icon={Activity}
                label="채팅 수집 활성화"
                value={status.database.chatEnabledStreamers}
              />
              <Metric
                icon={MonitorUp}
                label="활성 오버레이 주소"
                value={status.database.activeOverlays}
              />
            </div>
          </section>

          <section className="border-t border-white/10 py-7">
            <div className="mb-4 flex items-center gap-2">
              <Activity aria-hidden="true" size={18} className="text-emerald-300" />
              <h2 className="font-semibold text-white">현재 서버</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                icon={RadioTower}
                label="연결된 치지직 세션"
                value={status.runtime.chzzkSessions.connected}
                detail={`전체 ${status.runtime.chzzkSessions.total}개`}
              />
              <Metric
                icon={Activity}
                label="정상 세션"
                value={status.runtime.chzzkSessions.healthy}
                detail={`비정상 ${status.runtime.chzzkSessions.unhealthy}개`}
                warning={status.runtime.chzzkSessions.unhealthy > 0}
              />
              <Metric
                icon={MonitorUp}
                label="열린 오버레이 연결"
                value={status.runtime.overlayConnections.total}
                detail={`${status.runtime.overlayConnections.uniqueOverlays}개 오버레이`}
              />
              <Metric
                icon={MemoryStick}
                label="프로세스 메모리"
                value={`${status.runtime.memory.rssMb} MB`}
                detail={`Heap ${status.runtime.memory.heapUsedMb} MB`}
              />
            </div>
          </section>

          <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" size={14} />
              서버 가동 {formatUptime(status.runtime.uptimeSeconds)}
            </span>
            <span>
              조회 시각 {new Date(status.generatedAt).toLocaleString("ko-KR")}
            </span>
          </footer>
        </>
      ) : null}
    </div>
  );
}

interface MetricProps {
  icon: typeof Activity;
  label: string;
  value: number | string;
  detail?: string;
  warning?: boolean;
}

function Metric({ icon: Icon, label, value, detail, warning }: MetricProps) {
  return (
    <article className="rounded-md border border-white/10 bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Icon aria-hidden="true" size={16} />
        <span>{label}</span>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${warning ? "text-amber-300" : "text-white"}`}>
        {value}
      </p>
      {detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}
    </article>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  return [
    days > 0 ? `${days}일` : null,
    hours > 0 ? `${hours}시간` : null,
    `${minutes}분`
  ].filter(Boolean).join(" ");
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "운영 현황을 불러오지 못했습니다.";
}
