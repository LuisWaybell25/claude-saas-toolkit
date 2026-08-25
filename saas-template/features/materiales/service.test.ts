import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  NotFoundError,
  assertMaterialOwnership,
  createMaterial,
  deleteMaterial,
  listMaterials,
  updateMaterial,
} from "./service";

// Mock de Prisma: probamos la LÓGICA del servicio (que siempre filtre por
// tenant), no la base de datos. Los tests contra una BD real van en e2e/.
const prismaMock = vi.hoisted(() => ({
  material: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const TENANT_A = "tenant-aaa";
const TENANT_B = "tenant-bbb";

describe("materiales · aislamiento entre tenants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ESTE ES EL TEST MÁS IMPORTANTE DE UN SAAS MULTI-TENANT.
  // Si alguna vez falla, es una fuga de datos entre clientes.
  it("listar siempre filtra por el tenant de la sesión", async () => {
    prismaMock.material.findMany.mockResolvedValue([]);

    await listMaterials(TENANT_A);

    expect(prismaMock.material.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tenantId: TENANT_A } })
    );
  });

  it("crear asigna el tenant de la sesión, no uno arbitrario", async () => {
    prismaMock.material.create.mockResolvedValue({ id: "m1" });

    await createMaterial(TENANT_A, { name: "Vinil", unit: "M2", baseCost: 85, active: true });

    expect(prismaMock.material.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ tenantId: TENANT_A }),
    });
  });

  it("rechaza editar un registro de OTRO tenant", async () => {
    // El registro existe, pero pertenece al tenant B: findFirst con
    // tenantId = A no lo encuentra.
    prismaMock.material.findFirst.mockResolvedValue(null);

    await expect(
      updateMaterial("material-de-tenant-b", TENANT_A, { name: "Hackeado" })
    ).rejects.toThrow(NotFoundError);

    expect(prismaMock.material.update).not.toHaveBeenCalled();
  });

  it("rechaza borrar un registro de OTRO tenant", async () => {
    prismaMock.material.findFirst.mockResolvedValue(null);

    await expect(deleteMaterial("material-de-tenant-b", TENANT_A)).rejects.toThrow(NotFoundError);

    expect(prismaMock.material.delete).not.toHaveBeenCalled();
  });

  it("la verificación de pertenencia consulta por id Y tenantId juntos", async () => {
    prismaMock.material.findFirst.mockResolvedValue({ id: "m1", tenantId: TENANT_B });

    await assertMaterialOwnership("m1", TENANT_B);

    expect(prismaMock.material.findFirst).toHaveBeenCalledWith({
      where: { id: "m1", tenantId: TENANT_B },
    });
  });
});
