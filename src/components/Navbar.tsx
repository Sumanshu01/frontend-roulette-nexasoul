"use client";

import React, { useState, useEffect } from "react";
import { soundFX } from "@/utils/soundEffects";
import { Volume2, VolumeX, Compass, Anchor, Menu, X, Skull } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbianceOn, setIsAmbianceOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFX.playCoin();
    }
  };

  const handleAmbianceToggle = () => {
    const active = soundFX.toggleAmbiance();
    setIsAmbianceOn(active);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        backgroundColor: isScrolled ? "rgba(7, 11, 19, 0.95)" : "rgba(7, 11, 19, 0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: isScrolled
          ? "2px solid rgba(245, 158, 11, 0.4)"
          : "1px solid rgba(245, 158, 11, 0.15)",
        boxShadow: isScrolled ? "0 8px 30px rgba(0, 0, 0, 0.8)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0.8rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
          onClick={() => soundFX.playCoin()}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
              border: "2px solid #fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(245, 158, 11, 0.5)",
            }}
          >
            <Skull size={24} color="#fef08a" />
          </div>
          <div>
            <div
              className="font-pirate"
              style={{
                fontSize: "1.45rem",
                letterSpacing: "1px",
                color: "#fef08a",
                lineHeight: 1.1,
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              FRONTEND ROULETTE
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "2px",
                color: "#cbd5e1",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>NEXASOUL</span>
              <span>•</span>
              <span style={{ color: "#f87171" }}>GOL D. ROGER EDITION</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.8rem",
          }}
          className="desktop-nav"
        >
          <a
            href="/#overview"
            className="nav-link"
            style={{
              color: "#e2e8f0",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onClick={() => soundFX.playWheelTick(1.2)}
          >
            Overview
          </a>
          <a
            href="/#jury"
            className="nav-link"
            style={{
              color: "#e2e8f0",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onClick={() => soundFX.playWheelTick(1.1)}
          >
            Fleet & Jury
          </a>
          <a
            href="/#register"
            className="nav-link"
            style={{
              color: "#fbbf24",
              fontSize: "0.9rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onClick={() => soundFX.playCannon()}
          >
            Register
          </a>
          <a
            href="/admin"
            className="nav-link"
            style={{
              color: "#f87171",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              background: "rgba(185, 28, 28, 0.2)",
              border: "1px solid rgba(248, 113, 113, 0.4)",
              transition: "all 0.2s",
            }}
          >
            Admin Portal
          </a>
        </nav>

        {/* Action Controls: Sound Toggle & CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {/* Ocean Waves Ambiance Button */}
          <button
            onClick={handleAmbianceToggle}
            title={isAmbianceOn ? "Mute Ocean Ambiance" : "Play Grand Line Ocean Waves"}
            style={{
              background: isAmbianceOn ? "rgba(14, 165, 233, 0.25)" : "rgba(30, 41, 59, 0.6)",
              border: isAmbianceOn ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.15)",
              color: isAmbianceOn ? "#38bdf8" : "#94a3b8",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s",
            }}
          >
            <Anchor size={14} />
            <span style={{ display: "none" }} className="label-desktop">
              {isAmbianceOn ? "Sea: ON" : "Sea Ambiance"}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isMuted ? "Unmute Pirate Sound FX" : "Mute Sound FX"}
            style={{
              background: isMuted ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
              border: isMuted ? "1px solid #f87171" : "1px solid #fbbf24",
              color: isMuted ? "#f87171" : "#fef08a",
              padding: "0.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Register CTA */}
          <a
            href="#register"
            className="btn-pirate-gold"
            style={{
              padding: "0.55rem 1.1rem",
              fontSize: "0.82rem",
              textDecoration: "none",
            }}
            onClick={() => soundFX.playCannon()}
          >
            Join Fleet
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fef08a",
              cursor: "pointer",
              display: "block",
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "rgba(13, 21, 39, 0.98)",
            borderTop: "1px solid rgba(245, 158, 11, 0.3)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <a
            href="/#overview"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playWheelTick(1.2);
            }}
            style={{ color: "#e2e8f0", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}
          >
            📜 Event Overview
          </a>
          <a
            href="/#jury"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playWheelTick(1.1);
            }}
            style={{ color: "#e2e8f0", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}
          >
            🛡️ Fleet Admirals & Jury
          </a>
          <a
            href="/#register"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playCannon();
            }}
            className="btn-pirate-crimson"
            style={{ textAlign: "center", marginTop: "0.5rem" }}
          >
            ☠️ Register Pirate Crew
          </a>
          <a
            href="/admin"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playCoin();
            }}
            className="btn-pirate-secondary"
            style={{ textAlign: "center", marginTop: "0.3rem", color: "#f87171" }}
          >
            👑 Admin Portal
          </a>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .label-desktop {
            display: inline !important;
          }
        }
        .nav-link:hover {
          color: #fbbf24 !important;
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </header>
  );
}
