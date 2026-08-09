import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignUp } from '../api/use-sign-up'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const navigate = useNavigate()
  const signUp = useSignUp()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signUp.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.session) {
            navigate('/', { replace: true })
          } else {
            // Confirm-email is on for this project — the account exists but
            // has no session until the user clicks the emailed link.
            setNeedsConfirmation(true)
          }
        },
      },
    )
  }

  if (needsConfirmation) {
    return (
      <div className="card bg-base-200 w-full max-w-sm shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Check your email</h2>
          <p className="text-sm">
            We sent a confirmation link to <strong>{email}</strong>. Click it,
            then log in.
          </p>
          <div className="card-actions mt-2">
            <Link to="/login" className="btn btn-primary w-full">
              Go to log in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-200 w-full max-w-sm shadow-sm"
    >
      <div className="card-body gap-2">
        <h2 className="card-title">Sign up</h2>

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
            minLength={6}
            autoComplete="new-password"
            className="input w-full"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </fieldset>

        {signUp.error && (
          <p className="text-error text-sm">{signUp.error.message}</p>
        )}

        <div className="card-actions mt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={signUp.isPending}
          >
            {signUp.isPending ? 'Signing up…' : 'Sign up'}
          </button>
        </div>

        <p className="text-sm">
          Already have an account?{' '}
          <Link to="/login" className="link link-primary">
            Log in
          </Link>
        </p>
      </div>
    </form>
  )
}
