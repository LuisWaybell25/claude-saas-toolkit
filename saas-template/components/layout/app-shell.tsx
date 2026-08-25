"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface AppShellProps {
  navItems: NavItem[];
  productName: string;
  children: ReactNode;
  /** Slot para el menú de usuario, notificaciones, etc. */
  topbarActions?: ReactNode;
}

/**
 * Estructura base del dashboard: barra lateral + barra superior + contenido.
 *
 * Comportamiento responsive (mobile-first):
 *   móvil     → la barra lateral es un cajón que se abre desde el botón de menú
 *   escritorio (lg) → la barra lateral es fija y el botón de menú desaparece
 *
 * Se comparte entre todos los SaaS de la plataforma; lo que cambia por
 * producto son los `navItems`, el nombre y los tokens de color.
 */
export function AppShell({ navItems, productName, children, topbarActions }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Navegar cierra el cajón: en móvil, quedarse abierto tapando el contenido
  // recién cargado es desorientador.
  useEffect(() => setDrawerOpen(false), [pathname]);

  // Escape cierra el cajón, como cualquier capa modal.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Salto de navegación para teclado y lectores de pantalla */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>

      {/* Fondo oscuro del cajón — solo móvil */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Barra lateral */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card",
          "transition-transform duration-200 lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Navegación principal"
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <span className="truncate font-semibold">{productName}</span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar navegación"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {/* Riel del elemento activo: marca la posición sin depender
                    solo del color de fondo. */}
                {active && (
                  <span
                    className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Columna de contenido */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir navegación"
            aria-expanded={drawerOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {topbarActions}
          </div>
        </header>

        <main id="contenido" className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
