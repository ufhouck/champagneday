import { Wind, Thermometer, Waves, Users } from 'lucide-react';

type Condition = 'perfect' | 'good' | 'moderate' | 'poor';

interface WeatherConditions {
  windSpeed: number;
  airTemp: number;
  seaTemp: number;
}

function getWindCondition(speed: number): Condition {
  if (speed < 10) return 'perfect';
  if (speed < 15) return 'good';
  if (speed < 25) return 'moderate';
  return 'poor';
}

function getAirTempCondition(temp: number): Condition {
  if (temp >= 25 && temp <= 30) return 'perfect';
  if (temp >= 22 && temp <= 32) return 'good';
  if (temp >= 20 && temp <= 35) return 'moderate';
  return 'poor';
}

function getSeaTempCondition(temp: number): Condition {
  if (temp >= 23 && temp <= 26) return 'perfect';
  if (temp >= 21 && temp <= 28) return 'good';
  if (temp >= 19 && temp <= 30) return 'moderate';
  return 'poor';
}

function getCrowdEstimate(hour: number): string {
  if (hour >= 22 || hour < 6) {
    return '0';
  }
  if (hour >= 11 && hour <= 16) {
    return '2-3';
  }
  return '1';
}

function getOverallRecommendation(conditions: WeatherConditions): {
  message: string;
  className: string;
} {
  const wind = getWindCondition(conditions.windSpeed);
  const air = getAirTempCondition(conditions.airTemp);
  const sea = getSeaTempCondition(conditions.seaTemp);

  if (wind === 'poor') {
    return {
      message: "Today is too windy for swimming",
      className: "bg-red-50 border-red-200 text-red-700"
    };
  }

  if (sea === 'poor') {
    return {
      message: conditions.seaTemp < 19 
        ? "The sea is too cold for comfortable swimming"
        : "The sea is quite warm today, be cautious",
      className: "bg-orange-50 border-orange-200 text-orange-700"
    };
  }

  if (wind === 'perfect' && (air === 'perfect' || air === 'good') && (sea === 'perfect' || sea === 'good')) {
    return {
      message: "Perfect conditions for swimming today!",
      className: "bg-green-50 border-green-200 text-green-700"
    };
  }

  if (wind === 'moderate') {
    return {
      message: "A bit windy, but swimming is possible",
      className: "bg-yellow-50 border-yellow-200 text-yellow-700"
    };
  }

  return {
    message: "🍺 Decent conditions for swimming",
    className: "bg-blue-50 border-blue-200 text-blue-700"
  };
}

function ConditionIndicator({ 
  condition, 
  icon: Icon 
}: { 
  condition: Condition; 
  icon: typeof Wind 
}) {
  const colors = {
    perfect: "bg-green-100",
    good: "bg-blue-100",
    moderate: "bg-yellow-100",
    poor: "bg-red-100"
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[condition]}`} />
  );
}

export default function SwimRecommendation({ 
  conditions 
}: { 
  conditions: WeatherConditions 
}) {
  const recommendation = getOverallRecommendation(conditions);
  const windCondition = getWindCondition(conditions.windSpeed);
  const airCondition = getAirTempCondition(conditions.airTemp);
  const seaCondition = getSeaTempCondition(conditions.seaTemp);
  const currentHour = new Date().getHours();
  const crowdCount = getCrowdEstimate(currentHour);

  return (
    <div className={`rounded-3xl border h-full flex flex-col justify-between ${recommendation.className}`}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{recommendation.message}</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <Wind className="w-5 h-5" />
            <span>Wind</span>
            <ConditionIndicator condition={windCondition} icon={Wind} />
          </div>
          
          <div className="flex items-center space-x-3">
            <Thermometer className="w-5 h-5" />
            <span>Air</span>
            <ConditionIndicator condition={airCondition} icon={Thermometer} />
          </div>
          
          <div className="flex items-center space-x-3">
            <Waves className="w-5 h-5" />
            <span>Sea</span>
            <ConditionIndicator condition={seaCondition} icon={Waves} />
          </div>
        </div>

        <div className="flex items-center justify-center mt-6 bg-white/50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">
              {crowdCount === '0' 
                ? 'No one is at Champagne right now' 
                : `${crowdCount} ${crowdCount === '1' ? 'person is' : 'people are'} at Champagne right now`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}