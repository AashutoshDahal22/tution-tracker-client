import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import type { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  hasStudents: boolean;
  onEdit: (student: Student) => void;
  onRequestDelete: (id: string) => void;
  confirmDeleteId: string | null;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
}

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const StudentTable = ({
  students,
  hasStudents,
  onEdit,
  onRequestDelete,
  confirmDeleteId,
  onDelete,
  onCancelDelete,
}: StudentTableProps) => {
  return (
    <Table
      data={students}
      keyExtractor={(student) => student.id}
      emptyMessage={
        hasStudents
          ? "No students match your search."
          : "No students yet. Add one to get started."
      }
      columns={[
        {
          header: "Student",
          render: (student) => (
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-9 h-9 border border-stone-200 flex items-center justify-center text-xs font-semibold text-stone-500">
                {initials(student.name)}
              </div>
              <div className="min-w-0">
                <div className="font-serif text-base truncate">
                  {student.name}
                </div>
                <div className="text-xs text-stone-400 truncate">
                  {student.subject} · {student.phone ?? "No phone"}
                </div>
              </div>
            </div>
          ),
        },
        { header: "Code", render: (student) => student.studentCode },
        {
          header: "Status",
          render: (student) => (
            <Badge tone={student.status === "ACTIVE" ? "success" : "neutral"}>
              {student.status === "ACTIVE" ? "Active" : "Inactive"}
            </Badge>
          ),
        },
        {
          header: "Actions",
          render: (student) =>
            confirmDeleteId === student.id ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-stone-400 whitespace-nowrap">Remove?</span>
                <Button size="sm" onClick={() => onDelete(student.id)}>
                  Confirm
                </Button>
                <Button size="sm" variant="secondary" onClick={onCancelDelete}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onRequestDelete(student.id)}
                >
                  Remove
                </Button>
              </div>
            ),
        },
      ]}
    />
  );
};

export default StudentTable;
