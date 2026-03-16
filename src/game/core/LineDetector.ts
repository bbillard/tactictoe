import { Board } from './Board';
import type { SymbolType } from './Symbol';

export interface Position {
  row: number;
  col: number;
}

export interface Line {
  positions: [Position, Position, Position];
  type: SymbolType;
}

const linePatterns: [Position, Position, Position][] = [
  [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ],
  [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ],
  [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
  ],
  [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
  ],
  [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
  ],
  [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
  ],
  [
    { row: 0, col: 2 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
  ],
];

export const detectLines = (board: Board): Line[] => {
  const lines: Line[] = [];

  for (const pattern of linePatterns) {
    const [firstPos, secondPos, thirdPos] = pattern;
    const first = board.getSymbol(firstPos.row, firstPos.col);
    const second = board.getSymbol(secondPos.row, secondPos.col);
    const third = board.getSymbol(thirdPos.row, thirdPos.col);

    if (first && second && third && first.type === second.type && second.type === third.type) {
      lines.push({
        positions: pattern,
        type: first.type,
      });
    }
  }

  return lines;
};
