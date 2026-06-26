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
    <div className="fixed inset-0 z-50 isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)} 
      />

      {/* Slide-out Panel */}
      <div className="absolute right-0 top-0 h-full w-72 bg-[var(--surface)] border-l border-[var(--border)] shadow-md p-6 flex flex-col">
        
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-[var(--text-primary)] text-base">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-md text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors"
          >
            Collection
          </Link>

          {user && (
            <Link
              to="/admin/add-car"
              onClick={() => setOpen(false)}
              className="btn-primary inline-block text-sm w-max mt-1 mb-1"
            >
              + Add New
            </Link>
          )}

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-md text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors"
          >
            {user ? 'Account' : 'Admin'}
          </Link>

          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => { setDark(d => !d); setOpen(false) }}
              aria-label="Toggle dark mode"
              className="btn-outline text-sm w-full text-center"
            >
              {dark ? '☀ Switch to Light Mode' : '☾ Switch to Dark Mode'}
            </button>
          </div>
        </nav>
      </div>
    </div>
  ) : null

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--surface)] shadow-sm border-b border-[var(--border)]">
        <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Branding - Bulletproof flex layout for responsiveness */}
          <Link to="/" className="flex items-center gap-3 min-w-0 text-decoration-none">
            {/* shrink-0 guarantees the logo NEVER turns into a rectangle on small screens */}
            <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-[var(--surface-hover)] flex items-center justify-center shadow-sm">
              <img 
                src="/src/assets/logo.png" 
                alt="Brand Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  // Fallback in case logo.png fails to load
                  console.error("Image not found at /logo.png", e);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-[var(--text-secondary)] font-bold text-xs">LOGO</span>';
                }}
              />
            </div>
            
            {/* min-w-0 and truncate prevent long text from breaking the UI on narrow devices */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="font-extrabold text-base sm:text-[1.1rem] leading-tight text-[var(--text-primary)] truncate">
                Predator's Collection
              </div>
              <div className="text-[0.7rem] sm:text-xs text-[var(--text-muted)] truncate">
                Curated diecast showcase
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 ml-4">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Collection
            </Link>
            
            {user && (
              <Link to="/admin/add-car" className="btn-primary text-sm shadow-sm">
                + Add New
              </Link>
            )}
            
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {user ? 'Account' : 'Admin'}
            </Link>
            
            <button
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="btn-outline flex items-center justify-center w-8 h-8 p-0 rounded-full text-sm"
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? '☀' : '☾'}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center shrink-0 ml-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="btn-outline p-2 border-transparent bg-[var(--surface-hover)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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