import { NextResponse } from "next/server";

import { materialCreateSchema } from "@/features/materiales/schemas";
import { createMaterial, listMaterials } from "@/features/materiales/service";
import { handleApiError } from "@/lib/api-response";
import { getTenantContext } from "@/lib/tenant-context";

/**
 * MÓDULO DE EJEMPLO. Nota lo delgado que es este archivo: resuelve el
 * tenant, valida la entrada, delega al servicio, y traduce errores.
 * Ninguna regla de negocio ni query de Prisma vive aquí.
 */

export async function GET() {
  try {
    const { tenantId } = await getTenantContext();
    const materials = await listMaterials(tenantId);
    return NextResponse.json({ materials });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { tenantId } = await getTenantContext();
    const data = materialCreateSchema.parse(await req.json());
    const material = await createMaterial(tenantId, data);
    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
