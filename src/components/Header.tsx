import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user } = useAuth()
  const [dark, setDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto p-4 flex items-center justify-between flex-nowrap">
        <Link to="/" className="font-bold text-lg whitespace-nowrap flex items-center">
          HotWheels Collection
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 dark:text-gray-300">
            Collection
          </Link>
          {user && (
            <Link to="/admin/add-car" className="text-sm text-blue-600">
              + Add New Car
            </Link>
          )}
          <Link to="/login" className="text-sm text-gray-600">
            {user ? 'Account' : 'Admin'}
          </Link>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="px-2 py-1 border rounded text-sm"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </nav>

        {/* mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded border"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">Menu</div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1">
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/" onClick={() => setOpen(false)} className="text-sm text-gray-700 dark:text-gray-300">Collection</Link>
              {user && (
                <Link to="/admin/add-car" onClick={() => setOpen(false)} className="text-sm text-blue-600">+ Add New Car</Link>
              )}
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-gray-700">{user ? 'Account' : 'Admin'}</Link>
              <button onClick={() => { setDark((d) => !d); setOpen(false) }} aria-label="Toggle dark mode" className="text-sm border px-2 py-1 rounded w-max">{dark ? 'Light' : 'Dark'}</button>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
