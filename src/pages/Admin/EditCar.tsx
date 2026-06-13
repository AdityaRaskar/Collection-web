import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCar } from '../../hooks/useCar'
import AdminCarForm from '../../components/AdminCarForm'
import ImageManager from '../../components/ImageManager'

export default function EditCar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { carQuery, imagesQuery } = useCar(id)

  if (carQuery.isLoading) return <div className="skeleton" style={{ height: '8rem', borderRadius: '8px' }} />
  if (carQuery.isError || !carQuery.data) return <div style={{ color: '#ef4444' }}>Unable to load car</div>

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(`/car/${id}`)}
          aria-label="Back to details"
          className="btn-outline"
          style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Edit Car
      </h2>

      <div className="surface" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AdminCarForm initial={carQuery.data} />

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Manage Images</h3>
          {imagesQuery.isLoading ? (
            <div className="skeleton" style={{ height: '6rem', borderRadius: '8px' }} />
          ) : (
            <ImageManager carId={id as string} images={(imagesQuery.data ?? []) as any} />
          )}
        </div>
      </div>
    </div>
  )
}