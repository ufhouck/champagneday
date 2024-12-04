import type { SwimConditions } from '../types/weather';
import WeatherCard from './WeatherCard';

export default function SwimStatus({ conditions }: { conditions: SwimConditions }) {
  return (
    <div className="space-y-6">
      <WeatherCard conditions={conditions} isToday={true} />
      {conditions.tomorrow && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Tomorrow's Forecast</h3>
          <WeatherCard conditions={conditions.tomorrow} isToday={false} />
        </>
      )}
    </div>
  );
}