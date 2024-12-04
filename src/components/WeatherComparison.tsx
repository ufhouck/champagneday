import { Wind, Thermometer, Waves, CloudRain } from 'lucide-react';
import type { SwimConditions } from '../types/weather';
import WeatherInfo from './WeatherInfo';

interface WeatherComparisonProps {
  conditions: SwimConditions;
}

export default function WeatherComparison({ conditions }: WeatherComparisonProps) {
  const { tomorrow } = conditions;
  if (!tomorrow) return null;

  const comparisons = [
    {
      label: "Air Temperature",
      today: conditions.airTemp,
      tomorrow: tomorrow.airTemp,
      unit: "°C",
      icon: Thermometer,
      diff: tomorrow.airTemp - conditions.airTemp
    },
    {
      label: "Sea Temperature",
      today: conditions.seaTemp,
      tomorrow: tomorrow.seaTemp,
      unit: "°C",
      icon: Waves,
      diff: tomorrow.seaTemp - conditions.seaTemp
    },
    {
      label: "Wind Speed",
      today: conditions.windSpeed,
      tomorrow: tomorrow.windSpeed,
      unit: "km/h",
      icon: Wind,
      diff: tomorrow.windSpeed - conditions.windSpeed
    },
    {
      label: "Precipitation",
      today: conditions.precipMm,
      tomorrow: tomorrow.precipMm,
      unit: "mm",
      icon: CloudRain,
      diff: tomorrow.precipMm - conditions.precipMm
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Weather Comparison</h3>
      
      <div className="grid gap-4">
        {comparisons.map(({ label, today, tomorrow, unit, icon: Icon, diff }) => (
          <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">{label}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Today</div>
                <div className="font-medium">{today.toFixed(1)}{unit}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tomorrow</div>
                <div className="font-medium">{tomorrow.toFixed(1)}{unit}</div>
              </div>
              <div className={`w-16 text-right font-medium ${
                diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-gray-500'
              }`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {conditions.condition?.text} today, {tomorrow.condition?.text.toLowerCase()} tomorrow
      </div>
    </div>
  );
}