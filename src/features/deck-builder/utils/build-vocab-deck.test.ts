import { describe, expect, it } from 'vitest'
import { filterVocabEntries, buildVocabDeck } from './build-vocab-deck'
import type { VocabEntry } from '@/features/vocab-list'

function entry(overrides: Partial<VocabEntry>): VocabEntry {
  return {
    id: overrides.icelandicWord ?? 'orð',
    englishWord: 'word',
    icelandicWord: 'orð',
    wordType: 'noun',
    strength: null,
    grammarTable: { kind: 'none' },
    ...overrides,
  }
}

const entries: VocabEntry[] = [
  entry({ icelandicWord: 'a', wordType: 'noun', strength: 'strong' }),
  entry({ icelandicWord: 'b', wordType: 'noun', strength: 'weak' }),
  entry({ icelandicWord: 'c', wordType: 'noun', strength: null }),
  entry({ icelandicWord: 'd', wordType: 'verb', strength: 'strong' }),
]

describe('filterVocabEntries', () => {
  it('filters by word type', () => {
    const result = filterVocabEntries(entries, {
      wordTypes: ['verb'],
      strengths: [],
    })
    expect(result.map((e) => e.icelandicWord)).toEqual(['d'])
  })

  it('with no strength filter, includes unassigned words', () => {
    const result = filterVocabEntries(entries, {
      wordTypes: ['noun'],
      strengths: [],
    })
    expect(result.map((e) => e.icelandicWord).sort()).toEqual(['a', 'b', 'c'])
  })

  it('with a strength filter, excludes unassigned words', () => {
    const result = filterVocabEntries(entries, {
      wordTypes: ['noun'],
      strengths: ['strong'],
    })
    expect(result.map((e) => e.icelandicWord)).toEqual(['a'])
  })

  it('with both strength filters, includes strong and weak but not unassigned', () => {
    const result = filterVocabEntries(entries, {
      wordTypes: ['noun'],
      strengths: ['strong', 'weak'],
    })
    expect(result.map((e) => e.icelandicWord).sort()).toEqual(['a', 'b'])
  })
})

describe('buildVocabDeck', () => {
  it('builds cards only from matching entries, with no repeats', () => {
    const cards = buildVocabDeck(entries, {
      wordTypes: ['noun'],
      strengths: [],
    })
    expect(cards).toHaveLength(3)
    expect(new Set(cards.map((c) => c.id)).size).toBe(3)
    expect(cards.every((c) => c.result === null)).toBe(true)
  })

  it('returns an empty deck when nothing matches', () => {
    const cards = buildVocabDeck(entries, {
      wordTypes: ['adjective'],
      strengths: [],
    })
    expect(cards).toHaveLength(0)
  })
})
