"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";
import Spinner from "@/components/ui/Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

export function Button({ className, variant = "primary", isLoading = false, disabled, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-secondary text-white hover:opacity-90",
    outline: "border border-border text-foreground hover:bg-muted",
    ghost: "text-foreground hover:bg-muted"
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" label="Loading" /> : children}
    </button>
  );
}
