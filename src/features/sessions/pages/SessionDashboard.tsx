import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchStudents } from "@/features/students/studentSlice";
import {
  addSession,
  editSession,
  fetchSessions,
  removeSession,
} from "../sessionSlice";
import SessionForm from "../components/SessionForm";
import SessionTable from "../components/SessionTable";
import { sessionFormSchema, type SessionFormValues } from "../schemas";
import type { Session } from "../api";

type TimerStatus = "idle" | "running" | "paused";

const formatElapsed = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number): string => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const toDateTimeLocal = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const SessionTracker = () => {
  const dispatch = useAppDispatch();
  const { students } = useAppSelector((state) => state.students);
  const { sessions, loading, error } = useAppSelector(
    (state) => state.sessions,
  );

  // Timer state
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [timerStudentId, setTimerStudentId] = useState("");
  const [timerNotes, setTimerNotes] = useState("");
  const [timerBusy, setTimerBusy] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual log / edit form
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SessionFormValues>({
    studentId: "",
    startTime: toDateTimeLocal(new Date()),
    notes: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchStudents());
    void dispatch(fetchSessions());
  }, [dispatch]);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerStatus === "running") {
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
  }, [timerStatus]);

  const activeStudent = students.find((s) => s.id === timerStudentId);

  const handleStart = async () => {
    if (!timerStudentId) {
      toast.error("Pick a student to start the session.");
      return;
    }
    setTimerBusy(true);
    try {
      const session = await dispatch(
        addSession({
          studentId: timerStudentId,
          startTime: new Date().toISOString(),
          notes: timerNotes.trim() || undefined,
        }),
      ).unwrap();
      setActiveSessionId(session.id);
      setElapsed(0);
      setTimerStatus("running");
      toast.success("Session started.");
    } catch {
      toast.error("Could not start session.");
    } finally {
      setTimerBusy(false);
    }
  };

  const finishActive = async (status: "COMPLETED" | "CANCELLED") => {
    if (!activeSessionId) return;
    setTimerBusy(true);
    try {
      const minutes = Math.max(1, Math.round(elapsed / 60));
      const updated = await dispatch(
        editSession({
          id: activeSessionId,
          data: {
            endTime: new Date().toISOString(),
            duration: minutes,
            status,
          },
        }),
      ).unwrap();
      if (status === "COMPLETED") {
        toast.success(
          updated.amount !== null && updated.amount !== undefined
            ? `Session completed · $${updated.amount.toLocaleString()}`
            : "Session completed.",
        );
      } else {
        toast.success("Session cancelled.");
      }
    } catch {
      toast.error("Could not finish session.");
    } finally {
      setTimerBusy(false);
      setTimerStatus("idle");
      setElapsed(0);
      setActiveSessionId(null);
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      studentId: "",
      startTime: toDateTimeLocal(new Date()),
      notes: "",
    });
    setFormOpen(true);
  };

  const openEditForm = (session: Session) => {
    const start = new Date(session.startTime);
    setEditingId(session.id);
    setForm({
      studentId: session.studentId,
      startTime: toDateTimeLocal(
        Number.isNaN(start.getTime()) ? new Date() : start,
      ),
      notes: session.notes ?? "",
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    const parsed = sessionFormSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }
    try {
      if (editingId) {
        await dispatch(
          editSession({
            id: editingId,
            data: {
              startTime: new Date(parsed.data.startTime).toISOString(),
              notes: parsed.data.notes || null,
            },
          }),
        ).unwrap();
        toast.success("Session updated.");
      } else {
        await dispatch(
          addSession({
            studentId: parsed.data.studentId,
            startTime: new Date(parsed.data.startTime).toISOString(),
            notes: parsed.data.notes || undefined,
          }),
        ).unwrap();
        toast.success("Session logged.");
      }
      setFormOpen(false);
      setEditingId(null);
    } catch {
      toast.error("Could not save session.");
    }
  };

  const handleComplete = async (session: Session) => {
    try {
      const updated = await dispatch(
        editSession({
          id: session.id,
          data: { endTime: new Date().toISOString(), status: "COMPLETED" },
        }),
      ).unwrap();
      toast.success(
        updated.amount !== null && updated.amount !== undefined
          ? `Session completed · $${updated.amount.toLocaleString()}`
          : "Session completed.",
      );
    } catch {
      toast.error("Could not complete session.");
    }
  };

  const handleCancelSession = async (session: Session) => {
    try {
      await dispatch(
        editSession({ id: session.id, data: { status: "CANCELLED" } }),
      ).unwrap();
      toast.success("Session cancelled.");
    } catch {
      toast.error("Could not cancel session.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeSession(id)).unwrap();
      setConfirmDeleteId(null);
      toast.success("Session deleted.");
    } catch {
      toast.error("Could not delete session.");
    }
  };

  return (
    <div className="w-full text-stone-900 flex flex-col items-center gap-6">
      {/* Live timer */}
      <div className="w-full max-w-md border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-7">
        <div className="text-sm font-semibold text-emerald-800 mb-1">
          Live session
        </div>
        <div className="font-serif text-xl sm:text-2xl mb-4">
          {timerStatus === "idle" ? "Start a session" : (activeStudent?.name ?? "In session")}
        </div>

        {timerStatus === "idle" && (
          <div className="flex flex-col gap-3 mb-4">
            <Select
              name="timerStudent"
              label="Student"
              value={timerStudentId}
              onChange={(e) => setTimerStudentId(e.target.value)}
              placeholder={
                students.length === 0 ? "No students yet" : "Select a student"
              }
              options={students.map((s) => ({
                value: s.id,
                label: `${s.name} · ${s.subject}`,
              }))}
            />
            <Input
              name="timerNotes"
              type="text"
              label="Notes (optional)"
              value={timerNotes}
              onChange={(e) => setTimerNotes(e.target.value)}
              placeholder="What will you cover?"
            />
          </div>
        )}

        <div className="border border-stone-200 rounded-2xl bg-cream-50 py-8 px-4 flex flex-col items-center justify-center mb-5">
          <div className="font-serif text-5xl sm:text-6xl tabular-nums tracking-tight">
            {formatElapsed(elapsed)}
          </div>
          <div className="text-sm text-stone-500 mt-3">
            {timerStatus === "idle"
              ? "Timer has not started"
              : timerStatus === "running"
                ? "In session"
                : "Paused"}
          </div>
        </div>

        <div className="flex flex-col min-[400px]:flex-row gap-2.5">
          {timerStatus === "idle" && (
            <Button
              className="flex-1 rounded-xl"
              disabled={timerBusy}
              onClick={() => void handleStart()}
            >
              {timerBusy ? "Starting…" : "Start session"}
            </Button>
          )}
          {timerStatus !== "idle" && (
            <>
              <Button
                className="flex-1 rounded-xl"
                variant="secondary"
                onClick={() =>
                  setTimerStatus((p) => (p === "running" ? "paused" : "running"))
                }
              >
                {timerStatus === "running" ? "Pause" : "Resume"}
              </Button>
              <Button
                className="flex-1 rounded-xl"
                disabled={timerBusy}
                onClick={() => void finishActive("COMPLETED")}
              >
                End session
              </Button>
            </>
          )}
        </div>
        {timerStatus !== "idle" && (
          <Button
            className="w-full mt-2 rounded-xl"
            variant="ghost"
            disabled={timerBusy}
            onClick={() => void finishActive("CANCELLED")}
          >
            Discard session
          </Button>
        )}
      </div>

      {/* History */}
      <div className="w-full max-w-3xl border border-stone-200 rounded-2xl bg-white shadow-sm p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <div className="text-sm font-semibold text-emerald-800 mb-1">
              History
            </div>
            <div className="font-serif text-xl">
              {sessions.length} session{sessions.length === 1 ? "" : "s"}
            </div>
          </div>
          <Button
            className="rounded-xl"
            variant="secondary"
            onClick={openCreateForm}
          >
            Log session
          </Button>
        </div>

        {formOpen && (
          <div className="mb-5">
            <SessionForm
              values={form}
              students={students}
              isEditing={editingId !== null}
              onChange={setForm}
              onSubmit={() => void handleFormSubmit()}
              onCancel={() => {
                setFormOpen(false);
                setEditingId(null);
              }}
            />
          </div>
        )}

        {error && <div className="mb-4 text-red-700">{error}</div>}
        {loading && sessions.length === 0 ? (
          <div className="text-stone-500 text-center py-8">
            Loading sessions…
          </div>
        ) : (
          <SessionTable
            sessions={sessions}
            confirmDeleteId={confirmDeleteId}
            onEdit={openEditForm}
            onComplete={(s) => void handleComplete(s)}
            onCancelSession={(s) => void handleCancelSession(s)}
            onRequestDelete={setConfirmDeleteId}
            onDelete={(id) => void handleDelete(id)}
            onCancelDelete={() => setConfirmDeleteId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SessionTracker;
