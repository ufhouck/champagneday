import type { WeatherCondition, SwimConditions } from '../../types/weather';

// Simple weather prediction model
export function predictTomorrowWeather(today: SwimConditions): SwimConditions {
  // Temperature usually varies by 2-4 degrees
  const tempVariation = Math.random() * 2 + 1;
  const isWarming = Math.random() > 0.5;
  
  // Wind typically changes by 20-30%
  const windVariation = 0.2 + Math.random() * 0.1;
  const isWindier = Math.random() > 0.6;

  // Predict conditions
  const airTemp = today.airTemp + (isWarming ? tempVariation : -tempVariation);
  const windSpeed = today.windSpeed * (isWindier ? 1 + windVariation : 1 - windVariation);
  
  // Predict precipitation (slight chance of rain if currently dry)
  const precipMm = today.precipMm > 0 
    ? today.precipMm * 0.7 // Rain likely decreasing
    : Math.random() > 0.8 ? 0.5 : 0;

  // Predict weather condition
  const condition: WeatherCondition = {
    code: predictWeatherCode(today.condition?.code, precipMm),
    text: getPredictedWeatherText(precipMm, airTemp, windSpeed)
  };

  return {
    airTemp: Math.round(airTemp * 10) / 10,
    windSpeed: Math.round(windSpeed * 10) / 10,
    windDeg: ((today.windDeg + Math.round(Math.random() * 45 - 22.5)) + 360) % 360,
    seaTemp: today.seaTemp, // Sea temp changes very slowly
    precipMm: Math.round(precipMm * 10) / 10,
    condition
  };
}

function predictWeatherCode(currentCode: number = 800, precipMm: number): number {
  if (precipMm > 0) {
    return precipMm > 2.5 ? 502 : 500; // Heavy or light rain
  }
  
  if (currentCode >= 800) {
    // Clear to partly cloudy
    return Math.random() > 0.7 ? 801 : 800;
  }
  
  // Generally improving conditions
  return 800;
}

function getPredictedWeatherText(precipMm: number, temp: number, windSpeed: number): string {
  if (precipMm > 2.5) return 'Heavy rain';
  if (precipMm > 0) return 'Light rain';
  if (windSpeed > 25) return 'Strong winds';
  if (temp > 28) return 'Hot and sunny';
  if (temp < 15) return 'Cool';
  return 'Mostly clear';
}