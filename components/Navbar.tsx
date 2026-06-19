"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import Avatar from "./Avatar";

const links = [
  { href: "/", label: "Feed", icon: "🏠" },
  { href: "/friends", label: "Friends", icon: "🤝" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/games", label: "Games", icon: "🎲" },
  { href: "/profile", label: "Profile", icon: "🪪" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useStore();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍋</span>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-sea-600">Lime</span>
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium ml-1">
              where the islands connect
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition ${
                  isActive(l.href)
                    ? "bg-sea-50 text-sea-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="mr-1">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href="/profile" className="md:ml-2">
            <Avatar user={currentUser} size={38} />
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-100">
        <div className="flex justify-around items-center h-16">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center justify-center text-[11px] font-semibold w-full h-full ${
                isActive(l.href) ? "text-sea-600" : "text-slate-500"
              }`}
            >
              <span className="text-xl leading-none">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
