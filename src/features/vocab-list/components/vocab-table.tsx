import { useState } from 'react'
import { WordReviewModal } from '@/features/study-session'
import type { WordStrength, WordType } from '@/types/word'
import { useVocabList, type VocabEntry } from '../api/use-vocab-list'
import {
  useTable,
  type SortColumn,
  type StrengthFilter,
} from '../hooks/use-table'

const SORT_ARROW = { asc: '▲', desc: '▼' } as const

function StrengthDot({ strength }: { strength: WordStrength | null }) {
  const color =
    strength === 'strong'
      ? 'bg-success'
      : strength === 'weak'
        ? 'bg-error'
        : 'bg-base-300'
  return (
    <span
      className={`inline-block h-3 w-3 rounded-full ${color}`}
      aria-label={strength ?? 'unassigned'}
    />
  )
}

export function VocabTable() {
  const { data, isPending, error } = useVocabList()
  const entries = data ?? []
  const table = useTable(entries)
  const [reviewEntry, setReviewEntry] = useState<VocabEntry | null>(null)

  if (isPending) {
    return (
      <div className="flex w-full justify-center py-8">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }
  if (error) {
    return <p className="text-error">Could not load your vocab list.</p>
  }
  if (entries.length === 0) {
    return (
      <p className="text-base-content/60">
        Your vocab list is empty — add words while studying a deck.
      </p>
    )
  }

  const availableTypes = [
    ...new Set(entries.map((entry) => entry.wordType)),
  ].sort()

  function sortHeader(column: SortColumn, label: string) {
    return (
      <th
        className="cursor-pointer select-none"
        onClick={() => table.toggleSort(column)}
      >
        {label} {table.sortColumn === column && SORT_ARROW[table.sortDirection]}
      </th>
    )
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          placeholder="Search Vocab List…"
          className="input w-full sm:flex-1"
          value={table.search}
          onChange={(event) => table.setSearch(event.target.value)}
        />
        <select
          className="select w-full sm:w-auto"
          value={table.strengthFilter}
          onChange={(event) =>
            table.setStrengthFilter(event.target.value as StrengthFilter)
          }
        >
          <option value="all">All strengths</option>
          <option value="strong">Strong</option>
          <option value="weak">Weak</option>
          <option value="unassigned">Unassigned</option>
        </select>
        <select
          className="select w-full sm:w-auto"
          value={table.typeFilter}
          onChange={(event) =>
            table.setTypeFilter(event.target.value as WordType | 'all')
          }
        >
          <option value="all">All types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {sortHeader('strength', 'Strength')}
              {sortHeader('englishWord', 'Word')}
              {sortHeader('wordType', 'Type')}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-base-200 cursor-pointer"
                onClick={() => setReviewEntry(entry)}
              >
                <td>
                  <StrengthDot strength={entry.strength} />
                </td>
                <td>{entry.englishWord}</td>
                <td className="capitalize">{entry.wordType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.rows.length === 0 && (
        <p className="text-base-content/60 text-sm">
          No words match your filters.
        </p>
      )}

      {reviewEntry && (
        <WordReviewModal
          word={reviewEntry}
          onClose={() => setReviewEntry(null)}
        />
      )}
    </div>
  )
}
