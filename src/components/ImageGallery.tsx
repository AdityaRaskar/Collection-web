import React, { useEffect, useState } from 'react'
import supabase from '../services/supabase'
import { useImageDisplay } from '../contexts/ImageDisplayContext'
import FullscreenImage from './FullscreenImage'

type Props = {
  images: Array<{ id: string; image_url: string; image_path?: string }>
}

export default function ImageGallery({ images }: Props) {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(images && images.length ? images[0].id : null)
  const { fill } = useImageDisplay()
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [fullscreen, setFullscreen] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function resolve() {
      const map: Record<string, string> = {}
      for (const img of images || []) {
        if (img.image_path) {
          // try public URL first
          try {
            const pub = supabase.storage.from('car-images').getPublicUrl(img.image_path)
            const publicUrl = (pub as any)?.data?.publicUrl ?? ''
            if (publicUrl) {
              map[img.id] = publicUrl
              continue
            }
          } catch (_) {
            // ignore
          }

          // fall back to signed URL
          try {
            const signed = await supabase.storage.from('car-images').createSignedUrl(img.image_path, 60 * 60)
            map[img.id] = (signed as any)?.data?.signedUrl ?? img.image_url
            continue
          } catch (_) {
            map[img.id] = img.image_url
            continue
          }
        }

        // default to whatever is stored
        map[img.id] = img.image_url
      }
      if (mounted) setUrls(map)
    }
    resolve()
    return () => {
      mounted = false
    }
  }, [images])

  useEffect(() => {
    // update selected if images change
    if (images && images.length) setSelected((s) => s ?? images[0].id)
  }, [images])

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
        <div className="text-gray-500">No images</div>
      </div>
    )
  }

  const focusIndex = React.useMemo(() => images.findIndex((i) => i.id === selected), [images, selected])

  function handleKey(e: React.KeyboardEvent) {
    if (!images || images.length === 0) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (focusIndex > 0 ? focusIndex - 1 : images.length - 1)
      setSelected(images[prev].id)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (focusIndex < images.length - 1 ? focusIndex + 1 : 0)
      setSelected(images[next].id)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSelected(images[0].id)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSelected(images[images.length - 1].id)
    }
  }

  // ensure the gallery container is focused so keyboard navigation works
  React.useEffect(() => {
    const el = containerRef.current
    if (el) {
      try {
        el.focus()
      } catch (_) {
        // ignore
      }
    }
  }, [containerRef, selected])

  // scroll selected thumbnail into view when it changes
  React.useEffect(() => {
    if (!selected) return
    try {
      const el = document.getElementById(`thumb-${selected}`)
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    } catch (_) {
      // ignore
    }
  }, [selected])

  return (
    <div className="space-y-2">
      <div ref={containerRef} tabIndex={0} onKeyDown={handleKey} className="rounded overflow-hidden outline-none focus-within:ring-2 focus-within:ring-blue-300">
        <img
          onClick={() => setFullscreen(urls[selected ?? images[0].id] ?? images.find((i) => i.id === selected)?.image_url ?? images[0].image_url)}
          src={urls[selected ?? images[0].id] ?? images.find((i) => i.id === selected)?.image_url ?? images[0].image_url}
          alt="Main"
          className={`w-full h-64 sm:h-80 md:h-96 ${fill ? 'object-cover' : 'object-contain'} rounded cursor-zoom-in`}
          loading="lazy"
        />
      </div>
      {fullscreen ? <FullscreenImage src={fullscreen} onClose={() => setFullscreen(null)} /> : null}
      <div className="flex gap-2 overflow-x-auto py-1" role="list" aria-label="thumbnails">
        {images.map((img) => {
          const src = urls[img.id] ?? img.image_url
          const isSelected = img.id === selected
          return (
            <button
              id={`thumb-${img.id}`}
              key={img.id}
              onClick={() => setSelected(img.id)}
              className={`flex-none rounded overflow-hidden ${isSelected ? 'ring-2 ring-blue-300' : ''}`}
              style={{ width: 64, height: 64 }}
              aria-pressed={isSelected}
              data-thumb-id={img.id}
            >
              <img
                src={src}
                alt="thumb"
                className={`w-full h-full ${isSelected ? 'opacity-100' : 'opacity-60 filter grayscale'} object-cover`}
                loading="lazy"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
