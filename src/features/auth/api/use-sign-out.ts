import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  })
}
