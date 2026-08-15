import type { VocabEntry } from '@/features/vocab-list'
import type { StudyCard } from '@/stores/study-session-context'
import type { WordStrength, WordType } from '@/types/word'

export type VocabDeckFilters = {
  wordTypes: WordType[]
  /** Empty = no strength filter (include everything, including unassigned). */
  strengths: WordStrength[]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function filterVocabEntries(
  entries: VocabEntry[],
  filters: VocabDeckFilters,
): VocabEntry[] {
  return entries.filter((entry) => {
    if (!filters.wordTypes.includes(entry.wordType)) {
      return false
    }
    if (
      filters.strengths.length > 0 &&
      (entry.strength === null || !filters.strengths.includes(entry.strength))
    ) {
      return false
    }
    return true
  })
}

/**
 * Builds a deck straight from the user's saved vocab list — unlike
 * buildRandomDeck, this is a pure, synchronous filter + shuffle over
 * already-fetched entries (no generation, no network calls), and the deck
 * size is simply how many words match rather than a fixed 20.
 */
export function buildVocabDeck(
  entries: VocabEntry[],
  filters: VocabDeckFilters,
): StudyCard[] {
  return shuffle(filterVocabEntries(entries, filters)).map((entry) => ({
    id: entry.id,
    englishWord: entry.englishWord,
    icelandicWord: entry.icelandicWord,
    wordType: entry.wordType,
    grammarTable: entry.grammarTable,
    result: null,
  }))
}
