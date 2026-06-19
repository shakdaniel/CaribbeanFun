import Link from "next/link";

export default function GameHeader({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <h1 className="text-2xl font-extrabold">
        {icon} {title}
      </h1>
      <div className="flex items-center gap-2">
        {children}
        <Link href="/games" className="btn-ghost text-sm">
          ← All games
        </Link>
      </div>
    </div>
  );
}
