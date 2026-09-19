import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-roulette-nexasoul.vercel.app"),
  title: "FRONTEND ROULETTE — NEXASOUL | Gol D. Roger One Piece Edition",
  description: "Team-based frontend hackathon & ideathon. Spin the Grand Line Roulette wheel of destiny for random problem statements and twists. Assemble your pirate crew and claim the ultimate bounty!",
  keywords: ["Frontend Roulette", "NexaSoul", "Hackathon", "One Piece", "Gol D. Roger", "Frontend Development", "Ideathon", "Web Development"],
  openGraph: {
    title: "FRONTEND ROULETTE — NEXASOUL | Gol D. Roger One Piece Edition",
    description: "Spin the digital roulette wheel of destiny. 25+ problem statements, random twist conditions, live re-roll mini-game, and crew registration.",
    images: ["/images/gol_d_roger_hero.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#7f1d1d" />
      </head>
      <body>{children}</body>
    </html>
  );
}
