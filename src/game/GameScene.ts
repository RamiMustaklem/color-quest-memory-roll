/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { handleTileClick } from "../firebase/gameActions";

export default class GameScene extends Phaser.Scene {
  gameId: string;
  playerName: string;
  tileRects: Record<string, Phaser.GameObjects.Rectangle> = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(gameId: string, _gameState: any) {
    super("GameScene");
    this.gameId = gameId;
    this.playerName = localStorage.getItem("playerName") || "";
  }

  create() {
    const tileSize = 80;
    const margin = 10;

    // Listen to game state from Firebase
    const gameRef = ref(db, `games/${this.gameId}`);
    onValue(gameRef, (snapshot) => {
      const gameState = snapshot.val();
      if (!gameState || !gameState.grid) return;

      // Clear existing tiles if already drawn
      Object.values(this.tileRects).forEach((rect) => rect.destroy());
      this.tileRects = {};

      let i = 0;
      Object.entries(gameState.grid).forEach(([index, tile]: any) => {
        const x = (i % 6) * (tileSize + margin) + 100;
        const y = Math.floor(i / 6) * (tileSize + margin) + 100;
        i++;

        const isClaimed = tile.owner !== null;
        const rect = this.add
          .rectangle(x, y, tileSize, tileSize, isClaimed ? 0x00ff00 : 0x888888)
          .setInteractive()
          .setDepth(1);

        rect.removeAllListeners(); // Remove previous clicks

        if (!isClaimed && gameState.players[gameState.turn] === this.playerName) {
          rect.on("pointerdown", async () => {
            await handleTileClick(this.gameId, index, this.playerName);
          });
        }

        if (isClaimed) {
          this.add
            .text(x - 30, y - 10, tile.owner, {
              fontSize: "12px",
              color: "#000"
            })
            .setDepth(2);
        }

        this.tileRects[index] = rect;
      });

      // Show current color & turn
      this.add.text(10, 10, `Turn: ${gameState.players[gameState.turn]}`, {
        fontSize: "16px",
        color: "#ffffff"
      });

      this.add.text(10, 30, `Find: ${gameState.currentColor}`, {
        fontSize: "16px",
        color: "#ffffff"
      });
    });

    console.log("GameScene: Listening for game state updates...");
  }
}
