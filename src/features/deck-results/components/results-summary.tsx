type Props = {
  correct: number
  wrong: number
}

export function ResultsSummary({ correct, wrong }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Results</h2>
      <div className="mt-1 flex gap-6">
        <p>
          Right: <span className="text-success font-bold">{correct}</span>
        </p>
        <p>
          Wrong: <span className="text-error font-bold">{wrong}</span>
        </p>
      </div>
    </div>
  )
}
