import { useReducer, type ReactNode } from 'react'
import type { WordType } from '@/types/word'
import {
  StudySessionContext,
  type CardResult,
  type StudyCard,
  type StudySession,
  type StudySource,
} from './study-session-context'

type State = StudySession | null

type Action =
  | {
      type: 'start'
      cards: StudyCard[]
      source: StudySource
      wordTypes: WordType[]
      isComplete: boolean
    }
  | { type: 'append-card'; card: StudyCard }
  | { type: 'mark-complete' }
  | { type: 'flip' }
  | { type: 'toggle-front-language' }
  | { type: 'mark-result'; result: CardResult }
  | { type: 'next-card' }
  | { type: 'end' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return {
        cards: action.cards,
        currentIndex: 0,
        isFlipped: false,
        frontLanguage: 'en',
        source: action.source,
        wordTypes: action.wordTypes,
        isComplete: action.isComplete,
      }
    case 'append-card':
      return state && { ...state, cards: [...state.cards, action.card] }
    case 'mark-complete':
      return state && { ...state, isComplete: true }
    case 'flip':
      return state && { ...state, isFlipped: !state.isFlipped }
    case 'toggle-front-language':
      return (
        state && {
          ...state,
          frontLanguage: state.frontLanguage === 'en' ? 'is' : 'en',
        }
      )
    case 'mark-result':
      return (
        state && {
          ...state,
          cards: state.cards.map((card, index) =>
            index === state.currentIndex
              ? { ...card, result: action.result }
              : card,
          ),
        }
      )
    case 'next-card':
      return (
        state && {
          ...state,
          currentIndex: Math.min(
            state.currentIndex + 1,
            state.cards.length - 1,
          ),
          isFlipped: false,
        }
      )
    case 'end':
      return null
  }
}

export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null)

  return (
    <StudySessionContext.Provider
      value={{
        session: state,
        startDeck: (cards, source, wordTypes, isComplete) =>
          dispatch({ type: 'start', cards, source, wordTypes, isComplete }),
        appendCard: (card) => dispatch({ type: 'append-card', card }),
        markComplete: () => dispatch({ type: 'mark-complete' }),
        flipCard: () => dispatch({ type: 'flip' }),
        toggleFrontLanguage: () => dispatch({ type: 'toggle-front-language' }),
        markResult: (result) => dispatch({ type: 'mark-result', result }),
        goToNextCard: () => dispatch({ type: 'next-card' }),
        endSession: () => dispatch({ type: 'end' }),
      }}
    >
      {children}
    </StudySessionContext.Provider>
  )
}
