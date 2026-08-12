import { createContext, useContext } from 'react'

export const THEMES = [
  'light',
  'dark',
  'cupcake',
  'forest',
  'synthwave',
] as const
export type Theme = (typeof THEMES)[number]

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value)
}

export type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
