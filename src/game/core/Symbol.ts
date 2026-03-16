export type SymbolType = 'X' | 'O';

export interface SymbolToken {
  type: SymbolType;
  charge: number;
}

export const formatSymbol = (symbol: SymbolToken | null): string => {
  if (!symbol) {
    return '';
  }

  return `${symbol.type}${'*'.repeat(symbol.charge)}`;
};
