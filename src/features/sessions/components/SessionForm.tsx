import Form from "@/components/forms/Forms";
import FormActions from "@/components/forms/FormActions";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Student } from "@/features/students/api";
import type { SessionFormValues } from "../schemas";

interface SessionFormProps {
  values: SessionFormValues;
  students: Student[];
  isEditing: boolean;
  onChange: (values: SessionFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const SessionForm = ({
  values,
  students,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: SessionFormProps) => {
  const startsInFuture =
    values.startTime !== "" && new Date(values.startTime).getTime() > Date.now();

  return (
    <Form
      title={isEditing ? "Edit session" : "Schedule or log a session"}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Select
        name="studentId"
        label="Student"
        value={values.studentId}
        onChange={(event) =>
          onChange({ ...values, studentId: event.target.value })
        }
        placeholder={students.length === 0 ? "No students yet" : "Select a student"}
        options={students.map((s) => ({
          value: s.id,
          label: `${s.name} · ${s.subject}`,
        }))}
      />
      <Input
        name="startTime"
        type="datetime-local"
        label="Start time"
        value={values.startTime}
        onChange={(event) =>
          onChange({ ...values, startTime: event.target.value })
        }
        required
      />
      {startsInFuture && (
        <p className="text-sm text-emerald-800">
          Starts in the future — it will show as Upcoming on the dashboard.
        </p>
      )}
      <Input
        name="notes"
        type="text"
        label="Notes (optional)"
        value={values.notes ?? ""}
        onChange={(event) => onChange({ ...values, notes: event.target.value })}
        placeholder="Covered quadratic equations"
      />
      <FormActions
        submitLabel={isEditing ? "Save changes" : "Save session"}
        onCancel={onCancel}
      />
    </Form>
  );
};

export default SessionForm;
