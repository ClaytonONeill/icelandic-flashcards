import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'

async function removeFromVocab(icelandicWord: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) throw new Error('Not signed in')

  const { error } = await supabase
    .from('vocab_list')
    .delete()
    .eq('user_id', userId)
    .eq('icelandic_word', icelandicWord)
  if (error) throw error
}

export function useRemoveFromVocab() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeFromVocab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_LIST_QUERY_PREFIX })
    },
  })
}
