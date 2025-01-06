import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WeatherInfoProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  variant?: 'light' | 'dark';
}

export default function WeatherInfo({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  variant = 'light'
}: WeatherInfoProps) {
  const baseClasses = "flex items-center space-x-3 rounded-xl p-3";
  const variantClasses = variant === 'light' 
    ? "bg-black/20 backdrop-blur-sm text-white" 
    : "bg-gray-50 text-gray-800";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <Icon className={variant === 'light' ? 'text-white' : 'text-gray-600'} />
      <div className="text-sm font-medium">
        {label}: {value.toFixed(1)}{unit}
      </div>
    </div>
  );
}