import { Wind } from 'lucide-react';

interface WeatherInfoProps {
  label: string;
  value: number;
  unit: string;
  icon: typeof Wind;
  variant?: 'light' | 'dark';
  condition?: string;
}

export default function WeatherInfo({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  variant = 'light',
  condition 
}: WeatherInfoProps) {
  const baseClasses = "flex items-center space-x-3 rounded-xl p-3";
  const variantClasses = variant === 'light' 
    ? "bg-black/20 backdrop-blur-sm text-white" 
    : "bg-gray-50 text-gray-800";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <Icon className={`w-5 h-5 ${variant === 'light' ? 'text-white' : 'text-gray-600'}`} />
      <div>
        <span className="text-base font-medium">
          {label}: {value.toFixed(1)}{unit}
        </span>
        {condition && (
          <span className="block text-sm opacity-75">{condition}</span>
        )}
      </div>
    </div>
  );
}