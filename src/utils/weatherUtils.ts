import type { WeatherCondition } from '../types/weather';

export function isRainyCondition(code: number): boolean {
  // OpenWeatherMap rain condition codes
  return code >= 200 && code <= 531;
}

export function getWeatherDescription(code: number): string {
  // OpenWeatherMap condition codes
  if (code >= 200 && code < 300) return 'Thunderstorm';
  if (code >= 300 && code < 400) return 'Drizzle';
  if (code >= 500 && code < 600) return 'Rain';
  if (code >= 600 && code < 700) return 'Snow';
  if (code >= 700 && code < 800) return 'Atmosphere';
  if (code === 800) return 'Clear';
  if (code > 800) return 'Clouds';
  return 'Unknown';
}