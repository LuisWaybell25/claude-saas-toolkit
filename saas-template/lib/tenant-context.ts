import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * Resuelve el tenant y usuario autenticado de la request actual, a partir
 * de la sesión real de Supabase.
 *
 * ESTE ES EL ÚNICO LUGAR donde se determina "quién está pidiendo esto".
 * Ningún route handler debe leer un tenantId del body, del query string,
 * ni de un header controlado por el cliente — hacerlo permitiría que
 * cualquiera lea datos de otro tenant simplemente mandando otro id.
 *
 * `cache()` de React deduplica la llamada dentro de una misma request:
 * aunque tres funciones distintas la llamen, solo se consulta una vez.
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}

export class UnauthenticatedError extends Error {
  constructor(message = "No hay sesión activa.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export const getTenantContext = cache(async (): Promise<TenantContext> => {
  const supabase = createClient();

  // getUser() revalida el token contra Supabase. No uses getSession() aquí:
  // esa confía en la cookie sin verificarla del lado del servidor.
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new UnauthenticatedError();
  }

  // El usuario de Supabase Auth se enlaza con nuestra tabla User mediante
  // authUserId — ahí es donde vive la pertenencia al tenant y el rol.
  const user = await prisma.user.findUnique({
    where: { authUserId: authUser.id },
    select: { id: true, tenantId: true, email: true, role: true, active: true },
  });

  if (!user || !user.active) {
    throw new UnauthenticatedError("El usuario no está activo o no pertenece a ningún tenant.");
  }

  return {
    tenantId: user.tenantId,
    userId: user.id,
    email: user.email,
    role: user.role,
  };
});

/** Igual que getTenantContext, pero exige rol ADMIN. */
export async function requireAdmin(): Promise<TenantContext> {
  const ctx = await getTenantContext();
  if (ctx.role !== "ADMIN") {
    throw new UnauthenticatedError("Se requiere rol de administrador.");
  }
  return ctx;
}
