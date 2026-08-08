import { useRandomWord } from '../api/use-random-word'

export function WordLookupCard() {
  const { data, error, isPending, isFetching, refetch } = useRandomWord()

  return (
    <div className="card bg-base-200 w-full max-w-md shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Random word lookup</h2>
        <p className="text-base-content/70 text-sm">
          Demo feature showing the features/ + TanStack Query pattern: pick a
          random English word, translate it to Icelandic, then look it up in a
          dictionary API. Real flashcard features will follow this same shape
          but call{' '}
          <code className="bg-base-300 rounded px-1">lib/supabase.ts</code>{' '}
          instead.
        </p>

        {isPending && (
          <span className="loading loading-spinner loading-md self-start" />
        )}

        {error && (
          <p className="text-error">Something went wrong: {error.message}</p>
        )}

        {data && (
          <div className="flex flex-col gap-2">
            <p>
              English word:{' '}
              <span className="font-semibold">{data.englishWord}</span>
            </p>
            <p>
              Icelandic word:{' '}
              <span className="font-semibold">{data.icelandicWord}</span>
            </p>
            <pre className="mockup-code max-h-64 overflow-auto text-xs whitespace-pre-wrap">
              <code>{JSON.stringify(data.dictionaryEntry, null, 2)}</code>
            </pre>
          </div>
        )}

        <div className="card-actions justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Looking up…' : 'Get another word'}
          </button>
        </div>
      </div>
    </div>
  )
}
