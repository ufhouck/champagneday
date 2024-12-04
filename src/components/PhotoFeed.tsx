import React, { useState, useCallback } from 'react';
import { Camera, Upload, Trash2, Thermometer, Wind, CloudRain } from 'lucide-react';
import type { WeatherData } from '../types/weather';
import { usePhotos } from '../hooks/usePhotos';

interface PhotoFeedProps {
  weatherData: WeatherData;
}

export default function PhotoFeed({ weatherData }: PhotoFeedProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { photos, isLoading, error, uploadPhoto, deletePhoto } = usePhotos();

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          await uploadPhoto({
            imageData: reader.result,
            weather: {
              temp: weatherData.current.temp,
              windSpeed: weatherData.current.wind_speed,
              precipMm: weatherData.current.precip_mm,
              condition: weatherData.current.condition.text
            }
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  }, [weatherData, uploadPhoto]);

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading photos...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load photos</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

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
                    onClick={() => deletePhoto(photo.id, photo.imageUrl)}
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