"use server";

import { redirect } from "next/navigation";
import { cerrarSesion } from "@/lib/auth/session";

export async function logoutAction() {
  await cerrarSesion();
  redirect("/admin/login");
}
