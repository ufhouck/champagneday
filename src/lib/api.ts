import axios from 'axios';
import { WEATHER_API_KEY } from '../config';

const LAT = 37.0407;  // Gümüşlük latitude
const LON = 27.2342;  // Gümüşlük longitude

export interface WeatherData {
  current: {
    temp: number;
    wind_speed: number;
    wind_deg: number;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    wind_speed: number;
    wind_deg: number;
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
  }>;
}

export interface SeaData {
  water_temperature: number;
  hourly: Array<{
    dt: number;
    water_temperature: number;
  }>;
}

const api = axios.create({
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const { data } = await api.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${LAT},${LON}&days=7&aqi=no`
    );
    
    return {
      current: {
        temp: data.current.temp_c,
        wind_speed: data.current.wind_kph / 3.6,
        wind_deg: data.current.wind_degree
      },
      hourly: data.forecast.forecastday[0].hour.map((hour: any) => ({
        dt: new Date(hour.time).getTime() / 1000,
        temp: hour.temp_c,
        wind_speed: hour.wind_kph / 3.6,
        wind_deg: hour.wind_degree
      })),
      daily: data.forecast.forecastday.map((day: any) => ({
        dt: new Date(day.date).getTime() / 1000,
        temp: {
          day: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c
        },
        wind_speed: day.day.maxwind_kph / 3.6,
        wind_deg: day.hour[12].wind_degree
      }))
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

export async function fetchSeaData(): Promise<SeaData> {
  try {
    const { data } = await api.get(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=water_temperature&timezone=auto`
    );
    
    // Ensure we have valid data before processing
    if (!data?.hourly?.water_temperature?.length) {
      throw new Error('Invalid sea temperature data received');
    }

    return {
      water_temperature: data.hourly.water_temperature[0],
      hourly: data.hourly.time.map((time: string, index: number) => ({
        dt: new Date(time).getTime() / 1000,
        water_temperature: data.hourly.water_temperature[index]
      }))
    };
  } catch (error) {
    console.error('Sea data API error:', error);
    throw error;
  }
}

export async function fetchWindData(): Promise<number> {
  try {
    const { data } = await api.get(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${LAT},${LON}&aqi=no`
    );
    
    if (typeof data?.current?.wind_kph !== 'number') {
      throw new Error('Invalid wind data received');
    }

    return data.current.wind_kph / 3.6;
  } catch (error) {
    console.error('Wind API error:', error);
    throw error;
  }
}