import { cn } from "@/lib/utils";

/** Indicador de carga. Siempre acompáñalo de texto para lectores de pantalla. */
export function Spinner({
  className,
  label = "Cargando",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span
        className={cn(
          "h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary",
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
