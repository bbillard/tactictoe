import type { SymbolToken } from './Symbol';

export interface Cell {
  row: number;
  col: number;
  symbol: SymbolToken | null;
}
