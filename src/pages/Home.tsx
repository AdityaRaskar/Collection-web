import React, { useState, useEffect } from 'react'
import CarCard from '../components/CarCard'
import { Car } from '../types'
import { ImageDisplayProvider, useImageDisplay } from '../contexts/ImageDisplayContext'
import { useCars } from '../hooks/useCars'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'

export default function Home() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [limit] = useState(12)
  const [filters, setFilters] = useState<{ brand?: string; series?: string; year?: string; rarity?: string }>({})
  const [sort, setSort] = useState<string>('created_at:desc')

  const params: any = { q: query, limit, offset: page * limit }
  if (filters.brand) params.brand = filters.brand
  if (filters.series) params.series = filters.series
  if (filters.year) params.year = Number(filters.year)
  if (filters.rarity) params.rarity = filters.rarity
  if (sort) {
    const [orderBy, order] = sort.split(':')
    params.orderBy = orderBy
    params.order = order as any
  }

    const { data, isLoading, isError, refetch } = useCars(params) as any
    const cars = (data?.data ?? []) as Car[]
    const total = (data?.count ?? 0) as number

  useEffect(() => {
    // reset page when filters or query change
    setPage(0)
  }, [query, filters])

  function Controls() {
    const { fill, setFill } = useImageDisplay()
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">Image mode:</label>
        <button
            onClick={() => setFill(!fill)}
          className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-700"
        >
          {fill ? 'Fill' : 'Fit'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My HotWheels Collection</h1>
        <div className="text-sm text-gray-500">Total: {total}</div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <SearchBar value={query} onChange={(v) => setQuery(v)} />
        </div>
        <Controls />
        <div className="mt-2 flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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

      <Filters
        brand={filters.brand}
        series={filters.series}
        year={filters.year}
        rarity={filters.rarity}
        onChange={(f) => setFilters(f)}
      />

      {isLoading ? (
        <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden animate-pulse">
              <div className="bg-gray-100 dark:bg-gray-700" style={{ aspectRatio: '3/4' }} />
              <div className="p-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-700 w-3/4 mb-1 rounded" />
                <div className="h-2 bg-gray-100 dark:bg-gray-700 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading cars.</div>
      ) : cars.length === 0 ? (
        <div className="text-gray-500">🚗 No matching cars found</div>
      ) : (
        <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
          {cars.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center mt-6">
        {(page + 1) * limit < total && (
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  )
}
