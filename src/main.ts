import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';
import { BootScene } from './game/scenes/BootScene';
import { GameScene } from './game/scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 540,
  height: 700,
  backgroundColor: '#0f172a',
  scene: [BootScene, GameScene],
};

new Phaser.Game(config);
