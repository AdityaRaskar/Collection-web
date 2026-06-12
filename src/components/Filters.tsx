import React from 'react'

type Props = {
  brand?: string
  series?: string
  year?: string
  rarity?: string
  onChange: (filters: { brand?: string; series?: string; year?: string; rarity?: string }) => void
}

export default function Filters({ brand, series, year, rarity, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded p-3 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input
          placeholder="Brand"
          value={brand ?? ''}
          onChange={(e) => onChange({ brand: e.target.value, series, year, rarity })}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600"
        />
        <input
          placeholder="Series"
          value={series ?? ''}
          onChange={(e) => onChange({ brand, series: e.target.value, year, rarity })}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600"
        />
        <input
          placeholder="Year"
          value={year ?? ''}
          onChange={(e) => onChange({ brand, series, year: e.target.value, rarity })}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600"
        />
        <input
          placeholder="Rarity"
          value={rarity ?? ''}
          onChange={(e) => onChange({ brand, series, year, rarity: e.target.value })}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600"
        />
      </div>
    </div>
  )
}
