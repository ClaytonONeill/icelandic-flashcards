import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemePicker } from '@/components/theme-picker'
import { useSignOut } from '@/features/auth'
import { RequireAuth } from '../require-auth'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const signOut = useSignOut()
  const isVocabListPage = location.pathname === '/vocab'

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
            <Link to="/" className="text-lg font-semibold">
              Icelandic Flashcards
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Always visible, on every viewport — never collapses into the
                hamburger menu. */}
            <ThemePicker />

            {/* Desktop: nav/account controls shown inline */}
            <div className="hidden items-center gap-2 sm:flex">
              {!isVocabListPage && (
                <Link to="/vocab" className="btn btn-sm">
                  My Vocab List
                </Link>
              )}
              <button
                type="button"
                className="btn btn-sm"
                onClick={handleLogout}
                disabled={signOut.isPending}
              >
                Log out
              </button>
            </div>

            {/* Mobile: same nav/account controls collapsed into a hamburger
                menu, since the title + everything inline gets cramped on a
                phone. */}
            <div className="dropdown dropdown-end sm:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-square btn-sm"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 gap-1 p-2 shadow"
              >
                {!isVocabListPage && (
                  <li>
                    <Link to="/vocab">My Vocab List</Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signOut.isPending}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
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
