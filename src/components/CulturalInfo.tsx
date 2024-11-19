import React, { useState } from 'react';
import { Quote } from 'lucide-react';

interface CulturalInfoProps {
  compact?: boolean;
}

const QUOTES = [
  {
    text: "In Gümüşlük, where the ancient meets the eternal sea, every sunset writes a new story in gold.",
    author: "Cevat Şakir Kabaağaçlı",
    title: "The Fisherman of Halicarnassus"
  }
];

export default function CulturalInfo({ compact = false }: CulturalInfoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-4">
          <Quote className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-base font-serif italic text-gray-800 mb-2">
              {QUOTES[0].text}
            </p>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">{QUOTES[0].author}</p>
              {!compact && <p>{QUOTES[0].title}</p>}
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ferula Communis (Giant Fennel)
              </h3>
              <p className="text-sm text-gray-600">
                A characteristic plant of the Mediterranean region, growing abundantly in Gümüşlük's hills.
                Known locally for its historical and cultural significance.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Historical Legacy
            </h3>
            <p className="text-sm text-gray-600">
              Ancient Myndos, the predecessor of modern Gümüşlük, was an important 
              Dorian settlement dating back to 4th century BC.
            </p>
          </div>
        </>
      )}
    </div>
  );
}