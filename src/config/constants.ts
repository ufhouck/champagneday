// API Configuration
export const API_CONFIG = {
  WEATHER: {
    KEY: '72fc1f39f6ee44de8a874625241911',
    BASE_URL: 'https://api.weatherapi.com/v1'
  },
  HERE_MAPS: {
    KEY: 'zqRv9PKEZzN8TeNP0y1ExKaAkAGG_sYcRi88PoEhIEQ',
    BASE_URL: 'https://traffic.ls.hereapi.com/traffic/6.2'
  }
} as const;

// Location
export const LOCATION = {
  LAT: 37.0407,
  LON: 27.2342,
  NAME: 'Champagne Bay'
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  WEATHER: 15 * 60 * 1000,    // 15 minutes
  CROWD: 5 * 60 * 1000        // 5 minutes
} as const;

// Default values
export const DEFAULTS = {
  SEA_TEMP: 24, // °C
  WIND_SPEED: 5, // km/h
  AIR_TEMP: 24  // °C
} as const;