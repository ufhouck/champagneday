export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getCrowdEstimate(): number {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return 0;
  if (hour >= 11 && hour <= 16) return Math.floor(Math.random() * 3) + 2;
  return Math.floor(Math.random() * 2);
}

export function getCrowdMessage(count: number): string {
  if (count === 0) return "Champagne is empty right now";
  if (count === 1) return "One person at Champagne";
  return `${count} people at Champagne`;
}