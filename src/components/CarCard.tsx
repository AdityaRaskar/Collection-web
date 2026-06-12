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
    if (!targetId) {
      alert('Missing car id')
      return
    }
    if (!confirm('Delete this car? This action cannot be undone.')) return
    try {
      await deleteCar(targetId)
      window.location.reload()
    } catch (err) {
      alert('Failed to delete car')
    }
  }

  const thumbnailUrl =
    (car as any)?.extra_attributes?.thumbnail || (imagesQuery.data && imagesQuery.data.length ? imagesQuery.data[0].image_url : null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // when opening the modal, force a fresh fetch to ensure we have latest car + images
  useEffect(() => {
    if (!open) return
    if (car?.id) {
      try {
        carQuery.refetch()
        imagesQuery.refetch()
      } catch (_) {
        // ignore
      }
    }
  }, [open, car?.id, carQuery, imagesQuery])

  return (
    <>
      <article className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden p-1" style={{ cursor: 'pointer' }}>
        <button onClick={() => setOpen(true)} className="block text-left w-full">
          <div className="mb-2 flex items-center justify-center p-0" style={{ aspectRatio: '3/4', position: 'relative' }}>
            <div className={`w-full h-full bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-sm overflow-hidden flex items-center justify-center p-2`}>
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={car?.name} className={fill ? 'w-full h-full object-cover block' : 'w-full h-full object-contain block'} loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
              )}
            </div>
          </div>
          <div className="px-1 pb-1 pt-1">
            <h3 className="font-semibold text-sm truncate w-full">{car?.name ?? 'Untitled'}</h3>
          </div>
          {initialized && user ? (
            <div className="px-1 pb-2 flex gap-2 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/admin/edit-car/${car?.id}`)
                }}
                className="flex-1 min-w-0 flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded border border-blue-200 bg-blue-50 text-blue-600 h-8 sm:h-9"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center align-middle" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
                </svg>
                <span className="truncate leading-none">Edit</span>
              </button>

              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!car?.id) return
                  if (!confirm('Delete this car? This action cannot be undone.')) return
                  try {
                    await deleteCar(car.id)
                    // reload to refresh list
                    window.location.reload()
                  } catch (err) {
                    alert('Failed to delete car')
                  }
                }}
                className="flex-1 min-w-0 flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded border border-red-200 bg-red-50 text-red-600 h-8 sm:h-9"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center align-middle" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="truncate leading-none">Delete</span>
              </button>
            </div>
          ) : null}
        </button>
      </article>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-md sm:rounded-lg shadow-xl w-full h-full sm:w-[90%] sm:max-w-4xl sm:max-h-[90vh] overflow-auto">
            {/* Header moved into CarDetailsView to avoid duplicate title */}
            <div className="p-4">
              {imagesQuery.isLoading || carQuery.isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ) : (
                <div>
                  <CarDetailsView
                    car={carQuery.data ?? (car as any)}
                    images={(imagesQuery.data ?? []) as any}
                    user={user}
                    initialized={initialized}
                    onBack={() => setOpen(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
