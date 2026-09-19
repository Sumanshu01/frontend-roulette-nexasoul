"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EVENT_DATA } from "@/data/eventInfo";
import { soundFX } from "@/utils/soundEffects";
import {
  Compass,
  MapPin,
  Clock,
  Users,
  Target,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Anchor,
  Flame,
} from "lucide-react";

export default function EventOverview() {
  const [activeTab, setActiveTab] = useState<"concept" | "schedule" | "objectives" | "venue">("concept");

  return (
    <section
      id="overview"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#fbbf24",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          <Anchor size={16} />
          LOGUETOWN EXPEDITION MANIFESTO
        </div>
        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            color: "#fef08a",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            letterSpacing: "1px",
          }}
        >
          THE GRAND LINE LOGBOOK
        </h2>
        <p
          style={{
            color: "#94a3b8",
            maxWidth: "650px",
            margin: "0.5rem auto 0",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          Everything you need to know about the rules of engagement, venue coordinates, schedule, and team dynamics for NEXASOUL Frontend Roulette.
        </p>
      </div>

      {/* Interactive Navigation Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.8rem",
          marginBottom: "3rem",
        }}
      >
        {[
          { key: "concept", label: "Event Concept", icon: Flame },
          { key: "schedule", label: "Voyage Schedule", icon: Clock },
          { key: "objectives", label: "Primary Objectives", icon: Target },
          { key: "venue", label: "Grand Arena: B4 UCRD", icon: MapPin },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key as typeof activeTab);
                soundFX.playWheelTick(1.3);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "6px",
                border: isActive ? "2px solid #fbbf24" : "1px solid rgba(245, 158, 11, 0.25)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(185, 28, 28, 0.6) 0%, rgba(120, 53, 15, 0.8) 100%)"
                  : "rgba(13, 21, 39, 0.7)",
                color: isActive ? "#fef08a" : "#cbd5e1",
                fontFamily: "var(--font-heading)",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: isActive ? "0 0 20px rgba(245, 158, 11, 0.3)" : "none",
              }}
            >
              <Icon size={18} color={isActive ? "#fbbf24" : "#94a3b8"} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Event Concept */}
      {activeTab === "concept" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="tab-grid"
        >
          <div className="parchment-card" style={{ padding: "2.2rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
                borderBottom: "2px solid var(--parchment-border)",
                paddingBottom: "0.6rem",
              }}
            >
              <Compass size={26} color="#78350f" />
              <h3
                className="font-pirate"
                style={{ fontSize: "2.2rem", color: "#451a03", letterSpacing: "1px" }}
              >
                THE ROULETTE MECHANISM
              </h3>
            </div>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#27150a",
                marginBottom: "1.4rem",
              }}
            >
              {EVENT_DATA.concept}
            </p>

            <div
              style={{
                background: "rgba(120, 53, 15, 0.08)",
                borderLeft: "4px solid #b45309",
                padding: "1rem 1.2rem",
                borderRadius: "2px",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                className="font-heading"
                style={{ fontSize: "0.95rem", color: "#78350f", marginBottom: "0.3rem" }}
              >
                WHY THE DUAL ROULETTE?
              </h4>
              <p style={{ fontSize: "0.92rem", color: "#451a03", lineHeight: "1.5" }}>
                Unlike traditional hackathons where teams bring pre-baked concepts, Frontend Roulette tests true pirate spontaneity! You receive a <strong>Random Problem Statement</strong> + a <strong>Random Grand Line Constraint</strong> (e.g., Must Support Dark Mode or Must Feature Real-Time Visualisation).
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--parchment-border)",
                  padding: "0.85rem",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 700 }}>
                  EVENT DURATION
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1e1008" }}>
                  {EVENT_DATA.duration}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--parchment-border)",
                  padding: "0.85rem",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 700 }}>
                  FINAL DELIVERABLE
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#991b1b" }}>
                  Frontend Prototype + Pitch
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--parchment-border)",
                  padding: "0.85rem",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 700 }}>
                  EVALUATION MODEL
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1e1008" }}>
                  Jury-based 100-Point Scoring
                </div>
              </div>
            </div>
          </div>

          {/* Side Art / Poster */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                height: "520px",
                margin: "0 auto",
                borderRadius: "10px",
                overflow: "hidden",
                border: "4px solid #b45309",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              }}
            >
              <Image
                src="/images/calling_all_pirates.jpg"
                alt="Calling All Pirates Straw Hat Crew"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Voyage Schedule */}
      {activeTab === "schedule" && (
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              position: "relative",
            }}
          >
            {EVENT_DATA.schedule.map((item, idx) => (
              <div
                key={idx}
                className="pirate-panel"
                style={{
                  padding: "1.4rem 1.6rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.2rem",
                  borderLeft: "5px solid #fbbf24",
                }}
              >
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid #fbbf24",
                    borderRadius: "6px",
                    padding: "0.5rem 0.8rem",
                    textAlign: "center",
                    minWidth: "95px",
                  }}
                >
                  <Clock size={16} color="#fbbf24" style={{ margin: "0 auto 0.2rem" }} />
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fef08a" }}>
                    {item.time}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "0.3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h4
                      className="font-heading"
                      style={{ fontSize: "1.15rem", color: "#f8fafc", fontWeight: 700 }}
                    >
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          background: item.badge.includes("Main")
                            ? "#ef4444"
                            : item.badge.includes("Mini-Game")
                            ? "#d97706"
                            : "rgba(14, 165, 233, 0.3)",
                          color: "#fff",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: "1.6" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Objectives & Skills */}
      {activeTab === "objectives" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {EVENT_DATA.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="pirate-panel"
                style={{
                  padding: "1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "rgba(185, 28, 28, 0.25)",
                    border: "1px solid #f87171",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Target size={26} color="#fbbf24" />
                </div>
                <h4
                  className="font-heading"
                  style={{ fontSize: "1.2rem", color: "#fef08a", fontWeight: 700 }}
                >
                  {obj.title}
                </h4>
                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  {obj.description}
                </p>
              </div>
            ))}
          </div>

          {/* Skills Developed Banner */}
          <div
            className="parchment-card"
            style={{
              padding: "1.8rem 2.2rem",
              textAlign: "center",
            }}
          >
            <h4
              className="font-pirate"
              style={{ fontSize: "2rem", color: "#78350f", marginBottom: "1rem" }}
            >
              KEY SKILLS SHARPENED ON THE VOYAGE
            </h4>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.8rem",
              }}
            >
              {EVENT_DATA.skillsDeveloped.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "2px solid #bca476",
                    borderRadius: "999px",
                    padding: "0.5rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "#2c1810",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <CheckCircle2 size={16} color="#15803d" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Venue Spotlight B4 UCRD */}
      {activeTab === "venue" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="tab-grid"
        >
          <div className="pirate-panel" style={{ padding: "2.5rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#38bdf8",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "0.8rem",
              }}
            >
              <MapPin size={16} />
              NAUTICAL HARBOR COORDINATES
            </div>

            <h3
              className="font-pirate"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                color: "#fef08a",
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}
            >
              VENUE: D4 / D7 OPEN AREA
            </h3>

            <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              The entire hackathon arena is anchored at the iconic <strong>B4 UCRD</strong>. Equipped with high-speed wireless Den Den Mushi connections, team battle stations, mentor checkpoints, and presentation screens.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.8rem",
              }}
            >
              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  padding: "1rem",
                  borderRadius: "6px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>TEAM SIZE</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc" }}>
                  Min 3 — Max 4 Members
                </div>
              </div>

              <div
                style={{
                  background: "rgba(17, 30, 56, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  padding: "1rem",
                  borderRadius: "6px",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>START TIME</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f87171" }}>
                  10:00 AM Sharp
                </div>
              </div>
            </div>

            <a
              href="#register"
              className="btn-pirate-gold"
              onClick={() => soundFX.playCannon()}
            >
              Claim Harbor Spot (Register)
            </a>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "480px",
                height: "360px",
                margin: "0 auto",
                borderRadius: "10px",
                overflow: "hidden",
                border: "4px solid #b45309",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              }}
            >
              <Image
                src="/images/pirate_wheel_map.jpg"
                alt="Grand Line Navigation Chart"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  right: "12px",
                  background: "rgba(10, 15, 25, 0.85)",
                  backdropFilter: "blur(6px)",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #fbbf24",
                  color: "#fef08a",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                📍 B4 UCRD • ANCHOR POINT
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .tab-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </section>
  );
}
