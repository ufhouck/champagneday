import { API_CONFIG, LOCATION } from '../../config/constants';
import { fetchWithTimeout } from '../utils/fetch';
import { getTimeBasedEstimate } from '../../utils/crowd';

interface TrafficResponse {
  flowSegmentData: {
    confidence: number;
    currentSpeed: number;
    freeFlowSpeed: number;
    currentTravelTime: number;
    jamFactor: number;
  };
}

export async function estimateCrowdSize(): Promise<number> {
  try {
    const url = new URL(`${API_CONFIG.HERE_MAPS.BASE_URL}/flow.json`);
    const params = new URLSearchParams({
      apiKey: API_CONFIG.HERE_MAPS.KEY,
      bbox: `${LOCATION.LAT-0.1},${LOCATION.LON-0.1};${LOCATION.LAT+0.1},${LOCATION.LON+0.1}`,
      responseattributes: 'sh,fc'
    });

    const data = await fetchWithTimeout<TrafficResponse>(`${url}?${params}`);
    
    // Get base estimate from time of day
    const baseEstimate = getTimeBasedEstimate();
    
    // Adjust based on traffic conditions
    const jamFactor = data.flowSegmentData.jamFactor / 10;
    const trafficAdjustment = Math.round(jamFactor * 2);
    
    // Calculate final estimate
    return Math.min(Math.max(baseEstimate + trafficAdjustment, 0), 14);
  } catch (error) {
    console.warn('Falling back to time-based crowd estimate:', error);
    return getTimeBasedEstimate();
  }
}