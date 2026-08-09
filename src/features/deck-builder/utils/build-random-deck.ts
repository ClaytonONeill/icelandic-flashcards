import { generateWord, formsToTable } from '@/features/word-generation'
import type { StudyCard } from '@/stores/study-session-context'
import type { WordType } from '@/types/word'

const DECK_SIZE = 20

/**
 * Builds a full 20-card deck by generating random words of the given types
 * one at a time (not in parallel — the translate/dictionary APIs are free,
 * keyless services with no documented rate limits, so bursting them with
 * concurrent requests is avoided in favor of simple sequential calls).
 *
 * `onCard`, if given, fires as each card finishes generating (in the same
 * single pass, so word de-duplication naturally covers the whole deck) —
 * callers use this to start the study session with the first few cards
 * while the rest keep generating in the background, since a full 20-card
 * sequential generation can take a while.
 */
export async function buildRandomDeck(
  wordTypes: WordType[],
  onCard?: (card: StudyCard) => void,
): Promise<StudyCard[]> {
  const cards: StudyCard[] = []
  const seen = new Set<string>()

  while (cards.length < DECK_SIZE) {
    const wordType = wordTypes[Math.floor(Math.random() * wordTypes.length)]
    const generated = await generateWord(wordType)
    if (seen.has(generated.icelandicWord)) {
      continue
    }
    seen.add(generated.icelandicWord)

    const card: StudyCard = {
      id: generated.icelandicWord,
      englishWord: generated.englishWord,
      icelandicWord: generated.icelandicWord,
      wordType: generated.wordType,
      grammarTable: formsToTable(generated.wordType, generated.forms),
      result: null,
    }
    cards.push(card)
    onCard?.(card)
  }

  return cards
}
