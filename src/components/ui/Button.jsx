import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-secondary text-white hover:bg-[#8d4526] disabled:bg-[#c9a08a]",
  outline:
    "border border-secondary text-secondary hover:bg-secondary hover:text-white",
  ghost: "text-title hover:bg-primary",
  danger: "bg-red-700 text-white hover:bg-red-800",
  white: "bg-white text-title hover:bg-primary",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
