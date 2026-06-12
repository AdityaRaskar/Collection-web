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
      const text = err?.message ? err.message : JSON.stringify(err, Object.getOwnPropertyNames(err))
      setError(text || 'Login failed')
      // eslint-disable-next-line no-console
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
        {user ? (
          <div>
            <div className="mb-3">Signed in as {user.email}</div>
            <button className="px-3 py-1 border rounded" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-2 py-1 rounded mt-1" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
