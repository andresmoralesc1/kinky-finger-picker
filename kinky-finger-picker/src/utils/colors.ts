// Vibrant colors for player selection
export const PLAYER_COLORS = [
  '#FF006E', // Hot Pink
  '#FB5607', // Orange
  '#FFBE0B', // Yellow
  '#8338EC', // Purple
  '#3A86FF', // Blue
  '#06FFA5', // Mint
  '#FF1744', // Red
  '#00E676', // Green
  '#FF6D00', // Deep Orange
  '#D500F9', // Magenta
];

export const getRandomColor = (usedColors: string[] = []): string => {
  const availableColors = PLAYER_COLORS.filter(c => !usedColors.includes(c));
  if (availableColors.length === 0) return PLAYER_COLORS[0];
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};
