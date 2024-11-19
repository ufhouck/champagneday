import { Wind, Thermometer, Waves } from 'lucide-react';

interface WeatherCardProps {
  windSpeed: number;
  airTemp: number;
  seaTemp: number;
}

export default function WeatherCard({ 
  windSpeed = 0, 
  airTemp = 0, 
  seaTemp = 0 
}: WeatherCardProps) {
  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
      <div className="relative">
        <img 
          src="https://fastly.4sqi.net/img/general/600x600/63523651_nC_rBnlN4DQsfXrVIrnf_fgTNf459Y1R8rJG9AmkM5w.jpg"
          alt="Champagne Bay"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-xl font-semibold">Current Conditions</h3>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              Champagne Bay
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-200 dark:bg-blue-700 rounded-xl">
                <Wind className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                  {Number(windSpeed).toFixed(1)}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">km/h</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-200 dark:bg-orange-700 rounded-xl">
                <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-orange-900 dark:text-orange-100">
                  {Number(airTemp).toFixed(1)}°
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Air Temp</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/50 dark:to-cyan-800/50 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-cyan-200 dark:bg-cyan-700 rounded-xl">
                <Waves className="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-cyan-900 dark:text-cyan-100">
                  {Number(seaTemp).toFixed(1)}°
                </div>
                <div className="text-sm text-cyan-700 dark:text-cyan-300">Sea Temp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}