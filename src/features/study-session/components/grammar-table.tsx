import type { GrammarGrid, GrammarTable } from '@/features/word-generation'

function Grid({ grid }: { grid: GrammarGrid }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th></th>
            {grid.columnLabels.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row) => (
            <tr key={row.rowLabel}>
              <th className="font-normal opacity-70">{row.rowLabel}</th>
              {row.values.map((value, index) => (
                <td key={index} className={value ? undefined : 'opacity-30'}>
                  {value ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GrammarTableView({ table }: { table: GrammarTable }) {
  if (table.kind === 'none') {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {table.sections.length > 0 && (
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
          {table.sections.map((section) => (
            <div key={section.title} className="min-w-0 flex-1">
              <h3 className="mb-1 text-sm font-semibold opacity-70">
                {section.title}
              </h3>
              <Grid grid={section.grid} />
            </div>
          ))}
        </div>
      )}
      {table.notes.length > 0 && (
        <ul className="text-sm opacity-80">
          {table.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
