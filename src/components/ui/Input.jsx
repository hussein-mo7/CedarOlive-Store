import { cn } from "../../lib/cn";

export default function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-title">
          {label}
        </span>
      )}
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-sm text-text">{hint}</span>
      ) : null}
    </label>
  );
}

const control =
  "w-full rounded-xl border border-borderColor bg-white px-3.5 py-2.5 text-sm text-title outline-none transition placeholder:text-[#b3aaa3] focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:bg-primary";

export function Input({ label, error, className, ...props }) {
  return (
    <Field label={label} error={error}>
      <input className={cn(control, error && "border-red-400", className)} {...props} />
    </Field>
  );
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <Field label={label} error={error}>
      <textarea
        className={cn(control, "min-h-32 resize-y", error && "border-red-400", className)}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, error, className, children, ...props }) {
  return (
    <Field label={label} error={error}>
      <select className={cn(control, error && "border-red-400", className)} {...props}>
        {children}
      </select>
    </Field>
  );
}
