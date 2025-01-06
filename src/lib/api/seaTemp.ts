import { fetchWithTimeout } from '../utils/fetch';
import { API_URLS, API_KEYS, LOCATION, DEFAULTS } from '../../config/api';

interface StormglassResponse {
  hours: Array<{
    time: string;
    waterTemperature: {
      sg: number;
    };
  }>;
  meta: {
    cost: number;
    dailyQuota: number;
    end: string;
    lat: number;
    lng: number;
    params: string[];
    requestCount: number;
    start: string;
  };
}

export async function fetchSeaTemperature(): Promise<number> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const endTime = now + 3600; // Get 1 hour of data
    
    const url = new URL(`${API_URLS.STORMGLASS}/weather/point`);
    const params = new URLSearchParams({
      lat: LOCATION.LAT.toString(),
      lng: LOCATION.LON.toString(),
      params: 'waterTemperature',
      start: now.toString(),
      end: endTime.toString()
    });

    const data = await fetchWithTimeout<StormglassResponse>(
      `${url}?${params}`,
      {
        headers: {
          'Authorization': API_KEYS.STORMGLASS
        }
      }
    );

    // Get the latest sea temperature
    const latestReading = data.hours[0]?.waterTemperature?.sg;
    
    if (typeof latestReading !== 'number') {
      console.warn('Invalid sea temperature data, using default');
      return DEFAULTS.SEA_TEMP;
    }

    return latestReading;
  } catch (error) {
    console.error('Stormglass API error:', error);
    return DEFAULTS.SEA_TEMP; // Return default value on error
  }
}