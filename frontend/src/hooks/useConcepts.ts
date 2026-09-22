import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export function useConcepts() {
  return useQuery({
    queryKey: ['concepts'],
    queryFn: api.listConcepts,
  })
}
