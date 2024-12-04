import { Thermometer, Waves, Users, Clock, CloudRain } from 'lucide-react';
import type { SwimConditions } from '../types/weather';
import { getTimeOfDay, getCrowdEstimate, getCrowdMessage } from '../utils/timeUtils';
import { getSwimMessage } from '../utils/weatherUtils';
import TypewriterText from './TypewriterText';
import WeatherInfo from './WeatherInfo';
import WindInfo from './WindInfo';

interface WeatherCardProps {
  conditions: SwimConditions | SwimConditions['tomorrow'];
  isToday: boolean;
}

export default function WeatherCard({ conditions, isToday }: WeatherCardProps) {
  if (!conditions) return null;

  const { windSpeed, windDeg, airTemp, seaTemp, precipMm, condition } = conditions;
  const crowdCount = isToday ? getCrowdEstimate() : 0;
  const timeOfDay = getTimeOfDay();
  const { message, subMessage } = getSwimMessage(conditions as SwimConditions, timeOfDay);

  if (isToday) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div className="absolute inset-0">
          <img 
            src="https://fastly.4sqi.net/img/general/600x600/63523651_nC_rBnlN4DQsfXrVIrnf_fgTNf459Y1R8rJG9AmkM5w.jpg"
            alt="Champagne Bay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative p-6">
          <div className="mb-6">
            <TypewriterText text={message} subText={subMessage} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WeatherInfo label="Air" value={airTemp} unit="°C" icon={Thermometer} />
            <WeatherInfo label="Sea" value={seaTemp} unit="°C" icon={Waves} />
            <WindInfo speed={windSpeed} degree={windDeg} />
            {precipMm > 0 ? (
              <WeatherInfo 
                label="Rain" 
                value={precipMm} 
                unit="mm" 
                icon={CloudRain}
                condition={condition?.text} 
              />
            ) : (
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-xl p-3">
                <Users className="w-5 h-5 text-white" />
                <span className="text-base font-medium text-white">{getCrowdMessage(crowdCount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <div className="text-gray-800">
          <h2 className="text-2xl font-semibold mb-2">{message}</h2>
          {subMessage && <p className="text-lg text-gray-600">{subMessage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <WeatherInfo label="Air" value={airTemp} unit="°C" icon={Thermometer} variant="dark" />
        <WeatherInfo label="Sea" value={seaTemp} unit="°C" icon={Waves} variant="dark" />
        <WindInfo speed={windSpeed} degree={windDeg} variant="dark" />
        {precipMm > 0 ? (
          <WeatherInfo 
            label="Rain" 
            value={precipMm} 
            unit="mm" 
            icon={CloudRain}
            variant="dark"
            condition={condition?.text}
          />
        ) : (
          <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-base font-medium text-gray-800">Swimming forecast</span>
          </div>
        )}
      </div>
    </div>
  );
}