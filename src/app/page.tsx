"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroGolDRoger from "@/components/HeroGolDRoger";
import EventOverview from "@/components/EventOverview";
import DualRoulette from "@/components/DualRoulette";
import ReRollMiniGame from "@/components/ReRollMiniGame";
import ProblemVault from "@/components/ProblemVault";
import RegistrationPortal from "@/components/RegistrationPortal";
import PrizesAndFleet from "@/components/PrizesAndFleet";
import Footer from "@/components/Footer";
import { Compass, Lock, Sparkles } from "lucide-react";

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = () => {
      try {
        const saved = localStorage.getItem("grand_line_registered_crew");
        setIsRegistered(!!saved);
      } catch {
        setIsRegistered(false);
      }
    };

    checkRegistration();

    // Listen for storage changes (e.g. after form submit)
    window.addEventListener("storage", checkRegistration);

    // Also poll for changes within the same tab (localStorage doesn't fire for same-tab changes)
    const interval = setInterval(checkRegistration, 500);

    return () => {
      window.removeEventListener("storage", checkRegistration);
      clearInterval(interval);
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Navigation Header */}
      <Navbar />

      {/* Gol D. Roger Hero Section */}
      <HeroGolDRoger />

      {/* Event Overview, Objectives, Schedule, Venue B4 UCRD */}
      <EventOverview />

      {/* Crew Registration & Live Wanted Poster Pass Generator */}
      <RegistrationPortal />

      {/* Dual Roulette Wheel Arena — only after registration */}
      {isRegistered ? (
        <>
          <DualRoulette />
          <ReRollMiniGame />
        </>
      ) : (
        <section
          id="roulette"
          style={{
            padding: "5rem 1.5rem",
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(13, 21, 39, 0.85)",
              backdropFilter: "blur(12px)",
              border: "2px dashed rgba(245, 158, 11, 0.4)",
              borderRadius: "12px",
              padding: "3.5rem 2rem",
              boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.12)",
                border: "2px solid rgba(245, 158, 11, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Lock size={36} color="#fbbf24" />
            </div>

            <h2
              className="font-pirate"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "#fef08a",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                marginBottom: "0.8rem",
                letterSpacing: "1px",
              }}
            >
              ROULETTE LOCKED
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 auto 2rem",
              }}
            >
              The Dual Roulette Wheel and Re-Roll Mini-Game are unlocked{" "}
              <strong style={{ color: "#fbbf24" }}>only after your Pirate Crew is officially enlisted.</strong>{" "}
              Register your crew above to gain access to the Grand Line Roulette Arena.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#register" className="btn-pirate-crimson">
                <Sparkles size={18} />
                Enlist Your Crew First
              </a>
              <a href="#register" className="btn-pirate-secondary">
                <Compass size={18} color="#fbbf24" />
                Go to Registration
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Problem Statements Archive */}
      <ProblemVault />

      {/* Bounties, Prizes, High Admirals of the Jury, Mentors, 100-Point Scoring Matrix */}
      <PrizesAndFleet />

      {/* Footer & Roger Manifesto */}
      <Footer />
    </main>
  );
}
