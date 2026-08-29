import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-stone-50 bg-stone-900 border border-stone-900 hover:bg-emerald-800 hover:border-emerald-800",
  secondary:
    "text-stone-800 bg-white border border-stone-300 hover:border-stone-500",
  danger:
    "text-stone-50 bg-red-700 border border-red-700 hover:bg-red-800 hover:border-red-800",
  ghost:
    "text-stone-500 bg-transparent border border-transparent hover:text-stone-900",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
};

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {isLoading ? "Please wait…" : children}
    </button>
  );
};

export default Button;
