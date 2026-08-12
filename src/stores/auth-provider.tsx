import { useEffect, useReducer, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext } from './auth-context'

type AuthState = {
  session: Session | null
  loading: boolean
}

type AuthAction = { type: 'session-changed'; session: Session | null }

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'session-changed':
      return { session: action.session, loading: false }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    session: null,
    loading: true,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      dispatch({ type: 'session-changed', session: data.session })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'session-changed', session })
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session: state.session,
        user: state.session?.user ?? null,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
