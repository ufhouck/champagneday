import React from 'react';
import { useWeather } from './hooks/useWeather';
import { useLocationData } from './hooks/useLocationData';
import SwimStatus from './components/SwimStatus';
import LocationComparison from './components/LocationComparison';
import GeminiChat from './components/GeminiChat';

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

  const conditions = {
    windSpeed: weatherData?.current?.wind_speed ?? 0,
    windDeg: weatherData?.current?.wind_deg ?? 0,
    airTemp: weatherData?.current?.temp ?? 0,
    seaTemp: seaData?.water_temperature ?? 0,
    precipMm: weatherData?.current?.precip_mm ?? 0,
    condition: weatherData?.current?.condition,
    tomorrow: weatherData?.daily?.[1] ? {
      windSpeed: weatherData.daily[1].wind_speed,
      windDeg: weatherData.daily[1].wind_deg,
      airTemp: weatherData.daily[1].temp.day,
      seaTemp: seaData?.hourly?.find(h => {
        const date = new Date(h.dt * 1000);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        return date.getTime() === tomorrow.getTime();
      })?.water_temperature ?? seaData?.water_temperature ?? 0,
      precipMm: weatherData.daily[1].precip_mm,
      condition: weatherData.daily[1].condition
    } : undefined
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-12">
          <SwimStatus conditions={conditions} />
          {locationData && <LocationComparison locationData={locationData} />}
        </div>
      </div>

      <GeminiChat />

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>sümüklü</span>
          <span>2024</span>
        </div>
      </footer>
    </div>
  );
}