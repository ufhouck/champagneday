export interface WeatherCondition {
  text: string;
  code: number;
}

export interface LocationWeather {
  temp: number;
  wind_speed: number;
  wind_deg: number;
  precip_mm: number;
  sea_temp: number;
  condition: WeatherCondition;
}

export interface LocationData {
  gumusluk: LocationWeather;
  datca: LocationWeather;
}

export interface WeatherData {
  current: {
    temp: number;
    wind_speed: number;
    wind_deg: number;
    precip_mm: number;
    condition: WeatherCondition;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    wind_speed: number;
    wind_deg: number;
    precip_mm: number;
    condition: WeatherCondition;
  }>;
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

export interface SeaData {
  water_temperature: number;
  hourly: Array<{
    dt: number;
    water_temperature: number;
  }>;
}

export interface SwimConditions {
  windSpeed: number;
  windDeg: number;
  airTemp: number;
  seaTemp: number;
  precipMm: number;
  condition?: WeatherCondition;
  tomorrow?: {
    windSpeed: number;
    windDeg: number;
    airTemp: number;
    seaTemp: number;
    precipMm: number;
    condition?: WeatherCondition;
  };
}