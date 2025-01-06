import type { Moment, MomentInput } from '../types/moments';

const STORAGE_KEY = 'moments';

function getMomentsFromStorage(): Moment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

function saveMomentsToStorage(moments: Moment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export async function getMoments(): Promise<Moment[]> {
  return getMomentsFromStorage().sort((a, b) => b.timestamp - a.timestamp);
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  const moments = getMomentsFromStorage();
  
  const moment: Moment = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    likes: 0,
    weather
  };

  moments.unshift(moment);
  saveMomentsToStorage(moments);
  
  return moment;
}

export async function likeMoment(id: string): Promise<void> {
  const moments = getMomentsFromStorage();
  const moment = moments.find(m => m.id === id);
  
  if (moment) {
    moment.likes += 1;
    saveMomentsToStorage(moments);
  }
}

export async function deleteMoment(id: string): Promise<void> {
  const moments = getMomentsFromStorage();
  const filteredMoments = moments.filter(m => m.id !== id);
  saveMomentsToStorage(filteredMoments);
}