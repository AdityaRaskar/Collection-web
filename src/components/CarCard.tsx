import React, { useState, useEffect } from 'react'
import { Car } from '../types'
import ImageGallery from './ImageGallery'
import CarDetailsView from './CarDetailsView'
import { useCar } from '../hooks/useCar'
import { useAuth } from '../hooks/useAuth'
import { deleteCar } from '../services/cars'
import { useNavigate } from 'react-router-dom'
import { useImageDisplay } from '../contexts/ImageDisplayContext'

type Props = {
  car?: Partial<Car>
}

export default function CarCard({ car }: Props) {
  const [open, setOpen] = useState(false)
  const { carQuery, imagesQuery } = useCar(car?.id)
  const { fill } = useImageDisplay()
  const { user, initialized } = useAuth()
  const navigate = useNavigate()

  const handleEdit = () => navigate(`/admin/edit-car/${(carQuery.data ?? car)?.id}`)

  const handleDelete = async () => {
    const targetId = (carQuery.data ?? car)?.id
    if (!targetId) { alert('Missing car id'); return }
    if (!confirm('Delete this car? This action cannot be undone.')) return
    try {
      await deleteCar(targetId)
      window.location.reload()
    } catch {
      alert('Failed to delete car')
    }
  }

  const thumbnailUrl =
    (car as any)?.extra_attributes?.thumbnail ||
    (imagesQuery.data?.length ? imagesQuery.data[0].image_url : null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && open) setOpen(false) }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open || !car?.id) return
    try { carQuery.refetch(); imagesQuery.refetch() } catch (_) {}
  }, [open, car?.id])

  return (
    <>
      <article
        className="card transition-fast"
        style={{ cursor: 'pointer', overflow: 'hidden', padding: '0.25rem' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
      >
        <button onClick={() => setOpen(true)} className="block text-left w-full" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          {/* Image area — slightly darker inset so the card bg reads as the "frame" */}
          <div style={{ aspectRatio: '3/4', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: 'var(--page-bg)' }}>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={car?.name}
                className={fill ? 'w-full h-full object-cover block' : 'w-full h-full object-contain block'}
                loading="lazy"
                style={{ padding: fill ? 0 : '0.5rem' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No image
              </div>
            )}
          </div>

          <div style={{ padding: '0.5rem 0.375rem 0.375rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {car?.name ?? 'Untitled'}
            </h3>
          </div>
        </button>

        {initialized && user && (
          <div style={{ display: 'flex', gap: '0.375rem', padding: '0 0.375rem 0.5rem' }}>
            <button
              onClick={e => { e.stopPropagation(); navigate(`/admin/edit-car/${car?.id}`) }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                fontSize: '0.75rem', padding: '0.35rem 0.5rem', borderRadius: '6px',
                border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb',
                cursor: 'pointer', transition: 'opacity 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
              </svg>
              Edit
            </button>
            <button
              onClick={async e => {
                e.stopPropagation()
                if (!car?.id) return
                if (!confirm('Delete this car?')) return
                try { await deleteCar(car.id); window.location.reload() }
                catch { alert('Failed to delete car') }
              }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                fontSize: '0.75rem', padding: '0.35rem 0.5rem', borderRadius: '6px',
                border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626',
                cursor: 'pointer', transition: 'opacity 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div
            className="relative w-full h-full sm:w-[90%] sm:max-w-4xl sm:max-h-[90vh] sm:rounded-lg overflow-auto"
            style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-md)' }}
          >
            <div style={{ padding: '1rem' }}>
              {imagesQuery.isLoading || carQuery.isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ height: '16rem' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '60%' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '40%' }} />
                </div>
              ) : (
                <CarDetailsView
                  car={carQuery.data ?? (car as any)}
                  images={(imagesQuery.data ?? []) as any}
                  user={user}
                  initialized={initialized}
                  onBack={() => setOpen(false)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}