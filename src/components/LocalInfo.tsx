import React, { useState } from 'react';
import { Map, History, Sprout, Flower2, Quote } from 'lucide-react';
import HikingRoutes from './HikingRoutes';
import CulturalInfo from './CulturalInfo';
import HistoricalFlashcards from './HistoricalFlashcards';
import LocalPlants from './LocalPlants';

type Tab = 'hiking' | 'culture' | 'history' | 'plants';

const TABS: Array<{ id: Tab; label: string; icon: typeof Map }> = [
  { id: 'hiking', label: 'Hiking', icon: Map },
  { id: 'culture', label: 'Culture', icon: Sprout },
  { id: 'history', label: 'History', icon: History },
  { id: 'plants', label: 'Plants', icon: Flower2 },
];

export default function LocalInfo() {
  const [activeTab, setActiveTab] = useState<Tab>('hiking');

  return (
    <div className="bg-white rounded-3xl shadow-lg">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Local Information</h2>
        </div>

        {/* Tabs */}
        <div className="flex px-4 -mb-px overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
      </div>
    </div>
  );
}