import { useQuery } from '@tanstack/react-query'
import { fetchCarById, fetchImagesForCar } from '../services/cars'

export function useCar(id?: string) {
  const carQuery = useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id as string),
    enabled: !!id,
    // always refetch when the details page mounts to avoid stale cached objects
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  const imagesQuery = useQuery({
    queryKey: ['car', id, 'images'],
    queryFn: () => fetchImagesForCar(id as string),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  return { carQuery, imagesQuery }
}
