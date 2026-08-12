import { createContext, useContext } from 'react'
import type { GrammarTable } from '@/features/word-generation'
import type { WordType } from '@/types/word'

export type CardResult = 'correct' | 'incorrect'

export type StudyCard = {
  id: string
  englishWord: string
  icelandicWord: string
  wordType: WordType
  grammarTable: GrammarTable
  result: CardResult | null
}

export type StudySource = 'random' | 'vocab' | 'missed'

export type StudySession = {
  cards: StudyCard[]
  currentIndex: number
  isFlipped: boolean
  frontLanguage: 'en' | 'is'
  source: StudySource
  wordTypes: WordType[]
  /** False while a deck is still streaming in more cards in the background. */
  isComplete: boolean
}

export type StudySessionContextValue = {
  session: StudySession | null
  startDeck: (
    cards: StudyCard[],
    source: StudySource,
    wordTypes: WordType[],
    isComplete: boolean,
  ) => void
  appendCard: (card: StudyCard) => void
  markComplete: () => void
  flipCard: () => void
  toggleFrontLanguage: () => void
  markResult: (result: CardResult) => void
  goToNextCard: () => void
  endSession: () => void
}

export const StudySessionContext =
  createContext<StudySessionContextValue | null>(null)

export function useStudySession(): StudySessionContextValue {
  const context = useContext(StudySessionContext)
  if (!context) {
    throw new Error(
      'useStudySession must be used within a StudySessionProvider',
    )
  }
  return context
}
