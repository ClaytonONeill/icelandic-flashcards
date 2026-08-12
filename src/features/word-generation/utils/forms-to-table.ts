import type { WordType } from '@/types/word'
import type { InflectedForm } from '../types/dictionary'

export type GrammarGrid = {
  columnLabels: string[]
  rows: { rowLabel: string; values: (string | null)[] }[]
}

export type GrammarSection = {
  title: string
  grid: GrammarGrid
}

export type GrammarTable =
  | { kind: 'none' }
  | { kind: 'table'; sections: GrammarSection[]; notes: string[] }

const PERSON_LABELS = ['1. pers.', '2. pers.', '3. pers.']
const PERSON_TAGS = ['1st person', '2nd person', '3rd person']
const NUMBER_LABELS = ['Et.', 'Ft.']
const NUMBER_TAGS = ['singular', 'plural']
const CASE_LABELS = ['Nefnifall', 'Þolfall', 'Þágufall', 'Eignarfall']
const CASE_TAGS = ['nominative', 'accusative', 'dative', 'genitive']
const DEFINITENESS_LABELS = ['Án greinis', 'Með greini']
const DEFINITENESS_TAGS = ['without definite article', 'with definite article']
const GENDER_LABELS = ['Kk.', 'Kvk.', 'Hk.']
const GENDER_TAGS = ['masculine', 'feminine', 'neuter']

function findWord(
  pool: InflectedForm[],
  requiredTags: string[],
): string | null {
  return (
    pool.find((form) => requiredTags.every((tag) => form.tags.includes(tag)))
      ?.word ?? null
  )
}

function gridHasData(grid: GrammarGrid): boolean {
  return grid.rows.some((row) => row.values.some((value) => value !== null))
}

// Verb tables only cover the indicative mood, active voice — the same scope
// as the reference wireframe's "Framsöguháttur" table. Other moods/voices
// (subjunctive, imperative, middle voice) are intentionally left out.
function buildVerbTable(forms: InflectedForm[]): GrammarTable {
  const canonical = forms.filter(
    (form) =>
      form.variant === 1 &&
      form.tags.includes('active voice') &&
      form.tags.includes('indicative'),
  )

  function buildGrid(tenseTag: string): GrammarGrid {
    return {
      columnLabels: NUMBER_LABELS,
      rows: PERSON_TAGS.map((personTag, index) => ({
        rowLabel: PERSON_LABELS[index],
        values: NUMBER_TAGS.map((numberTag) =>
          findWord(canonical, [tenseTag, personTag, numberTag]),
        ),
      })),
    }
  }

  const present = buildGrid('present tense')
  const past = buildGrid('past tense')

  const sections: GrammarSection[] = []
  if (gridHasData(present)) sections.push({ title: 'Nútíð', grid: present })
  if (gridHasData(past)) sections.push({ title: 'Þátíð', grid: past })

  return sections.length
    ? { kind: 'table', sections, notes: [] }
    : { kind: 'none' }
}

function buildNounTable(forms: InflectedForm[]): GrammarTable {
  const canonical = forms.filter((form) => form.variant === 1)

  function buildGrid(numberTag: string): GrammarGrid {
    return {
      columnLabels: DEFINITENESS_LABELS,
      rows: CASE_TAGS.map((caseTag, index) => ({
        rowLabel: CASE_LABELS[index],
        values: DEFINITENESS_TAGS.map((definitenessTag) =>
          findWord(canonical, [caseTag, definitenessTag, numberTag]),
        ),
      })),
    }
  }

  const singular = buildGrid('singular')
  const plural = buildGrid('plural')

  const sections: GrammarSection[] = []
  if (gridHasData(singular)) sections.push({ title: 'Eintala', grid: singular })
  if (gridHasData(plural)) sections.push({ title: 'Fleirtala', grid: plural })

  return sections.length
    ? { kind: 'table', sections, notes: [] }
    : { kind: 'none' }
}

// Only the positive degree, strong declension gets a full grid (the form
// dictionaries cite as the headword paradigm). Comparative/superlative are
// summarized as single reference words rather than their own full grids, to
// keep the card readable on a phone screen.
function buildAdjectiveTable(forms: InflectedForm[]): GrammarTable {
  const strongPositive = forms.filter(
    (form) =>
      form.variant === 1 &&
      form.tags.includes('positive degree') &&
      form.tags.includes('strong declension'),
  )

  function buildGrid(numberTag: string): GrammarGrid {
    return {
      columnLabels: GENDER_LABELS,
      rows: CASE_TAGS.map((caseTag, index) => ({
        rowLabel: CASE_LABELS[index],
        values: GENDER_TAGS.map((genderTag) =>
          findWord(strongPositive, [caseTag, genderTag, numberTag]),
        ),
      })),
    }
  }

  const singular = buildGrid('singular')
  const plural = buildGrid('plural')

  const sections: GrammarSection[] = []
  if (gridHasData(singular)) sections.push({ title: 'Eintala', grid: singular })
  if (gridHasData(plural)) sections.push({ title: 'Fleirtala', grid: plural })

  const comparative = findWord(forms, [
    'comparative degree',
    'masculine',
    'nominative',
    'singular',
  ])
  const superlative = findWord(forms, [
    'superlative degree',
    'strong declension',
    'masculine',
    'nominative',
    'singular',
  ])
  const notes = [
    comparative && `Miðstig: ${comparative}`,
    superlative && `Efsta stig: ${superlative}`,
  ].filter((note): note is string => Boolean(note))

  return sections.length || notes.length
    ? { kind: 'table', sections, notes }
    : { kind: 'none' }
}

function buildAdverbTable(forms: InflectedForm[]): GrammarTable {
  const comparative = findWord(forms, ['comparative degree'])
  const superlative = findWord(forms, ['superlative degree'])
  const notes = [
    comparative && `Miðstig: ${comparative}`,
    superlative && `Efsta stig: ${superlative}`,
  ].filter((note): note is string => Boolean(note))

  return notes.length
    ? { kind: 'table', sections: [], notes }
    : { kind: 'none' }
}

/**
 * Builds a display-ready grammar table from a word's inflection forms. The
 * shape genuinely differs per word type (verb conjugation vs. noun/adjective
 * declension vs. simple degree), so this is a hand-written mapping per type
 * rather than a generic auto-layout.
 */
export function formsToTable(
  wordType: WordType,
  forms: InflectedForm[],
): GrammarTable {
  switch (wordType) {
    case 'verb':
      return buildVerbTable(forms)
    case 'noun':
      return buildNounTable(forms)
    case 'adjective':
      return buildAdjectiveTable(forms)
    case 'adverb':
      return buildAdverbTable(forms)
    case 'interjection':
    case 'conjunction':
    case 'preposition':
      return { kind: 'none' }
  }
}
