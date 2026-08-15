import { useStudySession } from '@/stores/study-session-context'
import { WordVocabActions } from './word-vocab-actions'

export function VocabActions() {
  const { session } = useStudySession()
  if (!session) {
    return null
  }

  const card = session.cards[session.currentIndex]
  return <WordVocabActions word={card} />
}
