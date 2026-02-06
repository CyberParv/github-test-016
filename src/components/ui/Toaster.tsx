"use client";

import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";

export default function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-md border border-border bg-background p-3 shadow-md",
            toast.type === "success" && "border-success",
            toast.type === "error" && "border-error"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && <p className="text-xs text-secondary">{toast.description}</p>}
            </div>
            <button
              className="text-xs text-secondary hover:text-foreground"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
