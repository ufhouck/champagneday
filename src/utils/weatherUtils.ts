import type { SwimConditions } from '../types/weather';

export function isRainyCondition(code: number): boolean {
  const rainyCodes = [
    1063, 1180, 1183, 1186, 1189, 1192, 1195,
    1240, 1243, 1246,
    1273, 1276
  ];
  return rainyCodes.includes(code);
}

export function getSwimMessage(conditions: SwimConditions, timeOfDay: string) {
  const { windSpeed, airTemp, seaTemp, precipMm, condition } = conditions;

  if (!condition) {
    return {
      message: "Weather data unavailable",
      subMessage: "Please try again later"
    };
  }

  if (isRainyCondition(condition.code)) {
    if (precipMm > 2.5) {
      return {
        message: "Heavy rain expected - Not suitable for swimming",
        subMessage: "Temperature might drop and visibility could be poor"
      };
    }
    if (precipMm > 0.5) {
      return {
        message: "Light rain expected - Swimming not recommended",
        subMessage: "Consider waiting for the weather to clear up"
      };
    }
  }

  if (airTemp < 15) {
    return {
      message: `Too cold for swimming! (${airTemp}°C)`,
      subMessage: "Water temperature is also quite low"
    };
  }

  if (windSpeed > 25) {
    return {
      message: "Too windy for swimming today!",
      subMessage: "Strong winds make swimming conditions unsafe"
    };
  }

  if (airTemp >= 25 && airTemp <= 30 && windSpeed < 15 && seaTemp >= 23 && precipMm < 0.1) {
    return {
      message: timeOfDay === 'night' ? "Perfect night for a swim!" : "Perfect day for swimming!",
      subMessage: "Ideal conditions for swimming"
    };
  }

  if (windSpeed > 15) {
    return {
      message: "A bit windy, but swimming is possible",
      subMessage: "Be cautious of the waves"
    };
  }

  if (precipMm > 0) {
    return {
      message: "Some rain possible - Use caution",
      subMessage: `Light precipitation expected (${precipMm.toFixed(1)}mm)`
    };
  }

  return {
    message: `Nice ${timeOfDay} for swimming`,
    subMessage: `Sea temperature: ${seaTemp}°C`
  };
}