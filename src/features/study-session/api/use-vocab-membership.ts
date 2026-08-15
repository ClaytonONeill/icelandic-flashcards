import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { WordStrength } from '@/types/word'
import { VOCAB_LIST_QUERY_PREFIX } from './vocab-list-query-key'

export const VOCAB_MEMBERSHIP_QUERY_KEY = [
  ...VOCAB_LIST_QUERY_PREFIX,
  'membership',
]

/**
 * Icelandic word -> current strength (null = unassigned) for every word the
 * user has saved. A Map rather than a Set so both "is this saved?" and
 * "what's its current strength?" come from one shared, cached query —
 * used by AddToVocabButton (add vs. remove) and by anywhere that opens a
 * single-card review session and needs to know whether to show Strong/Mark
 * Weak or Add to Vocab.
 */
async function fetchVocabMembership(): Promise<
  Map<string, WordStrength | null>
> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) return new Map()

  const { data, error } = await supabase
    .from('vocab_list')
    .select('icelandic_word, strength')
    .eq('user_id', userId)
  if (error) throw error

  return new Map(data.map((row) => [row.icelandic_word, row.strength]))
}

export function useVocabMembership() {
  return useQuery({
    queryKey: VOCAB_MEMBERSHIP_QUERY_KEY,
    queryFn: fetchVocabMembership,
  })
}
