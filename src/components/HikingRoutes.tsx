import React, { useState } from 'react';
import { Map, Navigation } from 'lucide-react';

interface HikingRoutesProps {
  compact?: boolean;
}

const HIKING_ROUTES = [
  {
    name: "Ancient Myndos Path",
    difficulty: "Moderate",
    length: "8.5 km",
    duration: "3-4 hours",
    description: "Historical path connecting ancient Myndos to Gümüşlük"
  },
  {
    name: "Koyunbaba Trail",
    difficulty: "Easy",
    length: "5.2 km",
    duration: "2 hours",
    description: "Coastal path with beautiful Mediterranean views"
  }
];

interface RouteCardProps {
  route: typeof HIKING_ROUTES[0];
  isExpanded: boolean;
  onToggle: () => void;
}

function RouteCard({ route, isExpanded, onToggle }: RouteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
          <p className="text-sm text-gray-500">{route.length} • {route.difficulty}</p>
        </div>
        <Navigation className={`w-5 h-5 text-gray-400 transform transition-transform ${
          isExpanded ? 'rotate-90' : ''
        }`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-gray-600">
          <p className="mb-2">{route.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span>Duration: {route.duration}</span>
            <button className="text-blue-600 hover:text-blue-700">
              View on Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HikingRoutes({ compact = false }: HikingRoutesProps) {
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Hiking Routes</h2>
          <span className="text-sm text-gray-500">
            {HIKING_ROUTES.length} routes available
          </span>
        </div>
      )}

      <div className="grid gap-4">
        {HIKING_ROUTES.slice(0, compact ? 2 : undefined).map((route, index) => (
          <RouteCard
            key={route.name}
            route={route}
            isExpanded={expandedRoute === index}
            onToggle={() => setExpandedRoute(expandedRoute === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}