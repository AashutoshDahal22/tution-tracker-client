import React from "react";

type BadgeTone = "success" | "neutral" | "danger" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  neutral: "bg-stone-100 text-stone-500 border-stone-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
};

const Badge = ({ children, tone = "neutral" }: BadgeProps) => {
  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full border whitespace-nowrap ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
