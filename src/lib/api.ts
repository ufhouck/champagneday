import type { WeatherData } from '../types/weather';

const API_KEY = 'your_api_key'; // Should be in .env file

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const data = await fetchWithTimeout(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=37.0407,27.2342&days=7&aqi=no`
    );

    return {
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
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
}