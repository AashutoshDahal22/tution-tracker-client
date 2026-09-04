import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-sm text-stone-600 leading-relaxed">{message}</p>

      <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {confirmLabel}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
