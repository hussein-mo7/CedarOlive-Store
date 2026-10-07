import { cn } from "../../lib/cn";

export default function Card({ className, children }) {
  return (
    <div className={cn("rounded-2xl border border-borderColor bg-white shadow-card", className)}>
      {children}
    </div>
  );
}
