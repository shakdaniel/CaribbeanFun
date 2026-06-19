// Renders a single domino half's pips, and a full tile.

const PIP_LAYOUTS: Record<number, [number, number][]> = {
  0: [],
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

function Half({ value, size }: { value: number; size: number }) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`${value}`}
    >
      {PIP_LAYOUTS[value].map(([row, col], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-slate-800"
          style={{
            width: size * 0.16,
            height: size * 0.16,
            top: `${[15, 42, 69][row]}%`,
            left: `${[15, 42, 69][col]}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function DominoTile({
  tile,
  size = 40,
  vertical = false,
  highlight = false,
  onClick,
  faded = false,
}: {
  tile: [number, number];
  size?: number;
  vertical?: boolean;
  highlight?: boolean;
  onClick?: () => void;
  faded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-white rounded-md shadow border-2 flex items-center justify-center transition ${
        vertical ? "flex-col" : "flex-row"
      } ${highlight ? "border-sea-400 ring-2 ring-sea-200" : "border-slate-200"} ${
        onClick ? "cursor-pointer hover:-translate-y-1" : "cursor-default"
      } ${faded ? "opacity-40" : ""}`}
      style={{ padding: size * 0.12 }}
    >
      <Half value={tile[0]} size={size} />
      <div
        className={vertical ? "w-3/4 border-t border-slate-300 my-1" : "h-3/4 border-l border-slate-300 mx-1"}
      />
      <Half value={tile[1]} size={size} />
    </button>
  );
}
