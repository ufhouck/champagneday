import type { Moment, MomentInput } from '../types/moments';

// In-memory cache
let momentsCache: Moment[] = [];
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function getMoments(): Promise<Moment[]> {
  const now = Date.now();
  
  // Use cache if available and fresh
  if (momentsCache.length > 0 && now - lastFetch < CACHE_DURATION) {
    return momentsCache;
  }

  try {
    const response = await fetch('/data/moments.json');
    if (!response.ok) return [];
    
    const data = await response.json();
    momentsCache = data.moments || [];
    lastFetch = now;
    
    return momentsCache.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading moments:', error);
    return momentsCache;
  }
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  const moment: Moment = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    likes: 0,
    weather
  };

  const moments = [moment, ...momentsCache];
  
  try {
    const response = await fetch('/.netlify/functions/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moments })
    });

    if (!response.ok) throw new Error('Failed to save moment');
    
    momentsCache = moments;
    lastFetch = Date.now();
    
    return moment;
  } catch (error) {
    console.error('Error adding moment:', error);
    throw error;
  }
}

export async function likeMoment(id: string): Promise<void> {
  const moments = momentsCache.map(m => 
    m.id === id ? { ...m, likes: m.likes + 1 } : m
  );

  try {
    const response = await fetch('/.netlify/functions/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moments })
    });

    if (!response.ok) throw new Error('Failed to update moment');
    
    momentsCache = moments;
    lastFetch = Date.now();
  } catch (error) {
    console.error('Error liking moment:', error);
    throw error;
  }
}

export async function deleteMoment(id: string): Promise<void> {
  const moments = momentsCache.filter(m => m.id !== id);

  try {
    const response = await fetch('/.netlify/functions/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moments })
    });

    if (!response.ok) throw new Error('Failed to delete moment');
    
    momentsCache = moments;
    lastFetch = Date.now();
  } catch (error) {
    console.error('Error deleting moment:', error);
    throw error;
  }
}