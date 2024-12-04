import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Heart, Wind, Thermometer, CloudRain } from 'lucide-react';
import type { WeatherData } from '../types/weather';
import { useMoments } from '../hooks/useMoments';

interface MomentsFeedProps {
  weatherData: WeatherData;
}

export default function MomentsFeed({ weatherData }: MomentsFeedProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { moments, isLoading, error, addMoment, deleteMoment, likeMoment } = useMoments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addMoment(text.trim(), {
        temp: weatherData.current.temp,
        windSpeed: weatherData.current.wind_speed,
        precipMm: weatherData.current.precip_mm,
        condition: weatherData.current.condition.text
      });
      setText('');
    } catch (error) {
      console.error('Error submitting moment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading moments...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <MessageSquare className="w-12 h-12 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load moments</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-start space-x-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your Champagne Bay moment..."
            className="flex-1 min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={isSubmitting}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span>{weatherData.current.temp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="w-4 h-4 text-blue-500" />
              <span>{weatherData.current.wind_speed.toFixed(1)} km/h</span>
            </div>
            <div className="flex items-center space-x-1">
              <CloudRain className="w-4 h-4 text-gray-500" />
              <span>{weatherData.current.precip_mm.toFixed(1)} mm</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {moments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No moments shared yet</h3>
            <p className="text-gray-500">Be the first to share a moment from Champagne Bay!</p>
          </div>
        ) : (
          moments.map((moment) => (
            <div key={moment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{moment.text}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    {new Date(moment.timestamp).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => likeMoment(moment.id)}
                      className="p-2 hover:bg-pink-50 rounded-full group transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                        <span className="text-sm text-gray-500 group-hover:text-pink-500">
                          {moment.likes}
                        </span>
                      </div>
                    </button>
                    <button 
                      onClick={() => deleteMoment(moment.id)}
                      className="p-2 hover:bg-red-50 rounded-full group transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">
                      {moment.weather.temp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {moment.weather.windSpeed.toFixed(1)} km/h
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CloudRain className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {moment.weather.precipMm.toFixed(1)} mm
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {moment.weather.condition}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}