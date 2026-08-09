import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '../api/use-sign-in'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const signIn = useSignIn()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signIn.mutate(
      { email, password },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-200 w-full max-w-sm shadow-sm"
    >
      <div className="card-body gap-2">
        <h2 className="card-title">Log in</h2>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            required
            autoComplete="email"
            className="input w-full"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="input w-full"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>

        {signIn.error && (
          <p className="text-error text-sm">{signIn.error.message}</p>
        )}

        <div className="card-actions mt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={signIn.isPending}
          >
            {signIn.isPending ? 'Logging in…' : 'Log in'}
          </button>
        </div>

        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}
