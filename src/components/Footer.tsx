"use client";

import React from "react";
import Image from "next/image";
import { soundFX } from "@/utils/soundEffects";
import { Skull, Compass, Anchor, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #090d16 0%, #05070c 100%)",
        borderTop: "3px solid #b45309",
        padding: "4rem 1.5rem 2rem",
        color: "#94a3b8",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "2rem",
        }}
      >
        {/* Jolly Roger Insignia */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
            border: "3px solid #fbbf24",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
            cursor: "pointer",
          }}
          onClick={() => soundFX.playCannon()}
          title="Click to fire celebratory pirate cannon!"
        >
          <Skull size={34} color="#fef08a" />
        </div>

        {/* Title */}
        <div>
          <h3
            className="font-pirate"
            style={{
              fontSize: "2.4rem",
              color: "#fef08a",
              letterSpacing: "1px",
              lineHeight: 1.1,
            }}
          >
            FRONTEND ROULETTE — NEXASOUL
          </h3>
          <div
            style={{
              fontSize: "0.85rem",
              letterSpacing: "3px",
              color: "#f87171",
              fontWeight: 800,
              textTransform: "uppercase",
              marginTop: "0.2rem",
            }}
          >
            ONE PIECE & GOL D. ROGER THEMATIC EDITION
          </div>
        </div>

        {/* Roger Famous Quote */}
        <div
          style={{
            maxWidth: "750px",
            background: "rgba(18, 25, 43, 0.7)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "6px",
            padding: "1.2rem 1.6rem",
          }}
        >
          <p
            className="font-scroll"
            style={{
              fontSize: "1.05rem",
              color: "#fef3c7",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            &quot;Destiny. The swelling tide of time. The dreams of humanity. These are things that cannot be stopped! As long as developers seek the answer to freedom, the spirit of code will never cease to be!&quot;
          </p>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#fbbf24",
              marginTop: "0.5rem",
              letterSpacing: "1px",
            }}
          >
            — GOL D. ROGER • KING OF THE PIRATES
          </div>
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          <a href="#hero" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            Voyage Start
          </a>
          <span>•</span>
          <a href="#overview" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            Manifesto & Venue B4 UCRD
          </a>
          <span>•</span>
          <a href="#roulette" style={{ color: "#fef08a", textDecoration: "none" }}>
            Dual Roulette Wheel
          </a>
          <span>•</span>
          <a href="#mini-game" style={{ color: "#f87171", textDecoration: "none" }}>
            Re-Roll Mini-Game
          </a>
          <span>•</span>
          <a href="#problems" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            Problem Vault
          </a>
          <span>•</span>
          <a href="#register" style={{ color: "#38bdf8", textDecoration: "none" }}>
            Register Crew
          </a>
        </div>

        {/* Bottom copyright & venue */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%",
            paddingTop: "1.5rem",
            fontSize: "0.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div>
            VENUE: <strong>B4 UCRD</strong> • DATE: <strong>AUGUST 2026</strong> • 9:30 AM – 4:25 PM
          </div>
          <div>
            CRAFTED FOR <strong>NEXASOUL FRONTEND ROULETTE</strong> WITH GOL D. ROGER SPIRIT
          </div>
        </div>
      </div>
    </footer>
  );
}
