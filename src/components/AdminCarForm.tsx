import React, { useState } from 'react'
import { createCar, uploadCarImages, updateCar, fetchCarById } from '../services/cars'
import { useQueryClient } from '@tanstack/react-query'
import { Car } from '../types'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

type Props = {
  initial?: Partial<Car>
}

export default function AdminCarForm({ initial }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [series, setSeries] = useState(initial?.series ?? '')
  const [year, setYear] = useState(initial?.year ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [extra, setExtra] = useState<Array<{ key: string; value: string }>>([])
  const [files, setFiles] = useState<File[]>([])
  const [fileStates, setFileStates] = useState<
    Array<{
      file: File
      status: 'idle' | 'uploading' | 'success' | 'error'
      url?: string
      error?: string
      preview?: string
    }>
  >([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { push } = useToast()
  const queryClient = useQueryClient()

  const addExtra = () => setExtra((e) => [...e, { key: '', value: '' }])
  const updateExtra = (i: number, field: 'key' | 'value', val: string) =>
    setExtra((e) => e.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)))

  // initialize extra attributes when editing an existing car
  React.useEffect(() => {
    if (initial?.extra_attributes && (!extra || extra.length === 0)) {
      const entries = Object.entries(initial.extra_attributes as Record<string, any>)
      const mapped = entries.map(([k, v]) => ({ key: k, value: typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v) }))
      setExtra(mapped)
    }
    // only run when initial changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  const previewsRef = React.useRef<string[]>([])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const list = Array.from(e.target.files)
    setFiles((f) => [...f, ...list])
    setFileStates((s) => {
      const added = list.map((file) => {
        const preview = URL.createObjectURL(file)
        previewsRef.current.push(preview)
        return { file, status: 'idle' as const, preview }
      })
      return [...s, ...added]
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const list = Array.from(e.dataTransfer.files)
      setFiles((f) => [...f, ...list])
      setFileStates((s) => {
        const added = list.map((file) => {
          const preview = URL.createObjectURL(file)
          previewsRef.current.push(preview)
          return { file, status: 'idle' as const, preview }
        })
        return [...s, ...added]
      })
    }
  }

  const prevent = (e: React.DragEvent) => e.preventDefault()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: Partial<Car> = {
        name,
        brand,
        series,
        year: year ? Number(year) : undefined,
        description,
        extra_attributes: Object.fromEntries(extra.filter((x) => x.key).map((x) => [x.key, x.value]))
      }

      let created
      if (initial?.id) {
        // merge existing extra_attributes to avoid overwriting server-side values
        try {
          const existing = await fetchCarById(initial.id)
          const existingExtras = (existing?.extra_attributes as Record<string, any>) || {}
          payload.extra_attributes = { ...existingExtras, ...(payload.extra_attributes as Record<string, any>) }
        } catch (e) {
          // ignore and proceed with provided payload
        }
        created = await updateCar(initial.id, payload)
      } else {
        created = await createCar(payload)
      }
      // upload images in parallel using helper; update per-file states
      if (files.length) {
        setFileStates((s) => s.map((it) => ({ ...it, status: 'uploading' })))
        try {
          const uploaded = await uploadCarImages((created as any).id, files)
          setFileStates((s) =>
            s.map((it, idx) =>
              idx < uploaded.length
                ? { ...it, status: 'success', url: (uploaded[idx] as any).image_url }
                : { ...it, status: 'error', error: 'Upload failed' }
            )
          )
        } catch (err: any) {
          setFileStates((s) => s.map((it) => ({ ...it, status: 'error', error: err?.message ?? 'error' })))
          push({ message: `Failed to upload images: ${err?.message ?? 'error'}`, tone: 'error' })
        }
      }

      // Write saved car into cache and invalidate list so other views immediately reflect changes
      try {
        const idStr = (created as any).id as string
        if (idStr) {
          queryClient.setQueryData(['car', idStr], created)
          queryClient.invalidateQueries({ queryKey: ['cars'] })
        }
      } catch (e) {
        // ignore
      }

      push({ message: 'Car saved successfully', tone: 'success' })
      navigate(`/car/${(created as any).id}`)
    } catch (err) {
      console.error(err)
      push({ message: 'Failed to save car', tone: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // remove a queued file before upload
  const removeFileAt = (index: number) => {
    setFileStates((s) => {
      const item = s[index]
      if (item?.preview) {
        URL.revokeObjectURL(item.preview)
        previewsRef.current = previewsRef.current.filter((p) => p !== item.preview)
      }
      const next = s.slice(0, index).concat(s.slice(index + 1))
      return next
    })
    setFiles((f) => f.slice(0, index).concat(f.slice(index + 1)))
  }

  // revoke previews on unmount
  React.useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => {
        try {
          URL.revokeObjectURL(p)
        } catch (e) {
          /* ignore */
        }
      })
      previewsRef.current = []
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-2 py-1 rounded" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>
          <div className="text-sm text-gray-600">Brand</div>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </label>
        <label>
          <div className="text-sm text-gray-600">Series</div>
          <input value={series} onChange={(e) => setSeries(e.target.value)} className="w-full border px-2 py-1 rounded" />
        </label>
      </div>
      <div>
        <label className="block">Year</label>
        <input value={year} onChange={(e) => setYear(e.target.value)} className="w-32 border px-2 py-1 rounded" />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Extra Attributes</h4>
          <button type="button" className="text-sm text-blue-600" onClick={addExtra}>
            + Add Attribute
          </button>
        </div>
        <div className="space-y-2 mt-2">
          {extra.map((e, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input placeholder="Key" value={e.key} onChange={(ev) => updateExtra(i, 'key', ev.target.value)} className="border px-2 py-1 rounded" />
              <input placeholder="Value" value={e.value} onChange={(ev) => updateExtra(i, 'value', ev.target.value)} className="border px-2 py-1 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block">Images</label>
        <div
          className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded text-center"
          onDrop={handleDrop}
          onDragOver={prevent}
          onDragEnter={prevent}
        >
          <div className="mb-2">Drag & drop images here, or</div>
          <input type="file" multiple accept="image/*" onChange={handleFiles} />
        </div>

        {fileStates.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {fileStates.map((fs, i) => (
              <div key={i} className="p-1 border rounded w-32 flex-none">
                <img src={fs.preview ?? ''} alt={fs.file.name} className="w-full h-24 object-cover rounded" />
                <div className="text-xs truncate">{fs.file.name}</div>
                <div className="text-xs mt-1 flex items-center justify-between">
                  <div>
                    {fs.status === 'idle' && <span className="text-gray-500">Queued</span>}
                    {fs.status === 'uploading' && <span className="text-blue-600">Uploading…</span>}
                    {fs.status === 'success' && <span className="text-green-600">Uploaded</span>}
                    {fs.status === 'error' && <span className="text-red-600">Error</span>}
                  </div>
                  <div>
                    {fs.status !== 'uploading' && fs.status !== 'success' && (
                      <button type="button" className="text-xs text-red-600 ml-2" onClick={() => removeFileAt(i)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}
