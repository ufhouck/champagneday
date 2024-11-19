import useSWR from 'swr';
import { fetchWeatherData, fetchSeaData, fetchWindData } from '../lib/api';
import type { WeatherData, SeaData } from '../lib/api';
import { FALLBACK_WEATHER, FALLBACK_SEA } from '../lib/fallback';

const fetcher = async (key: string) => {
  try {
    switch (key) {
      case 'weather':
        return await fetchWeatherData();
      case 'sea':
        return await fetchSeaData();
      case 'wind':
        return await fetchWindData();
      default:
        throw new Error(`Unknown key: ${key}`);
    }
  } catch (error) {
    console.warn(`${key} API error:`, error);
    switch (key) {
      case 'weather':
        return FALLBACK_WEATHER;
      case 'sea':
        return FALLBACK_SEA;
      case 'wind':
        return FALLBACK_WEATHER.current.wind_speed;
      default:
        throw error;
    }
  }
};

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
    fetcher,
    { 
      ...SWR_CONFIG,
      refreshInterval: 900000,
      fallbackData: FALLBACK_WEATHER,
    }
  );

  const { data: seaData, error: seaError } = useSWR<SeaData>(
    'sea',
    fetcher,
    { 
      ...SWR_CONFIG,
      refreshInterval: 900000,
      fallbackData: FALLBACK_SEA,
    }
  );

  const { data: windSpeed, error: windError } = useSWR<number>(
    'wind',
    fetcher,
    {
      ...SWR_CONFIG,
      refreshInterval: 300000,
      fallbackData: FALLBACK_WEATHER.current.wind_speed,
    }
  );

  const hasError = Boolean(weatherError || seaError || windError);
  const isLoading = !weatherData || !seaData || !windSpeed;

  return {
    weatherData: {
      ...weatherData ?? FALLBACK_WEATHER,
      current: {
        ...(weatherData?.current ?? FALLBACK_WEATHER.current),
        wind_speed: windSpeed ?? FALLBACK_WEATHER.current.wind_speed
      }
    },
    seaData: seaData ?? FALLBACK_SEA,
    isLoading: isLoading && !hasError,
    error: hasError,
  };
}