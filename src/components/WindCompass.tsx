import { memo } from 'react';
import { Navigation } from 'lucide-react';
import { getWindDirection } from '../utils/windUtils';

interface WindCompassProps {
  degree: number;
  variant?: 'light' | 'dark';
}

function WindCompass({ degree, variant = 'light' }: WindCompassProps) {
  const direction = getWindDirection(degree);
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  
  return (
    <div className="relative flex items-center space-x-2">
      <Navigation 
        className={`w-5 h-5 ${textColor} transform transition-transform duration-300`}
        style={{ transform: `rotate(${degree}deg)` }}
      />
      <span className={`text-sm font-medium ${textColor}`}>{direction}</span>
    </div>
  );
}

export default memo(WindCompass);