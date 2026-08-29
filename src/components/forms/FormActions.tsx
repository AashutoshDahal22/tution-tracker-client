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
    <div className={`flex gap-3 ${align === "right" ? "justify-end" : ""}`}>
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="flex-1 sm:flex-none"
      >
        {submitLabel}
      </Button>
      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1 sm:flex-none"
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
