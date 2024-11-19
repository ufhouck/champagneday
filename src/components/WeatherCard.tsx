import { Wind, Thermometer, Waves, Navigation } from 'lucide-react';

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
    <div className="material-card overflow-hidden">
      <div className="relative">
        <img 
          src="https://fastly.4sqi.net/img/general/600x600/63523651_nC_rBnlN4DQsfXrVIrnf_fgTNf459Y1R8rJG9AmkM5w.jpg"
          alt="Champagne at Gümüşlük"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 right-3 text-white text-sm font-medium px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full">
          champagne
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="material-card p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">
                  {Number(windSpeed).toFixed(1)} km/h
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</div>
              </div>
            </div>
          </div>

          <div className="material-card p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/50 rounded-full">
                <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">
                  {Number(airTemp).toFixed(1)}°C
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Air Temperature</div>
              </div>
            </div>
          </div>

          <div className="material-card p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-cyan-50 dark:bg-cyan-900/50 rounded-full">
                <Waves className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">
                  {Number(seaTemp).toFixed(1)}°C
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Sea Temperature</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full">
            <Navigation className="w-5 h-5 rotate-[220deg]" />
            <span className="text-sm">SW Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
}