import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/features/dashboard/api";
import type { Session } from "@/features/sessions/api";

type Filter = "All" | "Upcoming" | "Completed" | "Cancelled";

const filters: Filter[] = ["All", "Upcoming", "Completed", "Cancelled"];

const statusStyles: Record<Filter, string> = {
  All: "",
  Upcoming: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Completed: "bg-stone-100 text-stone-600 border-stone-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

function displayStatus(status: Session["status"]): Exclude<Filter, "All"> {
  if (status === "ONGOING") return "Upcoming";
  if (status === "COMPLETED") return "Completed";
  return "Cancelled";
}

function durationMinutes(s: Session): number | null {
  if (typeof s.duration === "number" && Number.isFinite(s.duration)) {
    return s.duration;
  }
  if (s.endTime) {
    const ms =
      new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
    if (Number.isFinite(ms) && ms > 0) return Math.round(ms / 60000);
  }
  return null;
}

function formatDuration(mins: number | null): string {
  if (mins === null) return "—";
  if (mins < 60) return `${mins}m`;
  const h = mins / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)}h`;
}

/** Server sends a stored amount; estimate only for legacy rows with amount null. */
function displayAmount(s: Session): number | null {
  if (typeof s.amount === "number") return s.amount;
  if (s.status === "CANCELLED") return 0;
  const st = s.student;
  if (!st || st.billingType !== "HOURLY" || st.rate === null) return null;
  const mins = durationMinutes(s);
  if (mins === null) return null;
  return Math.round(((st.rate * mins) / 60) * 100) / 100;
}

function formatMoney(v: number): string {
  return `$${Math.round(v).toLocaleString()}`;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("All");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: "Total sessions",
        value: String(stats.totals.sessions),
        sub: "since you started",
      },
      {
        label: "Total earned",
        value: formatMoney(stats.totals.earned),
        sub: "completed sessions",
      },
      {
        label: "Sessions this month",
        value: String(stats.month.sessions),
        sub: stats.month.label,
      },
      {
        label: "Active students",
        value: String(stats.totals.activeStudents),
        sub: "currently enrolled",
      },
    ];
  }, [stats]);

  const rows = useMemo(() => {
    if (!stats) return [];
    return stats.recent
      .map((s) => {
        const start = new Date(s.startTime);
        const amount = displayAmount(s);
        return {
          id: s.id,
          student: s.student?.name ?? "Unknown student",
          subject: s.student?.subject ?? "—",
          date: start.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          time: start.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          }),
          duration: formatDuration(durationMinutes(s)),
          status: displayStatus(s.status),
          price: amount === null ? "—" : formatMoney(amount),
        };
      })
      .filter((r) => filter === "All" || r.status === filter);
  }, [stats, filter]);

  const progress =
    stats && stats.month.sessions > 0
      ? Math.round((stats.month.held / stats.month.sessions) * 100)
      : 0;

  return (
    <div className="w-full text-stone-900">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-emerald-800 mb-1">
              Tuition tracker
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
              Your sessions
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/sessions")}
            className="w-full sm:w-auto text-base font-semibold text-stone-50 bg-emerald-800 border border-emerald-800 rounded-xl shadow-sm px-6 py-3.5 min-h-[52px] hover:bg-emerald-900 hover:border-emerald-900 transition-colors whitespace-nowrap"
          >
            + Start new session
          </button>
        </div>

        {loading && (
          <div className="text-stone-500 mb-6">Loading dashboard…</div>
        )}
        {error && <div className="text-red-700 mb-6">{error}</div>}

        {!loading && !error && stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {cards.map((s) => (
                <div
                  key={s.label}
                  className="border border-stone-200 rounded-2xl bg-white shadow-sm p-5"
                >
                  <div className="text-sm font-medium text-stone-600">
                    {s.label}
                  </div>
                  <div className="font-serif text-3xl mt-2">{s.value}</div>
                  <div className="text-sm text-stone-500 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Two-column: monthly overview + top students */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="lg:col-span-2 border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="font-serif text-lg sm:text-xl">This month</h2>
                  <span className="text-sm text-stone-500 whitespace-nowrap">
                    {stats.month.range}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-stone-600">Sessions held</div>
                    <div className="font-serif text-2xl mt-1">
                      {stats.month.held}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-600">Sessions upcoming</div>
                    <div className="font-serif text-2xl mt-1">
                      {stats.month.upcoming}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-600">Earned so far</div>
                    <div className="font-serif text-2xl mt-1">
                      {formatMoney(stats.month.earned)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-2.5 rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-700 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-stone-500 mt-2">
                  {stats.month.held} of {stats.month.sessions} sessions
                  completed this month
                </div>
              </div>

              <div className="border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-6">
                <h2 className="font-serif text-lg sm:text-xl mb-4 sm:mb-5">
                  Top students
                </h2>
                {stats.topStudents.length === 0 ? (
                  <div className="text-stone-500">No sessions yet.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {stats.topStudents.slice(0, 3).map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between gap-2 text-base"
                      >
                        <span className="text-stone-800">{st.name}</span>
                        <span className="text-stone-500 whitespace-nowrap">
                          {st.sessions} sessions
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sessions table */}
            <div className="border border-stone-200 rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 pb-4">
                <h2 className="font-serif text-lg sm:text-xl">
                  Recent &amp; upcoming
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-sm font-medium px-4 py-2.5 min-h-[44px] rounded-full border transition-colors ${
                        filter === f
                          ? "bg-emerald-800 text-stone-50 border-emerald-800"
                          : "bg-white text-stone-600 border-stone-300 hover:border-emerald-700"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-base">
                  <thead>
                    <tr className="border-t border-stone-200 text-left text-sm text-stone-500">
                      <th className="font-semibold px-6 py-3">Student</th>
                      <th className="font-semibold px-6 py-3">Subject</th>
                      <th className="font-semibold px-6 py-3">Date</th>
                      <th className="font-semibold px-6 py-3">Duration</th>
                      <th className="font-semibold px-6 py-3">Status</th>
                      <th className="font-semibold px-6 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s) => (
                      <tr key={s.id} className="border-t border-stone-100">
                        <td className="px-6 py-4 text-stone-800">{s.student}</td>
                        <td className="px-6 py-4 text-stone-600">{s.subject}</td>
                        <td className="px-6 py-4 text-stone-600">
                          {s.date} &middot; {s.time}
                        </td>
                        <td className="px-6 py-4 text-stone-600">{s.duration}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium px-2.5 py-1 rounded-full border ${statusStyles[s.status]}`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-stone-800">
                          {s.price}
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-stone-500"
                        >
                          {stats.totals.sessions === 0
                            ? "No sessions yet. Start your first session to see it here."
                            : "No sessions in this view."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
