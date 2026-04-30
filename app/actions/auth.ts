'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(params: {
  email: string
  password: string
  next?: string
}): Promise<{ error: string }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })
  if (error) {
    return { error: error.message }
  }
  // Only honor same-origin next values; reject anything starting with // or a scheme.
  const destination = params.next?.startsWith('/') && !params.next.startsWith('//') ? params.next : '/'
  redirect(destination)
}

export async function signup(params: {
  email: string
  password: string
}): Promise<{ error: string } | { success: true }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp(params)
  if (error) {
    return { error: error.message }
  }
  return { success: true }
}
