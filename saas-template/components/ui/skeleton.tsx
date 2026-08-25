import styles from "./skeleton.module.css";

interface SkeletonProps {
  /** Clases de Tailwind para tamaño y espaciado (ej. "h-4 w-32"). */
  className?: string;
}

/**
 * Placeholder de carga.
 *
 * EJEMPLO del patrón mixto que documenta la sección 6 de la arquitectura:
 * el layout (alto, ancho, márgenes) se controla con utilidades de Tailwind
 * desde fuera vía `className`, y solo la animación —que Tailwind no expresa
 * bien— vive en el CSS Module.
 */
export function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className}`} aria-hidden="true" />;
}
