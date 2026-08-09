import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudySession, type StudyCard } from '@/stores/study-session-context'
import type { WordType } from '@/types/word'
import { buildRandomDeck } from '../utils/build-random-deck'

export const INITIAL_BATCH_SIZE = 5

/**
 * Starts a random deck as soon as the first few cards are ready, then keeps
 * generating the rest in the background — a full 20-card generation is slow
 * enough (each card is a translate + dictionary lookup, sometimes several
 * retries) that waiting for all of it up front made the "Go" button feel
 * stuck.
 */
export function useStartRandomDeck() {
  const { startDeck, appendCard, markComplete } = useStudySession()
  const navigate = useNavigate()
  const [isBuilding, setIsBuilding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function start(wordTypes: WordType[]) {
    setIsBuilding(true)
    setProgress(0)
    setError(null)

    let started = false
    const initial: StudyCard[] = []

    try {
      await buildRandomDeck(wordTypes, (card) => {
        setProgress((count) => count + 1)
        if (!started) {
          initial.push(card)
          if (initial.length >= INITIAL_BATCH_SIZE) {
            started = true
            startDeck(initial, 'random', wordTypes, false)
            navigate('/study')
          }
        } else {
          appendCard(card)
        }
      })

      if (!started) {
        // Fewer than INITIAL_BATCH_SIZE cards total (shouldn't happen at the
        // fixed 20-card deck size, but handled rather than hanging forever).
        startDeck(initial, 'random', wordTypes, true)
        navigate('/study')
      } else {
        markComplete()
      }
    } catch (err) {
      if (started) {
        // Already studying a partial deck — end it there rather than
        // leaving the session stuck waiting for cards that will never
        // arrive.
        markComplete()
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Could not build a deck — try again.',
        )
      }
    } finally {
      setIsBuilding(false)
    }
  }

  return { start, isBuilding, progress, error }
}
