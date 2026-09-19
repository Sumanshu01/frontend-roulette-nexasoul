"use client";

import React from "react";
import Image from "next/image";
import { soundFX } from "@/utils/soundEffects";
import { EVENT_DATA } from "@/data/eventInfo";
import { Compass, Sparkles, MapPin, Calendar, Clock, Users, Trophy } from "lucide-react";

export default function HeroGolDRoger() {


  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "6.5rem",
        paddingBottom: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Graphic with Vignette & Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.28,
          backgroundImage: "url('/images/gol_d_roger_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(7, 11, 19, 0.7) 0%, rgba(7, 11, 19, 0.4) 40%, rgba(7, 11, 19, 0.95) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left Column: Roger Announcement & Hero Headlines */}
          <div>
            {/* Roger Announcement Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                backgroundColor: "rgba(185, 28, 28, 0.35)",
                border: "1px solid #f87171",
                borderRadius: "999px",
                padding: "0.4rem 1rem",
                marginBottom: "1.2rem",
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  boxShadow: "0 0 8px #ef4444",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fecaca",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                GOL D. ROGER × NEXASOUL PRESENT
              </span>
            </div>

            {/* Main Title with One Piece Typography */}
            <h1
              className="font-pirate"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
                lineHeight: "1.05",
                color: "#fef08a",
                textShadow: "0 4px 15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.4)",
                marginBottom: "0.5rem",
                letterSpacing: "1.5px",
              }}
            >
              FRONTEND ROULETTE
            </h1>

            <div
              className="font-heading"
              style={{
                fontSize: "clamp(1.1rem, 2.4vw, 1.8rem)",
                fontWeight: 900,
                color: "#f87171",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                textShadow: "0 2px 10px rgba(185, 28, 28, 0.6)",
              }}
            >
              NEXASOUL HACKATHON & IDEATHON
            </div>

            {/* Gol D. Roger Legendary Quote in Parchment Scroll */}
            <div
              style={{
                position: "relative",
                background: "rgba(30, 20, 15, 0.85)",
                border: "2px solid #b45309",
                borderLeft: "6px solid #fbbf24",
                borderRadius: "4px",
                padding: "1.2rem 1.4rem",
                marginBottom: "2rem",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "16px",
                  background: "#b91c1c",
                  color: "#fef08a",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.6rem",
                  borderRadius: "3px",
                  border: "1px solid #fbbf24",
                  letterSpacing: "1px",
                }}
              >
                GOL D. ROGER SPEAKS
              </div>
              <p
                className="font-scroll"
                style={{
                  fontSize: "1.05rem",
                  lineHeight: "1.6",
                  color: "#fef3c7",
                  fontStyle: "italic",
                }}
              >
                {EVENT_DATA.rogerQuote}
              </p>
            </div>

            {/* Event Key Spec Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.8rem",
                marginBottom: "2.2rem",
              }}
            >
              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <Calendar size={20} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Date</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                    {EVENT_DATA.date}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <Clock size={20} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Main Event Begins</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f87171" }}>
                    10:00 AM Sharp
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <MapPin size={20} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Venue</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#38bdf8" }}>
                    {EVENT_DATA.venue}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <Users size={20} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Crew Size</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                    3–4 Pirates
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <a
                href="#roulette"
                className="btn-pirate-gold"
                onClick={() => soundFX.playWheelTick(1.5)}
              >
                <Compass size={20} />
                Spin The Dual Roulette
              </a>

              <a
                href="#register"
                className="btn-pirate-crimson"
                onClick={() => soundFX.playCannon()}
              >
                <Trophy size={18} />
                Register Pirate Crew
              </a>

              <a
                href="#mini-game"
                className="btn-pirate-secondary"
                onClick={() => soundFX.playCoin()}
              >
                <Sparkles size={18} color="#fbbf24" />
                Re-Roll Mini-Game
              </a>
            </div>
          </div>

          {/* Right Column: Wanted Poster / Roger Visual & Live Countdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Wanted Poster Card Style Preview */}
            <div
              className="wanted-poster"
              style={{
                padding: "1.5rem",
                maxWidth: "420px",
                margin: "0 auto",
                transform: "rotate(1deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <div
                className="font-heading"
                style={{
                  fontSize: "2.4rem",
                  letterSpacing: "4px",
                  fontWeight: 900,
                  color: "#27150a",
                  lineHeight: 1,
                  borderBottom: "3px solid #784725",
                  paddingBottom: "0.4rem",
                  marginBottom: "0.8rem",
                }}
              >
                WANTED
              </div>

              {/* Poster Image Container */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "260px",
                  borderRadius: "2px",
                  overflow: "hidden",
                  border: "2px solid #5a371c",
                  marginBottom: "0.8rem",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/images/gol_d_roger_hero.jpg"
                  alt="Gol D. Roger King of the Pirates"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "6px",
                    right: "6px",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fef08a",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "2px",
                  }}
                >
                  GOL D. ROGER • KING OF THE PIRATES
                </div>
              </div>

              <div
                className="font-pirate"
                style={{
                  fontSize: "1.8rem",
                  color: "#831843",
                  lineHeight: 1.1,
                  letterSpacing: "1px",
                }}
              >
                DEAD OR ALIVE
              </div>

              <div
                className="font-heading"
                style={{
                  fontSize: "1.9rem",
                  fontWeight: 900,
                  color: "#1e1008",
                  letterSpacing: "2px",
                  margin: "0.4rem 0",
                }}
              >
                ฿ 1,500,000,000-
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#603813",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                MARINE REWARD • NEXASOUL GRAND BOUNTY
              </div>
            </div>

          </div>

        </div>
      </div>

      <style jsx>{`
        @media (min-width: 960px) {
          .hero-grid {
            grid-template-columns: 1.25fr 0.9fr !important;
          }
        }
      `}</style>
    </section>
  );
}
