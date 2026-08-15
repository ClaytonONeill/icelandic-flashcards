import type { GrammarTable } from '@/features/word-generation'
import type { WordStrength, WordType } from '@/types/word'
import { AddToVocabButton } from './add-to-vocab-button'
import { useUpdateStrength } from '../api/use-update-strength'
import { useVocabMembership } from '../api/use-vocab-membership'

export type VocabActionWord = {
  englishWord: string
  icelandicWord: string
  wordType: WordType
  grammarTable: GrammarTable
}

/**
 * Add-to-vocab vs. Strong/Mark Weak, decided by whether this word is
 * actually saved right now (via the shared membership query) rather than by
 * which screen it's rendered on — a word studied mid-random-deck that
 * happens to already be saved still gets the Strong/Weak controls.
 */
export function WordVocabActions({ word }: { word: VocabActionWord }) {
  const membership = useVocabMembership()
  const updateStrength = useUpdateStrength()

  const isSaved = membership.data?.has(word.icelandicWord) ?? false
  const strength = membership.data?.get(word.icelandicWord) ?? null

  if (!isSaved) {
    return (
      <AddToVocabButton
        card={{
          id: word.icelandicWord,
          englishWord: word.englishWord,
          icelandicWord: word.icelandicWord,
          wordType: word.wordType,
          grammarTable: word.grammarTable,
          result: null,
        }}
      />
    )
  }

  function setStrength(next: WordStrength | null) {
    updateStrength.mutate({ icelandicWord: word.icelandicWord, strength: next })
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`btn ${strength === 'strong' ? 'btn-success' : 'btn-outline'}`}
        disabled={updateStrength.isPending}
        onClick={() => setStrength(strength === 'strong' ? null : 'strong')}
      >
        Strong
      </button>
      <button
        type="button"
        className={`btn ${strength === 'weak' ? 'btn-error' : 'btn-outline'}`}
        disabled={updateStrength.isPending}
        onClick={() => setStrength(strength === 'weak' ? null : 'weak')}
      >
        Mark Weak
      </button>
    </div>
  )
}
