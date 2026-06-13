import React from 'react'
import AdminCarForm from '../../components/AdminCarForm'

export default function AddCar() {
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Add New Car
      </h2>
      <div className="surface" style={{ padding: '1.5rem' }}>
        <AdminCarForm />
      </div>
    </div>
  )
}