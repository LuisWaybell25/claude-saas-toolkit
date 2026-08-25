import { LayoutGrid, Package, Palette } from "lucide-react";

import { AppShell, type NavItem } from "@/components/layout/app-shell";

// Los elementos de navegación cambian por producto; el shell no.
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: <LayoutGrid className="h-4 w-4" /> },
  { href: "/materiales", label: "Materiales", icon: <Package className="h-4 w-4" /> },
  { href: "/design-system", label: "Design system", icon: <Palette className="h-4 w-4" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={NAV_ITEMS} productName="[NOMBRE_DEL_SAAS]">
      {children}
    </AppShell>
  );
}
