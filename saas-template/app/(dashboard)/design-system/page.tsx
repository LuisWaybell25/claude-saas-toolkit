"use client";

import { FileText, MoreHorizontal, Package, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Progress, StackedProgress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableNumericCell,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const TOKENS = [
  ["primary", "Primario"],
  ["success", "Éxito"],
  ["warning", "Advertencia"],
  ["destructive", "Peligro"],
  ["info", "Información"],
  ["muted", "Apagado"],
];

const FILAS = [
  { folio: "COT-2026-0012", cliente: "Rótulos del Bajío", estado: "Pagada", monto: 18450.0 },
  { folio: "COT-2026-0013", cliente: "Gráfica Central", estado: "Pendiente", monto: 7320.5 },
  { folio: "COT-2026-0014", cliente: "Impresos del Valle", estado: "Vencida", monto: 2980.0 },
];

const TONO_ESTADO = { Pagada: "success", Pendiente: "warning", Vencida: "destructive" } as const;

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Design system"
        description="Catálogo de componentes compartidos. Cambia de tema arriba para ver ambos modos."
        actions={<Button variant="outline">Ver documentación</Button>}
      />

      <div className="space-y-10">
        <Seccion titulo="Colores">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {TOKENS.map(([name, label]) => (
              <div key={name} className="space-y-1.5">
                <div
                  className="h-14 rounded-md border border-border"
                  style={{ backgroundColor: `hsl(var(--${name}))` }}
                />
                <p className="text-xs font-medium">{label}</p>
                <p className="font-mono text-2xs text-muted-foreground">--{name}</p>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Indicadores">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Ingresos del mes"
              value="$142,380"
              change={{ value: "+8.5%", direction: "up", caption: "vs. mes anterior" }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatCard
              label="Cotizaciones activas"
              value="34"
              change={{ value: "-3", direction: "down", caption: "esta semana" }}
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard label="Clientes" value="128" icon={<Users className="h-4 w-4" />}>
              <StackedProgress
                segments={[
                  { value: 45, tone: "primary", label: "Activos" },
                  { value: 30, tone: "success", label: "Nuevos" },
                  { value: 25, tone: "warning", label: "Inactivos" },
                ]}
              />
            </StatCard>
          </div>
        </Seccion>

        <Seccion titulo="Botones">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Guardar cambios</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="outline">Exportar</Button>
            <Button variant="ghost">Ver detalle</Button>
            <Button variant="destructive">Eliminar</Button>
            <Button loading>Guardando</Button>
            <Button disabled>Sin permisos</Button>
            <Button size="sm">Pequeño</Button>
            <Button size="lg">Grande</Button>
          </div>
        </Seccion>

        <Seccion titulo="Formularios">
          <Card>
            <CardContent className="grid gap-4 pt-4 md:grid-cols-2 md:pt-5">
              <Input name="material" label="Nombre del material" placeholder="Ej. Vinil impreso" />
              <Input
                name="costo"
                label="Costo por m²"
                type="number"
                hint="Antes de impuestos, en pesos."
              />
              <Field htmlFor="unidad" label="Unidad de medida" required>
                <Select>
                  <SelectTrigger id="unidad">
                    <SelectValue placeholder="Selecciona una unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m2">Metro cuadrado</SelectItem>
                    <SelectItem value="ml">Metro lineal</SelectItem>
                    <SelectItem value="pieza">Pieza</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Input
                name="correo"
                label="Correo"
                defaultValue="correo-invalido"
                error="Escribe un correo válido, como nombre@empresa.com"
              />
              <Field htmlFor="notas" label="Notas" className="md:col-span-2">
                <Textarea id="notas" placeholder="Especificaciones técnicas del material…" />
              </Field>
              <div className="flex items-center gap-2">
                <Checkbox id="activo" defaultChecked />
                <Label htmlFor="activo">Material activo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="destacado" />
                <Label htmlFor="destacado">Mostrar como destacado</Label>
              </div>
            </CardContent>
          </Card>
        </Seccion>

        <Seccion titulo="Mensajes">
          <div className="space-y-2">
            <Alert tone="success" title="Cotización enviada">
              El cliente la recibió por WhatsApp hace unos segundos.
            </Alert>
            <Alert tone="warning" title="Sin respuesta desde hace 48 horas">
              Tres cotizaciones enviadas siguen sin actualizarse.
            </Alert>
            <Alert tone="destructive" title="No se pudo guardar">
              El costo por m² debe ser mayor a cero.
            </Alert>
            <Alert tone="info">Los precios se recalculan al cambiar el margen general.</Alert>
          </div>
        </Seccion>

        <Seccion titulo="Progreso y carga">
          <Card>
            <CardContent className="space-y-4 pt-4 md:pt-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Producción</span>
                  <span className="tabular text-muted-foreground">72%</span>
                </div>
                <Progress value={72} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Entregado</span>
                  <span className="tabular text-muted-foreground">100%</span>
                </div>
                <Progress value={100} tone="success" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Cancelado</span>
                  <span className="tabular text-muted-foreground">35%</span>
                </div>
                <Progress value={35} tone="destructive" />
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner />
                Cargando datos del catálogo…
              </div>
            </CardContent>
          </Card>
        </Seccion>

        <Seccion titulo="Pestañas, menús y diálogos">
          <Card>
            <CardContent className="pt-4 md:pt-5">
              <Tabs defaultValue="general">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="precios">Precios</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Abrir diálogo</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Eliminar material</DialogTitle>
                          <DialogDescription>
                            Este material se usó en cotizaciones anteriores, así que se desactivará
                            en vez de borrarse. El historial no cambia.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="secondary">Cancelar</Button>
                          <Button variant="destructive">Desactivar material</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Más acciones">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>LM</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">Luis M.</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="precios">
                  <p className="text-sm text-muted-foreground">Contenido de la pestaña Precios.</p>
                </TabsContent>
                <TabsContent value="historial">
                  <p className="text-sm text-muted-foreground">Contenido de la pestaña Historial.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Seccion>

        <Seccion titulo="Tabla de datos">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones recientes</CardTitle>
              <CardDescription>Las cifras usan números tabulares para que cuadren.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FILAS.map((fila) => (
                    <TableRow key={fila.folio}>
                      <TableCell className="font-mono text-xs">{fila.folio}</TableCell>
                      <TableCell>{fila.cliente}</TableCell>
                      <TableCell>
                        <Badge tone={TONO_ESTADO[fila.estado as keyof typeof TONO_ESTADO]}>
                          {fila.estado}
                        </Badge>
                      </TableCell>
                      <TableNumericCell>
                        $
                        {fila.monto.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableNumericCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                pageCount={5}
                onPageChange={setPage}
                totalItems={87}
                pageSize={20}
              />
            </CardContent>
          </Card>
        </Seccion>

        <Seccion titulo="Estado vacío">
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title="Aún no hay materiales en el catálogo"
            description="Agrega tu primer material para empezar a cotizar. Puedes cambiar costos y unidades después."
            action={<Button>Agregar material</Button>}
          />
        </Seccion>
      </div>
    </div>
  );
}
