import { cn } from "../../lib/cn";

const tones = {
  neutral: "bg-primary text-title",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-sky-100 text-sky-800",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "delivered" || value === "resolved") return "success";
  if (value === "shipped" || value === "packed") return "warning";
  if (value === "canceled" || value === "cancelled") return "danger";
  if (value === "placed" || value === "pending") return "info";
  return "neutral";
}
