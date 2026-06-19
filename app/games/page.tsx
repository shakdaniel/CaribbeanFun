import Link from "next/link";

const games = [
  {
    href: "/games/dominoes",
    title: "Dominoes",
    icon: "🁢",
    blurb: "The Caribbean classic. Slam the table and play against the CPU.",
    grad: "from-sea-500 to-palm-500",
  },
  {
    href: "/games/ludo",
    title: "Ludo",
    icon: "🎲",
    blurb: "Roll, race, and send your friends back home. Up to 4 players.",
    grad: "from-sunset-500 to-mango-400",
  },
  {
    href: "/games/checkers",
    title: "Checkers",
    icon: "🔴",
    blurb: "Draughts the island way. Crown your kings and clear the board.",
    grad: "from-palm-500 to-sea-500",
  },
  {
    href: "/games/trivia",
    title: "Caribbean Trivia",
    icon: "❓",
    blurb: "Test your knowledge of island music, food, and culture.",
    grad: "from-mango-400 to-sunset-500",
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Games 🎲</h1>
        <p className="text-slate-500">
          Pull up a chair — popular Caribbean games, ready to play.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="card p-5 hover:shadow-md transition group"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.grad} flex items-center justify-center text-3xl shadow group-hover:scale-105 transition`}
            >
              {g.icon}
            </div>
            <h2 className="mt-3 text-lg font-bold">{g.title}</h2>
            <p className="text-sm text-slate-500">{g.blurb}</p>
            <span className="mt-2 inline-block text-sea-600 font-semibold text-sm">
              Play now →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
