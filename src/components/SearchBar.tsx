import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <label className="sr-only">Search</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, brand, or series"
        className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800"
        aria-label="Search cars"
      />
    </div>
  )
}
