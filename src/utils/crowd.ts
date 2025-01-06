export function getTimeBasedEstimate(): number {
  const hour = new Date().getHours();
  
  if (hour >= 22 || hour < 6) return 0;
  if (hour >= 11 && hour <= 16) return Math.floor(Math.random() * 5) + 8; // 8-12 people
  if (hour >= 9 && hour < 11) return Math.floor(Math.random() * 3) + 5;   // 5-7 people
  if (hour >= 16 && hour < 19) return Math.floor(Math.random() * 3) + 6;  // 6-8 people
  return Math.floor(Math.random() * 3) + 2; // 2-4 people
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