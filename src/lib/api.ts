import axios from 'axios';
import { WEATHER_API_KEY, LOCATIONS } from '../config';
import type { WeatherData, SeaData, LocationData } from '../types/weather';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const { data } = await api.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${LOCATIONS.gumusluk.lat},${LOCATIONS.gumusluk.lon}&days=7&aqi=no`
    );

    return {
      current: {
        temp: data.current.temp_c,
        wind_speed: data.current.wind_kph / 3.6,
        wind_deg: data.current.wind_degree,
        precip_mm: data.current.precip_mm,
        condition: {
          text: data.current.condition.text,
          code: data.current.condition.code
        }
      },
      hourly: data.forecast.forecastday[0].hour.map((hour: any) => ({
        dt: Math.floor(new Date(hour.time).getTime() / 1000),
        temp: hour.temp_c,
        wind_speed: hour.wind_kph / 3.6,
        wind_deg: hour.wind_degree,
        precip_mm: hour.precip_mm,
        condition: {
          text: hour.condition.text,
          code: hour.condition.code
        }
      })),
      daily: data.forecast.forecastday.map((day: any) => ({
        dt: Math.floor(new Date(day.date).getTime() / 1000),
        temp: {
          day: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c
        },
        wind_speed: day.day.maxwind_kph / 3.6,
        wind_deg: day.hour[12].wind_degree,
        precip_mm: day.day.totalprecip_mm,
        condition: {
          text: day.day.condition.text,
          code: day.day.condition.code
        }
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
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LOCATIONS.gumusluk.lat}&longitude=${LOCATIONS.gumusluk.lon}&hourly=water_temperature&timezone=auto`
    );
    
    const data = response.data;
    const hourlyData = data.hourly.time.map((time: string, index: number) => ({
      dt: Math.floor(new Date(time).getTime() / 1000),
      water_temperature: Number(data.hourly.water_temperature[index])
    })).filter((item: any) => !isNaN(item.water_temperature));

    return {
      water_temperature: hourlyData[0].water_temperature,
      hourly: hourlyData
    };
  } catch (error) {
    console.error('Sea data API error:', error);
    throw new Error('Failed to fetch sea temperature data');
  }
}

export async function fetchLocationData(): Promise<LocationData> {
  try {
    const [gumuslukData, datcaData] = await Promise.all([
      api.get(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${LOCATIONS.gumusluk.lat},${LOCATIONS.gumusluk.lon}&aqi=no`),
      api.get(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${LOCATIONS.datca.lat},${LOCATIONS.datca.lon}&aqi=no`)
    ]);

    const [gumuslukSeaTemp, datcaSeaTemp] = await Promise.all([
      fetchLocationSeaTemp(LOCATIONS.gumusluk.lat, LOCATIONS.gumusluk.lon),
      fetchLocationSeaTemp(LOCATIONS.datca.lat, LOCATIONS.datca.lon)
    ]);

    return {
      gumusluk: {
        temp: gumuslukData.data.current.temp_c,
        wind_speed: gumuslukData.data.current.wind_kph / 3.6,
        wind_deg: gumuslukData.data.current.wind_degree,
        precip_mm: gumuslukData.data.current.precip_mm,
        sea_temp: gumuslukSeaTemp,
        condition: {
          text: gumuslukData.data.current.condition.text,
          code: gumuslukData.data.current.condition.code
        }
      },
      datca: {
        temp: datcaData.data.current.temp_c,
        wind_speed: datcaData.data.current.wind_kph / 3.6,
        wind_deg: datcaData.data.current.wind_degree,
        precip_mm: datcaData.data.current.precip_mm,
        sea_temp: datcaSeaTemp,
        condition: {
          text: datcaData.data.current.condition.text,
          code: datcaData.data.current.condition.code
        }
      }
    };
  } catch (error) {
    console.error('Location data API error:', error);
    throw new Error('Failed to fetch location data');
  }
}

async function fetchLocationSeaTemp(lat: number, lon: number): Promise<number> {
  try {
    const response = await api.get(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=water_temperature&timezone=auto`
    );
    
    const data = response.data;
    const currentTemp = Number(data.hourly.water_temperature[0]);
    
    if (isNaN(currentTemp)) {
      throw new Error('Invalid sea temperature value');
    }

    return currentTemp;
  } catch (error) {
    console.error('Sea temperature API error:', error);
    // Return a reasonable fallback value for the region
    return 22;
  }
}