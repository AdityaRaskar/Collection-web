import React, { useState } from 'react'
import { CarImage } from '../types'
import { deleteCarImage, reorderCarImages } from '../services/cars'

type Props = {
  carId: string
  images: CarImage[]
  onChange?: (images: CarImage[]) => void
}

export default function ImageManager({ carId, images: initial = [], onChange }: Props) {
  const [images, setImages] = useState<CarImage[]>([...initial])

  const move = async (index: number, dir: -1 | 1) => {
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= images.length) return
    const arr = [...images]
    const tmp = arr[newIndex]
    arr[newIndex] = arr[index]
    arr[index] = tmp
    setImages(arr)
    if (onChange) onChange(arr)
    // persist order
    await reorderCarImages(carId, arr.map((i) => i.id))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    await deleteCarImage(id)
    const arr = images.filter((i) => i.id !== id)
    setImages(arr)
    if (onChange) onChange(arr)
  }

  return (
    <div className="space-y-2">
      {images.map((img, idx) => (
        <div key={img.id} className="flex items-center gap-2 min-w-0">
          <img src={img.image_url} alt="thumb" className="w-20 h-20 object-cover rounded flex-none" loading="lazy" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-600 break-words max-w-full">{img.image_url}</div>
            <div className="space-x-2 mt-2">
              <button className="px-2 py-1 border rounded" onClick={() => move(idx, -1)} disabled={idx === 0}>
                ↑
              </button>
              <button className="px-2 py-1 border rounded" onClick={() => move(idx, 1)} disabled={idx === images.length - 1}>
                ↓
              </button>
              <button className="px-2 py-1 border rounded text-red-600" onClick={() => handleDelete(img.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
