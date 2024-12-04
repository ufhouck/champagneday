import useSWR from 'swr';
import { fetchLocationData } from '../lib/api';
import type { LocationData } from '../types/weather';

const FALLBACK_LOCATION_DATA: LocationData = {
  gumusluk: {
    temp: 24,
    wind_speed: 18,
    precip_mm: 0,
    sea_temp: 22,
    condition: {
      text: "Sunny",
      code: 1000
    }
  },
  datca: {
    temp: 23,
    wind_speed: 20,
    precip_mm: 0,
    sea_temp: 21,
    condition: {
      text: "Sunny",
      code: 1000
    }
  }
};

export function useLocationData() {
  const { data, error } = useSWR<LocationData>(
    'locations',
    () => fetchLocationData().catch(() => FALLBACK_LOCATION_DATA),
    { 
      refreshInterval: 900000, // 15 minutes
      fallbackData: FALLBACK_LOCATION_DATA,
      revalidateOnFocus: false
    }
  );

  return {
    locationData: data ?? FALLBACK_LOCATION_DATA,
    isLoading: !data && !error,
    error
  };
}