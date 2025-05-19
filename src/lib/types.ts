export type GameState = {
  grid: Record<string, { color: string; owner: string | null }>;
  players: string[];
  turn: number;
  currentColor: string;
};
