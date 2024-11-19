import React from 'react';
import { Flower2 } from 'lucide-react';

const LOCAL_PLANTS = [
  {
    name: "Ferula Communis",
    commonName: "Giant Fennel",
    description: "A characteristic Mediterranean plant reaching heights of 2-3 meters, with yellow flowers and finely divided leaves.",
    season: "Spring-Summer"
  },
  {
    name: "Thymus Vulgaris",
    commonName: "Thyme",
    description: "A fragrant herb commonly found in the rocky areas of Gümüşlük, used in local cuisine.",
    season: "Year-round"
  },
  {
    name: "Pistacia Lentiscus",
    commonName: "Mastic Tree",
    description: "An evergreen shrub typical of Mediterranean coastal areas, producing aromatic resin.",
    season: "Year-round"
  }
];

export default function LocalPlants() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Local Flora</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Native species</span>
      </div>

      <div className="grid gap-4">
        {LOCAL_PLANTS.map((plant) => (
          <div 
            key={plant.name}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start space-x-3">
              <Flower2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plant.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{plant.commonName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {plant.description}
                </p>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Best viewing: {plant.season}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}