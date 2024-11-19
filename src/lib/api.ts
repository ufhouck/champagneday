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
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Validate weather data structure
function validateWeatherData(data: any): data is WeatherData {
  try {
    return Boolean(
      data?.current?.temp_c !== undefined &&
      data?.forecast?.forecastday?.[0]?.hour &&
      Array.isArray(data.forecast.forecastday)
    );
  } catch {
    return false;
  }
}

// Validate sea data structure
function validateSeaData(data: any): boolean {
  try {
    return Boolean(
      data?.hourly?.time &&
      Array.isArray(data.hourly.time) &&
      data?.hourly?.water_temperature &&
      Array.isArray(data.hourly.water_temperature) &&
      data.hourly.time.length === data.hourly.water_temperature.length
    );
  } catch {
    return false;
  }
}

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const { data } = await api.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${LAT},${LON}&days=7&aqi=no`
    );
    
    if (!validateWeatherData(data)) {
      throw new Error('Invalid weather data format');
    }

    // Create a plain object with only the data we need
    return {
      current: {
        temp: data.current.temp_c,
        wind_speed: data.current.wind_kph / 3.6,
        wind_deg: data.current.wind_degree
      },
      hourly: data.forecast.forecastday[0].hour.map((hour: any) => ({
        dt: Math.floor(new Date(hour.time).getTime() / 1000),
        temp: hour.temp_c,
        wind_speed: hour.wind_kph / 3.6,
        wind_deg: hour.wind_degree
      })),
      daily: data.forecast.forecastday.map((day: any) => ({
        dt: Math.floor(new Date(day.date).getTime() / 1000),
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
    throw new Error('Failed to fetch weather data');
  }
}

export async function fetchSeaData(): Promise<SeaData> {
  try {
    const response = await api.get(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=water_temperature&timezone=auto`
    );
    
    const data = response.data;
    
    if (!validateSeaData(data)) {
      throw new Error('Invalid sea temperature data format');
    }

    // Create a plain object with only the data we need
    const hourlyData = data.hourly.time.map((time: string, index: number) => ({
      dt: Math.floor(new Date(time).getTime() / 1000),
      water_temperature: Number(data.hourly.water_temperature[index])
    })).filter((item: any) => !isNaN(item.water_temperature));

    if (hourlyData.length === 0) {
      throw new Error('No valid sea temperature data available');
    }

    // Return a plain object with only the required data
    return {
      water_temperature: hourlyData[0].water_temperature,
      hourly: hourlyData
    };
  } catch (error) {
    console.error('Sea data API error:', error);
    throw new Error('Failed to fetch sea temperature data');
  }
}