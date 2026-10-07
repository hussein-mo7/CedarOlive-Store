import { cn } from "../../lib/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-[#e7ddd3]", className)} />;
}

export function ProductSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-3 h-4 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/3" />
    </div>
  );
}

export function Spinner({ className, label = "Loading" }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-text", className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
