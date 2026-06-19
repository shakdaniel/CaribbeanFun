// Checkers / Draughts engine (8x8 English draughts rules with mandatory capture).
// Red ("r") is the human, moves up the board (decreasing row).
// Black ("b") is the CPU, moves down the board (increasing row).

export type Color = "r" | "b";
export interface Piece {
  color: Color;
  king: boolean;
}
export type Cell = Piece | null;
export type Board = Cell[][]; // [row][col], 8x8

export interface Move {
  from: [number, number];
  to: [number, number];
  captures: [number, number][]; // squares of captured pieces
}

export const SIZE = 8;

export function isDark(r: number, c: number) {
  return (r + c) % 2 === 1;
}

export function initialBoard(): Board {
  const b: Board = Array.from({ length: SIZE }, () =>
    Array<Cell>(SIZE).fill(null)
  );
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isDark(r, c)) continue;
      if (r < 3) b[r][c] = { color: "b", king: false };
      else if (r > 4) b[r][c] = { color: "r", king: false };
    }
  }
  return b;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function directions(piece: Piece): [number, number][] {
  if (piece.king) {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
  }
  return piece.color === "r"
    ? [
        [-1, -1],
        [-1, 1],
      ]
    : [
        [1, -1],
        [1, 1],
      ];
}

function clone(board: Board): Board {
  return board.map((row) => row.map((c) => (c ? { ...c } : null)));
}

// Apply a (single-step or full) move and return the new board.
export function applyMove(board: Board, move: Move): Board {
  const b = clone(board);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = b[fr][fc]!;
  b[fr][fc] = null;
  for (const [cr, cc] of move.captures) b[cr][cc] = null;
  // king promotion
  const becomesKing =
    !piece.king &&
    ((piece.color === "r" && tr === 0) || (piece.color === "b" && tr === SIZE - 1));
  b[tr][tc] = { color: piece.color, king: piece.king || becomesKing };
  return b;
}

// Recursive capture sequences from a square.
function captureSequences(
  board: Board,
  r: number,
  c: number,
  piece: Piece,
  captured: [number, number][]
): Move[] {
  const results: Move[] = [];
  let extended = false;
  for (const [dr, dc] of directions(piece)) {
    const mr = r + dr;
    const mc = c + dc;
    const lr = r + 2 * dr;
    const lc = c + 2 * dc;
    if (!inBounds(lr, lc)) continue;
    const mid = board[mr]?.[mc];
    if (!mid || mid.color === piece.color) continue;
    if (board[lr][lc] !== null) continue;
    if (captured.some(([cr, cc]) => cr === mr && cc === mc)) continue;

    // simulate the jump
    const nb = clone(board);
    nb[r][c] = null;
    nb[mr][mc] = null;
    // promotion ends the multi-jump in English draughts
    const becomesKing =
      !piece.king &&
      ((piece.color === "r" && lr === 0) ||
        (piece.color === "b" && lr === SIZE - 1));
    const movedPiece: Piece = {
      color: piece.color,
      king: piece.king || becomesKing,
    };
    nb[lr][lc] = movedPiece;

    const newCaptured = [...captured, [mr, mc] as [number, number]];

    if (!becomesKing) {
      const further = captureSequences(nb, lr, lc, movedPiece, newCaptured);
      if (further.length > 0) {
        extended = true;
        for (const f of further) results.push(f);
      }
    }
    if (becomesKing || !extended) {
      // record this jump as a terminal capture from the original square
      // (the `from` is the original piece's start; we rebuild on return)
      results.push({ from: [r, c], to: [lr, lc], captures: newCaptured });
    }
  }
  return results;
}

// All legal moves for a color (enforces mandatory capture).
export function legalMoves(board: Board, color: Color): Move[] {
  const captures: Move[] = [];
  const quiet: Move[] = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;

      const seqs = captureSequences(board, r, c, piece, []);
      for (const s of seqs) captures.push({ ...s, from: [r, c] });

      if (seqs.length === 0) {
        for (const [dr, dc] of directions(piece)) {
          const tr = r + dr;
          const tc = c + dc;
          if (inBounds(tr, tc) && board[tr][tc] === null) {
            quiet.push({ from: [r, c], to: [tr, tc], captures: [] });
          }
        }
      }
    }
  }
  return captures.length > 0 ? captures : quiet;
}

export function movesFrom(
  board: Board,
  color: Color,
  r: number,
  c: number
): Move[] {
  return legalMoves(board, color).filter(
    (m) => m.from[0] === r && m.from[1] === c
  );
}

export function countPieces(board: Board, color: Color): number {
  let n = 0;
  for (const row of board) for (const cell of row) if (cell?.color === color) n++;
  return n;
}

export function winner(board: Board, toMove: Color): Color | null {
  if (countPieces(board, "r") === 0) return "b";
  if (countPieces(board, "b") === 0) return "r";
  if (legalMoves(board, toMove).length === 0)
    return toMove === "r" ? "b" : "r";
  return null;
}

// --- Simple CPU (greedy with a touch of look-ahead) ---

function evaluate(board: Board): number {
  // positive favors black (CPU)
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (!p) continue;
      const val = p.king ? 5 : 3;
      const advance = p.color === "b" ? r : SIZE - 1 - r; // push forward
      const s = val + advance * 0.1;
      score += p.color === "b" ? s : -s;
    }
  }
  return score;
}

export function chooseCpuMove(board: Board): Move | null {
  const moves = legalMoves(board, "b");
  if (moves.length === 0) return null;

  let best: Move[] = [];
  let bestScore = -Infinity;
  for (const m of moves) {
    const after = applyMove(board, m);
    // opponent's best reply (1-ply) to discourage blunders
    const replies = legalMoves(after, "r");
    let worst = evaluate(after);
    for (const rm of replies) {
      const s = evaluate(applyMove(after, rm));
      if (s < worst) worst = s;
    }
    const score = worst + m.captures.length * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = [m];
    } else if (score === bestScore) {
      best.push(m);
    }
  }
  return best[Math.floor(Math.random() * best.length)];
}
