import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "destructive";

const tones: Record<Tone, { wrapper: string; icon: string; Icon: typeof Info }> = {
  info: { wrapper: "border-info/30 bg-info/5", icon: "text-info", Icon: Info },
  success: { wrapper: "border-success/30 bg-success/5", icon: "text-success", Icon: CheckCircle2 },
  warning: {
    wrapper: "border-warning/30 bg-warning/5",
    icon: "text-warning",
    Icon: AlertTriangle,
  },
  destructive: {
    wrapper: "border-destructive/30 bg-destructive/5",
    icon: "text-destructive",
    Icon: XCircle,
  },
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
}

export function Alert({ className, tone = "info", title, children, ...props }: AlertProps) {
  const { wrapper, icon, Icon } = tones[tone];

  return (
    <div
      // role="alert" solo en mensajes de error: en los informativos molesta
      // al lector de pantalla interrumpiendo lo que estaba leyendo.
      role={tone === "destructive" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border p-3 md:p-4", wrapper, className)}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
