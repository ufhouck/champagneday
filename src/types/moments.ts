import type { WeatherData } from './weather';

export interface Moment {
  id: string;
  text: string;
  timestamp: number;
  likes: number;
  weather: {
    temp: number;
    windSpeed: number;
    precipMm: number;
    condition: string;
  };
}

export interface MomentInput {
  text: string;
  weather: Moment['weather'];
}