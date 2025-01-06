import { useState, useEffect } from 'react';
import { getMoments, addMoment, deleteMoment, likeMoment } from '../lib/storage';
import type { Moment } from '../types/moments';

export function useMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMoments = async () => {
    try {
      setIsLoading(true);
      const data = await getMoments();
      setMoments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching moments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch moments'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const handleAddMoment = async (text: string, weather: Moment['weather']) => {
    try {
      const newMoment = await addMoment({ text, weather });
      setMoments(prev => [newMoment, ...prev]);
      return newMoment;
    } catch (err) {
      console.error('Error adding moment:', err);
      throw err;
    }
  };

  const handleDeleteMoment = async (id: string) => {
    try {
      await deleteMoment(id);
      setMoments(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting moment:', err);
      throw err;
    }
  };

  const handleLikeMoment = async (id: string) => {
    try {
      await likeMoment(id);
      setMoments(prev => prev.map(m => 
        m.id === id ? { ...m, likes: m.likes + 1 } : m
      ));
    } catch (err) {
      console.error('Error liking moment:', err);
      throw err;
    }
  };

  return {
    moments,
    isLoading,
    error,
    addMoment: handleAddMoment,
    deleteMoment: handleDeleteMoment,
    likeMoment: handleLikeMoment,
    refreshMoments: fetchMoments
  };
}