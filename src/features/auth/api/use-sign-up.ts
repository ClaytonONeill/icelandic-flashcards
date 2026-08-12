import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type SignUpInput = {
  email: string
  password: string
}

async function signUp({ email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Without this, Supabase sends the confirmation link to whatever
    // "Site URL" is configured in the dashboard — a single fixed value that
    // can't be right for both local dev and the deployed site at once. This
    // makes the redirect match wherever the signup actually happened.
    // Supabase still requires this exact origin to be allow-listed under
    // Auth -> URL Configuration -> Redirect URLs, or it silently falls back
    // to the dashboard's Site URL instead.
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) throw error
  return data
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  })
}
