import { useState } from 'react'
import type { WordType } from '@/types/word'
import { WordTypePicker } from './word-type-picker'
import { BuildingDeckIndicator } from './building-deck-indicator'
import { useStartRandomDeck } from '../hooks/use-start-random-deck'

export function RandomDeckForm() {
  const [selected, setSelected] = useState<WordType[]>([])
  const { start, isBuilding, progress, error } = useStartRandomDeck()

  return (
    <div className="card bg-base-200 w-full max-w-md shadow-sm">
      <div className="card-body gap-4">
        <h2 className="card-title">Build Flashcard Deck</h2>
        <WordTypePicker selected={selected} onChange={setSelected} />
        {error && <p className="text-error text-sm">{error}</p>}
        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={selected.length === 0 || isBuilding}
          onClick={() => start(selected)}
        >
          {isBuilding ? <BuildingDeckIndicator progress={progress} /> : 'Go'}
        </button>
      </div>
    </div>
  )
}
