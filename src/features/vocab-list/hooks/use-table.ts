import { useMemo, useState } from 'react'
import type { WordStrength, WordType } from '@/types/word'
import type { VocabEntry } from '../api/use-vocab-list'

export type SortColumn = 'strength' | 'englishWord' | 'wordType'
export type SortDirection = 'asc' | 'desc'
export type StrengthFilter = WordStrength | 'unassigned' | 'all'

const STRENGTH_SORT_RANK: Record<StrengthFilter, number> = {
  strong: 0,
  weak: 1,
  unassigned: 2,
  all: 3, // unused for sorting, only appears as a filter value
}

function compareRows(a: VocabEntry, b: VocabEntry, column: SortColumn): number {
  if (column === 'strength') {
    return (
      STRENGTH_SORT_RANK[a.strength ?? 'unassigned'] -
      STRENGTH_SORT_RANK[b.strength ?? 'unassigned']
    )
  }
  return a[column].localeCompare(b[column])
}

/**
 * Client-side sort/filter/search for the vocab list table. The list is
 * small (a user's own saved words), so filtering the full fetched set in
 * memory is simpler than a server-side paginated/filtered query.
 */
export function useTable(rows: VocabEntry[]) {
  const [search, setSearch] = useState('')
  const [strengthFilter, setStrengthFilter] = useState<StrengthFilter>('all')
  const [typeFilter, setTypeFilter] = useState<WordType | 'all'>('all')
  const [sortColumn, setSortColumn] = useState<SortColumn>('englishWord')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  function toggleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = rows
    if (query) {
      result = result.filter((row) =>
        row.englishWord.toLowerCase().includes(query),
      )
    }
    if (strengthFilter !== 'all') {
      result = result.filter(
        (row) => (row.strength ?? 'unassigned') === strengthFilter,
      )
    }
    if (typeFilter !== 'all') {
      result = result.filter((row) => row.wordType === typeFilter)
    }

    const sorted = [...result].sort((a, b) => {
      const comparison = compareRows(a, b, sortColumn)
      return sortDirection === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [rows, search, strengthFilter, typeFilter, sortColumn, sortDirection])

  return {
    rows: filteredRows,
    search,
    setSearch,
    strengthFilter,
    setStrengthFilter,
    typeFilter,
    setTypeFilter,
    sortColumn,
    sortDirection,
    toggleSort,
  }
}
