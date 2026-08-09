import { useState } from 'react'
import type { StudyCard } from '@/stores/study-session-context'
import { useAddToVocab } from '../api/use-add-to-vocab'

export function AddToVocabButton({ card }: { card: StudyCard }) {
  const addToVocab = useAddToVocab()
  const [added, setAdded] = useState(false)

  return (
    <button
      type="button"
      className="btn"
      disabled={added || addToVocab.isPending}
      onClick={() =>
        addToVocab.mutate(card, { onSuccess: () => setAdded(true) })
      }
    >
      {added ? 'Added' : 'Add to Vocab'}
    </button>
  )
}
