import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js';
import { GameTurnController } from '../core/GameTurnController';
import { formatSymbol } from '../core/Symbol';
import { GamePhase } from '../state/GameState';

const CELL_SIZE = 120;
const BOARD_X = 90;
const BOARD_Y = 160;

export class GameScene extends Phaser.Scene {
  private controller = new GameTurnController();
  private statusText!: any;
  private playerHpText!: any;
  private enemyHpText!: any;
  private abilityText!: any;
  private turnText!: any;
  private cellTexts: any[][] = [];
  private abilityMode = false;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.add.text(30, 30, 'Tactictoe MVP', { fontSize: '28px', color: '#f8fafc' });

    this.playerHpText = this.add.text(30, 75, '', { fontSize: '24px', color: '#93c5fd' });
    this.enemyHpText = this.add.text(30, 115, '', { fontSize: '24px', color: '#f87171' });

    this.drawBoard();

    this.abilityText = this.add
      .text(30, 550, '', { fontSize: '24px', color: '#fde047', backgroundColor: '#1e293b', padding: { x: 8, y: 6 } })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const snapshot = this.controller.getSnapshot();
        if (snapshot.phase !== GamePhase.PLAYER_TURN) {
          return;
        }

        if (!snapshot.ability.canUse()) {
          this.controller.log = `Charge Boost cooldown: ${snapshot.ability.currentCooldown}`;
          this.refresh();
          return;
        }

        this.abilityMode = !this.abilityMode;
        this.controller.log = this.abilityMode
          ? 'Ability mode ON: click one of your X symbols.'
          : 'Ability mode OFF.';
        this.refresh();
      });

    this.turnText = this.add.text(30, 600, '', { fontSize: '22px', color: '#cbd5e1' });
    this.statusText = this.add.text(30, 640, '', { fontSize: '20px', color: '#e2e8f0' });

    this.refresh();
  }

  private drawBoard(): void {
    for (let row = 0; row < 3; row += 1) {
      this.cellTexts[row] = [];
      for (let col = 0; col < 3; col += 1) {
        const x = BOARD_X + col * CELL_SIZE;
        const y = BOARD_Y + row * CELL_SIZE;

        this.add.rectangle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE - 6, CELL_SIZE - 6, 0x1e293b, 1);
        this.add.rectangle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE - 6, CELL_SIZE - 6).setStrokeStyle(2, 0x475569);

        const text = this.add
          .text(x + CELL_SIZE / 2, y + CELL_SIZE / 2, '', {
            fontSize: '48px',
            color: '#f8fafc',
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.handleCellClick(row, col));

        this.cellTexts[row][col] = text;
      }
    }
  }

  private handleCellClick(row: number, col: number): void {
    const snapshot = this.controller.getSnapshot();
    if (snapshot.phase !== GamePhase.PLAYER_TURN) {
      return;
    }

    if (this.abilityMode) {
      this.controller.tryUseAbility(row, col);
      this.abilityMode = false;
      this.refresh();
      return;
    }

    const placed = this.controller.tryPlayerPlace(row, col);
    this.refresh();

    if (!placed) {
      return;
    }

    this.time.delayedCall(550, () => {
      this.controller.runEnemyTurn();
      this.refresh();
    });
  }

  private refresh(): void {
    const snapshot = this.controller.getSnapshot();

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const symbol = snapshot.board.getSymbol(row, col);
        const text = this.cellTexts[row][col];
        text.setText(formatSymbol(symbol));

        if (!symbol) {
          text.setColor('#f8fafc');
        } else if (symbol.type === 'X') {
          text.setColor(symbol.charge > 0 ? '#60a5fa' : '#3b82f6');
        } else {
          text.setColor(symbol.charge > 0 ? '#fca5a5' : '#ef4444');
        }
      }
    }

    this.playerHpText.setText(`HP PLAYER: ${snapshot.playerHp}`);
    this.enemyHpText.setText(`HP ENEMY: ${snapshot.enemyHp}`);
    this.abilityText.setText(
      snapshot.ability.canUse()
        ? this.abilityMode
          ? '[Charge Boost: SELECT CELL]'
          : '[Charge Boost]'
        : `[Charge Boost CD: ${snapshot.ability.currentCooldown}]`,
    );
    this.turnText.setText(`Turn: ${snapshot.phase}`);
    this.statusText.setText(snapshot.log);

    if (snapshot.phase === GamePhase.GAME_OVER) {
      this.abilityMode = false;
    }
  }
}
