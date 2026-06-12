import supabase from './supabase'
import { Car, CarImage } from '../types'

export type CarFilter = {
  q?: string
  brand?: string
  series?: string
  year?: number
  rarity?: string
  tags?: string[]
  limit?: number
  offset?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

export async function fetchCars(filters: CarFilter = {}) {
  const { q, brand, series, year, rarity, tags, limit = 24, offset = 0, orderBy = 'created_at', order = 'desc' } = filters

  let query = supabase.from('cars').select('*', { count: 'exact' }).range(offset, offset + limit - 1)

  // Basic search across name, brand, series, and tags
  if (q) {
    // Use ilike for partial matches
    const like = `%${q}%`
    query = query.or(`name.ilike.${like},brand.ilike.${like},series.ilike.${like}`)
  }

  if (brand) query = query.eq('brand', brand)
  if (series) query = query.eq('series', series)
  if (year) query = query.eq('year', year)
  if (rarity) query = query.eq('rarity', rarity)
  if (tags && tags.length) query = query.contains('tags', tags)

  // ordering
  query = query.order(orderBy, { ascending: order === 'asc' })

  const { data, error, count } = await query
  if (error) throw error
  return { data: data as Car[] | null, count: count ?? 0 }
}

export async function fetchCarById(id: string) {
  const { data, error } = await supabase.from('cars').select('*').eq('id', id).single()
  if (error) throw error
  // debug fetched car
  // eslint-disable-next-line no-console
  console.debug('fetchCarById:', id, data)
  return data as Car
}

export async function fetchImagesForCar(car_id: string) {
  const { data, error } = await supabase.from('car_images').select('*').eq('car_id', car_id).order('display_order', { ascending: true })
  if (error) throw error
  // debug fetched images
  // eslint-disable-next-line no-console
  console.debug('fetchImagesForCar:', car_id, data)
  return (data as CarImage[]) ?? []
}

export async function createCar(payload: Partial<Car>) {
  const { data, error } = await supabase.from('cars').insert([payload]).select().single()
  if (error) throw error
  return data as Car
}

export async function updateCar(id: string, payload: Partial<Car>) {
  const { data, error } = await supabase.from('cars').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Car
}

export async function deleteCar(id: string) {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
  return true
}

// Image helpers: upload to storage and create metadata row
export async function uploadCarImage(carId: string, file: File) {
  const filePath = `cars/${carId}/${Date.now()}_${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage.from('car-images').upload(filePath, file)
  if (uploadError) throw uploadError

  // Debug: log upload path (non-sensitive)
  // eslint-disable-next-line no-console
  const uploadedPath = (uploadData as any)?.path
  console.debug('uploadCarImage: uploaded to storage path', uploadedPath)

  // Try to get a public URL; if bucket is private, fall back to signed URL
  let url = ''
  try {
    const pub = await supabase.storage.from('car-images').getPublicUrl(uploadedPath)
    url = (pub as any)?.data?.publicUrl ?? ''
  } catch (e) {
    // ignore and try signed url
  }

  if (!url) {
    try {
      const signed = await supabase.storage.from('car-images').createSignedUrl(uploadedPath, 60 * 60)
      url = (signed as any)?.data?.signedUrl ?? ''
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('uploadCarImage: createSignedUrl failed', e)
    }
  }

  if (!url) {
    // If we couldn't derive a URL, surface an informative error
    const err = new Error('Uploaded file but could not generate a public or signed URL for the image')
    // eslint-disable-next-line no-console
    console.error('uploadCarImage:', err)
    throw err
  }

  const { data, error } = await supabase
    .from('car_images')
    .insert([{ car_id: carId, image_url: url, image_path: uploadedPath }])
    .select()
    .single()
  if (error) {
    // eslint-disable-next-line no-console
    console.error('uploadCarImage: failed to insert car_images row', error)
    throw error
  }
  // eslint-disable-next-line no-console
  console.debug('uploadCarImage: inserted car_images row', data)
  return data as CarImage
}

export async function uploadCarImages(carId: string, files: File[]) {
  // upload files in parallel, return created CarImage rows
  const promises = files.map((f) => uploadCarImage(carId, f).then((r) => ({ status: 'fulfilled', value: r })).catch((err) => ({ status: 'rejected', reason: err })))
  const results = await Promise.all(promises)
  const uploaded: CarImage[] = []
  for (const r of results) {
    if ((r as any).status === 'fulfilled') uploaded.push((r as any).value)
  }

  // eslint-disable-next-line no-console
  console.debug('uploadCarImages: uploaded count', uploaded.length)

  // set thumbnail if missing
  if (uploaded.length) {
    try {
      const car = await fetchCarById(carId)
      const extras = (car.extra_attributes as Record<string, any>) || {}
      if (!extras.thumbnail) {
        extras.thumbnail = uploaded[0].image_url
        await updateCar(carId, { extra_attributes: extras })
      }
    } catch (e) {
      // ignore
    }
  }

  return uploaded
}

export async function deleteCarImage(imageId: string, imagePath?: string) {
  // delete metadata
  const { data, error } = await supabase.from('car_images').delete().eq('id', imageId)
  if (error) throw error
  // Optionally delete from storage if path provided
  if (imagePath) {
    try {
      await supabase.storage.from('car-images').remove([imagePath])
    } catch (e) {
      // ignore storage delete errors
    }
  }
  return true
}

export async function reorderCarImages(carId: string, orderedIds: string[]) {
  // Update display_order for each image id in the provided order
  const updates = orderedIds.map((id, idx) => ({ id, display_order: idx }))
  for (const u of updates) {
    const { error } = await supabase.from('car_images').update({ display_order: u.display_order }).eq('id', u.id)
    if (error) throw error
  }
  return true
}
