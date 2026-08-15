import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { GrammarTable } from '@/features/word-generation'
import type { WordStrength, WordType } from '@/types/word'

export type VocabEntry = {
  id: string
  englishWord: string
  icelandicWord: string
  wordType: WordType
  strength: WordStrength | null
  grammarTable: GrammarTable
}

const VOCAB_LIST_QUERY_KEY = ['vocab-list', 'entries']

async function fetchVocabList(): Promise<VocabEntry[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const userId = userData.user?.id
  if (!userId) return []

  const { data, error } = await supabase
    .from('vocab_list')
    .select(
      'icelandic_word, english_word, word_type, strength, dictionary_entry',
    )
    .eq('user_id', userId)
  if (error) throw error

  return data.map((row) => ({
    id: row.icelandic_word as string,
    englishWord: row.english_word as string,
    icelandicWord: row.icelandic_word as string,
    wordType: row.word_type as WordType,
    strength: row.strength as WordStrength | null,
    grammarTable: row.dictionary_entry as GrammarTable,
  }))
}

export function useVocabList() {
  return useQuery({
    queryKey: VOCAB_LIST_QUERY_KEY,
    queryFn: fetchVocabList,
  })
}
