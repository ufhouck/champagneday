import { useState } from 'react';
import { Wind, Thermometer, Waves } from 'lucide-react';
import type { WeatherData, SeaData } from '../lib/api';

interface SeaTemperatureForecastProps {
  weatherData: WeatherData;
  seaData: SeaData;
}

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SeaTemperatureForecast({ 
  weatherData,
  seaData 
}: SeaTemperatureForecastProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  
  const forecast = weatherData.daily.map((day, dayIndex) => {
    const date = new Date(day.dt * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
    const dayEnd = dayStart + 86400;

    const hourlyData = weatherData.hourly
      .filter(hour => hour.dt >= dayStart && hour.dt < dayEnd)
      .map((hour, hourIndex) => {
        const hourDate = new Date(hour.dt * 1000);
        return {
          hour: hourDate.getHours(),
          seaTemp: seaData.hourly[hourIndex]?.water_temperature ?? seaData.water_temperature,
          airTemp: hour.temp,
          windSpeed: hour.wind_speed
        };
      });

    return {
      date,
      dayName: weekDays[date.getDay()],
      hourlyData
    };
  });

  const selectedData = forecast[selectedDay]?.hourlyData ?? [];
  const maxWindSpeed = 30;

  const windPoints = selectedData.map((data, index) => {
    const x = (index / Math.max(1, selectedData.length - 1)) * 100;
    const y = 100 - (data.windSpeed / maxWindSpeed) * 100;
    return `${x},${y}`;
  }).join(' L');

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Hourly Weather Forecast</h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-6">
        {forecast.map((day, index) => (
          <button
            key={day.dayName}
            onClick={() => setSelectedDay(index)}
            className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${
              selectedDay === index
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {day.dayName.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center">
          <Waves className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm text-gray-600">Sea Temp</span>
        </div>
        <div className="flex items-center">
          <Thermometer className="w-4 h-4 text-orange-500 mr-2" />
          <span className="text-sm text-gray-600">Air Temp</span>
        </div>
        <div className="flex items-center">
          <Wind className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">Wind Speed</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-32 mx-8">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="wind-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(156, 163, 175, 0.5)" />
                <stop offset="100%" stopColor="rgba(156, 163, 175, 0)" />
              </linearGradient>
            </defs>
            {windPoints && (
              <>
                <path
                  d={`M0,100 L${windPoints} L100,100 Z`}
                  fill="url(#wind-gradient)"
                  className="transition-all duration-300"
                />
                <path
                  d={`M${windPoints}`}
                  fill="none"
                  stroke="rgb(156, 163, 175)"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </>
            )}
          </svg>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-24 gap-2">
              {selectedData.map(({ hour, seaTemp, airTemp, windSpeed }) => (
                <div key={hour} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  
                  <div className="relative h-32 w-8 bg-gray-50/50 rounded-lg overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 w-2 ml-1 rounded-t-full bg-blue-500 transition-all duration-300"
                      style={{
                        height: `${((seaTemp - 18) / (26 - 18)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-2 mr-1 rounded-t-full bg-orange-500 transition-all duration-300"
                      style={{
                        height: `${((airTemp - 18) / (32 - 18)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 space-y-1 text-center">
                    <div className="text-xs font-medium text-blue-600">{seaTemp.toFixed(1)}°</div>
                    <div className="text-xs font-medium text-orange-600">{airTemp.toFixed(1)}°</div>
                    <div className="text-xs font-medium text-gray-600">{windSpeed.toFixed(1)}km/h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}