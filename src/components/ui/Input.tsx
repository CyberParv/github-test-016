"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          error && "border-error",
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {helperText && !error && (
        <span id={`${inputId}-helper`} className="text-xs text-secondary">
          {helperText}
        </span>
      )}
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
