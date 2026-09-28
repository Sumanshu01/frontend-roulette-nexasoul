"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ProblemVault from "@/components/ProblemVault";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Skull, Compass } from "lucide-react";

export default function ProblemsPage() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", paddingTop: "5rem" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "1rem 1.5rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#fbbf24",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            background: "rgba(13, 21, 39, 0.7)",
            padding: "0.4rem 0.9rem",
            borderRadius: "6px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <ArrowLeft size={16} />
          Back to Main Deck (Home)
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#94a3b8",
            fontSize: "0.85rem",
          }}
        >
          <Skull size={15} color="#ef4444" />
          <span>Frontend Roulette • Gol D. Roger Edition</span>
        </div>
      </div>

      {/* The 10 Official Problem Statements */}
      <ProblemVault />

      <Footer />
    </main>
  );
}
