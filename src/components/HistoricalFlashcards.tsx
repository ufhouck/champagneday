import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface HistoricalFlashcardsProps {
  compact?: boolean;
}

const HISTORICAL_CARDS = [
  {
    quote: "Where the ancient walls of Myndos whisper tales of centuries past",
    author: "Herodotus",
    title: "The Histories"
  },
  {
    quote: "The waters of Gümüşlük hold secrets of civilizations long gone",
    author: "Strabo",
    title: "Geographica"
  }
];

export default function HistoricalFlashcards({ compact = false }: HistoricalFlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((current) => 
          current === HISTORICAL_CARDS.length - 1 ? 0 : current + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const displayCards = compact ? [HISTORICAL_CARDS[0]] : HISTORICAL_CARDS;

  return (
    <div className="space-y-4">
      {displayCards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start space-x-3">
            <Quote className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg font-serif italic text-gray-800 dark:text-gray-200 mb-3">
                {card.quote}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold">{card.author}</p>
                {!compact && <p>{card.title}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}

      {!compact && displayCards.length > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={() => {
              setCurrentIndex(current => 
                current === 0 ? HISTORICAL_CARDS.length - 1 : current - 1
              );
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 dark:text-gray-300" />
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5 dark:text-gray-300" />
            ) : (
              <Play className="w-5 h-5 dark:text-gray-300" />
            )}
          </button>
          
          <button
            onClick={() => {
              setCurrentIndex(current => 
                current === HISTORICAL_CARDS.length - 1 ? 0 : current + 1
              );
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}