import { useState, useEffect } from 'react';
import { estimateCrowdSize } from '../lib/api/crowd';
import { CACHE_DURATION } from '../config/constants';

export function useCrowdData() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: number;

    async function fetchCount() {
      try {
        const crowdCount = await estimateCrowdSize();
        if (mounted) {
          setCount(crowdCount);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch crowd data'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCount();
    intervalId = window.setInterval(fetchCount, CACHE_DURATION.CROWD);
    
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { count, isLoading, error };
}