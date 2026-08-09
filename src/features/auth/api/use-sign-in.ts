import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type SignInInput = {
  email: string
  password: string
}

async function signIn({ email, password }: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  })
}
