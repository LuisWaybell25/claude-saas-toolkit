import { z } from "zod";

import { moneyAmountSchema } from "@/lib/validators";

export const measurementUnitEnum = z.enum(["UNIT", "M2", "LINEAR_METER", "HOUR"]);

export const materialCreateSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
  unit: measurementUnitEnum,
  baseCost: moneyAmountSchema,
  active: z.boolean().optional().default(true),
});

export const materialUpdateSchema = materialCreateSchema.partial();

export type MaterialCreateInput = z.infer<typeof materialCreateSchema>;
export type MaterialUpdateInput = z.infer<typeof materialUpdateSchema>;
