import { useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  BuildingDeckIndicator,
  useStartRandomDeck,
} from '@/features/deck-builder'
import {
  ResultsList,
  ResultsSummary,
  useCompleteDeck,
} from '@/features/deck-results'
import { useStudySession, type StudyCard } from '@/stores/study-session-context'

export function StudyResultsRoute() {
  const { session, startDeck, endSession } = useStudySession()
  const navigate = useNavigate()
  const completeDeck = useCompleteDeck()
  const startRandomDeck = useStartRandomDeck()
  const hasRecorded = useRef(false)

  useEffect(() => {
    if (!session || hasRecorded.current) {
      return
    }
    hasRecorded.current = true
    const correct = session.cards.filter(
      (card) => card.result === 'correct',
    ).length
    completeDeck.mutate({
      correct,
      total: session.cards.length,
      wordTypes: session.wordTypes,
      source: session.source,
    })
    // completeDeck is a useMutation result and changes identity every
    // render — omitted deliberately so this only fires once per session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  if (!session) {
    return <Navigate to="/" replace />
  }

  const activeSession = session
  const correct = activeSession.cards.filter(
    (card) => card.result === 'correct',
  ).length
  const wrong = activeSession.cards.filter(
    (card) => card.result === 'incorrect',
  ).length

  function handleRetry() {
    startDeck(
      activeSession.cards.map((card) => ({ ...card, result: null })),
      activeSession.source,
      activeSession.wordTypes,
      true,
    )
    navigate('/study')
  }

  function handleNewDeckSameParameters() {
    startRandomDeck.start(activeSession.wordTypes)
  }

  function handleOnlyMissedWords() {
    const missed: StudyCard[] = activeSession.cards
      .filter((card) => card.result === 'incorrect')
      .map((card) => ({ ...card, result: null }))
    if (missed.length === 0) {
      return
    }
    startDeck(missed, 'missed', activeSession.wordTypes, true)
    navigate('/study')
  }

  function handleExit() {
    endSession()
    navigate('/')
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ResultsSummary correct={correct} wrong={wrong} />
      <ResultsList cards={activeSession.cards} />
      {startRandomDeck.error && (
        <p className="text-error text-sm">{startRandomDeck.error}</p>
      )}
      <div className="flex flex-col gap-2">
        <button type="button" className="btn" onClick={handleRetry}>
          Retry
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleNewDeckSameParameters}
          disabled={startRandomDeck.isBuilding}
        >
          {startRandomDeck.isBuilding ? (
            <BuildingDeckIndicator progress={startRandomDeck.progress} />
          ) : (
            'New Deck Same Parameters'
          )}
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleOnlyMissedWords}
          disabled={wrong === 0}
        >
          Only Missed Words
        </button>
        <button type="button" className="btn btn-outline" onClick={handleExit}>
          Exit
        </button>
      </div>
    </div>
  )
}

export default StudyResultsRoute
