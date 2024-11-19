import { Wind, Thermometer, Waves } from 'lucide-react';

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

  return (
    <div className={`rounded-2xl border p-6 mb-8 ${recommendation.className}`}>
      <h2 className="text-xl font-semibold mb-4">{recommendation.message}</h2>
      
      <div className="flex justify-between items-center">
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
    </div>
  );
}