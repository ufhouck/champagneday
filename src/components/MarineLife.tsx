import React from 'react';
import { Fish, Shell, Anchor } from 'lucide-react';

const MARINE_CREATURES = [
  {
    name: "Mediterranean Monk Seal",
    scientificName: "Monachus monachus",
    category: "Mammals",
    description: "Rare species occasionally spotted in quiet coves",
    icon: Fish,
    status: "Protected"
  },
  {
    name: "Common Octopus",
    scientificName: "Octopus vulgaris",
    category: "Cephalopods",
    description: "Intelligent creatures often found among rocks",
    icon: Shell,
    status: "Common"
  },
  {
    name: "Red Mullet",
    scientificName: "Mullus barbatus",
    category: "Fish",
    description: "Local delicacy swimming in small schools",
    icon: Fish,
    status: "Common"
  },
  {
    name: "Mediterranean Slipper Lobster",
    scientificName: "Scyllarides latus",
    category: "Crustaceans",
    description: "Nocturnal species found in rocky areas",
    icon: Anchor,
    status: "Protected"
  },
  {
    name: "Sea Bass",
    scientificName: "Dicentrarchus labrax",
    category: "Fish",
    description: "Popular fish found in coastal waters",
    icon: Fish,
    status: "Common"
  }
];

export default function MarineLife() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Marine Life</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Local species</span>
      </div>

      <div className="grid gap-4">
        {MARINE_CREATURES.map((creature) => {
          const Icon = creature.icon;
          return (
            <div 
              key={creature.name}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {creature.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-1">
                    {creature.scientificName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {creature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {creature.category}
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      creature.status === 'Protected'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      {creature.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}