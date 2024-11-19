import { Users, Wind, Thermometer } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WeatherConditions {
  windSpeed: number;
  airTemp: number;
  seaTemp: number;
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getCrowdEstimate() {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return 0;
  if (hour >= 11 && hour <= 16) return Math.floor(Math.random() * 3) + 2;
  return Math.floor(Math.random() * 2);
}

function getOverallRecommendation(conditions: WeatherConditions) {
  const { windSpeed, airTemp, seaTemp } = conditions;
  const timeOfDay = getTimeOfDay();
  const bodrumTemp = airTemp + 2;

  if (airTemp < 15) {
    return {
      message: `Too cold for swimming! (${airTemp}°C)`,
      subMessage: `Even Bodrum center is chilly at ${bodrumTemp}°C`,
      className: "bg-white shadow-lg",
      icon: <Thermometer className="w-8 h-8 text-rose-500" />
    };
  }

  if (windSpeed > 25) {
    return {
      message: "Too windy for swimming today!",
      className: "bg-white shadow-lg",
      icon: <Wind className="w-8 h-8 text-amber-500" />
    };
  }

  if (airTemp >= 25 && airTemp <= 30 && windSpeed < 15 && seaTemp >= 23) {
    return {
      message: timeOfDay === 'night' 
        ? "Perfect night for a swim under the stars!" 
        : "Perfect day for swimming!",
      subMessage: bodrumTemp > airTemp ? "Even nicer than Bodrum center!" : undefined,
      className: "bg-white shadow-lg",
      icon: <Thermometer className="w-8 h-8 text-teal-500" />
    };
  }

  if (windSpeed > 15) {
    return {
      message: "A bit windy, but swimming is possible",
      className: "bg-white shadow-lg",
      icon: <Wind className="w-8 h-8 text-amber-500" />
    };
  }

  return {
    message: `Nice ${timeOfDay} for swimming`,
    className: "bg-white shadow-lg",
    icon: <Thermometer className="w-8 h-8 text-sky-500" />
  };
}

interface TypewriterTextProps {
  text: string;
  subText?: string;
}

function TypewriterText({ text, subText }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [displaySubText, setDisplaySubText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else if (subText && index < text.length + subText.length) {
        setDisplaySubText(subText.slice(0, index - text.length + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [text, subText]);

  return (
    <div className="font-sans">
      <h2 className="text-2xl font-semibold mb-2">{displayText}</h2>
      {subText && <p className="text-lg text-gray-600">{displaySubText}</p>}
    </div>
  );
}

export default function SwimRecommendation({ conditions }: { conditions: WeatherConditions }) {
  const recommendation = getOverallRecommendation(conditions);
  const crowdCount = getCrowdEstimate();

  const getCrowdMessage = (count: number) => {
    if (count === 0) return "Champagne is empty right now";
    if (count === 1) return "One person at Champagne";
    return `${count} people at Champagne`;
  };

  return (
    <div className={`rounded-2xl p-6 ${recommendation.className}`}>
      <div className="flex items-start space-x-4 mb-6">
        {recommendation.icon}
        <TypewriterText 
          text={recommendation.message} 
          subText={recommendation.subMessage}
        />
      </div>

      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
        <Users className="w-6 h-6 text-gray-600" />
        <span className="text-lg text-gray-700">
          {getCrowdMessage(crowdCount)}
        </span>
      </div>
    </div>
  );
}