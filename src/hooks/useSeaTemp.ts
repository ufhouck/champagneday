import { useState, useEffect } from 'react';
import { fetchSeaTemperature } from '../lib/api/seaTemp';
import { DEFAULTS } from '../config/constants';

export function useSeaTemp() {
  const [seaTemp, setSeaTemp] = useState(DEFAULTS.SEA_TEMP);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getSeaTemp() {
      try {
        const temp = await fetchSeaTemperature();
        setSeaTemp(temp);
        setError(null);
      } catch (err) {
        console.error('Sea temperature error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch sea temperature'));
      } finally {
        setIsLoading(false);
      }
    }

    getSeaTemp();
  }, []);

  return { seaTemp, isLoading, error };
}