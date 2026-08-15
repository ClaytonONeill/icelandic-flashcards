import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVocabList } from '@/features/vocab-list'
import { useStudySession } from '@/stores/study-session-context'
import type { WordStrength, WordType } from '@/types/word'
import { WordTypePicker } from './word-type-picker'
import { buildVocabDeck, filterVocabEntries } from '../utils/build-vocab-deck'

export function VocabDeckForm() {
  const { data } = useVocabList()
  const entries = data ?? []
  const [selectedTypes, setSelectedTypes] = useState<WordType[]>([])
  const [useWeak, setUseWeak] = useState(false)
  const [useStrong, setUseStrong] = useState(false)
  const { startDeck } = useStudySession()
  const navigate = useNavigate()

  const availableTypes = [...new Set(entries.map((entry) => entry.wordType))]
  const strengths: WordStrength[] = [
    ...(useWeak ? (['weak'] as const) : []),
    ...(useStrong ? (['strong'] as const) : []),
  ]
  const matchCount = filterVocabEntries(entries, {
    wordTypes: selectedTypes,
    strengths,
  }).length

  function handleGo() {
    const cards = buildVocabDeck(entries, {
      wordTypes: selectedTypes,
      strengths,
    })
    startDeck(cards, 'vocab', selectedTypes, true)
    navigate('/study')
  }

  return (
    <div className="card bg-base-200 w-full max-w-md shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Build Vocab Deck</h2>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigate('/vocab')}
          >
            Cancel
          </button>
        </div>

        <div className="flex gap-2">
          {/* Border color always matches the strength dot color used
              elsewhere (success = strong, error = weak) so these read as
              tied to that meaning whether toggled on or off, and stay
              visually distinct from the neutral word-type buttons below. */}
          <button
            type="button"
            className={`btn btn-outline btn-error flex-1 ${useWeak ? 'btn-active' : ''}`}
            onClick={() => setUseWeak((value) => !value)}
          >
            Use Weak Words
          </button>
          <button
            type="button"
            className={`btn btn-outline btn-success flex-1 ${useStrong ? 'btn-active' : ''}`}
            onClick={() => setUseStrong((value) => !value)}
          >
            Use Strong Words
          </button>
        </div>

        <WordTypePicker
          selected={selectedTypes}
          onChange={setSelectedTypes}
          availableTypes={availableTypes}
        />

        {selectedTypes.length > 0 && (
          <p className="text-base-content/60 text-sm">
            {matchCount} matching word{matchCount === 1 ? '' : 's'}
          </p>
        )}

        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={selectedTypes.length === 0 || matchCount === 0}
          onClick={handleGo}
        >
          Go
        </button>
      </div>
    </div>
  )
}
