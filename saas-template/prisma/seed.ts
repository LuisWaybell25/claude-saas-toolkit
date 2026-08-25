/**
 * Seed de desarrollo.
 *
 * OJO: crear un usuario aquí NO crea su identidad en Supabase Auth (eso
 * requiere la Admin API de Supabase o registrarse desde /signup). Este
 * seed sirve para poblar datos de catálogo de un tenant que ya existe.
 *
 * Flujo recomendado en local:
 *   1. Levanta la app y regístrate en /signup (crea Tenant + User reales).
 *   2. Copia el id del tenant desde Supabase o Prisma Studio.
 *   3. Pégalo abajo y corre: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TENANT_ID = process.env.SEED_TENANT_ID ?? "";

async function main() {
  if (!TENANT_ID) {
    console.error(
      "Define SEED_TENANT_ID con el id de un tenant existente antes de correr el seed."
    );
    process.exit(1);
  }

  await prisma.material.createMany({
    data: [
      { tenantId: TENANT_ID, name: "Material de ejemplo A", unit: "M2", baseCost: 85.0 },
      { tenantId: TENANT_ID, name: "Material de ejemplo B", unit: "UNIT", baseCost: 12.5 },
    ],
  });

  console.error(`Seed completo para el tenant ${TENANT_ID}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
