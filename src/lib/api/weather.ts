import { fetchWithTimeout } from '../utils/fetch';
import { API_URLS, API_KEYS, LOCATION } from '../../config/api';
import type { WeatherData } from '../../types/weather';

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const url = new URL(`${API_URLS.WEATHER}/forecast.json`);
    const params = new URLSearchParams({
      key: API_KEYS.WEATHER,
      q: `${LOCATION.LAT},${LOCATION.LON}`,
      days: '2',
      aqi: 'no'
    });

    const data = await fetchWithTimeout(`${url}?${params}`);

    return {
      current: {
        temp: data.current.temp_c,
        wind_speed: data.current.wind_kph / 3.6, // Convert to m/s
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
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}