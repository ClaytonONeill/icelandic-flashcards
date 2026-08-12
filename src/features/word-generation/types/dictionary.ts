import type { WordType } from '@/types/word'

export type InflectedForm = {
  /** The inflected word itself, e.g. "hefur" */
  word: string
  /** Grammatical tags in BÍN's order, e.g. ['active voice', 'indicative', 'present tense', '2nd person', 'singular'] */
  tags: string[]
  /** BÍN's variant number for this cell — 1 is the canonical/standard form */
  variant: number
}

export type GeneratedWord = {
  wordType: WordType
  englishWord: string
  icelandicWord: string
  /** BÍN's dictionary/lemma form, which can differ from the exact translated word (e.g. "höfum" -> lemma "hafa") */
  baseWord: string
  forms: InflectedForm[]
}
