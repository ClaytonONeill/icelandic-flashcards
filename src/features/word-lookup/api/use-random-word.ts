import { useQuery } from '@tanstack/react-query'
import { faker } from '@faker-js/faker'
import translate from 'translate'

export type RandomWordResult = {
  englishWord: string
  icelandicWord: string
  dictionaryEntry: unknown
}

async function fetchRandomWord(): Promise<RandomWordResult> {
  const englishWord = faker.word.adjective()
  const icelandicWord = await translate(englishWord, 'is')

  const response = await fetch(
    `https://freedictionaryapi.com/api/v1/entries/is/${icelandicWord}`,
  )

  if (!response.ok) {
    throw new Error(`Dictionary lookup failed with status ${response.status}`)
  }

  const dictionaryEntry = await response.json()

  return { englishWord, icelandicWord, dictionaryEntry }
}

export function useRandomWord() {
  return useQuery({
    queryKey: ['word-lookup', 'random'],
    queryFn: fetchRandomWord,
  })
}
