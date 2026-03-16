import { Board } from '../core/Board';
import type { SymbolType } from '../core/Symbol';
import type { Ability, AbilityUseResult } from './Ability';

export class ChargeBoostAbility implements Ability {
  readonly name = 'Charge Boost';
  readonly cooldown = 3;
  currentCooldown = 0;
  private usedThisTurn = false;

  canUse(): boolean {
    return this.currentCooldown === 0 && !this.usedThisTurn;
  }

  tickCooldown(): void {
    if (this.currentCooldown > 0) {
      this.currentCooldown -= 1;
    }
    this.usedThisTurn = false;
  }

  use(board: Board, row: number, col: number, owner: SymbolType): AbilityUseResult {
    if (!this.canUse()) {
      return { success: false, message: 'Ability unavailable.' };
    }

    const symbol = board.getSymbol(row, col);
    if (!symbol || symbol.type !== owner) {
      return { success: false, message: 'Select one of your symbols.' };
    }

    symbol.charge += 1;
    this.currentCooldown = this.cooldown;
    this.usedThisTurn = true;

    return { success: true, message: `Boosted ${owner} at (${row + 1}, ${col + 1}).` };
  }
}
