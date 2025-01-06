import React from 'react';
import { useWeather } from './hooks/useWeather';
import SwimStatus from './components/SwimStatus';

export default function App() {
  const { weatherData, seaTemp, isLoading, error } = useWeather();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium text-lg">
          Failed to load weather data. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium text-lg">Loading weather data...</div>
      </div>
    );
  }

  const conditions = {
    windSpeed: weatherData.current.wind_speed,
    windDeg: weatherData.current.wind_deg,
    airTemp: weatherData.current.temp,
    seaTemp: seaTemp,
    precipMm: weatherData.current.precip_mm,
    condition: weatherData.current.condition
  };

  const tomorrow = weatherData.daily[0];
  const tomorrowConditions = tomorrow ? {
    windSpeed: tomorrow.wind_speed,
    windDeg: tomorrow.wind_deg,
    airTemp: tomorrow.temp.day,
    seaTemp: seaTemp, // Sea temperature changes very slowly
    precipMm: tomorrow.precip_mm,
    condition: tomorrow.condition
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SwimStatus 
          conditions={conditions}
          tomorrow={tomorrowConditions}
        />
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>sümüklü</span>
          <span>2024</span>
        </div>
      </footer>
    </div>
  );
}