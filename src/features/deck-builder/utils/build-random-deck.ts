import { generateWord, formsToTable } from '@/features/word-generation'
import type { StudyCard } from '@/stores/study-session-context'
import type { WordType } from '@/types/word'

const DECK_SIZE = 20

// A handful of cards generate concurrently rather than all 20 at once — each
// card is up to 3 sequential network round-trips (translate, BÍN search,
// full-form fetch) to free, keyless third-party services with no documented
// rate limits, so a small bounded concurrency trades a meaningful speedup
// for not risking a burst getting throttled.
const CONCURRENCY = 3

/**
 * Builds a full 20-card deck by generating random words of the given types,
 * a few at a time. `onCard`, if given, fires as each card finishes (all
 * workers share one `seen` set, so word de-duplication covers the whole
 * deck regardless of which worker found it) — callers use this to start the
 * study session with the first few cards while the rest keep generating in
 * the background.
 */
export async function buildRandomDeck(
  wordTypes: WordType[],
  onCard?: (card: StudyCard) => void,
): Promise<StudyCard[]> {
  const cards: StudyCard[] = []
  const seen = new Set<string>()

  async function worker() {
    while (cards.length < DECK_SIZE) {
      const wordType = wordTypes[Math.floor(Math.random() * wordTypes.length)]
      const generated = await generateWord(wordType)

      // Re-check after the await — another worker may have filled the deck
      // (or found the same word) while this request was in flight.
      if (cards.length >= DECK_SIZE || seen.has(generated.icelandicWord)) {
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
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  return cards
}
