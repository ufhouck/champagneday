// API Base URLs
export const API_URLS = {
  WEATHER: 'https://api.weatherapi.com/v1',
  STORMGLASS: 'https://api.stormglass.io/v2'
} as const;

// API Keys
export const API_KEYS = {
  WEATHER: '72fc1f39f6ee44de8a874625241911',
  STORMGLASS: 'fff594d2-cc03-11ef-9159-0242ac130003-fff59568-cc03-11ef-9159-0242ac130003'
} as const;

// Location coordinates
export const LOCATION = {
  LAT: 37.0407,
  LON: 27.2342,
  NAME: 'Champagne Bay'
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  WEATHER: 15 * 60 * 1000,    // 15 minutes
  SEA_TEMP: 60 * 60 * 1000    // 1 hour
} as const;

// Default values
export const DEFAULTS = {
  SEA_TEMP: 24, // °C
  WIND_SPEED: 5, // km/h
  AIR_TEMP: 24  // °C
} as const;