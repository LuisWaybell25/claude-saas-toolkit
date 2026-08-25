import { NextResponse } from "next/server";

import { materialUpdateSchema } from "@/features/materiales/schemas";
import { deleteMaterial, updateMaterial } from "@/features/materiales/service";
import { handleApiError } from "@/lib/api-response";
import { getTenantContext } from "@/lib/tenant-context";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { tenantId } = await getTenantContext();
    const data = materialUpdateSchema.parse(await req.json());
    const material = await updateMaterial(params.id, tenantId, data);
    return NextResponse.json({ material });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { tenantId } = await getTenantContext();
    const result = await deleteMaterial(params.id, tenantId);

    if (result.softDeleted) {
      return NextResponse.json({
        material: result.material,
        note: "Este material ya se usó en registros existentes, así que se desactivó en vez de eliminarse.",
      });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
