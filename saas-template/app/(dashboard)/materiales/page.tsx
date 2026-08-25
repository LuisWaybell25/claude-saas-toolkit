import { MaterialsTable } from "@/features/materiales/components/materials-table";

/**
 * MÓDULO DE EJEMPLO — bórralo cuando tengas tus propias pantallas.
 * Muestra dónde vive una página de feature en la estructura del proyecto.
 */
export default function MaterialesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Materiales</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Catálogo de ejemplo — muestra el patrón CRUD completo del template.
      </p>
      <MaterialsTable />
    </main>
  );
}
