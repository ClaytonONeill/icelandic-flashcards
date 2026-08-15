import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { WordStrength } from '@/types/word'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'

type UpdateStrengthInput = {
  icelandicWord: string
  strength: WordStrength | null
}

async function updateStrength({
  icelandicWord,
  strength,
}: UpdateStrengthInput) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) throw new Error('Not signed in')

  const { error } = await supabase
    .from('vocab_list')
    .update({ strength })
    .eq('user_id', userId)
    .eq('icelandic_word', icelandicWord)
  if (error) throw error
}

export function useUpdateStrength() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStrength,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_LIST_QUERY_PREFIX })
    },
  })
}
