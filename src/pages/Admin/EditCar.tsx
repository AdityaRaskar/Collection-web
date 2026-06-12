import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCar } from '../../hooks/useCar'
import AdminCarForm from '../../components/AdminCarForm'
import ImageManager from '../../components/ImageManager'

export default function EditCar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { carQuery, imagesQuery } = useCar(id)

  if (carQuery.isLoading) return <div className="animate-pulse h-32 bg-gray-100" />
  if (carQuery.isError || !carQuery.data) return <div className="text-red-500">Unable to load car</div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <button onClick={() => navigate(`/car/${id}`)} aria-label="Back to details" className="p-2 rounded border">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Edit Car</h2>
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow space-y-6">
        <AdminCarForm initial={carQuery.data} />

        <div>
          <h3 className="font-semibold mb-2">Manage Images</h3>
          {imagesQuery.isLoading ? (
            <div className="animate-pulse h-24 bg-gray-100" />
          ) : (
            <ImageManager carId={id as string} images={(imagesQuery.data ?? []) as any} />
          )}
        </div>
      </div>
    </div>
  )
}
