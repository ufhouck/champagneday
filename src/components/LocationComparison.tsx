import { Wind, Thermometer, CloudRain, Waves } from 'lucide-react';
import type { LocationData } from '../types/weather';

interface LocationComparisonProps {
  locationData: LocationData;
}

export default function LocationComparison({ locationData }: LocationComparisonProps) {
  const { gumusluk, datca } = locationData;

  const comparisons = [
    {
      label: "Air Temperature",
      gumusluk: gumusluk.temp,
      datca: datca.temp,
      unit: "°C",
      icon: Thermometer,
      diff: datca.temp - gumusluk.temp
    },
    {
      label: "Sea Temperature",
      gumusluk: gumusluk.sea_temp,
      datca: datca.sea_temp,
      unit: "°C",
      icon: Waves,
      diff: datca.sea_temp - gumusluk.sea_temp
    },
    {
      label: "Wind Speed",
      gumusluk: gumusluk.wind_speed,
      datca: datca.wind_speed,
      unit: "km/h",
      icon: Wind,
      diff: datca.wind_speed - gumusluk.wind_speed
    },
    {
      label: "Precipitation",
      gumusluk: gumusluk.precip_mm,
      datca: datca.precip_mm,
      unit: "mm",
      icon: CloudRain,
      diff: datca.precip_mm - gumusluk.precip_mm
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Comparison</h3>
      
      <div className="grid gap-4">
        {comparisons.map(({ label, gumusluk, datca, unit, icon: Icon, diff }) => (
          <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">{label}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Gümüşlük</div>
                <div className="font-medium">{gumusluk.toFixed(1)}{unit}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Datça</div>
                <div className="font-medium">{datca.toFixed(1)}{unit}</div>
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
        {gumusluk.condition.text} in Gümüşlük, {datca.condition.text.toLowerCase()} in Datça
      </div>
    </div>
  );
}