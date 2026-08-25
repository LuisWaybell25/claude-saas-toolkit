"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createTenantWithOwner } from "@/features/tenant-onboarding/service";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const signupSchema = z.object({
  businessName: z.string().trim().min(2, "El nombre del negocio es requerido").max(160),
  userName: z.string().trim().min(2, "Tu nombre es requerido").max(120),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export interface ActionState {
  error?: string;
  success?: string;
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mensaje genérico a propósito: distinguir "email no existe" de
    // "contraseña incorrecta" permitiría enumerar cuentas registradas.
    return { error: "Email o contraseña incorrectos." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    businessName: formData.get("businessName"),
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = createClient();

  // 1. Crear la identidad en Supabase Auth (Supabase guarda la contraseña
  //    hasheada; nosotros nunca la vemos ni la almacenamos).
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "No se pudo crear la cuenta." };
  }

  // 2. Crear el Tenant y el User ADMIN en nuestra base de datos.
  try {
    await createTenantWithOwner({
      businessName: parsed.data.businessName,
      authUserId: data.user.id,
      email: parsed.data.email,
      userName: parsed.data.userName,
    });
  } catch {
    return {
      error:
        "Se creó tu acceso pero no se pudo configurar el negocio. Contacta a soporte para completarlo.",
    };
  }

  // Si tienes confirmación de email activada en Supabase, el usuario aún
  // no tiene sesión — se le pide confirmar antes de entrar.
  if (!data.session) {
    return { success: "Cuenta creada. Revisa tu correo para confirmar tu email." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
