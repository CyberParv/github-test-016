import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function Spinner({ size = "md", label = "Loading" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
  };

  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite" aria-label={label}>
      <span className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
