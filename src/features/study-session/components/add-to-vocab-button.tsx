import type { StudyCard } from '@/stores/study-session-context'
import { useAddToVocab } from '../api/use-add-to-vocab'
import { useRemoveFromVocab } from '../api/use-remove-from-vocab'
import { useVocabMembership } from '../api/use-vocab-membership'

export function AddToVocabButton({ card }: { card: StudyCard }) {
  const membership = useVocabMembership()
  const addToVocab = useAddToVocab()
  const removeFromVocab = useRemoveFromVocab()

  const isSaved = membership.data?.has(card.icelandicWord) ?? false
  const isPending = addToVocab.isPending || removeFromVocab.isPending

  function handleClick() {
    if (isSaved) {
      removeFromVocab.mutate(card.icelandicWord)
    } else {
      addToVocab.mutate(card)
    }
  }

  return (
    <button
      type="button"
      className="btn"
      disabled={membership.isPending || isPending}
      onClick={handleClick}
    >
      {isSaved ? 'Remove from Vocab' : 'Add to Vocab'}
    </button>
  )
}
