/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, get, update, set } from "firebase/database";
import { db } from "./config";

// 🎨 Game color palette
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// 🧩 Initializes grid with 24 tiles
const initializeGrid = (): Record<string, any> => {
  const grid: Record<string, any> = {};
  for (let i = 0; i < 24; i++) {
    grid[i] = {
      color: colors[Math.floor(Math.random() * colors.length)],
      owner: null
    };
  }
  return grid;
};

// 🚀 Called when 2+ players join or on game creation
export const startGame = async (gameId: string, players: string[]) => {
  const gameRef = ref(db, `games/${gameId}`);

  const grid = initializeGrid();
  const scores = Object.fromEntries(players.map(p => [p, 0]));
  const currentColor = colors[Math.floor(Math.random() * colors.length)];

  await set(gameRef, {
    players,
    status: "in-progress",
    grid,
    scores,
    turn: 0,
    currentColor
  });
};

// 🎲 Called when player clicks "Roll Dice"
export const rollDiceAndAdvanceTurn = async (gameId: string) => {
  const gameRef = ref(db, `games/${gameId}`);
  const snapshot = await get(gameRef);
  const data = snapshot.val();

  const nextTurn = (data.turn + 1) % data.players.length;
  const newColor = colors[Math.floor(Math.random() * colors.length)];

  await update(gameRef, {
    turn: nextTurn,
    currentColor: newColor
  });
};

// 🧠 Called when a player clicks a tile
export const handleTileClick = async (
  gameId: string,
  tileIndex: number,
  playerName: string
) => {
  const gameRef = ref(db, `games/${gameId}`);
  const snapshot = await get(gameRef);
  const data = snapshot.val();

  const tile = data.grid[tileIndex];
  if (!tile || tile.owner) return;

  // 🎯 Check for color match
  const isCorrect = tile.color === data.currentColor;

  if (isCorrect) {
    data.grid[tileIndex].owner = playerName;
    data.scores[playerName] += 1;

    await update(gameRef, {
      grid: data.grid,
      scores: data.scores
    });

    // 🏁 Check for end of game
    const allClaimed = Object.values(data.grid).every((t: any) => t.owner !== null);
    if (allClaimed) {
      await update(gameRef, { status: "finished" });
    } else {
      await rollDiceAndAdvanceTurn(gameId);
    }
  } else {
    // ❌ Wrong guess — just advance turn
    await rollDiceAndAdvanceTurn(gameId);
  }
};
