import Form from "@/components/forms/Forms";
import FormActions from "@/components/forms/FormActions";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { BillingType, StudentFormValues, StudentStatus } from "../types";

interface StudentFormProps {
  values: StudentFormValues;
  isEditing: boolean;
  onChange: (values: StudentFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const StudentForm = ({
  values,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: StudentFormProps) => {
  return (
    <Form
      title={isEditing ? "Edit student" : "Add a new student"}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Input
        name="name"
        type="text"
        label="Full name"
        value={values.name}
        onChange={(event) => onChange({ ...values, name: event.target.value })}
        placeholder="Jordan Vega"
        required
      />
      <Input
        name="parentName"
        type="text"
        label="Parent name"
        value={values.parentName}
        onChange={(event) =>
          onChange({ ...values, parentName: event.target.value })
        }
        placeholder="Alex Vega"
      />
      <Input
        name="phone"
        type="tel"
        label="Phone"
        value={values.phone}
        onChange={(event) => onChange({ ...values, phone: event.target.value })}
        placeholder="+1 555 0100"
      />
      <Input
        name="address"
        type="text"
        label="Address"
        value={values.address}
        onChange={(event) =>
          onChange({ ...values, address: event.target.value })
        }
        placeholder="12 Main Street"
      />
      <Input
        name="subject"
        type="text"
        label="Subject"
        value={values.subject}
        onChange={(event) =>
          onChange({ ...values, subject: event.target.value })
        }
        placeholder="Mathematics"
        required
      />
      <Select
        name="billingType"
        label="Billing type"
        value={values.billingType}
        onChange={(event) =>
          onChange({
            ...values,
            billingType: event.target.value as BillingType,
          })
        }
        options={[
          { value: "HOURLY", label: "Hourly" },
          { value: "MONTHLY", label: "Monthly" },
        ]}
      />
      <Input
        name="rate"
        type="number"
        label="Rate"
        value={values.rate}
        onChange={(event) => onChange({ ...values, rate: event.target.value })}
        placeholder="25"
        min="0.01"
        step="0.01"
        required
      />
      <Select
        name="status"
        label="Status"
        value={values.status}
        onChange={(event) =>
          onChange({
            ...values,
            status: event.target.value as StudentStatus,
          })
        }
        options={[
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" },
        ]}
      />
      <FormActions
        submitLabel={isEditing ? "Save changes" : "Add student"}
        onCancel={onCancel}
      />
    </Form>
  );
};

export default StudentForm;
