import { useState, useEffect, useRef } from "react";

type SessionStatus = "idle" | "running" | "paused" | "ended";

const formatElapsed = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const pad = (n: number): string => String(n).padStart(2, "0");

  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const statusStyles: Record<SessionStatus, string> = {
  idle: "bg-stone-100 text-stone-500 border-stone-200",
  running: "bg-emerald-50 text-emerald-800 border-emerald-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  ended: "bg-stone-900 text-stone-50 border-stone-900",
};

const statusLabel: Record<SessionStatus, string> = {
  idle: "Not started",
  running: "In session",
  paused: "Paused",
  ended: "Session ended",
};

const SessionTracker = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [elapsed, setElapsed] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live wall clock
  useEffect(() => {
    const clockId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(clockId);
    };
  }, []);

  // Session timer
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleStart = (): void => {
    setStartedAt(new Date());
    setElapsed(0);
    setStatus("running");
  };

  const handlePauseResume = (): void => {
    setStatus((prev) => (prev === "running" ? "paused" : "running"));
  };

  const handleEnd = (): void => {
    setStatus("ended");
  };

  const handleReset = (): void => {
    setStatus("idle");
    setElapsed(0);
    setStartedAt(null);
  };

  return (
    <div className="w-full text-stone-900 flex justify-center">
      <div className="w-full max-w-md border border-stone-200 bg-white p-5 sm:p-7 lg:p-9">
        {/* Date / Status */}
        <div className="flex items-start justify-between gap-3 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="text-xs tracking-widest uppercase text-emerald-800 mb-1">
              Live session
            </div>

            <div className="font-serif text-lg sm:text-xl break-words">
              {dateLabel}
            </div>

            <div className="text-sm text-stone-400 mt-0.5 tabular-nums">
              {timeLabel}
            </div>
          </div>

          <span
            className={`text-xs font-medium px-2.5 py-1 border whitespace-nowrap shrink-0 ${
              statusStyles[status]
            }`}
          >
            {statusLabel[status]}
          </span>
        </div>

        {/* Timer */}
        <div className="border border-stone-200 py-8 sm:py-10 px-4 flex flex-col items-center justify-center mb-6 sm:mb-7">
          <div className="font-serif text-4xl min-[400px]:text-5xl sm:text-6xl tabular-nums tracking-tight text-center break-all">
            {formatElapsed(elapsed)}
          </div>

          <div className="text-xs text-stone-400 mt-3">
            {startedAt
              ? `Started at ${startedAt.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Timer has not started"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col min-[400px]:flex-row gap-2.5 sm:gap-3">
          {status === "idle" && (
            <button
              onClick={handleStart}
              className="flex-1 text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-4 py-3.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors min-h-[48px]"
            >
              Start session
            </button>
          )}

          {(status === "running" || status === "paused") && (
            <>
              <button
                onClick={handlePauseResume}
                className="flex-1 text-sm font-semibold text-stone-800 bg-white border border-stone-300 px-4 py-3.5 hover:border-stone-500 transition-colors min-h-[48px]"
              >
                {status === "running" ? "Pause" : "Resume"}
              </button>

              <button
                onClick={handleEnd}
                className="flex-1 text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-4 py-3.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors min-h-[48px]"
              >
                End session
              </button>
            </>
          )}

          {status === "ended" && (
            <button
              onClick={handleReset}
              className="flex-1 text-sm font-semibold text-stone-800 bg-white border border-stone-300 px-4 py-3.5 hover:border-stone-500 transition-colors min-h-[48px]"
            >
              Start a new session
            </button>
          )}
        </div>

        {/* Ended session information */}
        {status === "ended" && (
          <div className="mt-5 text-xs text-stone-400 text-center">
            Total duration logged: {formatElapsed(elapsed)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTracker;
