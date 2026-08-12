import { useStudySession } from '@/stores/study-session-context'

export function CorrectIncorrectButtons() {
  const { session, markResult } = useStudySession()
  if (!session) {
    return null
  }

  const card = session.cards[session.currentIndex]

  return (
    <div className="flex gap-3">
      <button
        type="button"
        aria-label="Mark correct"
        onClick={() => markResult('correct')}
        className={`btn btn-circle ${card.result === 'correct' ? 'btn-success' : 'btn-outline btn-success'}`}
      >
        ✓
      </button>
      <button
        type="button"
        aria-label="Mark incorrect"
        onClick={() => markResult('incorrect')}
        className={`btn btn-circle ${card.result === 'incorrect' ? 'btn-error' : 'btn-outline btn-error'}`}
      >
        ✕
      </button>
    </div>
  )
}
