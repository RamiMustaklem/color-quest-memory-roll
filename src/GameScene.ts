import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('tile', '/tile.png'); // Use a placeholder tile asset
  }

  create() {
    const rows = 4, cols = 6, tileSize = 80;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    // const index = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = this.add.rectangle(
          100 + x * tileSize,
          100 + y * tileSize,
          tileSize - 10,
          tileSize - 10,
          0x888888
        ).setInteractive();

        tile.setData('color', Phaser.Utils.Array.GetRandom(colors));
        tile.on('pointerdown', () => {
          tile.setFillStyle(Phaser.Display.Color.HexStringToColor(tile.getData('color')).color);
        });
      }
    }
  }
}
