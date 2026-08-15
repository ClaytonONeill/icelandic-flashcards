import { Link } from 'react-router-dom'
import { VocabTable } from '@/features/vocab-list'

export function VocabListRoute() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Vocab List</h1>
        <Link to="/vocab/deck" className="btn btn-primary">
          Create Deck
        </Link>
      </div>
      <VocabTable />
    </div>
  )
}

export default VocabListRoute
