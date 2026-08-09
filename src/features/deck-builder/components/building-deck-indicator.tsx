import { INITIAL_BATCH_SIZE } from '../hooks/use-start-random-deck'

export function BuildingDeckIndicator({ progress }: { progress: number }) {
  const shown = Math.min(progress, INITIAL_BATCH_SIZE)

  return (
    <span className="inline-flex items-center gap-2">
      <span className="loading loading-dots loading-sm" />
      Building deck… {shown}/{INITIAL_BATCH_SIZE}
    </span>
  )
}
