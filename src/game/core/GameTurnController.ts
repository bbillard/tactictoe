import { ChargeBoostAbility } from '../abilities/ChargeBoost';
import { RandomAI } from '../ai/RandomAI';
import { CombatSystem } from './CombatSystem';
import { Board } from './Board';
import { detectLines } from './LineDetector';
import { LineResolver } from './LineResolver';
import { GamePhase } from '../state/GameState';

export interface TurnSnapshot {
  board: Board;
  playerHp: number;
  enemyHp: number;
  phase: GamePhase;
  log: string;
  ability: ChargeBoostAbility;
}

export class GameTurnController {
  readonly board = new Board(3);
  readonly ability = new ChargeBoostAbility();
  readonly ai = new RandomAI();
  readonly combat = new CombatSystem();
  readonly lineResolver = new LineResolver();

  playerHp = 10;
  enemyHp = 10;
  phase = GamePhase.PLAYER_TURN;
  log = 'Your turn. Place X.';

  startPlayerTurn(): void {
    this.phase = GamePhase.PLAYER_TURN;
    this.ability.tickCooldown();
    this.log = 'Your turn. Place X.';
  }

  tryPlayerPlace(row: number, col: number): boolean {
    if (this.phase !== GamePhase.PLAYER_TURN) {
      return false;
    }

    const placed = this.board.placeSymbol(row, col, 'X');
    if (!placed) {
      this.log = 'Cell is not empty.';
      return false;
    }

    this.resolveAfterMove('X');
    return true;
  }

  tryUseAbility(row: number, col: number): boolean {
    if (this.phase !== GamePhase.PLAYER_TURN) {
      return false;
    }

    const result = this.ability.use(this.board, row, col, 'X');
    this.log = result.message;
    return result.success;
  }

  runEnemyTurn(): void {
    if (this.phase === GamePhase.GAME_OVER) {
      return;
    }

    this.phase = GamePhase.ENEMY_TURN;
    const move = this.ai.chooseMove(this.board);
    if (!move) {
      this.log = 'No available moves. Your turn.';
      this.startPlayerTurn();
      return;
    }

    this.board.placeSymbol(move.row, move.col, 'O');
    this.log = `Enemy placed O at (${move.row + 1}, ${move.col + 1}).`;
    this.resolveAfterMove('O');
  }

  private resolveAfterMove(actor: 'X' | 'O'): void {
    this.phase = GamePhase.RESOLVING_LINES;

    const lines = detectLines(this.board).filter((line) => line.type === actor);
    let totalDamage = 0;

    for (const line of lines) {
      const resolution = this.lineResolver.resolveLine(this.board, line);
      totalDamage += resolution.damage;
    }

    if (totalDamage > 0) {
      if (actor === 'X') {
        this.enemyHp = this.combat.applyDamage(this.enemyHp, totalDamage);
        this.log = `You dealt ${totalDamage} damage.`;
      } else {
        this.playerHp = this.combat.applyDamage(this.playerHp, totalDamage);
        this.log = `Enemy dealt ${totalDamage} damage.`;
      }
    }

    if (this.enemyHp <= 0 || this.playerHp <= 0) {
      this.phase = GamePhase.GAME_OVER;
      this.log = this.enemyHp <= 0 ? 'Victory!' : 'Defeat!';
      return;
    }

    if (actor === 'X') {
      this.phase = GamePhase.ENEMY_TURN;
    } else {
      this.startPlayerTurn();
    }
  }

  getSnapshot(): TurnSnapshot {
    return {
      board: this.board,
      playerHp: this.playerHp,
      enemyHp: this.enemyHp,
      phase: this.phase,
      log: this.log,
      ability: this.ability,
    };
  }
}
