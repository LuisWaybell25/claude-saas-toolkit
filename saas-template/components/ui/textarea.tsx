import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={error || undefined}
    className={cn(
      "min-h-20 w-full rounded-md border bg-card px-3 py-2 text-sm",
      "placeholder:text-muted-foreground disabled:opacity-50",
      error ? "border-destructive" : "border-input",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
