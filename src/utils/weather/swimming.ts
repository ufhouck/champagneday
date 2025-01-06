import type { SwimConditions } from '../../types/weather';
import { isRainyCondition } from './conditions';

export function getSwimMessage(conditions: SwimConditions) {
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

  if (airTemp >= 25 && airTemp <= 30 && windSpeed < 15 && seaTemp >= 23) {
    return {
      message: "Perfect conditions for swimming!",
      subMessage: "Ideal temperature and calm winds"
    };
  }

  if (windSpeed > 15) {
    return {
      message: "A bit windy, but swimming is possible",
      subMessage: "Be cautious of the waves"
    };
  }

  return {
    message: "Good conditions for swimming",
    subMessage: `Sea temperature: ${seaTemp}°C`
  };
}