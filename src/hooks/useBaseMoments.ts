import { useEffect, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { publicClient, MOMENTS_CONTRACT_ADDRESS, MOMENTS_ABI, formatMomentFromChain } from '../lib/baseChain';
import type { Moment } from '../types/moments';

export function useBaseMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Read contract data
  const { data: contractMoments, error: readError } = useReadContract({
    address: MOMENTS_CONTRACT_ADDRESS,
    abi: MOMENTS_ABI,
    functionName: 'getMoments',
  });

  // Write contract functions
  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    if (contractMoments) {
      const formattedMoments = contractMoments.map(formatMomentFromChain);
      setMoments(formattedMoments);
      setIsLoading(false);
    }
    if (readError) {
      setError(readError);
      setIsLoading(false);
    }
  }, [contractMoments, readError]);

  const addMoment = async (text: string, weather: Moment['weather']) => {
    try {
      const { temp, windSpeed, precipMm, condition } = weather;
      
      const result = await writeContract({
        address: MOMENTS_CONTRACT_ADDRESS,
        abi: MOMENTS_ABI,
        functionName: 'createMoment',
        args: [
          text,
          BigInt(Date.now()),
          {
            temp: BigInt(Math.round(temp * 100)),
            windSpeed: BigInt(Math.round(windSpeed * 100)),
            precipMm: BigInt(Math.round(precipMm * 100)),
            condition
          }
        ]
      });

      // Wait for transaction to be mined
      await publicClient.waitForTransactionReceipt({ hash: result });
      
      // Refresh moments list
      const newMoments = await publicClient.readContract({
        address: MOMENTS_CONTRACT_ADDRESS,
        abi: MOMENTS_ABI,
        functionName: 'getMoments'
      });

      setMoments(newMoments.map(formatMomentFromChain));
      
      return result;
    } catch (err) {
      console.error('Error adding moment:', err);
      throw err;
    }
  };

  const likeMoment = async (id: string) => {
    try {
      const result = await writeContract({
        address: MOMENTS_CONTRACT_ADDRESS,
        abi: MOMENTS_ABI,
        functionName: 'likeMoment',
        args: [BigInt(id)]
      });

      await publicClient.waitForTransactionReceipt({ hash: result });
      
      // Refresh moments list
      const newMoments = await publicClient.readContract({
        address: MOMENTS_CONTRACT_ADDRESS,
        abi: MOMENTS_ABI,
        functionName: 'getMoments'
      });

      setMoments(newMoments.map(formatMomentFromChain));
    } catch (err) {
      console.error('Error liking moment:', err);
      throw err;
    }
  };

  return {
    moments,
    isLoading: isLoading || isPending,
    error,
    addMoment,
    likeMoment
  };
}