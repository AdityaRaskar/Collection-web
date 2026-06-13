import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Login failed')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Admin Login
      </h2>
      {/* surface panel: solid white/dark, no transparency */}
      <div className="surface" style={{ padding: '1.5rem' }}>
        {user ? (
          <div>
            <p style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Signed in as <strong>{user.email}</strong>
            </p>
            <button className="btn-outline" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'block' }}>
              <span className="label" style={{ display: 'block', marginBottom: '0.25rem' }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </label>
            <label style={{ display: 'block' }}>
              <span className="label" style={{ display: 'block', marginBottom: '0.25rem' }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
            <div>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}