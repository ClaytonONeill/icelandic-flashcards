import { WORD_TYPES, type WordType } from '@/types/word'

const LABELS: Record<WordType, string> = {
  noun: 'Nouns',
  adjective: 'Adjectives',
  adverb: 'Adverbs',
  verb: 'Verbs',
  conjunction: 'Conjunctions',
  preposition: 'Prepositions',
  interjection: 'Interjections',
}

type Props = {
  selected: WordType[]
  onChange: (selected: WordType[]) => void
  /** Restrict the choices shown, e.g. to types actually present in the vocab list. */
  availableTypes?: readonly WordType[]
}

export function WordTypePicker({
  selected,
  onChange,
  availableTypes = WORD_TYPES,
}: Props) {
  function toggle(type: WordType) {
    onChange(
      selected.includes(type)
        ? selected.filter((t) => t !== type)
        : [...selected, type],
    )
  }

  function selectAll() {
    onChange(
      selected.length === availableTypes.length ? [] : [...availableTypes],
    )
  }

  function selectRandomOne() {
    // Prefer a type that isn't already selected, so clicking Random again
    // when one type is already picked visibly changes something instead of
    // occasionally re-picking the same one by chance.
    const pool = availableTypes.filter((type) => !selected.includes(type))
    const candidates = pool.length > 0 ? pool : availableTypes
    const random = candidates[Math.floor(Math.random() * candidates.length)]
    onChange([random])
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {availableTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => toggle(type)}
          className={`btn ${selected.includes(type) ? 'btn-primary' : 'btn-outline'}`}
        >
          {LABELS[type]}
        </button>
      ))}
      <button
        type="button"
        onClick={selectAll}
        className={`btn ${selected.length === availableTypes.length ? 'btn-primary' : 'btn-outline'}`}
      >
        All
      </button>
      <button
        type="button"
        onClick={selectRandomOne}
        className="btn btn-outline"
      >
        Random
      </button>
    </div>
  )
}
