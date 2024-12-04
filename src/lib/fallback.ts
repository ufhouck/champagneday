import type { WeatherData, SeaData } from './api';

export const FALLBACK_WEATHER: WeatherData = {
  current: {
    temp: 24,
    wind_speed: 18,
    wind_deg: 220,
    precip_mm: 0,
    condition: {
      text: "Sunny",
      code: 1000
    }
  },
  hourly: Array.from({ length: 24 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 3600,
    temp: 24 + Math.sin(i / 24 * Math.PI) * 4,
    wind_speed: 18 + Math.sin(i / 24 * Math.PI * 2) * 8,
    wind_deg: 220,
    precip_mm: 0,
    condition: {
      text: "Sunny",
      code: 1000
    }
  })),
  daily: Array.from({ length: 7 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 86400,
    temp: {
      day: 24 + Math.sin(i / 7 * Math.PI) * 4,
      min: 20 + Math.sin(i / 7 * Math.PI) * 4,
      max: 28 + Math.sin(i / 7 * Math.PI) * 4
    },
    wind_speed: 18 + Math.sin(i / 7 * Math.PI * 2) * 8,
    wind_deg: 220,
    precip_mm: 0,
    condition: {
      text: "Sunny",
      code: 1000
    }
  }))
};

export const FALLBACK_SEA: SeaData = {
  water_temperature: 22,
  hourly: Array.from({ length: 24 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 3600,
    water_temperature: 22 + Math.sin(i / 24 * Math.PI) * 2
  }))
};