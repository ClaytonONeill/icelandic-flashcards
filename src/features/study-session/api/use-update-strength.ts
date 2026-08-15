import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { WordStrength } from '@/types/word'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'
import { VOCAB_MEMBERSHIP_QUERY_KEY } from './use-vocab-membership'

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
    // Optimistic: the membership cache drives the Strong/Mark Weak button
    // colors, and those buttons are disabled while a request is in flight —
    // without this, the round-trip meant both buttons briefly went gray
    // (their disabled look) before flipping to the right color once the
    // query refetched. Writing the new value in immediately makes the color
    // change instant instead of round-trip-dependent.
    onMutate: async ({ icelandicWord, strength }) => {
      await queryClient.cancelQueries({ queryKey: VOCAB_MEMBERSHIP_QUERY_KEY })
      const previous = queryClient.getQueryData<
        Map<string, WordStrength | null>
      >(VOCAB_MEMBERSHIP_QUERY_KEY)
      if (previous) {
        const next = new Map(previous)
        next.set(icelandicWord, strength)
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, next)
      }
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(VOCAB_MEMBERSHIP_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_LIST_QUERY_PREFIX })
    },
  })
}
