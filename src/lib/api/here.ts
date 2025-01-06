import { fetchWithTimeout } from '../utils/fetch';

const HERE_API_KEY = 'zqRv9PKEZzN8TeNP0y1ExKaAkAGG_sYcRi88PoEhIEQ';
const CACHE_KEY = 'hereTrafficData';

interface TrafficResponse {
  flowSegmentData: {
    confidence: number;
    currentSpeed: number;
    freeFlowSpeed: number;
    currentTravelTime: number;
    jamFactor: number;
  };
}

// Cache sürelerini tanımla
const CACHE_PERIODS = {
  MORNING: { hour: 8, duration: 4 * 60 * 60 * 1000 },   // 4 saat
  AFTERNOON: { hour: 13, duration: 4 * 60 * 60 * 1000 },
  EVENING: { hour: 18, duration: 4 * 60 * 60 * 1000 }
};

function getCachedTrafficData(): any | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp, period } = JSON.parse(cached);
    const now = new Date();
    const currentHour = now.getHours();

    // Şu anki periyodu bul
    const currentPeriod = Object.values(CACHE_PERIODS).find(p => 
      currentHour >= p.hour && currentHour < p.hour + 4
    );

    // Eğer aynı periyottaysak ve cache süresi dolmamışsa
    if (currentPeriod && period === currentPeriod.hour && 
        (Date.now() - timestamp) < currentPeriod.duration) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function cacheTrafficData(data: any): void {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Hangi periyotta olduğumuzu bul
    const period = Object.values(CACHE_PERIODS).find(p => 
      currentHour >= p.hour && currentHour < p.hour + 4
    )?.hour;

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      period
    }));
  } catch (error) {
    console.warn('Failed to cache traffic data:', error);
  }
}

export async function fetchTrafficData() {
  // Önce cache'e bak
  const cachedData = getCachedTrafficData();
  if (cachedData !== null) {
    return cachedData;
  }

  try {
    const url = new URL('https://traffic.ls.hereapi.com/traffic/6.2/flow.json');
    const params = new URLSearchParams({
      apiKey: HERE_API_KEY,
      bbox: '37.0307,27.2242;37.0507,27.2442', // Champagne Bay çevresi
      responseattributes: 'sh,fc'
    });

    const data = await fetchWithTimeout<TrafficResponse>(`${url}?${params}`);
    cacheTrafficData(data);
    return data;
  } catch (error) {
    console.error('HERE API error:', error);
    throw error;
  }
}