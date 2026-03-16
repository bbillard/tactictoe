import { Board } from '../core/Board';
import type { SymbolType } from '../core/Symbol';

export interface AbilityUseResult {
  success: boolean;
  message: string;
}

export interface Ability {
  readonly name: string;
  readonly cooldown: number;
  currentCooldown: number;
  canUse(): boolean;
  tickCooldown(): void;
  use(board: Board, row: number, col: number, owner: SymbolType): AbilityUseResult;
}
