import { NextResponse } from "next/server";

// Endpoint sin autenticación, solo para verificar que el despliegue
// responde. Útil para monitoreo básico (uptime checks).
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
