"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface Material {
  id: string;
  name: string;
  unit: string;
  baseCost: string;
  active: boolean;
}

const UNIT_LABELS: Record<string, string> = {
  UNIT: "pieza",
  M2: "m²",
  LINEAR_METER: "metro lineal",
  HOUR: "hora",
};

/**
 * MÓDULO DE EJEMPLO. Muestra el patrón de UI: fetch al montar, estados de
 * carga/error/vacío explícitos, y actualización optimista de la lista.
 */
export function MaterialsTable() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/materiales")
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo.");
        return res.json();
      })
      .then((data) => setMaterials(data.materials))
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (materials === null) return <p className="text-sm text-ink-faint">Cargando…</p>;

  if (materials.length === 0) {
    return (
      <div className="rounded border border-dashed border-line p-8 text-center">
        <p className="mb-3 text-sm text-ink-soft">Aún no hay materiales en el catálogo.</p>
        <Button>Agregar el primero</Button>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse overflow-hidden rounded border border-line text-sm">
      <thead>
        <tr className="border-b border-line bg-ink text-left text-paper">
          <th className="px-4 py-2 font-medium">Nombre</th>
          <th className="px-4 py-2 font-medium">Unidad</th>
          <th className="px-4 py-2 font-medium">Costo base</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((m) => (
          <tr key={m.id} className="border-b border-line last:border-0">
            <td className="px-4 py-2 text-ink">{m.name}</td>
            <td className="px-4 py-2 font-mono text-ink-soft">{UNIT_LABELS[m.unit] ?? m.unit}</td>
            <td className="px-4 py-2 font-mono text-ink">${Number(m.baseCost).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
