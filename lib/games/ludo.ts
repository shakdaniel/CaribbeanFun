// Ludo engine — you (red) vs 3 CPUs on a classic 15x15 cross board.

export type LColor = "red" | "green" | "yellow" | "blue";

export interface Token {
  id: string;
  color: LColor;
  slot: number; // 0..3 fixed base slot
  progress: number; // -1 in yard, 0..55 on path/home lane, 56 = finished
}

export const COLORS: LColor[] = ["red", "green", "yellow", "blue"];

export const COLOR_HEX: Record<LColor, string> = {
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#f59e0b",
  blue: "#3b82f6",
};

export const FINISH = 56;

// 52-cell main track in clockwise order on a 15x15 grid ([row, col]).
export const PATH: [number, number][] = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], // 0-4
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], // 5-10
  [0, 7], // 11
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], // 12-17
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], // 18-23
  [7, 14], // 24
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], // 25-30
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], // 31-36
  [14, 7], // 37
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], // 38-43
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], // 44-49
  [7, 0], // 50
  [6, 0], // 51
];

export const START_OFFSET: Record<LColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Home lane cells (progress 51..55) for each color, leading to the center.
export const HOME_LANE: Record<LColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

export const CENTER: [number, number] = [7, 7];

// Base slots (2x2) inside each corner.
export const BASE_SLOTS: Record<LColor, [number, number][]> = {
  red: [[1, 1], [1, 4], [4, 1], [4, 4]],
  green: [[1, 10], [1, 13], [4, 10], [4, 13]],
  yellow: [[10, 10], [10, 13], [13, 10], [13, 13]],
  blue: [[10, 1], [10, 4], [13, 1], [13, 4]],
};

// Safe squares (starts + stars): no captures happen here.
export const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export function initialTokens(): Token[] {
  const tokens: Token[] = [];
  for (const color of COLORS) {
    for (let slot = 0; slot < 4; slot++) {
      tokens.push({ id: `${color}-${slot}`, color, slot, progress: -1 });
    }
  }
  return tokens;
}

// Grid cell [row,col] where a token should be drawn.
export function cellFor(t: Token): [number, number] {
  if (t.progress === -1) return BASE_SLOTS[t.color][t.slot];
  if (t.progress <= 50)
    return PATH[(START_OFFSET[t.color] + t.progress) % 52];
  if (t.progress <= 55) return HOME_LANE[t.color][t.progress - 51];
  return CENTER;
}

// Ring index (for capture checks) or null if in yard/home lane/finished.
export function ringIndex(t: Token): number | null {
  if (t.progress < 0 || t.progress > 50) return null;
  return (START_OFFSET[t.color] + t.progress) % 52;
}

export function movableTokens(
  tokens: Token[],
  color: LColor,
  roll: number
): Token[] {
  return tokens.filter((t) => {
    if (t.color !== color) return false;
    if (t.progress === FINISH) return false;
    if (t.progress === -1) return roll === 6; // need a 6 to leave the yard
    return t.progress + roll <= FINISH; // can't overshoot the center
  });
}

export interface MoveResult {
  tokens: Token[];
  captured: number; // count of captured opponents
}

export function moveToken(
  tokens: Token[],
  tokenId: string,
  roll: number
): MoveResult {
  const next = tokens.map((t) => ({ ...t }));
  const tok = next.find((t) => t.id === tokenId)!;

  if (tok.progress === -1) {
    tok.progress = 0; // enters on its start square (only when roll === 6)
  } else {
    tok.progress = tok.progress + roll;
  }

  let captured = 0;
  const ri = ringIndex(tok);
  if (ri !== null && !SAFE.has(ri)) {
    for (const other of next) {
      if (other.color === tok.color) continue;
      if (ringIndex(other) === ri) {
        other.progress = -1; // send home
        captured++;
      }
    }
  }

  return { tokens: next, captured };
}

export function hasWon(tokens: Token[], color: LColor): boolean {
  return tokens
    .filter((t) => t.color === color)
    .every((t) => t.progress === FINISH);
}

export function rollDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

// CPU chooses a token: prefer captures, then finishing, then leaving yard,
// then the most-advanced token.
export function chooseCpuToken(
  tokens: Token[],
  color: LColor,
  roll: number
): Token | null {
  const movable = movableTokens(tokens, color, roll);
  if (movable.length === 0) return null;

  const scored = movable.map((t) => {
    let score = 0;
    const after = moveToken(tokens, t.id, roll);
    if (after.captured > 0) score += 100 * after.captured;
    if (t.progress + roll === FINISH) score += 50;
    if (t.progress === -1) score += 20;
    score += t.progress; // advance the leader
    return { t, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].t;
}
