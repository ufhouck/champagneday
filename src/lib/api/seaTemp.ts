import { fetchWithTimeout } from '../utils/fetch';
import { API_URLS, API_KEYS, LOCATION, DEFAULTS } from '../../config/api';

const CACHE_KEY = 'seaTemp';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 saat

interface StormglassResponse {
  hours: Array<{
    time: string;
    waterTemperature: {
      sg: number;
    };
  }>;
}

function getCachedTemp(): number | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { temp, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION) {
      return temp;
    }
    return null;
  } catch {
    return null;
  }
}

function cacheTemp(temp: number): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      temp,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache sea temperature:', error);
  }
}

export async function fetchSeaTemperature(): Promise<number> {
  // Önce cache'e bak
  const cachedTemp = getCachedTemp();
  if (cachedTemp !== null) {
    return cachedTemp;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const endTime = now + 3600; // 1 saatlik veri
    
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

    const latestTemp = data.hours[0]?.waterTemperature?.sg;
    
    if (typeof latestTemp === 'number') {
      // Sıcaklığı cache'le
      cacheTemp(latestTemp);
      return latestTemp;
    }

    throw new Error('Invalid temperature data');
  } catch (error) {
    console.warn('Stormglass API error:', error);
    
    // Cache'de veri yoksa ve API çağrısı başarısız olduysa default değeri döndür
    return DEFAULTS.SEA_TEMP;
  }
}