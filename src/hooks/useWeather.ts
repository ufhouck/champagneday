import useSWR from 'swr';
import { fetchWeatherData } from '../lib/api/weather';
import { fetchSeaTemperature } from '../lib/api/seaTemp';
import { CACHE_DURATION, DEFAULTS } from '../config/api';
import type { WeatherData } from '../types/weather';

const FALLBACK_WEATHER: WeatherData = {
  current: {
    temp: DEFAULTS.AIR_TEMP,
    wind_speed: DEFAULTS.WIND_SPEED,
    wind_deg: 180,
    precip_mm: 0,
    condition: {
      text: 'Clear sky',
      code: 800
    }
  },
  daily: []
};

export function useWeather() {
  // Fetch weather data
  const { data: weatherData, error: weatherError } = useSWR<WeatherData>(
    'weather',
    fetchWeatherData,
    {
      refreshInterval: CACHE_DURATION.WEATHER,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      fallbackData: FALLBACK_WEATHER
    }
  );

  // Fetch sea temperature
  const { data: seaTemp } = useSWR(
    'seaTemp',
    fetchSeaTemperature,
    {
      refreshInterval: CACHE_DURATION.SEA_TEMP,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      fallbackData: DEFAULTS.SEA_TEMP
    }
  );

  return {
    weatherData: weatherData ?? FALLBACK_WEATHER,
    seaTemp: seaTemp ?? DEFAULTS.SEA_TEMP,
    isLoading: !weatherData,
    error: weatherError
  };
}