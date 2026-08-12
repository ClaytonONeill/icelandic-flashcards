import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { AuthProvider } from '@/stores/auth-provider'
import { StudySessionProvider } from '@/stores/study-session-provider'
import { ThemeProvider } from '@/stores/theme-provider'

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StudySessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StudySessionProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
