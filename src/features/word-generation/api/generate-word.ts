import { faker } from '@faker-js/faker'
import translate from 'translate'
import type { WordType } from '@/types/word'
import type { GeneratedWord, InflectedForm } from '../types/dictionary'

const MAX_ATTEMPTS = 8
const INFLECTION_API = 'https://ylhyra.is/api/inflection'

// Icelandic prepositions and interjections are small, closed word classes —
// faker's English word lists for these categories lean heavily on
// archaic/Latin/idiomatic entries (e.g. "apud", "forenenst", "pace") that
// rarely translate to a single BÍN-recognized Icelandic word. Live-probed
// hit rate through faker+translate was ~5% for prepositions and ~27% for
// interjections, both too unreliable for the retry budget below — so these
// two types sample directly from a curated, BÍN-verified Icelandic word list
// instead of going through faker/translate first. All other types are open
// classes where faker+translate reliably finds a match.
const CURATED_ICELANDIC_WORDS: Partial<Record<WordType, string[]>> = {
  preposition: [
    'í',
    'á',
    'við',
    'frá',
    'til',
    'eftir',
    'fyrir',
    'undir',
    'yfir',
    'milli',
    'gegn',
    'án',
    'um',
    'með',
    'af',
    'að',
    'hjá',
    'kringum',
    'innan',
    'utan',
    'ofan',
    'neðan',
    'meðal',
    'gagnvart',
    'gegnum',
    'handa',
    'nálægt',
    'sunnan',
  ],
  interjection: ['vá', 'æ', 'ha', 'nei', 'jæja', 'úff', 'uss', 'hó'],
}

function fakerWordFor(wordType: WordType): string {
  switch (wordType) {
    case 'noun':
      return faker.word.noun()
    case 'adjective':
      return faker.word.adjective()
    case 'adverb':
      return faker.word.adverb()
    case 'interjection':
      return faker.word.interjection()
    case 'conjunction':
      return faker.word.conjunction()
    case 'preposition':
      return faker.word.preposition()
    case 'verb':
      return faker.word.verb()
  }
}

async function pickWordPair(
  wordType: WordType,
): Promise<{ englishWord: string; icelandicWord: string }> {
  const curated = CURATED_ICELANDIC_WORDS[wordType]
  if (curated) {
    const icelandicWord = curated[Math.floor(Math.random() * curated.length)]
    // Auto-detecting the source language is unreliable for these short,
    // closed-class words (e.g. "á" or "uss" can be mistaken for already
    // being English and returned unchanged) — the source language must be
    // stated explicitly here, unlike the English->Icelandic direction below.
    const englishWord = await translate(icelandicWord, { from: 'is', to: 'en' })
    return { englishWord, icelandicWord }
  }

  const englishWord = fakerWordFor(wordType)
  const icelandicWord = await translate(englishWord, 'is')
  return { englishWord, icelandicWord }
}

type SearchCandidate = {
  BIN_id: number
  base_word: string
  word_categories: string[]
}

type SearchResponse = {
  results: SearchCandidate[]
}

type FlatFormRow = {
  inflectional_form: string
  inflectional_form_categories: (string | number)[]
}

type FlatResponse = {
  results: FlatFormRow[]
}

function normalizeForm(row: FlatFormRow): InflectedForm {
  const categories = [...row.inflectional_form_categories]
  const last = categories[categories.length - 1]
  const variant = typeof last === 'number' ? (categories.pop() as number) : 1
  return {
    word: row.inflectional_form,
    tags: categories as string[],
    variant,
  }
}

async function tryGenerateWord(
  wordType: WordType,
): Promise<GeneratedWord | null> {
  const { englishWord, icelandicWord } = await pickWordPair(wordType)

  const searchResponse = await fetch(
    `${INFLECTION_API}?search=${encodeURIComponent(icelandicWord)}`,
  )
  if (!searchResponse.ok) {
    return null
  }
  const search = (await searchResponse.json()) as SearchResponse

  // A search term can match inflected forms of several unrelated headwords
  // (e.g. "hafa" is both the verb itself and the noun "haf"'s genitive
  // plural) — only an entry whose categories include the requested word type
  // is usable. The match isn't always the first category: interjections in
  // particular are frequently cross-classified (e.g. "vá" -> noun/interjection).
  const candidate = search.results.find((result) =>
    result.word_categories.includes(wordType),
  )
  if (!candidate) {
    return null
  }

  const formsResponse = await fetch(
    `${INFLECTION_API}?id=${candidate.BIN_id}&type=flat`,
  )
  if (!formsResponse.ok) {
    return null
  }
  const flat = (await formsResponse.json()) as FlatResponse

  return {
    wordType,
    englishWord,
    icelandicWord,
    baseWord: candidate.base_word,
    forms: flat.results.map(normalizeForm),
  }
}

/**
 * Generates a random word of the given type by translating a random English
 * word to Icelandic and looking up its full inflection paradigm in the BÍN
 * database (via ylhyra.is). Not every random word resolves to a usable
 * Icelandic entry of the requested type, so this retries with a fresh
 * random word until one succeeds.
 */
export async function generateWord(wordType: WordType): Promise<GeneratedWord> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = await tryGenerateWord(wordType)
    if (result) {
      return result
    }
  }
  throw new Error(
    `Could not generate a ${wordType} after ${MAX_ATTEMPTS} attempts — try again.`,
  )
}
