import React from 'react'
import ImageGallery from './ImageGallery'
import { Car, CarImage } from '../types'

type Props = {
  car?: Car | null
  images?: CarImage[]
  user?: any
  initialized?: boolean
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function CarDetailsView({ car, images = [], user, initialized, onBack, onEdit, onDelete }: Props) {
  const filteredAttributes = car?.extra_attributes
    ? Object.entries(car.extra_attributes).filter(([k, v]) => {
        if (!k) return false
        if (k === 'thumbnail') return false
        if (v === null || v === undefined) return false
        if (typeof v === 'string' && v.trim() === '') return false
        return true
      })
    : []

  return (
    <div>
      {onBack && (
        <div className="mb-4">
          <button onClick={onBack} aria-label="Back" className="p-2 rounded border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{car?.name ?? 'Car Details'}</h2>
        {initialized && user ? (
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 text-sm px-3 py-2 rounded border border-blue-200 bg-blue-50 text-blue-600"
              onClick={onEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
              </svg>
              <span>Edit</span>
            </button>

            <button
              className="flex items-center gap-2 text-sm px-3 py-2 rounded border border-red-200 bg-red-50 text-red-600"
              onClick={onDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ImageGallery images={images as any} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow min-w-0">
          <dl>
            <div>
              <dt className="text-sm text-gray-500">Brand</dt>
              <dd className="mb-2">{car?.brand ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Series</dt>
              <dd className="mb-2">{car?.series ?? '—'}</dd>
            </div>
            {car?.year && (
              <div>
                <dt className="text-sm text-gray-500">Year</dt>
                <dd className="mb-2">{car.year}</dd>
              </div>
            )}
            {car?.model_number && (
              <div>
                <dt className="text-sm text-gray-500">Model #</dt>
                <dd className="mb-2">{car.model_number}</dd>
              </div>
            )}
            {car?.purchase_price != null && (
              <div>
                <dt className="text-sm text-gray-500">Purchase Price</dt>
                <dd className="mb-2">${car.purchase_price}</dd>
              </div>
            )}
            {car?.description && (
              <div>
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="mb-2">{car.description}</dd>
              </div>
            )}

            {filteredAttributes.length > 0 && (
              <div>
                <dt className="text-sm text-gray-500">Attributes</dt>
                <dd className="mb-2">
                  <div className="space-y-2">
                    {filteredAttributes.map(([k, v]) => (
                      <div key={k} className="flex items-start gap-2 min-w-0">
                        <div className="text-sm text-gray-600 w-32 flex-shrink-0">{k}</div>
                        <div className="break-words min-w-0">{typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v)}</div>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
