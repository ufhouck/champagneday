import { HERE_MAPS_API } from '../../config/constants';
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

async function fetchTrafficData() {
  const url = new URL('https://traffic.ls.hereapi.com/traffic/6.2/flow.json');
  const params = new URLSearchParams({
    apiKey: HERE_MAPS_API.KEY,
    bbox: `${HERE_MAPS_API.LOCATION.LAT-0.1},${HERE_MAPS_API.LOCATION.LON-0.1};${HERE_MAPS_API.LOCATION.LAT+0.1},${HERE_MAPS_API.LOCATION.LON+0.1}`,
    responseattributes: 'sh,fc',
  });

  return fetchWithTimeout<TrafficResponse>(`${url}?${params}`);
}

export async function estimateCrowdSize(): Promise<number> {
  try {
    const trafficData = await fetchTrafficData();
    
    // Get base estimate from time of day
    const baseEstimate = getTimeBasedEstimate();
    
    // Adjust based on traffic conditions
    const jamFactor = trafficData.flowSegmentData.jamFactor / 10;
    const trafficAdjustment = Math.round(jamFactor * 2); // Can add up to 2 more people
    
    // Apply seasonal adjustment
    const seasonalAdjustment = getSeasonalAdjustment();
    
    // Calculate final estimate
    const finalEstimate = baseEstimate + trafficAdjustment + seasonalAdjustment;
    
    // Ensure result is within reasonable bounds (0-14 people)
    return Math.min(Math.max(finalEstimate, 0), 14);
  } catch (error) {
    console.error('Error estimating crowd size:', error);
    // Fallback to time-based estimate if API fails
    return getTimeBasedEstimate();
  }
}

function getSeasonalAdjustment(): number {
  const month = new Date().getMonth();
  
  // Summer months (June-August)
  if (month >= 5 && month <= 7) {
    return Math.floor(Math.random() * 3); // 0 to +2 people
  }
  
  // Winter months (December-February)
  if (month >= 11 || month <= 1) {
    return -Math.floor(Math.random() * 2); // -1 to 0 people
  }
  
  // Spring/Autumn
  return Math.floor(Math.random() * 3) - 1; // -1 to +1 people
}