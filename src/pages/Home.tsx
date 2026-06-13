import React, { useState, useEffect } from 'react'
import CarCard from '../components/CarCard'
import { Car } from '../types'
import { ImageDisplayProvider, useImageDisplay } from '../contexts/ImageDisplayContext'
import { useCars } from '../hooks/useCars'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [limit] = useState(12)
  const [gridType, setGridType] = useState<string>(() => localStorage.getItem('gridType') ?? 'comfortable')
  const [sort, setSort] = useState<string>('created_at:desc')

  const params: any = { q: query, limit, offset: page * limit }
  if (sort) {
    const [orderBy, order] = sort.split(':')
    params.orderBy = orderBy
    params.order = order as any
  }

  const { data, isLoading, isError } = useCars(params) as any
  const cars = (data?.data ?? []) as Car[]
  const total = (data?.count ?? 0) as number

  useEffect(() => { setPage(0) }, [query])

  function Controls() {
    const { fill, setFill } = useImageDisplay()
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <label className="label">Image mode:</label>
        <button
          onClick={() => setFill(!fill)}
          className="btn-outline"
          style={{ fontSize: '0.875rem', padding: '0.25rem 0.6rem' }}
        >
          {fill ? 'Fill' : 'Fit'}
        </button>

        <label className="label">Grid:</label>
        <select
          value={gridType}
          onChange={e => { setGridType(e.target.value); try { localStorage.setItem('gridType', e.target.value) } catch (_) {} }}
          className="input"
          style={{ width: 'auto', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
          <option value="list">List</option>
        </select>
      </div>
    )
  }

  const gridClass =
    gridType === 'compact'
      ? 'grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
      : gridType === 'list'
      ? 'grid gap-4 grid-cols-1'
      : 'grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>My HotWheels Collection</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Curated set — {total} items</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <SearchBar value={query} onChange={v => setQuery(v)} />
        <Controls />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="label">Sort:</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input"
            style={{ width: 'auto', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
          >
            <option value="name:asc">Name A-Z</option>
            <option value="name:desc">Name Z-A</option>
            <option value="created_at:desc">Newest added</option>
            <option value="created_at:asc">Oldest added</option>
            <option value="purchase_date:desc">Newest purchase</option>
            <option value="purchase_date:asc">Oldest purchase</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className={gridClass}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card" style={{ overflow: 'hidden' }}>
              <div className="skeleton" style={{ aspectRatio: '3/4' }} />
              <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="skeleton" style={{ height: '0.75rem', width: '70%' }} />
                <div className="skeleton" style={{ height: '0.6rem', width: '45%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div style={{ color: '#ef4444' }}>Error loading cars.</div>
      ) : cars.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>🚗 No matching cars found</div>
      ) : (
        <div className={gridClass}>
          {cars.map(c => <CarCard key={c.id} car={c} />)}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        {(page + 1) * limit < total && (
          <button className="btn-outline" onClick={() => setPage(p => p + 1)}>
            Load more
          </button>
        )}
      </div>
    </div>
  )
}