import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { WordStrength } from '@/types/word'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'
import { VOCAB_MEMBERSHIP_QUERY_KEY } from './use-vocab-membership'

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
    // Optimistic, same reasoning as use-update-strength.ts — makes the
    // Add/Remove toggle flip immediately instead of after a round-trip.
    onMutate: async (icelandicWord) => {
      await queryClient.cancelQueries({ queryKey: VOCAB_MEMBERSHIP_QUERY_KEY })
      const previous = queryClient.getQueryData<
        Map<string, WordStrength | null>
      >(VOCAB_MEMBERSHIP_QUERY_KEY)
      if (previous) {
        const next = new Map(previous)
        next.delete(icelandicWord)
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, next)
      }
      return { previous }
    },
    onError: (_error, _icelandicWord, context) => {
      if (context?.previous) {
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_LIST_QUERY_PREFIX })
    },
  })
}
