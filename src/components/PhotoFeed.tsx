import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Thermometer, Wind, CloudRain } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface PhotoPost {
  id: string;
  imageUrl: string;
  timestamp: number;
  weather: {
    temp: number;
    windSpeed: number;
    precipMm: number;
    condition: string;
  };
}

interface PhotoFeedProps {
  weatherData: WeatherData;
}

// Use localStorage to persist photos
const STORAGE_KEY = 'champagne-bay-photos';

export default function PhotoFeed({ weatherData }: PhotoFeedProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<PhotoPost[]>([]);

  // Load photos from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem(STORAGE_KEY);
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create a FileReader to read the image as a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto: PhotoPost = {
        id: Math.random().toString(36).substring(7),
        imageUrl: reader.result as string,
        timestamp: Date.now(),
        weather: {
          temp: weatherData.current.temp,
          windSpeed: weatherData.current.wind_speed,
          precipMm: weatherData.current.precip_mm,
          condition: weatherData.current.condition.text
        }
      };
      setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
          id="photo-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="photo-upload"
          className={`block w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            isUploading
              ? 'bg-gray-50 border-gray-300'
              : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <>
                <Upload className="w-8 h-8 text-gray-400 animate-bounce" />
                <span className="text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 text-blue-500" />
                <span className="text-blue-600 font-medium">Take a photo</span>
                <span className="text-sm text-gray-500">Share your Champagne Bay moment</span>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Photo Feed */}
      <div className="space-y-6">
        {photos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No moments shared today</h3>
            <p className="text-gray-500">Be the first to share a photo from Champagne Bay!</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={photo.imageUrl}
                  alt="Champagne Bay"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 hover:bg-red-50 rounded-full group transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">
                      {photo.weather.temp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {photo.weather.windSpeed.toFixed(1)} km/h
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CloudRain className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {photo.weather.precipMm.toFixed(1)} mm
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {photo.weather.condition}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}