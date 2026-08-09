import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { StudyCard } from '@/stores/study-session-context'

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
  return useMutation({
    mutationFn: addToVocab,
  })
}
