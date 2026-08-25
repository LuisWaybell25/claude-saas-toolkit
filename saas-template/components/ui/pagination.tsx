"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Total de registros, para el texto "Mostrando X de Y". */
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize = 20,
}: PaginationProps) {
  const from = (page - 1) * pageSize + 1;
  const to = totalItems ? Math.min(page * pageSize, totalItems) : page * pageSize;

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center justify-between gap-3 md:flex-row"
    >
      {totalItems !== undefined && (
        <p className="text-sm text-muted-foreground">
          <span className="tabular">
            {from}–{to}
          </span>{" "}
          de <span className="tabular">{totalItems}</span>
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <span className="px-2 text-sm tabular text-muted-foreground">
          {page} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
