import type { Moment, MomentInput } from '../types/moments';

const MOMENTS_FILE = 'data/moments.json';

async function readMoments(): Promise<Moment[]> {
  try {
    const response = await fetch(`/${MOMENTS_FILE}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error reading moments:', error);
    return [];
  }
}

async function writeMoments(moments: Moment[]): Promise<void> {
  try {
    const response = await fetch('/api/moments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moments)
    });
    if (!response.ok) throw new Error('Failed to save moments');
  } catch (error) {
    console.error('Error writing moments:', error);
    throw error;
  }
}

export async function getMoments(): Promise<Moment[]> {
  const moments = await readMoments();
  return moments.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  const moments = await readMoments();
  
  const moment: Moment = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    likes: 0,
    weather
  };

  moments.push(moment);
  await writeMoments(moments);
  
  return moment;
}

export async function likeMoment(id: string): Promise<void> {
  const moments = await readMoments();
  const moment = moments.find(m => m.id === id);
  
  if (moment) {
    moment.likes += 1;
    await writeMoments(moments);
  }
}

export async function deleteMoment(id: string): Promise<void> {
  const moments = await readMoments();
  const filteredMoments = moments.filter(m => m.id !== id);
  await writeMoments(filteredMoments);
}