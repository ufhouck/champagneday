import type { SwimConditions } from '../types/weather';
import { getSwimMessage } from '../utils/weather';
import WeatherCard from './WeatherCard';

interface SwimStatusProps {
  conditions: SwimConditions;
  tomorrow?: SwimConditions;
}

export default function SwimStatus({ conditions, tomorrow }: SwimStatusProps) {
  return (
    <div className="space-y-6">
      <WeatherCard 
        conditions={conditions} 
        message={getSwimMessage(conditions)}
        isToday={true} 
      />
      
      {tomorrow && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Tomorrow's Forecast
          </h3>
          <WeatherCard 
            conditions={tomorrow}
            message={getSwimMessage(tomorrow)}
            isToday={false}
          />
        </>
      )}
    </div>
  );
}