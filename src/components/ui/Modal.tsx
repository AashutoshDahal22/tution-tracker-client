import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full bg-white border border-stone-200 p-7 sm:p-8 ${sizeStyles[size]}`}
      >
        {title && (
          <div className="flex items-start justify-between mb-6">
            <div className="font-serif text-lg">{title}</div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-stone-400 hover:text-stone-900 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div>{children}</div>

        {footer && <div className="mt-7 flex gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
