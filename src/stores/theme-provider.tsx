import { useEffect, useReducer, type ReactNode } from 'react'
import { ThemeContext, isTheme, type Theme } from './theme-context'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isTheme(stored)) {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

type ThemeAction = { type: 'set'; theme: Theme }

function themeReducer(_state: Theme, action: ThemeAction): Theme {
  switch (action.type) {
    case 'set':
      return action.theme
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, dispatch] = useReducer(themeReducer, undefined, getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function setTheme(theme: Theme) {
    dispatch({ type: 'set', theme })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
