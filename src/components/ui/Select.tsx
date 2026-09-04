import React, { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = "", ...rest },
    ref,
  ) => {
    const selectId = id ?? rest.name;

    return (
      <div>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-stone-600 mb-1.5"
          >
            {label}
          </label>
        )}

        <select
          id={selectId}
          ref={ref}
          className={`w-full text-base border rounded-lg px-4 py-3 min-h-[48px] focus:outline-none bg-white ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-stone-300 focus:border-emerald-700"
          } ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
