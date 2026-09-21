"use client";

import React, { useState } from "react";
import { EVENT_DATA } from "@/data/eventInfo";
import {
  Trophy,
  Medal,
  Shield,
  UserCheck,
  Compass,
} from "lucide-react";

export default function PrizesAndFleet() {
  const [activeSection, setActiveSection] = useState<"prizes" | "fleet">("prizes");

  return (
    <section
      id="prizes"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#fbbf24",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          <Trophy size={16} />
          GRAND LINE HALL OF FAME • PDF PAGES 9, 10 & 12
        </div>
        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
            color: "#fef08a",
            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
            letterSpacing: "1px",
          }}
        >
          BOUNTIES, FLEET & JURY
        </h2>
        <p
          style={{
            color: "#cbd5e1",
            maxWidth: "680px",
            margin: "0.5rem auto 0",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          Inspect the grand trophies, medals, High Admirals of the jury, and the senior mentors.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.8rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { id: "prizes", label: "Prizes & Bounties", icon: Trophy },
          { id: "fleet", label: "Admirals & Mentors", icon: Shield },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "6px",
                border: isActive ? "2px solid #fbbf24" : "1px solid rgba(245, 158, 11, 0.25)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(185, 28, 28, 0.7) 0%, rgba(120, 53, 15, 0.8) 100%)"
                  : "rgba(13, 21, 39, 0.7)",
                color: isActive ? "#fef08a" : "#cbd5e1",
                fontFamily: "var(--font-heading)",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={18} color={isActive ? "#fbbf24" : "#94a3b8"} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Section 1: Prizes & Bounties */}
      {activeSection === "prizes" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {EVENT_DATA.prizes.map((prize, idx) => {
            const isGrand = prize.id === "best-overall";
            return (
              <div
                key={prize.id}
                className="parchment-card"
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: isGrand ? "4px solid #b45309" : "2px solid var(--parchment-border)",
                  boxShadow: isGrand
                    ? "0 15px 40px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(245, 158, 11, 0.2)"
                    : "0 10px 30px rgba(0,0,0,0.6)",
                  transform: isGrand ? "scale(1.02)" : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: isGrand ? "#b91c1c" : "#78350f",
                      border: "2px solid #fbbf24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                    }}
                  >
                    {isGrand ? (
                      <Trophy size={32} color="#fef08a" />
                    ) : (
                      <Medal size={30} color="#fef08a" />
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: isGrand ? "#991b1b" : "#78350f",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {prize.reward}
                  </div>

                  <h3
                    className="font-pirate"
                    style={{
                      fontSize: "1.85rem",
                      color: "#27150a",
                      lineHeight: 1.15,
                      marginBottom: "0.8rem",
                    }}
                  >
                    {prize.title}
                  </h3>

                  <p style={{ fontSize: "0.92rem", color: "#451a03", lineHeight: "1.6" }}>
                    {prize.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    borderTop: "1px dashed var(--parchment-border)",
                    paddingTop: "0.8rem",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#78350f", textTransform: "uppercase" }}>
                    Grand Line Pirate Bounty
                  </div>
                  <div
                    className="font-heading"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 900,
                      color: isGrand ? "#991b1b" : "#b45309",
                    }}
                  >
                    {prize.bounty}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section 2: Fleet (Judges, Mentors, Core Team) */}
      {activeSection === "fleet" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* High Admirals (Judges) */}
          <div>
            <h3
              className="font-pirate"
              style={{
                fontSize: "2.2rem",
                color: "#fef08a",
                marginBottom: "1.2rem",
                textAlign: "center",
              }}
            >
              HIGH ADMIRALS OF THE JURY (PDF PAGE 10)
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.2rem",
              }}
            >
              {EVENT_DATA.judges.map((judge, idx) => (
                <div
                  key={idx}
                  className="pirate-panel"
                  style={{
                    padding: "1.4rem",
                    textAlign: "center",
                    borderTop: "3px solid #fbbf24",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "rgba(185, 28, 28, 0.3)",
                      border: "2px solid #fbbf24",
                      margin: "0 auto 0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserCheck size={28} color="#fef08a" />
                  </div>
                  <h4
                    className="font-heading"
                    style={{ fontSize: "1.05rem", color: "#f8fafc", fontWeight: 700 }}
                  >
                    {judge.name}
                  </h4>
                  <div style={{ fontSize: "0.78rem", color: "#fbbf24", margin: "0.2rem 0" }}>
                    {judge.role}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      background: judge.badgeColor,
                      color: "#fff",
                      marginTop: "0.4rem",
                    }}
                  >
                    {judge.round}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Senior Mentors */}
          <div>
            <h3
              className="font-pirate"
              style={{
                fontSize: "2rem",
                color: "#f87171",
                marginBottom: "1.2rem",
                textAlign: "center",
              }}
            >
              GRAND LINE SENIOR MENTORS
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {EVENT_DATA.mentors.map((mentor, idx) => (
                <div
                  key={idx}
                  className="pirate-panel"
                  style={{
                    padding: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "6px",
                      background: "rgba(14, 165, 233, 0.2)",
                      border: "1px solid #38bdf8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Compass size={22} color="#38bdf8" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                      {mentor.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{mentor.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
