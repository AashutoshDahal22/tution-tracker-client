import { useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "active" | "inactive";
};

type FormState = {
  name: string;
  email: string;
  grade: string;
  status: "active" | "inactive";
};

const emptyForm: FormState = {
  name: "",
  email: "",
  grade: "",
  status: "active",
};

const seedStudents: Student[] = [
  {
    id: "1",
    name: "Amara Osei",
    email: "amara.osei@mail.edu",
    grade: "10th",
    status: "active",
  },
  {
    id: "2",
    name: "Liam Chen",
    email: "liam.chen@mail.edu",
    grade: "11th",
    status: "active",
  },
  {
    id: "3",
    name: "Priya Nair",
    email: "priya.nair@mail.edu",
    grade: "9th",
    status: "inactive",
  },
];

const statusStyles: Record<Student["status"], string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  inactive: "bg-stone-100 text-stone-500 border-stone-200",
};

const statusLabel: Record<Student["status"], string> = {
  active: "Active",
  inactive: "Inactive",
};

const makeId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const StudentDashboard = () => {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [query, setQuery] = useState<string>("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const filtered = students.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q)
    );
  });

  const openCreateForm = (): void => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (student: Student): void => {
    setForm({
      name: student.name,
      email: student.email,
      grade: student.grade,
      status: student.status,
    });
    setEditingId(student.id);
    setFormOpen(true);
  };

  const closeForm = (): void => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (): void => {
    const name = form.name.trim();
    const email = form.email.trim();
    const grade = form.grade.trim();

    if (!name || !email || !grade) return;

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, name, email, grade, status: form.status }
            : s,
        ),
      );
    } else {
      setStudents((prev) => [
        ...prev,
        { id: makeId(), name, email, grade, status: form.status },
      ]);
    }

    closeForm();
  };

  const handleDelete = (id: string): void => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
  };

  const activeCount = students.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-5 sm:p-8">
      <div className="w-full max-w-3xl mx-auto border border-stone-200 bg-white p-7 sm:p-9">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-xs tracking-widest uppercase text-emerald-800 mb-1">
              Student roster
            </div>
            <div className="font-serif text-xl">Manage students</div>
            <div className="text-sm text-stone-400 mt-0.5">
              {students.length} total · {activeCount} active
            </div>
          </div>

          <button
            onClick={openCreateForm}
            className="text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-4 py-2.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors whitespace-nowrap"
          >
            Add student
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or grade"
            className="w-full text-sm border border-stone-200 px-3.5 py-2.5 focus:outline-none focus:border-stone-500 placeholder:text-stone-400"
          />
        </div>

        {formOpen && (
          <div className="border border-stone-200 p-6 mb-7">
            <div className="font-serif text-lg mb-5">
              {editingId ? "Edit student" : "Add a new student"}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jordan Vega"
                  className="w-full text-sm border border-stone-200 px-3.5 py-2.5 focus:outline-none focus:border-stone-500 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jordan.vega@mail.edu"
                  className="w-full text-sm border border-stone-200 px-3.5 py-2.5 focus:outline-none focus:border-stone-500 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
                  Grade
                </label>
                <input
                  type="text"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  placeholder="10th"
                  className="w-full text-sm border border-stone-200 px-3.5 py-2.5 focus:outline-none focus:border-stone-500 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Student["status"],
                    })
                  }
                  className="w-full text-sm border border-stone-200 px-3.5 py-2.5 focus:outline-none focus:border-stone-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none text-sm font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-5 py-2.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors"
              >
                {editingId ? "Save changes" : "Add student"}
              </button>
              <button
                onClick={closeForm}
                className="flex-1 sm:flex-none text-sm font-semibold text-stone-800 bg-white border border-stone-300 px-5 py-2.5 hover:border-stone-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="border border-stone-200 divide-y divide-stone-200">
          {filtered.length === 0 && (
            <div className="py-14 text-center text-sm text-stone-400">
              {students.length === 0
                ? "No students yet. Add one to get started."
                : "No students match your search."}
            </div>
          )}

          {filtered.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0 w-9 h-9 border border-stone-200 flex items-center justify-center text-xs font-semibold text-stone-500">
                  {initials(student.name)}
                </div>

                <div className="min-w-0">
                  <div className="font-serif text-base truncate">
                    {student.name}
                  </div>
                  <div className="text-xs text-stone-400 truncate">
                    {student.email} · {student.grade}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs font-medium px-2.5 py-1 border whitespace-nowrap ${statusStyles[student.status]}`}
                >
                  {statusLabel[student.status]}
                </span>

                {confirmDeleteId === student.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 hidden sm:inline">
                      Remove?
                    </span>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-xs font-semibold text-stone-50 bg-stone-900 border border-stone-900 px-3 py-1.5 hover:bg-emerald-800 hover:border-emerald-800 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs font-semibold text-stone-800 bg-white border border-stone-300 px-3 py-1.5 hover:border-stone-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(student)}
                      className="text-xs font-semibold text-stone-800 bg-white border border-stone-300 px-3 py-1.5 hover:border-stone-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(student.id)}
                      className="text-xs font-semibold text-stone-800 bg-white border border-stone-300 px-3 py-1.5 hover:border-stone-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
