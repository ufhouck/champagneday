import React from 'react';
import { useWeather } from './hooks/useWeather';
import { useLocationData } from './hooks/useLocationData';
import SwimStatus from './components/SwimStatus';
import LocationComparison from './components/LocationComparison';
import GeminiChat from './components/GeminiChat';
import { Heart } from 'lucide-react';

export default function App() {
  const { weatherData, seaData, isLoading, error } = useWeather();
  const { locationData, isLoading: isLocationLoading } = useLocationData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium text-lg">Failed to load weather data</div>
      </div>
    );
  }

  if (isLoading || isLocationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium text-lg">Loading weather data...</div>
      </div>
    );
  }

  const tomorrow = weatherData?.daily?.[1];
  const tomorrowSeaTemp = seaData?.hourly?.find(h => {
    const date = new Date(h.dt * 1000);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    return date.getTime() === tomorrow.getTime();
  });

  const conditions = {
    windSpeed: weatherData?.current?.wind_speed ?? 0,
    airTemp: weatherData?.current?.temp ?? 0,
    seaTemp: seaData?.water_temperature ?? 0,
    precipMm: weatherData?.current?.precip_mm ?? 0,
    condition: weatherData?.current?.condition,
    tomorrow: tomorrow ? {
      windSpeed: tomorrow.wind_speed,
      airTemp: tomorrow.temp.day,
      seaTemp: tomorrowSeaTemp?.water_temperature ?? seaData?.water_temperature ?? 0,
      precipMm: tomorrow.precip_mm,
      condition: tomorrow.condition
    } : undefined
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-2xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <SwimStatus conditions={conditions} />
        <div className="mt-8">
          <LocationComparison locationData={locationData} />
        </div>
      </div>
      <GeminiChat />
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>sümüklü</span>
          <Heart className="w-4 h-4 text-red-400 animate-pulse" />
          <span>2024</span>
        </div>
      </footer>
    </div>
  );
}