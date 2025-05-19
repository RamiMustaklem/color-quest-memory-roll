/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { onValue, ref } from "firebase/database";
import Phaser from "phaser";
import GameScene from "./GameScene";
import { rollDiceAndAdvanceTurn, startGame } from "../firebase/gameActions";

export const GameRoom = () => {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState<any>(null);
  const playerName = localStorage.getItem("playerName") || "";
  const gameRef = useRef<Phaser.Game | null>(null);

  // Listen to Firebase game state
  useEffect(() => {
    if (!gameId) return;
    const gameStateRef = ref(db, `games/${gameId}`);
    const unsub = onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      setGameState(data);
    });

    return () => unsub();
  }, [gameId]);

  // Auto-start game when 2+ players join
  useEffect(() => {
    if (!gameId || !gameState) return;
    if (gameState.status === "waiting" && gameState.players.length >= 2) {
      startGame(gameId, gameState.players);
    }
  }, [gameId, gameState]);

  // Create Phaser game once state is ready
  useEffect(() => {
    if (!gameState || !gameState.grid || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: [new GameScene(gameId!, gameState)]
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [gameId, gameState]);

  if (!gameState) return <p>Loading game...</p>;

  const currentPlayer = gameState.players[gameState.turn];
  const isMyTurn = playerName === currentPlayer;

  return (
    <div>
      <h2>Game Room</h2>
      <p>Game ID: {gameId}</p>
      <p>You are: {playerName}</p>
      <p>Players: {gameState.players.join(", ")}</p>
      <p>Turn: {currentPlayer}</p>
      <p>Target Color: {gameState.currentColor || "Waiting for roll..."}</p>

      {isMyTurn && (
        <button onClick={() => rollDiceAndAdvanceTurn(gameId!)}>
          🎲 Roll Dice
        </button>
      )}

      <div id="game-container" style={{ marginTop: "20px" }} />
    </div>
  );
};
