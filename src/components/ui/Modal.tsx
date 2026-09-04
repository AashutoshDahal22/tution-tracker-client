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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-stone-900/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full bg-white border border-stone-200 rounded-2xl shadow-lg p-5 sm:p-8 max-h-[92vh] overflow-y-auto ${sizeStyles[size]}`}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
            <div className="font-serif text-base sm:text-lg">{title}</div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-stone-500 hover:text-stone-900 text-2xl leading-none p-1 -m-1 shrink-0"
            >
              ×
            </button>
          </div>
        )}

        <div>{children}</div>

        {footer && (
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
