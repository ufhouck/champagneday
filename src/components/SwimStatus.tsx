import { useState, useEffect } from 'react';
import { Wind, Thermometer, Waves, Users, Clock } from 'lucide-react';

interface SwimConditions {
  windSpeed: number;
  airTemp: number;
  seaTemp: number;
  tomorrow?: {
    windSpeed: number;
    airTemp: number;
    seaTemp: number;
  };
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getCrowdEstimate(): number {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return 0;
  if (hour >= 11 && hour <= 16) return Math.floor(Math.random() * 3) + 2;
  return Math.floor(Math.random() * 2);
}

function getSwimMessage(conditions: SwimConditions, isToday: boolean) {
  const { windSpeed, airTemp, seaTemp } = conditions;
  const timeOfDay = getTimeOfDay();
  
  // Different comparisons for today (Bodrum) and tomorrow (Datça)
  const comparisonTemp = isToday ? airTemp + 2 : airTemp - 1; // Datça is typically 1°C cooler
  const comparisonSeaTemp = isToday ? seaTemp + 0.5 : seaTemp - 0.8; // Datça waters are typically cooler
  const locationName = isToday ? "Bodrum" : "Datça Palamutbükü";

  if (airTemp < 15) {
    return {
      message: `Too cold for swimming! (${airTemp}°C)`,
      subMessage: `Even ${locationName} is only ${comparisonTemp}°C`
    };
  }

  if (windSpeed > 25) {
    return {
      message: isToday ? "Too windy for swimming today!" : "Strong winds expected tomorrow",
      subMessage: "Strong winds make swimming conditions unsafe"
    };
  }

  if (airTemp >= 25 && airTemp <= 30 && windSpeed < 15 && seaTemp >= 23) {
    return {
      message: isToday 
        ? (timeOfDay === 'night' ? "Perfect night for a swim!" : "Perfect day for swimming!")
        : "Tomorrow looks perfect for swimming!",
      subMessage: seaTemp > comparisonSeaTemp 
        ? `Water is cooler in ${locationName} (${comparisonSeaTemp.toFixed(1)}°C)`
        : `Similar conditions to ${locationName}`
    };
  }

  if (windSpeed > 15) {
    return {
      message: isToday ? "A bit windy, but swimming is possible" : "Expect some wind tomorrow",
      subMessage: `${locationName} has similar wind conditions`
    };
  }

  return {
    message: isToday 
      ? `Nice ${timeOfDay} for swimming`
      : "Good swimming conditions expected",
    subMessage: `Sea temperature: ${seaTemp}°C (${locationName}: ${comparisonSeaTemp.toFixed(1)}°C)`
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
      <h2 className="text-2xl font-semibold mb-2 text-white">{displayText}</h2>
      {subText && <p className="text-lg text-white/90">{displaySubText}</p>}
    </div>
  );
}

function WeatherInfo({ label, value, unit, icon: Icon, variant = 'light' }: {
  label: string;
  value: number;
  unit: string;
  icon: typeof Wind;
  variant?: 'light' | 'dark';
}) {
  const baseClasses = "flex items-center space-x-3 rounded-xl p-3";
  const variantClasses = variant === 'light' 
    ? "bg-black/20 backdrop-blur-sm text-white" 
    : "bg-gray-50 text-gray-800";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <Icon className={`w-5 h-5 ${variant === 'light' ? 'text-white' : 'text-gray-600'}`} />
      <span className="text-base font-medium">
        {label}: {value.toFixed(1)}{unit}
      </span>
    </div>
  );
}

function WeatherCard({ conditions, isToday }: { 
  conditions: SwimConditions | SwimConditions['tomorrow'], 
  isToday: boolean 
}) {
  if (!conditions) return null;

  const { windSpeed, airTemp, seaTemp } = conditions;
  const crowdCount = isToday ? getCrowdEstimate() : 0;
  const { message, subMessage } = getSwimMessage({ windSpeed, airTemp, seaTemp } as SwimConditions, isToday);

  const getCrowdMessage = (count: number) => {
    if (count === 0) return "Champagne is empty right now";
    if (count === 1) return "One person at Champagne";
    return `${count} people at Champagne`;
  };

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
          <div className="flex items-center space-x-2 mb-6">
            <TypewriterText text={message} subText={subMessage} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WeatherInfo label="Air" value={airTemp} unit="°C" icon={Thermometer} />
            <WeatherInfo label="Sea" value={seaTemp} unit="°C" icon={Waves} />
            <WeatherInfo label="Wind" value={windSpeed} unit="km/h" icon={Wind} />
            <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-xl p-3">
              <Users className="w-5 h-5 text-white" />
              <span className="text-base font-medium text-white">{getCrowdMessage(crowdCount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="text-gray-800">
          <h2 className="text-2xl font-semibold mb-2">{message}</h2>
          {subMessage && <p className="text-lg text-gray-600">{subMessage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <WeatherInfo label="Air" value={airTemp} unit="°C" icon={Thermometer} variant="dark" />
        <WeatherInfo label="Sea" value={seaTemp} unit="°C" icon={Waves} variant="dark" />
        <WeatherInfo label="Wind" value={windSpeed} unit="km/h" icon={Wind} variant="dark" />
        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-base font-medium text-gray-800">Swimming forecast</span>
        </div>
      </div>
    </div>
  );
}

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