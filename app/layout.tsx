import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Lime — Where the islands connect",
  description:
    "Caribbean social media and games. Lime with friends, reconnect with old ones, and play dominoes, ludo, checkers and trivia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 pt-6 pb-28 md:pb-12">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
