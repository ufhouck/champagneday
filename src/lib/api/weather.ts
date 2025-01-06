import { fetchWithTimeout } from '../utils/fetch';
import { API_URLS, API_KEYS, LOCATION } from '../../config/api';
import type { WeatherData } from '../../types/weather';

const CACHE_KEY = 'weatherData';
const CACHE_DURATION = 30 * 60 * 1000; // 30 dakika

function getCachedWeather(): WeatherData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function cacheWeather(data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache weather data:', error);
  }
}

export async function fetchWeatherData(): Promise<WeatherData> {
  // Önce cache'e bak
  const cachedData = getCachedWeather();
  if (cachedData) {
    return cachedData;
  }

  try {
    const url = new URL(`${API_URLS.WEATHER}/forecast.json`);
    const params = new URLSearchParams({
      key: API_KEYS.WEATHER,
      q: `${LOCATION.LAT},${LOCATION.LON}`,
      days: '2',
      aqi: 'no'
    });

    const data = await fetchWithTimeout(`${url}?${params}`);
    const weatherData: WeatherData = {
      current: {
        temp: data.current.temp_c,
        wind_speed: data.current.wind_kph / 3.6,
        wind_deg: data.current.wind_degree,
        precip_mm: data.current.precip_mm,
        condition: {
          text: data.current.condition.text,
          code: data.current.condition.code
        }
      },
      daily: data.forecast.forecastday.map((day: any) => ({
        dt: Math.floor(new Date(day.date).getTime() / 1000),
        temp: {
          day: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c
        },
        wind_speed: day.day.maxwind_kph / 3.6,
        wind_deg: day.hour[12].wind_degree,
        precip_mm: day.day.totalprecip_mm,
        condition: {
          text: day.day.condition.text,
          code: day.day.condition.code
        }
      }))
    };

    cacheWeather(weatherData);
    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}