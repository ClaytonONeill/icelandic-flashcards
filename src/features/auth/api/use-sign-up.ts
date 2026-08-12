import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type SignUpInput = {
  email: string
  password: string
}

async function signUp({ email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  })
}
