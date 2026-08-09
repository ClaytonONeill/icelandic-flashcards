import { AddToVocabButton } from '@/features/study-session'
import type { StudyCard } from '@/stores/study-session-context'

type Props = {
  cards: StudyCard[]
}

export function ResultsList({ cards }: Props) {
  return (
    <ul className="flex max-h-80 w-full flex-col gap-2 overflow-y-auto">
      {cards.map((card) => (
        <li
          key={card.id}
          className="bg-base-200 flex flex-wrap items-center gap-2 rounded-lg p-2"
        >
          <span
            className={`inline-block h-3 w-3 shrink-0 rounded-full ${
              card.result === 'correct' ? 'bg-success' : 'bg-error'
            }`}
          />
          <span className="min-w-0 flex-1 truncate">{card.icelandicWord}</span>
          <span className="text-base-content/60 shrink-0 text-sm capitalize">
            {card.wordType}
          </span>
          <AddToVocabButton card={card} />
        </li>
      ))}
    </ul>
  )
}
