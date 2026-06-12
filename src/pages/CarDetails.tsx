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

  // debug auth + car state
  // eslint-disable-next-line no-console
  console.debug('CarDetails mount', { id, initialized, user, car: carQuery.data })

  const car = carQuery.data

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

  return (
    <div>
      {imagesQuery.isLoading || carQuery.isLoading ? (
        <div className="h-64 bg-gray-100 animate-pulse" />
      ) : (
        <CarDetailsView
          car={carQuery.data}
          images={(imagesQuery.data ?? []) as any}
          user={user}
          initialized={initialized}
          onBack={() => navigate('/')}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
