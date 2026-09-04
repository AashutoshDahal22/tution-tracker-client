import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Session } from "../api";

interface SessionTableProps {
  sessions: Session[];
  confirmDeleteId: string | null;
  onEdit: (session: Session) => void;
  onComplete: (session: Session) => void;
  onCancelSession: (session: Session) => void;
  onRequestDelete: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
}

const statusTone = (status: Session["status"]) => {
  if (status === "COMPLETED") return "neutral" as const;
  if (status === "CANCELLED") return "danger" as const;
  return "success" as const;
};

// Backend only has ONGOING / COMPLETED / CANCELLED, so "upcoming" is
// derived: an ONGOING session starting in the future is upcoming,
// otherwise it is currently ongoing.
const displayStatus = (s: Session, now: number): string => {
  if (s.status === "COMPLETED") return "Completed";
  if (s.status === "CANCELLED") return "Cancelled";
  return new Date(s.startTime).getTime() > now ? "Upcoming" : "Ongoing";
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
};

const formatDuration = (s: Session) => {
  const mins = s.duration;
  if (mins === null || mins === undefined) return "—";
  if (mins < 60) return `${mins}m`;
  const h = mins / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)}h`;
};

const SessionTable = ({
  sessions,
  confirmDeleteId,
  onEdit,
  onComplete,
  onCancelSession,
  onRequestDelete,
  onDelete,
  onCancelDelete,
}: SessionTableProps) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center text-stone-500 py-8">
        No sessions yet. Start the timer above or schedule one manually.
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-base">
        <thead>
          <tr className="text-left text-sm text-stone-500">
            <th className="font-semibold px-4 py-3">Student</th>
            <th className="font-semibold px-4 py-3">Start</th>
            <th className="font-semibold px-4 py-3">Duration</th>
            <th className="font-semibold px-4 py-3">Amount</th>
            <th className="font-semibold px-4 py-3">Status</th>
            <th className="font-semibold px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const isFuture = new Date(s.startTime).getTime() > now;
            return (
            <tr key={s.id} className="border-t border-stone-100">
              <td className="px-4 py-3 text-stone-800">
                {s.student?.name ?? "Unknown"}
                <span className="block text-sm text-stone-500">
                  {s.student?.subject ?? ""}
                  {s.notes ? ` · ${s.notes}` : ""}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                {formatDateTime(s.startTime)}
              </td>
              <td className="px-4 py-3 text-stone-600">{formatDuration(s)}</td>
              <td className="px-4 py-3 text-stone-800">
                {s.amount !== null && s.amount !== undefined
                  ? `$${s.amount.toLocaleString()}`
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(s.status)}>{displayStatus(s, now)}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end flex-wrap">
                  {s.status === "ONGOING" && (
                    <>
                      <span title={isFuture ? "Starts in the future" : undefined}>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isFuture}
                          onClick={() => onComplete(s)}
                        >
                          Complete
                        </Button>
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onCancelSession(s)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </Button>
                  {confirmDeleteId === s.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onCancelDelete}
                      >
                        Keep
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRequestDelete(s.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
