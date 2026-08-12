import { Navigate } from 'react-router-dom'
import { SignupForm } from '@/features/auth'
import { useAuth } from '@/stores/auth-context'

export function SignupRoute() {
  const { session, loading } = useAuth()

  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Icelandic Flashcards</h1>
      <SignupForm />
    </div>
  )
}

export default SignupRoute
