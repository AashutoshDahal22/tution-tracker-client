import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  addStudent,
  editStudent,
  fetchStudents,
  removeStudent,
} from "../studentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";
import type { Student, StudentFormValues } from "../types";

const emptyForm: StudentFormValues = {
  name: "",
  parentName: "",
  phone: "",
  address: "",
  subject: "",
  billingType: "HOURLY",
  rate: "",
  status: "ACTIVE",
};

const StudentDashboard = () => {
  const [query, setQuery] = useState<string>("");
  const [form, setForm] = useState<StudentFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector(
    (state) => state.students,
  );

  useEffect(() => {
    void dispatch(fetchStudents());
  }, [dispatch]);

  const filtered = students.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q) ||
      (s.parentName?.toLowerCase().includes(q) ?? false) ||
      (s.phone?.toLowerCase().includes(q) ?? false)
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
      parentName: student.parentName ?? "",
      phone: student.phone ?? "",
      address: student.address ?? "",
      subject: student.subject,
      billingType: student.billingType,
      rate: student.rate?.toString() ?? "",
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

  const handleSubmit = async (): Promise<void> => {
    const name = form.name.trim();
    const subject = form.subject.trim();
    const rate = Number(form.rate);

    if (!name || !subject || !Number.isFinite(rate) || rate <= 0) return;

    const data = {
      name,
      parentName: form.parentName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      subject,
      billingType: form.billingType,
      rate,
      status: form.status,
    };

    if (editingId !== null) {
      await dispatch(editStudent({ id: editingId, data })).unwrap();
    } else {
      const { status: _status, ...createData } = data;
      await dispatch(addStudent(createData)).unwrap();
    }

    closeForm();
  };

  const handleDelete = async (id: string): Promise<void> => {
    await dispatch(removeStudent(id)).unwrap();
    setConfirmDeleteId(null);
  };

  const activeCount = students.filter((s) => s.status === "ACTIVE").length;

  return (
    <div className="w-full text-stone-900">
      <div className="w-full max-w-3xl mx-auto border border-stone-200 bg-white p-4 sm:p-7 lg:p-9">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="text-xs tracking-widest uppercase text-emerald-800 mb-1">
              Student roster
            </div>
            <div className="font-serif text-lg sm:text-xl">Manage students</div>
            <div className="text-sm text-stone-400 mt-0.5">
              {students.length} total · {activeCount} active
            </div>
          </div>

          <Button
            onClick={openCreateForm}
            disabled={loading}
            className="w-full sm:w-auto shrink-0"
          >
            Add student
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or grade"
          />
        </div>

        {formOpen && (
          <StudentForm
            values={form}
            isEditing={editingId !== null}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}

        {error && <div className="mb-5 text-sm text-red-700">{error}</div>}

        <StudentTable
          students={filtered}
          hasStudents={students.length > 0}
          onEdit={openEditForm}
          onRequestDelete={setConfirmDeleteId}
          confirmDeleteId={confirmDeleteId}
          onDelete={handleDelete}
          onCancelDelete={() => setConfirmDeleteId(null)}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
