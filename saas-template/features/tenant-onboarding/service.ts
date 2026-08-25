import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface CreateTenantInput {
  businessName: string;
  authUserId: string;
  email: string;
  userName: string;
}

/**
 * Crea un tenant nuevo junto con su primer usuario (siempre ADMIN).
 *
 * Va en una transacción a propósito: un Tenant sin usuario, o un User
 * huérfano sin tenant, dejarían la cuenta en un estado inservible del que
 * el usuario no podría salir solo. O se crean los dos, o ninguno.
 *
 * Este flujo es idéntico en cualquier SaaS de la plataforma — lo único
 * que suele cambiar es qué campos extra pide el formulario de registro.
 */
export async function createTenantWithOwner(input: CreateTenantInput) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const tenant = await tx.tenant.create({
      data: { businessName: input.businessName },
    });

    const user = await tx.user.create({
      data: {
        tenantId: tenant.id,
        authUserId: input.authUserId,
        email: input.email,
        name: input.userName,
        role: "ADMIN",
      },
    });

    return { tenant, user };
  });
}

/**
 * ¿Este usuario de Supabase Auth ya tiene un tenant asociado?
 * Se usa después del login para decidir si mandarlo al dashboard o a
 * completar su registro.
 */
export async function findTenantByAuthUserId(authUserId: string) {
  return prisma.user.findUnique({
    where: { authUserId },
    select: { tenantId: true, role: true, active: true },
  });
}
