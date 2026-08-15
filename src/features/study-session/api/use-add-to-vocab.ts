import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { StudyCard } from '@/stores/study-session-context'
import type { WordStrength } from '@/types/word'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'
import { VOCAB_MEMBERSHIP_QUERY_KEY } from './use-vocab-membership'

async function addToVocab(card: StudyCard) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) throw new Error('Not signed in')

  const { error } = await supabase.from('vocab_list').upsert(
    {
      user_id: userId,
      english_word: card.englishWord,
      icelandic_word: card.icelandicWord,
      word_type: card.wordType,
      dictionary_entry: card.grammarTable,
    },
    { onConflict: 'user_id,icelandic_word' },
  )
  if (error) throw error
}

export function useAddToVocab() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addToVocab,
    // Optimistic, same reasoning as use-update-strength.ts — makes the
    // Add/Remove toggle flip immediately instead of after a round-trip.
    onMutate: async (card) => {
      await queryClient.cancelQueries({ queryKey: VOCAB_MEMBERSHIP_QUERY_KEY })
      const previous = queryClient.getQueryData<
        Map<string, WordStrength | null>
      >(VOCAB_MEMBERSHIP_QUERY_KEY)
      if (previous) {
        const next = new Map(previous)
        next.set(card.icelandicWord, null)
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, next)
      }
      return { previous }
    },
    onError: (_error, _card, context) => {
      if (context?.previous) {
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_LIST_QUERY_PREFIX })
    },
  })
}
