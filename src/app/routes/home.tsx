import { ThemePicker } from '@/components/theme-picker'
import { WordLookupCard } from '@/features/word-lookup'

export function HomeRoute() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="navbar bg-base-100 border-base-300 border-b px-4">
        <div className="flex-1">
          <span className="text-lg font-semibold">Icelandic Flashcards</span>
        </div>
        <ThemePicker />
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 p-4">
        <WordLookupCard />
      </main>
    </div>
  )
}

export default HomeRoute
