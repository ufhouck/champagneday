import { useState, useEffect } from 'react';
import { estimateCrowdSize } from '../utils/crowdEstimation';

export function useCrowdEstimate() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function updateEstimate() {
      try {
        const estimate = await estimateCrowdSize();
        if (mounted) {
          setCount(estimate);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to estimate crowd'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    updateEstimate();

    // Her 15 dakikada bir güncelle
    const interval = setInterval(updateEstimate, 15 * 60 * 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { count, isLoading, error };
}