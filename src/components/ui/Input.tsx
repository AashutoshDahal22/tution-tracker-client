import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone-600 mb-1.5"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`w-full text-base border rounded-lg px-4 py-3 min-h-[48px] focus:outline-none placeholder:text-stone-500 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-stone-300 focus:border-emerald-700"
          } ${className}`}
          {...rest}
        />

        {hint && !error && (
          <div className="text-sm text-stone-500 mt-1">{hint}</div>
        )}
        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
