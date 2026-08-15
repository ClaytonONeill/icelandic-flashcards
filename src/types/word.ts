export const WORD_TYPES = [
  'noun',
  'adjective',
  'adverb',
  'interjection',
  'conjunction',
  'preposition',
  'verb',
] as const

export type WordType = (typeof WORD_TYPES)[number]

export const WORD_STRENGTHS = ['strong', 'weak'] as const

export type WordStrength = (typeof WORD_STRENGTHS)[number]
