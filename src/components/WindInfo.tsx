import { Navigation, ArrowRight } from 'lucide-react';

interface WindInfoProps {
  speed: number;
  degree: number;
  variant?: 'light' | 'dark';
}

function getWindDirection(degree: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}

function getFullWindDirection(degree: number): string {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(((degree % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}

function getWaterActivityMessage(speed: number, degree: number): string {
  if (speed > 25) return "Not safe for water activities";
  
  const direction = getWindDirection(degree);
  if (['E', 'SE', 'S'].includes(direction)) {
    return "Good for sailing";
  }
  if (['SW', 'W', 'NW'].includes(direction)) {
    return "Good for paddling";
  }
  if (['N', 'NE'].includes(direction)) {
    return "Calm waters";
  }
  return "Moderate conditions";
}

function getWindDescription(speed: number): string {
  if (speed < 5) return "Light breeze";
  if (speed < 12) return "Gentle breeze";
  if (speed < 20) return "Moderate wind";
  if (speed < 25) return "Strong wind";
  return "Very strong wind";
}

export default function WindInfo({ speed, degree, variant = 'light' }: WindInfoProps) {
  const fullDirection = getFullWindDirection(degree);
  const activityMessage = getWaterActivityMessage(speed, degree);
  const windDescription = getWindDescription(speed);

  const baseClasses = "flex items-center space-x-3 rounded-xl p-3 transition-all";
  const variantClasses = variant === 'light' 
    ? "bg-black/20 backdrop-blur-sm text-white" 
    : "bg-gray-50 text-gray-800";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-center space-x-3 flex-1">
        <div className="relative">
          <Navigation 
            className={`w-5 h-5 ${variant === 'light' ? 'text-white' : 'text-gray-600'} transform transition-transform duration-200`}
            style={{ transform: `rotate(${degree}deg)` }}
          />
          <ArrowRight 
            className={`w-3 h-3 absolute -right-1 top-1/2 -translate-y-1/2 ${
              variant === 'light' ? 'text-white/70' : 'text-gray-400'
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">
              {speed.toFixed(1)} km/h
            </span>
            <span className={`text-sm ${variant === 'light' ? 'text-white/90' : 'text-gray-600'}`}>
              {windDescription}
            </span>
          </div>
          <div className="text-sm mt-0.5 space-y-1">
            <span className={variant === 'light' ? 'text-white/80' : 'text-gray-500'}>
              From {fullDirection}
            </span>
            <div className={variant === 'light' ? 'text-white/90' : 'text-gray-600'}>
              {activityMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}