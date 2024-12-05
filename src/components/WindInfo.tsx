import { getMaritimeConditions } from '../utils/windUtils';
import WindCompass from './WindCompass';

interface WindInfoProps {
  speed: number;
  degree: number;
  variant?: 'light' | 'dark';
}

export default function WindInfo({ speed, degree, variant = 'light' }: WindInfoProps) {
  const conditions = getMaritimeConditions(speed, degree);
  
  const baseClasses = "flex items-center justify-between rounded-xl p-3 transition-all";
  const variantClasses = variant === 'light' 
    ? "bg-black/20 backdrop-blur-sm text-white" 
    : "bg-gray-50 text-gray-800";

  const safetyColors = {
    optimal: variant === 'light' ? 'text-green-300' : 'text-green-600',
    fair: variant === 'light' ? 'text-blue-300' : 'text-blue-600',
    caution: variant === 'light' ? 'text-yellow-300' : 'text-yellow-600',
    warning: variant === 'light' ? 'text-red-300' : 'text-red-600'
  };

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-center space-x-4">
        <WindCompass degree={degree} variant={variant} />
        <span className="text-base font-medium">
          {speed.toFixed(1)} km/h
        </span>
      </div>
      
      <div className="text-right">
        <div className={`text-sm font-medium ${safetyColors[conditions.safety]}`}>
          {conditions.recommendation}
        </div>
      </div>
    </div>
  );
}