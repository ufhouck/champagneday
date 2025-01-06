import React from 'react';
import { Thermometer, Waves, Users } from 'lucide-react';
import type { SwimConditions } from '../types/weather';
import { getCrowdMessage } from '../utils/crowd';
import { getTimeOfDay } from '../utils/timeUtils';
import TypewriterText from './TypewriterText';
import WeatherInfo from './WeatherInfo';
import WindInfo from './WindInfo';

interface WeatherCardProps {
  conditions: SwimConditions;
  message: {
    message: string;
    subMessage?: string;
  };
  isToday: boolean;
}

export default function WeatherCard({ conditions, message, isToday }: WeatherCardProps) {
  const { windSpeed, windDeg, airTemp, seaTemp, precipMm } = conditions;
  const timeOfDay = getTimeOfDay();
  const crowdMessage = isToday ? getCrowdMessage(Math.floor(Math.random() * 10)) : undefined;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      {isToday && (
        <div className="absolute inset-0">
          <img 
            src="https://fastly.4sqi.net/img/general/width960/63523651_nC_rBnlN4DQsfXrVIrnf_fgTNf459Y1R8rJG9AmkM5w.jpg"
            alt="Champagne Bay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      )}

      <div className={`relative p-6 ${!isToday ? 'bg-white' : ''}`}>
        <div className="mb-6">
          <TypewriterText 
            text={message.message} 
            subText={message.subMessage}
            variant={isToday ? 'light' : 'dark'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WeatherInfo 
            label="Air" 
            value={airTemp} 
            unit="°C" 
            icon={Thermometer}
            variant={isToday ? 'light' : 'dark'}
          />
          <WeatherInfo 
            label="Sea" 
            value={seaTemp} 
            unit="°C" 
            icon={Waves}
            variant={isToday ? 'light' : 'dark'}
          />
          <WindInfo 
            speed={windSpeed} 
            degree={windDeg}
            variant={isToday ? 'light' : 'dark'}
          />
          {isToday && crowdMessage && (
            <div className={`flex items-center space-x-3 ${
              isToday ? 'bg-black/20 backdrop-blur-sm text-white' : 'bg-gray-50 text-gray-800'
            } rounded-xl p-3`}>
              <Users className={isToday ? 'text-white' : 'text-gray-600'} />
              <span className="text-sm font-medium">{crowdMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}