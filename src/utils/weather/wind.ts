// Beaufort Scale wind speeds in km/h
export const BEAUFORT_SCALE = {
  CALM: 1,        // 0-1 km/h
  LIGHT_AIR: 5,   // 1-5 km/h
  LIGHT_BREEZE: 11, // 6-11 km/h
  GENTLE_BREEZE: 19, // 12-19 km/h
  MODERATE_BREEZE: 28, // 20-28 km/h
  FRESH_BREEZE: 38,   // 29-38 km/h
} as const;

// Champagne Bay shore orientation
const SHORE_FACING_DEGREE = 135; // Southeast facing

export function getWindDirection(degree: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}

export function getMaritimeConditions(speed: number, degree: number): {
  recommendation: string;
  safety: 'optimal' | 'fair' | 'caution' | 'warning';
} {
  // Calculate relative wind angle to shore
  const relativeAngle = Math.abs((degree - SHORE_FACING_DEGREE + 360) % 360);
  const isOffshore = relativeAngle > 135 && relativeAngle < 225;
  const isOnshore = relativeAngle < 45 || relativeAngle > 315;
  const isCrossshore = !isOffshore && !isOnshore;
  
  let recommendation = '';
  let safety: 'optimal' | 'fair' | 'caution' | 'warning' = 'optimal';

  if (speed <= BEAUFORT_SCALE.LIGHT_AIR) {
    recommendation = 'Perfect for swimming';
    safety = 'optimal';
  } else if (speed <= BEAUFORT_SCALE.LIGHT_BREEZE) {
    if (isOffshore) {
      recommendation = 'Watch for drift';
      safety = 'fair';
    } else if (isCrossshore) {
      recommendation = 'Good conditions';
      safety = 'optimal';
    } else {
      recommendation = 'Ideal conditions';
      safety = 'optimal';
    }
  } else if (speed <= BEAUFORT_SCALE.GENTLE_BREEZE) {
    if (isOffshore) {
      recommendation = 'Use caution';
      safety = 'caution';
    } else if (isCrossshore) {
      recommendation = 'Moderate waves';
      safety = 'fair';
    } else {
      recommendation = 'Light chop';
      safety = 'fair';
    }
  } else if (speed <= BEAUFORT_SCALE.MODERATE_BREEZE) {
    recommendation = 'Strong waves';
    safety = 'caution';
  } else {
    recommendation = 'Not recommended';
    safety = 'warning';
  }

  return { recommendation, safety };
}