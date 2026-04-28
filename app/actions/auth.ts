"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(params: {
  email: string;
  password: string;
}): Promise<{ error: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(params);
  if (error) {
    return { error: error.message };
  }
  redirect("/dashboard");
}

export async function signup(params: {
  email: string;
  password: string;
}): Promise<{ error: string } | { success: true }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp(params);
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
