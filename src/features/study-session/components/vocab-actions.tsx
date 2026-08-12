import { useStudySession } from '@/stores/study-session-context'
import { AddToVocabButton } from './add-to-vocab-button'

// Decks sourced from the vocab list itself get Strong/Mark Weak buttons here
// instead — that lands with the vocab-list feature, which is what actually
// produces source: 'vocab' sessions.
export function VocabActions() {
  const { session } = useStudySession()
  if (!session || session.source === 'vocab') {
    return null
  }

  const card = session.cards[session.currentIndex]
  return <AddToVocabButton card={card} />
}
