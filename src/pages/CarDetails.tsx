import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCar } from '../hooks/useCar'
import { deleteCar } from '../services/cars'
import { useAuth } from '../hooks/useAuth'
import CarDetailsView from '../components/CarDetailsView'

export default function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { carQuery, imagesQuery } = useCar(id)
  const { user, initialized } = useAuth()

  const isLoading = carQuery.isLoading || imagesQuery.isLoading
  const isError = carQuery.isError || imagesQuery.isError
  const notFound =
    !carQuery.isLoading &&
    !carQuery.data &&
    !carQuery.isError

  const handleBack = () => {
    // Go back in history if there's a previous entry; otherwise fall to home
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleEdit = () => navigate(`/admin/edit-car/${id}`)

  const handleDelete = async () => {
    if (!confirm('Delete this car? This action cannot be undone.')) return
    try {
      await deleteCar(id as string)
      navigate('/')
    } catch (err) {
      alert('Failed to delete car')
    }
  }

  if (isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <div className="skeleton" style={{ width: '2.5rem', height: '2.2rem', borderRadius: '6px' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: '8px' }} />
          </div>
          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ height: '0.65rem', width: '35%', marginBottom: '0.35rem' }} />
                <div className="skeleton" style={{ height: '0.85rem', width: '70%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    const errMsg =
      (carQuery.error as any)?.message ||
      (imagesQuery.error as any)?.message ||
      'An unexpected error occurred.'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '3rem', height: '3rem', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Failed to load car</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '22rem' }}>{errMsg}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-outline" onClick={() => { carQuery.refetch(); imagesQuery.refetch() }}>
            Try again
          </button>
          <button className="btn-outline" onClick={handleBack}>
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Car not found</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>This car may have been deleted or the link is invalid.</p>
        </div>
        <button className="btn-outline" onClick={handleBack}>← Go back</button>
      </div>
    )
  }

  return (
    <CarDetailsView
      car={carQuery.data}
      images={(imagesQuery.data ?? []) as any}
      user={user}
      initialized={initialized}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}