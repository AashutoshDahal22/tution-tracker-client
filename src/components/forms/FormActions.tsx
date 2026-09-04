import Button from "@/components/ui/Button";

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  align?: "left" | "right";
}

const FormActions = ({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  align = "left",
}: FormActionsProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-2.5 sm:gap-3 ${align === "right" ? "sm:justify-end" : ""}`}
    >
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full sm:w-auto sm:flex-none"
      >
        {submitLabel}
      </Button>
      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto sm:flex-none"
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
