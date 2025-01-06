import { fetchTrafficData } from '../lib/api/here';

const CACHE_KEY = 'crowdEstimate';

interface CrowdEstimate {
  count: number;
  timestamp: number;
}

export async function estimateCrowdSize(): Promise<number> {
  try {
    const trafficData = await fetchTrafficData();
    
    // Trafik yoğunluğuna göre baz tahmini yap
    const jamFactor = trafficData.flowSegmentData.jamFactor / 10; // 0-1 arası normalize et
    const speedRatio = trafficData.flowSegmentData.currentSpeed / trafficData.flowSegmentData.freeFlowSpeed;
    
    // Saat bazlı baz tahmin
    const baseEstimate = getTimeBasedBaseEstimate();
    
    // Trafik faktörlerini kullanarak tahmini ayarla
    let adjustment = 0;
    if (jamFactor > 0.7) adjustment = 2;
    else if (jamFactor > 0.4) adjustment = 1;
    if (speedRatio < 0.5) adjustment += 1;
    
    const finalEstimate = Math.min(Math.max(baseEstimate + adjustment, 0), 15);
    
    // Tahmini cache'le
    cacheEstimate(finalEstimate);
    
    return finalEstimate;
  } catch (error) {
    console.warn('Falling back to time-based estimate:', error);
    return getTimeBasedBaseEstimate();
  }
}

function getTimeBasedBaseEstimate(): number {
  const hour = new Date().getHours();
  
  if (hour >= 22 || hour < 6) return 0;
  if (hour >= 11 && hour <= 16) return 8; // Peak hours
  if (hour >= 9 && hour < 11) return 5;   // Morning
  if (hour >= 16 && hour < 19) return 6;  // Evening
  return 3; // Other times
}

function cacheEstimate(count: number): void {
  try {
    const estimate: CrowdEstimate = {
      count,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(estimate));
  } catch (error) {
    console.warn('Failed to cache crowd estimate:', error);
  }
}