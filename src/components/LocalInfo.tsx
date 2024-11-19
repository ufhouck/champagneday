import React, { useState } from 'react';
import { Map, History, Sprout, Flower2, Fish } from 'lucide-react';
import HikingRoutes from './HikingRoutes';
import CulturalInfo from './CulturalInfo';
import HistoricalFlashcards from './HistoricalFlashcards';
import LocalPlants from './LocalPlants';
import MarineLife from './MarineLife';

type Tab = 'hiking' | 'culture' | 'history' | 'plants' | 'marine';

const TABS: Array<{ id: Tab; label: string; icon: typeof Map }> = [
  { id: 'hiking', label: 'Hiking', icon: Map },
  { id: 'culture', label: 'Culture', icon: Sprout },
  { id: 'history', label: 'History', icon: History },
  { id: 'plants', label: 'Plants', icon: Flower2 },
  { id: 'marine', label: 'Marine', icon: Fish },
];

export default function LocalInfo() {
  const [activeTab, setActiveTab] = useState<Tab>('hiking');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Local Information</h2>
        </div>

        {/* Tabs */}
        <div className="flex px-4 -mb-px overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className={`space-y-6 transition-opacity duration-200 ${
          activeTab === 'hiking' ? 'block' : 'hidden'
        }`}>
          <HikingRoutes />
        </div>
        
        <div className={`space-y-6 transition-opacity duration-200 ${
          activeTab === 'culture' ? 'block' : 'hidden'
        }`}>
          <CulturalInfo />
        </div>
        
        <div className={`space-y-6 transition-opacity duration-200 ${
          activeTab === 'history' ? 'block' : 'hidden'
        }`}>
          <HistoricalFlashcards />
        </div>

        <div className={`space-y-6 transition-opacity duration-200 ${
          activeTab === 'plants' ? 'block' : 'hidden'
        }`}>
          <LocalPlants />
        </div>

        <div className={`space-y-6 transition-opacity duration-200 ${
          activeTab === 'marine' ? 'block' : 'hidden'
        }`}>
          <MarineLife />
        </div>
      </div>
    </div>
  );
}