// Block dominoes (double-six), head-to-head: you vs CPU.

export type Tile = [number, number];

export interface Placed {
  tile: Tile; // oriented for display: left value, right value
}

export interface GameState {
  playerHand: Tile[];
  cpuHand: Tile[];
  line: Placed[]; // played tiles, left to right
  leftEnd: number;
  rightEnd: number;
  turn: "player" | "cpu";
  passes: number; // consecutive passes
  winner: "player" | "cpu" | "tie" | null;
  log: string[];
}

export function fullSet(): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push([i, j]);
    }
  }
  return tiles;
}

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pipCount(hand: Tile[]): number {
  return hand.reduce((s, [a, b]) => s + a + b, 0);
}

export function tileMatches(tile: Tile, end: number): boolean {
  return tile[0] === end || tile[1] === end;
}

export interface PlayOption {
  index: number; // index in hand
  side: "left" | "right";
}

export function legalPlays(hand: Tile[], state: GameState): PlayOption[] {
  if (state.line.length === 0) {
    return hand.map((_, index) => ({ index, side: "right" as const }));
  }
  const opts: PlayOption[] = [];
  hand.forEach((tile, index) => {
    if (tileMatches(tile, state.leftEnd)) opts.push({ index, side: "left" });
    if (tileMatches(tile, state.rightEnd)) opts.push({ index, side: "right" });
  });
  return opts;
}

export function newGame(): GameState {
  const deck = shuffle(fullSet());
  const playerHand = deck.slice(0, 7);
  const cpuHand = deck.slice(7, 14);

  // Highest double leads; fall back to player.
  let starter: "player" | "cpu" = "player";
  let bestDouble = -1;
  for (const [a, b] of playerHand)
    if (a === b && a > bestDouble) {
      bestDouble = a;
      starter = "player";
    }
  for (const [a, b] of cpuHand)
    if (a === b && a > bestDouble) {
      bestDouble = a;
      starter = "cpu";
    }

  return {
    playerHand,
    cpuHand,
    line: [],
    leftEnd: -1,
    rightEnd: -1,
    turn: starter,
    passes: 0,
    winner: null,
    log: [`${starter === "player" ? "You" : "CPU"} start.`],
  };
}

// Place a tile from `hand` onto the line. Mutates a copy and returns it.
export function playTile(
  state: GameState,
  who: "player" | "cpu",
  index: number,
  side: "left" | "right"
): GameState {
  const s = structuredCloneState(state);
  const hand = who === "player" ? s.playerHand : s.cpuHand;
  const tile = hand[index];
  hand.splice(index, 1);

  if (s.line.length === 0) {
    s.line.push({ tile: [tile[0], tile[1]] });
    s.leftEnd = tile[0];
    s.rightEnd = tile[1];
  } else if (side === "left") {
    const open = s.leftEnd;
    // orient so the matching value touches the line: [outer, open]
    const oriented: Tile = tile[1] === open ? [tile[0], tile[1]] : [tile[1], tile[0]];
    s.line.unshift({ tile: oriented });
    s.leftEnd = oriented[0];
  } else {
    const open = s.rightEnd;
    const oriented: Tile = tile[0] === open ? [tile[0], tile[1]] : [tile[1], tile[0]];
    s.line.push({ tile: oriented });
    s.rightEnd = oriented[1];
  }

  s.passes = 0;
  s.log.unshift(
    `${who === "player" ? "You" : "CPU"} played [${tile[0]}|${tile[1]}].`
  );

  // win by emptying hand
  if (hand.length === 0) {
    s.winner = who;
    s.log.unshift(`${who === "player" ? "You" : "CPU"} domino! 🎉`);
    return s;
  }

  s.turn = who === "player" ? "cpu" : "player";
  return s;
}

export function pass(state: GameState, who: "player" | "cpu"): GameState {
  const s = structuredCloneState(state);
  s.passes += 1;
  s.log.unshift(`${who === "player" ? "You" : "CPU"} passed.`);
  if (s.passes >= 2) {
    // blocked game — lower pip count wins
    const p = pipCount(s.playerHand);
    const c = pipCount(s.cpuHand);
    s.winner = p < c ? "player" : c < p ? "cpu" : "tie";
    s.log.unshift(
      s.winner === "tie"
        ? "Blocked — it's a tie!"
        : `Blocked! ${s.winner === "player" ? "You" : "CPU"} win on count (${Math.min(
            p,
            c
          )} vs ${Math.max(p, c)}).`
    );
  } else {
    s.turn = who === "player" ? "cpu" : "player";
  }
  return s;
}

// CPU picks a move: prefer doubles and high-pip tiles to shed weight.
export function cpuMove(state: GameState): GameState {
  const opts = legalPlays(state.cpuHand, state);
  if (opts.length === 0) return pass(state, "cpu");

  let best = opts[0];
  let bestScore = -1;
  for (const o of opts) {
    const [a, b] = state.cpuHand[o.index];
    const score = a + b + (a === b ? 3 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = o;
    }
  }
  return playTile(state, "cpu", best.index, best.side);
}

function structuredCloneState(s: GameState): GameState {
  return {
    playerHand: s.playerHand.map((t) => [...t] as Tile),
    cpuHand: s.cpuHand.map((t) => [...t] as Tile),
    line: s.line.map((p) => ({ tile: [...p.tile] as Tile })),
    leftEnd: s.leftEnd,
    rightEnd: s.rightEnd,
    turn: s.turn,
    passes: s.passes,
    winner: s.winner,
    log: [...s.log],
  };
}
