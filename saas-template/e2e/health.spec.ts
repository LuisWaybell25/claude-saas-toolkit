import { test, expect } from "@playwright/test";

// Reemplaza esto por el flujo crítico real de tu SaaS en cuanto exista
// (ver docs/arquitectura-estandar.md sección 14). Este test solo prueba
// que el proyecto arranca.
test("la app responde", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveTitle(/error/i);
});
