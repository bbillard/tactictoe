import type { Cell } from './Cell';
import type { SymbolToken, SymbolType } from './Symbol';

export class Board {
  readonly size: number;
  private readonly cells: Cell[][];

  constructor(size = 3) {
    this.size = size;
    this.cells = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => ({ row, col, symbol: null })),
    );
  }

  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }

  getSymbol(row: number, col: number): SymbolToken | null {
    return this.cells[row][col].symbol;
  }

  placeSymbol(row: number, col: number, type: SymbolType): boolean {
    const cell = this.getCell(row, col);
    if (cell.symbol) {
      return false;
    }

    cell.symbol = { type, charge: 0 };
    return true;
  }

  setSymbol(row: number, col: number, symbol: SymbolToken | null): void {
    this.cells[row][col].symbol = symbol;
  }

  clearCell(row: number, col: number): void {
    this.cells[row][col].symbol = null;
  }

  increaseCharge(row: number, col: number): boolean {
    const symbol = this.getSymbol(row, col);
    if (!symbol) {
      return false;
    }

    symbol.charge += 1;
    return true;
  }

  getEmptyCells(): Array<{ row: number; col: number }> {
    const empties: Array<{ row: number; col: number }> = [];
    for (let row = 0; row < this.size; row += 1) {
      for (let col = 0; col < this.size; col += 1) {
        if (!this.getSymbol(row, col)) {
          empties.push({ row, col });
        }
      }
    }

    return empties;
  }
}
