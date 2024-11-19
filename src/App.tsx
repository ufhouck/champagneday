import React from 'react';
import WeatherCard from './components/WeatherCard';
import SeaTemperatureForecast from './components/SeaTemperatureForecast';
import SwimRecommendation from './components/SwimRecommendation';
import LocalInfo from './components/LocalInfo';
import LiveMap from './components/LiveMap';
import { useWeather } from './hooks/useWeather';

function App() {
  const { weatherData, seaData, isLoading, error } = useWeather();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 dark:text-red-400">Failed to load weather data</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading weather data...</div>
      </div>
    );
  }

  const currentConditions = {
    windSpeed: weatherData?.current?.wind_speed ?? 0,
    airTemp: weatherData?.current?.temp ?? 0,
    seaTemp: seaData?.water_temperature ?? 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-display text-gray-900 dark:text-white mb-2">Champagne Day</h1>
          <p className="text-gray-600 dark:text-gray-400">Gümüşlük Şampanya Koyu 🍾</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LiveMap 
                windSpeed={currentConditions.windSpeed}
                windDegree={weatherData.current.wind_deg}
                temperature={currentConditions.airTemp}
              />
              <SwimRecommendation conditions={currentConditions} />
            </div>
            <WeatherCard 
              windSpeed={currentConditions.windSpeed}
              airTemp={currentConditions.airTemp}
              seaTemp={currentConditions.seaTemp}
            />
            <SeaTemperatureForecast 
              weatherData={weatherData}
              seaData={seaData}
            />
          </div>
          <div className="lg:col-span-1">
            <LocalInfo />
          </div>
        </div>

        <footer className="text-center mt-12 pb-8">
          <p className="text-xl dark:text-gray-300">
            🐱 <span className="mx-2">❤️</span> sümüklü kalp
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;