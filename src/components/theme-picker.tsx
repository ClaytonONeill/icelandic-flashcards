import { THEMES, useTheme, type Theme } from '@/stores/theme-context'

export function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Theme</span>
      <select
        className="select select-sm"
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
      >
        {THEMES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
