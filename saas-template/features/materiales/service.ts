import { prisma } from "@/lib/prisma";

import type { MaterialCreateInput, MaterialUpdateInput } from "./schemas";

/**
 * MÓDULO DE EJEMPLO — referencia viva del patrón CRUD de catálogo.
 * Ver .claude/skills/nuevo-modulo-crud/SKILL.md para replicarlo.
 *
 * Regla que se repite en TODAS las funciones de este archivo: el tenantId
 * siempre entra como parámetro explícito y siempre aparece en el `where`.
 * Ninguna función de servicio debe poder ejecutarse "sin tenant".
 */

export class NotFoundError extends Error {
  constructor(message = "Registro no encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function listMaterials(tenantId: string) {
  return prisma.material.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createMaterial(tenantId: string, data: MaterialCreateInput) {
  return prisma.material.create({
    data: { ...data, tenantId },
  });
}

/**
 * Verifica que el registro exista Y pertenezca a este tenant antes de
 * dejar que nadie lo toque. Nunca hagas update/delete por id solo: sin
 * esta verificación, adivinar un id permitiría editar datos ajenos.
 */
export async function assertMaterialOwnership(id: string, tenantId: string) {
  const existing = await prisma.material.findFirst({ where: { id, tenantId } });
  if (!existing) {
    throw new NotFoundError("Material no encontrado.");
  }
  return existing;
}

export async function updateMaterial(id: string, tenantId: string, data: MaterialUpdateInput) {
  await assertMaterialOwnership(id, tenantId);
  return prisma.material.update({ where: { id }, data });
}

/**
 * Soft-delete condicional: si el registro ya fue usado en transacciones
 * históricas, desactivarlo en vez de borrarlo preserva la integridad de
 * esos registros pasados.
 *
 * NOTA: en este template Material no tiene tablas que lo referencien, así
 * que siempre borra. Cuando tu entidad SÍ tenga referencias (cotizaciones,
 * pedidos...), descomenta el bloque de abajo y ajústalo.
 */
export type DeleteMaterialResult =
  | { softDeleted: true; material: { id: string; active: boolean } }
  | { softDeleted: false };

export async function deleteMaterial(
  id: string,
  tenantId: string
): Promise<DeleteMaterialResult> {
  await assertMaterialOwnership(id, tenantId);

  // const referenced = await prisma.<tablaQueReferencia>.findFirst({
  //   where: { materialId: id },
  //   select: { id: true },
  // });
  //
  // if (referenced) {
  //   const material = await prisma.material.update({
  //     where: { id },
  //     data: { active: false },
  //   });
  //   return { softDeleted: true, material };
  // }

  await prisma.material.delete({ where: { id } });
  return { softDeleted: false };
}
