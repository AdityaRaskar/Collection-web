import { useQuery } from '@tanstack/react-query'
import { fetchCars } from '../services/cars'
import { Car } from '../types'

export function useCars(params: Record<string, any>) {
  const key = ['cars', params]
  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchCars(params),
    keepPreviousData: true,
    staleTime: 1000 * 60
  })
  return query
}
