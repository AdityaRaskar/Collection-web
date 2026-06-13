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
        if (!k || k === 'thumbnail') return false
        if (v === null || v === undefined) return false
        if (typeof v === 'string' && v.trim() === '') return false
        return true
      })
    : []

  return (
    <div>
      {onBack && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={onBack} aria-label="Back" className="btn-outline" style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {car?.name ?? 'Car Details'}
        </h2>
        {initialized && user && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="transition-fast"
              onClick={onEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.875rem', padding: '0.4rem 0.75rem', borderRadius: '6px',
                border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', cursor: 'pointer',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
              </svg>
              Edit
            </button>
            <button
              className="transition-fast"
              onClick={onDelete}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.875rem', padding: '0.4rem 0.75rem', borderRadius: '6px',
                border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ImageGallery images={images as any} />
        </div>

        {/* Details panel uses --card-bg to match card surface */}
        <div
          className="card min-w-0"
          style={{ padding: '1rem' }}
        >
          <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              ['Brand', car?.brand],
              ['Series', car?.series],
              ['Year', car?.year],
              ['Model #', car?.model_number],
              ['Purchase Price', car?.purchase_price != null ? `$${car.purchase_price}` : null],
              ['Description', car?.description],
            ].map(([label, value]) =>
              value ? (
                <div key={label as string}>
                  <dt style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{label}</dt>
                  <dd style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value as string}</dd>
                </div>
              ) : null
            )}

            {filteredAttributes.length > 0 && (
              <div>
                <dt style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Attributes</dt>
                <dd>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {filteredAttributes.map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '0.5rem', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '7rem', flexShrink: 0 }}>{k}</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', wordBreak: 'break-word', minWidth: 0 }}>
                          {typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v)}
                        </span>
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