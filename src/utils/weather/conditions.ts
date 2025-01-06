import type { WeatherCondition } from '../../types/weather';

// OpenWeatherMap condition codes
export function isRainyCondition(code: number): boolean {
  return (code >= 200 && code <= 531) || // Thunderstorm, drizzle, rain
         (code >= 611 && code <= 616);    // Sleet
}

export function getWeatherDescription(condition: WeatherCondition): string {
  const { code, text } = condition;
  
  if (code >= 200 && code < 300) return 'Thunderstorm';
  if (code >= 300 && code < 400) return 'Drizzle';
  if (code >= 500 && code < 600) return 'Rain';
  if (code >= 600 && code < 700) return 'Snow';
  if (code >= 700 && code < 800) return 'Atmosphere';
  if (code === 800) return 'Clear';
  if (code > 800) return 'Clouds';
  
  return text || 'Unknown';
}