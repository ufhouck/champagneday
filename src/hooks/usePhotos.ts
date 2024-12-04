import { useState, useEffect } from 'react';
import { addPhoto, getPhotos, deletePhoto } from '../lib/firebase';
import type { PhotoPost } from '../types/photos';

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const data = await getPhotos();
      setPhotos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch photos'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, []);

  const uploadPhoto = async (photoData: { imageData: string; weather: PhotoPost['weather'] }) => {
    try {
      const newPhoto = await addPhoto(photoData);
      setPhotos(prev => [newPhoto, ...prev]);
      return newPhoto;
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  };

  const handleDeletePhoto = async (id: string, imageUrl: string) => {
    try {
      await deletePhoto(id, imageUrl);
      setPhotos(prev => prev.filter(photo => photo.id !== id));
    } catch (err) {
      console.error('Error deleting photo:', err);
      throw err;
    }
  };

  return {
    photos,
    isLoading,
    error,
    uploadPhoto,
    deletePhoto: handleDeletePhoto,
    refreshPhotos: fetchPhotos
  };
}