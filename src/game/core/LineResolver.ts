import { Board } from './Board';
import type { Line } from './LineDetector';

export interface LineResolutionResult {
  damage: number;
}

export class LineResolver {
  resolveLine(board: Board, line: Line): LineResolutionResult {
    let damage = 1;

    for (const position of line.positions) {
      const symbol = board.getSymbol(position.row, position.col);
      if (symbol) {
        damage += symbol.charge;
      }
    }

    const center = line.positions[1];
    board.increaseCharge(center.row, center.col);

    const first = line.positions[0];
    const last = line.positions[2];
    board.clearCell(first.row, first.col);
    board.clearCell(last.row, last.col);

    return { damage };
  }
}
