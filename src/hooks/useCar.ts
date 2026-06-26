import { useQuery } from '@tanstack/react-query'
import { fetchCarById, fetchImagesForCar } from '../services/cars'

export function useCar(id?: string) {
  const carQuery = useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id as string),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 / "not found" — it won't fix itself
      const msg = error?.message ?? ''
      if (msg.includes('not found') || msg.includes('404') || msg.includes('PGRST116')) return false
      return failureCount < 2
    },
    staleTime: 1000 * 30,
  })

  const imagesQuery = useQuery({
    queryKey: ['car', id, 'images'],
    queryFn: () => fetchImagesForCar(id as string),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 30,
  })

  return { carQuery, imagesQuery }
}