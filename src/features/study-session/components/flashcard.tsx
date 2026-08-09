import { useStudySession } from '@/stores/study-session-context'
import { EnIsToggle } from './en-is-toggle'
import { GrammarTableView } from './grammar-table'
import { CorrectIncorrectButtons } from './correct-incorrect-buttons'
import { VocabActions } from './vocab-actions'

type Props = {
  onFinish: () => void
}

export function Flashcard({ onFinish }: Props) {
  const { session, flipCard, goToNextCard } = useStudySession()
  if (!session) {
    return null
  }

  const card = session.cards[session.currentIndex]
  const isAtFrontier = session.currentIndex === session.cards.length - 1
  const isWaitingForMore = isAtFrontier && !session.isComplete
  const isLastCard = isAtFrontier && session.isComplete
  const frontWord =
    session.frontLanguage === 'en' ? card.englishWord : card.icelandicWord
  const flippedHeader =
    session.frontLanguage === 'en'
      ? `${card.englishWord}: ${card.icelandicWord}`
      : `${card.icelandicWord}: ${card.englishWord}`

  function handleNext() {
    if (isLastCard) {
      onFinish()
    } else {
      goToNextCard()
    }
  }

  const isNextDisabled = isWaitingForMore || card.result === null

  return (
    <div className="flex w-full max-w-md flex-col gap-4 sm:max-w-3xl">
      <div className="flex items-center justify-between">
        <button type="button" className="btn btn-sm" onClick={onFinish}>
          Exit Deck
        </button>
        <EnIsToggle />
      </div>

      {!session.isFlipped ? (
        <button
          type="button"
          onClick={flipCard}
          className="card bg-base-200 hover:border-primary flex min-h-64 w-full cursor-pointer items-center justify-center border-2 border-transparent p-6 text-center shadow-sm transition-transform duration-150 hover:scale-[1.02]"
        >
          <span className="text-2xl font-semibold">{frontWord}</span>
        </button>
      ) : (
        <div className="card bg-base-200 w-full min-w-0 gap-4 p-6 shadow-sm">
          <button
            type="button"
            onClick={flipCard}
            className="cursor-pointer text-left text-xl font-semibold"
          >
            {flippedHeader}
          </button>

          <GrammarTableView table={card.grammarTable} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <CorrectIncorrectButtons />
            <div className="flex gap-2">
              <VocabActions />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                {isWaitingForMore ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : isLastCard ? (
                  'Finish'
                ) : (
                  'Next Card'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
