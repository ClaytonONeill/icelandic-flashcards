import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { StudySource } from '@/stores/study-session-context'
import type { WordType } from '@/types/word'
import { calculateDeckPoints } from '../utils/calculate-deck-points'

type CompleteDeckInput = {
  correct: number
  total: number
  wordTypes: WordType[]
  source: StudySource
}

async function completeDeck({
  correct,
  total,
  wordTypes,
  source,
}: CompleteDeckInput) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) throw new Error('Not signed in')

  const amount = calculateDeckPoints(correct, total)
  const { error } = await supabase.from('points_transactions').insert({
    user_id: userId,
    amount,
    reason: 'deck_completed',
    metadata: {
      correct,
      total,
      word_types: wordTypes,
      source,
      perfect: correct === total,
    },
  })
  if (error) throw error

  return amount
}

export function useCompleteDeck() {
  return useMutation({
    mutationFn: completeDeck,
  })
}
