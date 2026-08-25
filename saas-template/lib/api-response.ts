import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UnauthenticatedError } from "./tenant-context";

/**
 * Traduce errores conocidos a respuestas HTTP consistentes, para no
 * repetir el mismo try/catch en cada route handler — y para no filtrar
 * detalles internos (stack traces, nombres de tabla) al cliente.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof UnauthenticatedError) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos.", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Errores de "no encontrado" lanzados por los servicios de features/,
  // y el P2025 que Prisma lanza cuando un update/delete no halla el registro.
  const name = error instanceof Error ? error.name : "";
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: string }).code
      : undefined;

  if (name === "NotFoundError" || code === "P2025") {
    return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
  }

  console.error(error);
  return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
}
