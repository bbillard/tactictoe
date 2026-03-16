import { Board } from '../core/Board';

export class RandomAI {
  chooseMove(board: Board): { row: number; col: number } | null {
    const empties = board.getEmptyCells();
    if (empties.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * empties.length);
    return empties[index];
  }
}
