const CACHE_KEY = 'crowdEstimate';
const CACHE_DURATION = 15 * 60 * 1000; // 15 dakika

function getCachedCrowdCount(): number | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { count, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < CACHE_DURATION) {
      return count;
    }
    return null;
  } catch {
    return null;
  }
}

function cacheCrowdCount(count: number): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      count,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache crowd count:', error);
  }
}

export function getTimeBasedEstimate(): number {
  const cachedCount = getCachedCrowdCount();
  if (cachedCount !== null) {
    return cachedCount;
  }

  const hour = new Date().getHours();
  let count = 0;
  
  if (hour >= 22 || hour < 6) {
    count = 0;
  } else if (hour >= 11 && hour <= 16) {
    count = 8 + Math.floor(Math.random() * 5); // 8-12 people
  } else if (hour >= 9 && hour < 11) {
    count = 5 + Math.floor(Math.random() * 3); // 5-7 people
  } else if (hour >= 16 && hour < 19) {
    count = 6 + Math.floor(Math.random() * 3); // 6-8 people
  } else {
    count = 2 + Math.floor(Math.random() * 3); // 2-4 people
  }

  cacheCrowdCount(count);
  return count;
}

export function getCrowdMessage(count: number): string {
  if (count === 0) return "Empty (0 people)";
  if (count === 1) return "Very quiet (1 person)";
  if (count <= 4) return `Quiet (2-4 people)`;
  if (count <= 7) return `Moderate (5-7 people)`;
  if (count <= 10) return `Getting busy (8-10 people)`;
  if (count <= 12) return `Busy (11-12 people)`;
  return `Very busy (13+ people)`;
}