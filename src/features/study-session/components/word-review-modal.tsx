import { useState } from 'react'
import { GrammarTableView } from './grammar-table'
import { WordVocabActions, type VocabActionWord } from './word-vocab-actions'

type Props = {
  word: VocabActionWord
  onClose: () => void
}

/**
 * A self-contained "look up this word" popup — used by both the vocab list
 * and any results/stats list, wherever a word can be clicked to see its
 * flip side again. Deliberately does not touch StudySessionContext: it's
 * layered on top of whatever page opened it (vocab list, deck results) via
 * local state only, so closing it never disturbs — or replaces — a real
 * deck session. Results metrics stay reserved for decks actually built
 * through the deck-builder screens.
 */
export function WordReviewModal({ word, onClose }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box relative flex max-w-md flex-col gap-4 pt-12 sm:max-w-3xl">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {!isFlipped ? (
          <button
            type="button"
            onClick={() => setIsFlipped(true)}
            className="bg-base-200 hover:border-primary flex min-h-48 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-transparent p-6 text-center transition-transform duration-150 hover:scale-[1.02]"
          >
            <span className="text-2xl font-semibold">{word.englishWord}</span>
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="cursor-pointer text-left text-xl font-semibold"
            >
              {word.englishWord}: {word.icelandicWord}
            </button>

            <GrammarTableView table={word.grammarTable} />

            <div className="flex justify-end">
              <WordVocabActions word={word} />
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
    </div>
  )
}
