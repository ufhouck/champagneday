import useSWR from 'swr';
import { fetchWeatherData, fetchSeaData } from '../lib/api';
import type { WeatherData, SeaData } from '../lib/api';
import { FALLBACK_WEATHER, FALLBACK_SEA } from '../lib/fallback';

const SWR_CONFIG = {
  revalidateOnFocus: false,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 60000,
};

export function useWeather() {
  const { data: weatherData, error: weatherError } = useSWR<WeatherData>(
    'weather',
    () => fetchWeatherData().catch(() => FALLBACK_WEATHER),
    { 
      ...SWR_CONFIG,
      refreshInterval: 900000,
      fallbackData: FALLBACK_WEATHER,
    }
  );

  const { data: seaData, error: seaError } = useSWR<SeaData>(
    'sea',
    () => fetchSeaData().catch(() => FALLBACK_SEA),
    { 
      ...SWR_CONFIG,
      refreshInterval: 900000,
      fallbackData: FALLBACK_SEA,
    }
  );

  const hasError = Boolean(weatherError || seaError);
  const isLoading = !weatherData || !seaData;

  return {
    weatherData: weatherData ?? FALLBACK_WEATHER,
    seaData: seaData ?? FALLBACK_SEA,
    isLoading: isLoading && !hasError,
    error: hasError,
  };
}