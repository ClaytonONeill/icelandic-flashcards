import { Outlet, useNavigate } from 'react-router-dom'
import { ThemePicker } from '@/components/theme-picker'
import { useSignOut } from '@/features/auth'
import { RequireAuth } from '../require-auth'

export function AppLayout() {
  const navigate = useNavigate()
  const signOut = useSignOut()

  function handleLogout() {
    signOut.mutate(undefined, {
      onSuccess: () => navigate('/login', { replace: true }),
    })
  }

  return (
    <RequireAuth>
      <div className="flex min-h-svh flex-col">
        <header className="navbar bg-base-100 border-base-300 border-b px-4">
          <div className="flex-1">
            <span className="text-lg font-semibold">Icelandic Flashcards</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemePicker />
            <button
              type="button"
              className="btn btn-sm"
              onClick={handleLogout}
              disabled={signOut.isPending}
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center gap-6 p-4">
          <Outlet />
        </main>

        <footer className="text-base-content/50 p-4 text-center text-xs">
          Grammar data © Árni Magnússon Institute for Icelandic Studies (BÍN),
          licensed{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            CC BY-SA 4.0
          </a>
          .
        </footer>
      </div>
    </RequireAuth>
  )
}

export default AppLayout
