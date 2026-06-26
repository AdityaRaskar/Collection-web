import React, { useState, useEffect, useRef } from 'react'
import CarCard from '../components/CarCard'
import { Car } from '../types'
import { useImageDisplay } from '../contexts/ImageDisplayContext'
import { useCars } from '../hooks/useCars'
import SearchBar from '../components/SearchBar'

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48, 96]
const BRANDS = ['All', 'Hotwheels', 'Matchbox', 'Majorette', 'Other']

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(12)
  const [gridType, setGridType] = useState<string>(() => localStorage.getItem('gridType') ?? 'comfortable')
  const [sort, setSort] = useState<string>('created_at:desc')
  const [brandFilter, setBrandFilter] = useState<string>('All')
  
  const [showFilters, setShowFilters] = useState(false)

  const topRef = useRef<HTMLDivElement>(null)
  const { fill, setFill } = useImageDisplay()

  const params: any = { q: query, limit, offset: page * limit }
  if (sort) {
    const [orderBy, order] = sort.split(':')
    params.orderBy = orderBy
    params.order = order as any
  }
  if (brandFilter && brandFilter !== 'All') {
    params.brand = brandFilter
  }

  const { data, isLoading, isError } = useCars(params) as any
  const cars = (data?.data ?? []) as Car[]
  const total = (data?.count ?? 0) as number

  useEffect(() => { setPage(0) }, [query, brandFilter, limit])

  const goToPage = (newPage: number) => {
    setPage(newPage)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const gridClass =
    gridType === 'compact'
      ? 'grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
      : gridType === 'list'
      ? 'grid gap-4 grid-cols-1'
      : 'grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'

  const totalPages = Math.ceil(total / limit)
  const hasPrev = page > 0
  const hasNext = (page + 1) * limit < total

  return (
    <div ref={topRef} className="px-4 py-6 max-w-7xl mx-auto w-full">
      {/* Header section - Now protected with min-w-0 and truncate */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b border-[var(--border)] pb-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight truncate">
            Diecast Collection
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 truncate">
            Curated set — <span className="font-semibold text-[var(--text-secondary)]">{total} items</span>
          </p>
        </div>
      </div>

      {/* Control Dashboard Panel */}
      <div className="surface p-4 mb-6 flex flex-col gap-4 shadow-sm w-full rounded-lg">
        
        {/* Top Row: Search Bar & Mobile Toggle Button */}
        <div className="flex items-center gap-2 w-full min-w-0">
          <div className="flex-1 min-w-0">
            <SearchBar value={query} onChange={v => setQuery(v)} />
          </div>
          
          {/* Mobile Filter Toggle - shrink-0 prevents it from being crushed by the search bar */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden shrink-0 btn-outline flex items-center justify-center gap-1.5 px-3 h-10 rounded-md whitespace-nowrap transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-semibold">{showFilters ? 'Hide' : 'Filters'}</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap items-start gap-4 pt-2 border-t sm:border-t-0 border-[var(--border)]`}>
          
          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">Image</label>
            <button
              onClick={() => setFill(!fill)}
              className="btn-outline h-9 text-sm w-full transition-fast rounded-md truncate"
            >
              {fill ? 'Fill Container' : 'Fit Container'}
            </button>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">Layout</label>
            <select
              value={gridType}
              onChange={e => { 
                setGridType(e.target.value); 
                try { localStorage.setItem('gridType', e.target.value) } catch (_) {} 
              }}
              className="input h-9 text-sm w-full cursor-pointer rounded-md truncate"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
              <option value="list">List</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">Brand</label>
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="input h-9 text-sm w-full cursor-pointer rounded-md truncate"
            >
              {BRANDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">Sort By</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input h-9 text-sm w-full cursor-pointer rounded-md truncate"
            >
              <option value="name:asc">Name A-Z</option>
              <option value="name:desc">Name Z-A</option>
              <option value="created_at:desc">Newest Added</option>
              <option value="created_at:asc">Oldest Added</option>
              <option value="purchase_date:desc">Newest Purchase</option>
              <option value="purchase_date:asc">Oldest Purchase</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-auto mt-2 md:mt-0 min-w-[140px]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] truncate">Per Page</label>
            <div className="flex flex-wrap gap-2">
              {PAGE_SIZE_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setLimit(n)}
                  className={`text-sm font-semibold h-9 px-3 rounded-md min-w-[2.5rem] transition-fast ${
                    limit === n 
                      ? 'bg-[var(--accent)] text-white shadow-md border-transparent' 
                      : 'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Content */}
      {isLoading ? (
        <div className={gridClass}>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[3/4]" />
              <div className="p-3 flex flex-col gap-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="surface text-center py-12 text-red-500 font-medium rounded-lg px-4">⚠️ Error loading cars. Please refresh.</div>
      ) : cars.length === 0 ? (
        <div className="surface text-center py-12 text-[var(--text-muted)] font-medium rounded-lg px-4">🚗 No matching cars found</div>
      ) : (
        <div className={gridClass}>
          {cars.map(c => <CarCard key={c.id} car={c} />)}
        </div>
      )}

      {/* Wrapping Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col items-center gap-4 w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 w-full">
            <button
              className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md shrink-0"
              onClick={() => goToPage(0)}
              disabled={!hasPrev}
            >
              « First
            </button>
            <button
              className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md shrink-0"
              onClick={() => goToPage(page - 1)}
              disabled={!hasPrev}
            >
              ‹ Prev
            </button>

            {/* Middle Page Numbers */}
            <div className="flex flex-wrap justify-center items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i)
                .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, i, idx, arr) => {
                  if (idx > 0 && i - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(i)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`e${idx}`} className="px-2 py-1 text-[var(--text-muted)] text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => goToPage(item as number)}
                      className={`px-3.5 py-2 text-sm font-medium rounded-md transition-fast shrink-0 ${
                        page === item
                          ? 'bg-[var(--accent)] text-white shadow-md border-transparent'
                          : 'btn-outline'
                      }`}
                    >
                      {(item as number) + 1}
                    </button>
                  )
                )
              }
            </div>

            <button
              className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md shrink-0"
              onClick={() => goToPage(page + 1)}
              disabled={!hasNext}
            >
              Next ›
            </button>
            <button
              className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md shrink-0"
              onClick={() => goToPage(totalPages - 1)}
              disabled={!hasNext}
            >
              Last »
            </button>
          </div>

          <p className="text-sm font-medium text-[var(--text-muted)] text-center break-words px-4">
            Page {page + 1} of {totalPages} <span className="opacity-50 mx-1">|</span> Showing {cars.length} of {total} items
          </p>
        </div>
      )}
    </div>
  )
}