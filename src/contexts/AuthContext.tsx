import React from 'react'
import supabase from '../services/supabase'

type AuthContextValue = {
  user: any | null
  initialized: boolean
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any | null>(null)
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        const u = (data as any)?.session?.user ?? null
        // debug auth state
        // eslint-disable-next-line no-console
        console.debug('AuthProvider init user:', u)
        setUser(u)
      } finally {
        if (mounted) setInitialized(true)
      }
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session as any)?.user ?? null)
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, initialized }}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

export default AuthContext
