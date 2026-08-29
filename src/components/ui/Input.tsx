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
            className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`w-full text-sm border px-3.5 py-2.5 focus:outline-none placeholder:text-stone-400 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-stone-200 focus:border-stone-500"
          } ${className}`}
          {...rest}
        />

        {hint && !error && (
          <div className="text-xs text-stone-400 mt-1">{hint}</div>
        )}
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
