import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { useLocationData } from './hooks/useLocationData';
import SwimStatus from './components/SwimStatus';
import LocationComparison from './components/LocationComparison';
import GeminiChat from './components/GeminiChat';
import PhotoFeed from './components/PhotoFeed';
import { Heart, Cloud, Camera } from 'lucide-react';

type Tab = 'weather' | 'moments';

const STORAGE_KEY = 'champagne-bay-photos';
const LAST_VIEWED_KEY = 'last-viewed-timestamp';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('weather');
  const [hasNewMoments, setHasNewMoments] = useState(false);
  const { weatherData, seaData, isLoading, error } = useWeather();
  const { locationData, isLoading: isLocationLoading } = useLocationData();

  // Check for new moments
  useEffect(() => {
    const checkNewMoments = () => {
      const lastViewed = Number(localStorage.getItem(LAST_VIEWED_KEY)) || 0;
      const photos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const hasNew = photos.some((photo: any) => photo.timestamp > lastViewed);
      setHasNewMoments(hasNew);
    };

    checkNewMoments();
    window.addEventListener('storage', checkNewMoments);
    return () => window.removeEventListener('storage', checkNewMoments);
  }, []);

  // Update last viewed timestamp when switching to moments tab
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'moments') {
      localStorage.setItem(LAST_VIEWED_KEY, Date.now().toString());
      setHasNewMoments(false);
    }
  };

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
    windDeg: weatherData?.current?.wind_deg ?? 0,
    airTemp: weatherData?.current?.temp ?? 0,
    seaTemp: seaData?.water_temperature ?? 0,
    precipMm: weatherData?.current?.precip_mm ?? 0,
    condition: weatherData?.current?.condition,
    tomorrow: tomorrow ? {
      windSpeed: tomorrow.wind_speed,
      windDeg: tomorrow.wind_deg,
      airTemp: tomorrow.temp.day,
      seaTemp: tomorrowSeaTemp?.water_temperature ?? seaData?.water_temperature ?? 0,
      precipMm: tomorrow.precip_mm,
      condition: tomorrow.condition
    } : undefined
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="flex">
            <button
              onClick={() => handleTabChange('weather')}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'weather'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Cloud className="w-5 h-5" />
              <span>Weather</span>
            </button>
            <button
              onClick={() => handleTabChange('moments')}
              className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'moments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Camera className="w-5 h-5" />
                {hasNewMoments && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span>Moments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {activeTab === 'weather' ? (
          <>
            <SwimStatus conditions={conditions} />
            <div className="mt-8">
              <LocationComparison locationData={locationData} />
            </div>
          </>
        ) : (
          <PhotoFeed weatherData={weatherData} />
        )}
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