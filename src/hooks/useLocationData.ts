import useSWR from 'swr';
import { fetchLocationData } from '../lib/api';
import type { LocationData } from '../types/weather';

export function useLocationData() {
  const { data, error } = useSWR<LocationData>(
    'locations',
    fetchLocationData,
    { 
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3
    }
  );

  return {
    locationData: data,
    isLoading: !data && !error,
    error
  };
}