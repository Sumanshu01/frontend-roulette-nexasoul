"use client";

import React, { useState } from "react";
import { EVENT_DATA } from "@/data/eventInfo";
import {
  Shield,
  UserCheck,
  Compass,
  CheckCircle,
  Award,
} from "lucide-react";

export default function PrizesAndFleet() {
  const [activeTab, setActiveTab] = useState<"jury" | "mentors" | "scoring">("jury");

  return (
    <section
      id="jury"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {/* Anchor target for #prizes backwards compatibility */}
      <span id="prizes" style={{ position: "absolute", top: "-80px" }} />

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
          <Shield size={16} />
          GRAND LINE HIGH COMMAND & JURY
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
          FLEET ADMIRALS & JURY
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
          Meet the High Admirals presiding over the Grand Line evaluations, senior engineering mentors, and the 100-Point Jury evaluation matrix.
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
          { id: "jury", label: "High Admirals (Jury)", icon: Shield },
          { id: "mentors", label: "Senior Mentors", icon: Compass },
          { id: "scoring", label: "100-Pt Scoring Matrix", icon: Award },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
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

      {/* Tab 1: High Admirals (Judges) */}
      {activeTab === "jury" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {EVENT_DATA.judges.map((judge, idx) => (
              <div
                key={idx}
                className="pirate-panel"
                style={{
                  padding: "1.8rem 1.4rem",
                  textAlign: "center",
                  borderTop: "4px solid #fbbf24",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(185, 28, 28, 0.35)",
                    border: "2px solid #fbbf24",
                    margin: "0 auto 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <UserCheck size={32} color="#fef08a" />
                </div>
                <h4
                  className="font-heading"
                  style={{ fontSize: "1.15rem", color: "#f8fafc", fontWeight: 700 }}
                >
                  {judge.name}
                </h4>
                <div style={{ fontSize: "0.85rem", color: "#fbbf24", margin: "0.3rem 0 0.8rem" }}>
                  {judge.role}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "0.25rem 0.8rem",
                    borderRadius: "999px",
                    background: judge.badgeColor,
                    color: "#fff",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {judge.round}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Senior Mentors */}
      {activeTab === "mentors" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {EVENT_DATA.mentors.map((mentor, idx) => (
              <div
                key={idx}
                className="pirate-panel"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  borderLeft: "4px solid #38bdf8",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "rgba(14, 165, 233, 0.2)",
                    border: "1px solid #38bdf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Compass size={24} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                    {mentor.name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                    {mentor.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 100-Point Scoring Matrix */}
      {activeTab === "scoring" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {EVENT_DATA.evaluationCriteria.map((criterion, idx) => (
            <div
              key={idx}
              className="parchment-card"
              style={{
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{ fontSize: "1.05rem", color: "#27150a", fontWeight: 800 }}
                  >
                    {criterion.category}
                  </h4>
                  <span
                    style={{
                      background: "#b91c1c",
                      color: "#fef08a",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                    }}
                  >
                    {criterion.marks} PTS
                  </span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#5a371c", lineHeight: 1.5 }}>
                  {criterion.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px dashed var(--parchment-border)",
                  fontSize: "0.75rem",
                  color: "#78350f",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <CheckCircle size={14} color="#15803d" /> Verified by Official Fleet Jury
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
