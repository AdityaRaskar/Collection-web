import { useCallback } from 'react'
import supabase from '../services/supabase'
import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  // prefer centralized context if available
  try {
    const { user, initialized } = useAuthContext()
    const signIn = useCallback(async (email: string, password: string) => {
      const res = await supabase.auth.signInWithPassword({ email, password })
      const { error } = res
      if (error) throw error
      return true
    }, [])
    const signOut = useCallback(async () => {
      await supabase.auth.signOut()
    }, [])
    return { user, initialized, signIn, signOut }
  } catch (e) {
    // fallback if provider not present
    // simple local behavior similar to previous implementation
    const [user, setUser] = require('react').useState<any>(null)
    require('react').useEffect(() => {
      const init = async () => {
        const { data } = await supabase.auth.getSession()
        setUser((data as any)?.session?.user ?? null)
      }
      init()
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser((session as any)?.user ?? null)
      })
      return () => listener?.subscription.unsubscribe()
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
      const res = await supabase.auth.signInWithPassword({ email, password })
      const { error } = res
      if (error) throw error
      return true
    }, [])
    const signOut = useCallback(async () => {
      await supabase.auth.signOut()
      setUser(null)
    }, [])
    return { user, initialized: true, signIn, signOut }
  }
}
