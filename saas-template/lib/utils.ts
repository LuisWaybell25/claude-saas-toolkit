import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind resolviendo conflictos.
 * `cn("px-2", "px-4")` devuelve "px-4", no ambas.
 * Es lo que permite que un componente acepte `className` desde fuera
 * y esa clase gane sobre el estilo por defecto.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
