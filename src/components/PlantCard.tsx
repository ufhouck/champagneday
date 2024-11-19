import React from 'react';
import { Flower2, ExternalLink } from 'lucide-react';

interface PlantInfo {
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  uses?: string[];
  season?: string;
}

export default function PlantCard({ plant }: { plant: PlantInfo }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Flower2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
            <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
            <p className="text-sm text-gray-600 mb-3">{plant.description}</p>
            {plant.uses && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Common Uses:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {plant.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>
            )}
            {plant.season && (
              <div className="mt-3 flex items-center text-sm text-emerald-600">
                <span className="font-medium">Best season: {plant.season}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}