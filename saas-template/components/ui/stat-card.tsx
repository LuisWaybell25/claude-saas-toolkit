import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  /** Cambio respecto al periodo anterior, ej. { value: "+8.5%", direction: "up" } */
  change?: { value: string; direction: "up" | "down"; caption?: string };
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Tarjeta de indicador (KPI).
 *
 * Nota sobre la dirección: "arriba" no siempre es bueno — gastos que suben
 * son malos. Por eso el color lo decide el llamador vía `direction`, no se
 * infiere del signo.
 */
export function StatCard({ label, value, change, icon, className, children }: StatCardProps) {
  const Arrow = change?.direction === "down" ? TrendingDown : TrendingUp;

  return (
    <Card className={cn("p-4 md:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            {icon}
          </div>
        )}
      </div>

      {change && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-xs font-medium",
            change.direction === "up" ? "text-success" : "text-destructive"
          )}
        >
          <Arrow className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="tabular">{change.value}</span>
          {change.caption && (
            <span className="font-normal text-muted-foreground">{change.caption}</span>
          )}
        </p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </Card>
  );
}
