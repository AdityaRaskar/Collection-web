import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user } = useAuth()
  const [dark, setDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  )
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  const mobileMenu = open ? (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      {/* Panel — rendered via portal so it's outside header's backdrop-filter context */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '18rem',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Collection
          </Link>

          {user && (
            <Link
              to="/admin/add-car"
              onClick={() => setOpen(false)}
              className="btn-primary"
              style={{ display: 'inline-block', fontSize: '0.875rem', textDecoration: 'none', width: 'max-content' }}
            >
              + Add New
            </Link>
          )}

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {user ? 'Account' : 'Admin'}
          </Link>

          <button
            onClick={() => { setDark(d => !d); setOpen(false) }}
            aria-label="Toggle dark mode"
            className="btn-outline"
            style={{ width: 'max-content', fontSize: '0.875rem', marginTop: '0.5rem' }}
          >
            {dark ? '☀ Light' : '☾ Dark'}
          </button>
        </nav>
      </div>
    </div>
  ) : null

  return (
    <>
      <header
        className="subtle-divider"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow">
              HW
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2, color: 'var(--text-primary)' }}>
                HotWheels Collection
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Curated diecast showcase
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 safe-flex">
            <Link
              to="/"
              style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              className="transition-fast hover:text-indigo-500"
            >
              Collection
            </Link>
            {user && (
              <Link to="/admin/add-car" className="btn-primary" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
                + Add New
              </Link>
            )}
            <Link
              to="/login"
              style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              className="transition-fast hover:text-indigo-500"
            >
              {user ? 'Account' : 'Admin'}
            </Link>
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="btn-outline"
              style={{ fontSize: '0.875rem' }}
            >
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="btn-outline"
              style={{ padding: '0.4rem' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {createPortal(mobileMenu, document.body)}
    </>
  )
}