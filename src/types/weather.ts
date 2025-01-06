export interface WeatherCondition {
  text: string;
  code: number;
}

export interface WeatherData {
  current: {
    temp: number;
    wind_speed: number;
    wind_deg: number;
    precip_mm: number;
    condition: WeatherCondition;
  };
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    wind_speed: number;
    wind_deg: number;
    precip_mm: number;
    condition: WeatherCondition;
  }>;
}

export interface SwimConditions {
  windSpeed: number;
  windDeg: number;
  airTemp: number;
  seaTemp: number;
  precipMm: number;
  condition?: WeatherCondition;
}