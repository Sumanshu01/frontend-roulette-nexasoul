"use client";

import React, { useState, useMemo } from "react";
import { PROBLEM_STATEMENTS, ProblemStatement } from "@/data/problems";
import { soundFX } from "@/utils/soundEffects";
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Shield,
  Eye,
  BookOpen,
} from "lucide-react";

export default function ProblemVault() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeModalProblem, setActiveModalProblem] = useState<ProblemStatement | null>(null);

  // Extract all unique domains
  const domains = useMemo(() => {
    const list = Array.from(new Set(PROBLEM_STATEMENTS.map((p) => p.domain)));
    return ["All", ...list.sort()];
  }, []);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return PROBLEM_STATEMENTS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDomain = selectedDomain === "All" || p.domain === selectedDomain;
      const matchDifficulty =
        selectedDifficulty === "All" || p.difficulty.startsWith(selectedDifficulty);

      return matchSearch && matchDomain && matchDifficulty;
    });
  }, [searchQuery, selectedDomain, selectedDifficulty]);

  return (
    <section
      id="problems"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1320px",
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
          <BookOpen size={16} />
          GRAND LINE ARCHIVES • 24+ PROBLEM STATEMENTS
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
          THE PROBLEM STATEMENT VAULT
        </h2>
        <p
          style={{
            color: "#cbd5e1",
            maxWidth: "700px",
            margin: "0.5rem auto 0",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          Explore the official repository of 24+ frontend challenges spanning Healthcare, FinTech, Cybersecurity, AI/ML, and more, divided into 3 difficulty levels.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div
        className="pirate-panel"
        style={{
          padding: "1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        {/* Top bar: Search + Difficulty Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: "relative",
              flex: "1 1 300px",
              maxWidth: "480px",
            }}
          >
            <Search
              size={18}
              color="#fbbf24"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search by ID, title, domain, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.6rem",
                background: "rgba(7, 11, 19, 0.85)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "6px",
                color: "#f8fafc",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {/* Difficulty Filter Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { label: "All Difficulties", val: "All" },
              { label: "Level 1: Freshers", val: "Level 1" },
              { label: "Level 2: Medium", val: "Level 2" },
              { label: "Level 3: Hard", val: "Level 3" },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => {
                  setSelectedDifficulty(d.val);
                  soundFX.playWheelTick(1.2);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border:
                    selectedDifficulty === d.val
                      ? "1px solid #fbbf24"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  background:
                    selectedDifficulty === d.val
                      ? "linear-gradient(180deg, #b45309 0%, #78350f 100%)"
                      : "rgba(17, 24, 39, 0.6)",
                  color: selectedDifficulty === d.val ? "#fef08a" : "#94a3b8",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                soundFX.playWheelTick(1.1);
              }}
              style={{
                padding: "0.35rem 0.8rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: selectedDomain === dom ? "1px solid #fbbf24" : "1px solid rgba(255, 255, 255, 0.1)",
                background: selectedDomain === dom ? "#fbbf24" : "rgba(30, 41, 59, 0.6)",
                color: selectedDomain === dom ? "#1e1008" : "#cbd5e1",
                transition: "all 0.15s ease",
              }}
            >
              {dom === "All" ? "All Domains (13)" : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "1.8rem",
        }}
      >
        {filteredProblems.map((prob) => {
          const isHard = prob.difficulty.includes("Hard");
          const isMedium = prob.difficulty.includes("Medium");

          return (
            <div
              key={prob.id}
              className="parchment-card"
              style={{
                padding: "1.6rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onClick={() => {
                setActiveModalProblem(prob);
                soundFX.playCoin();
              }}
            >
              <div>
                {/* Header: ID, Domain, Difficulty */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.8rem",
                    borderBottom: "1px dashed var(--parchment-border)",
                    paddingBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 900,
                      fontSize: "0.95rem",
                      color: "#991b1b",
                    }}
                  >
                    {prob.id}
                  </span>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <span
                      style={{
                        background: "rgba(120, 53, 15, 0.15)",
                        border: "1px solid #78350f",
                        color: "#78350f",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "3px",
                      }}
                    >
                      {prob.domain}
                    </span>
                    <span
                      style={{
                        background: isHard ? "#7f1d1d" : isMedium ? "#0369a1" : "#15803d",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "3px",
                      }}
                    >
                      {prob.difficulty.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-pirate"
                  style={{
                    fontSize: "1.65rem",
                    color: "#27150a",
                    lineHeight: 1.15,
                    marginBottom: "0.8rem",
                  }}
                >
                  {prob.title}
                </h3>

                {/* Problem snippet */}
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#451a03",
                    lineHeight: 1.5,
                    marginBottom: "1.2rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {prob.problem}
                </p>
              </div>

              {/* Card Footer: Bounty + View Details Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px dashed var(--parchment-border)",
                  paddingTop: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#78350f", textTransform: "uppercase" }}>
                    Bounty Allocation
                  </div>
                  <div
                    className="font-heading"
                    style={{ fontSize: "1.05rem", fontWeight: 900, color: "#991b1b" }}
                  >
                    {prob.bounty}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#78350f",
                  }}
                >
                  <Eye size={16} />
                  Inspect Card
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "#94a3b8",
          }}
        >
          No problem statements match your search query. Try resetting filters!
        </div>
      )}

      {/* Detailed Problem Modal */}
      {activeModalProblem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setActiveModalProblem(null)}
        >
          <div
            className="parchment-card"
            style={{
              maxWidth: "750px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.2rem",
              border: "4px solid #b45309",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "2px solid var(--parchment-border)",
                paddingBottom: "1rem",
                marginBottom: "1.2rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#991b1b" }}>
                  OFFICIAL HACKATHON CARD • {activeModalProblem.id}
                </div>
                <h3
                  className="font-pirate"
                  style={{ fontSize: "2.2rem", color: "#2d1810", lineHeight: 1.1 }}
                >
                  {activeModalProblem.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalProblem(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  color: "#78350f",
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.4rem", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#78350f",
                  color: "#fef08a",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                }}
              >
                Domain: {activeModalProblem.domain}
              </span>
              <span
                style={{
                  background: "#b91c1c",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                }}
              >
                Difficulty: {activeModalProblem.difficulty}
              </span>
              <span
                style={{
                  background: "#0369a1",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                }}
              >
                Bounty: {activeModalProblem.bounty}
              </span>
            </div>

            {/* Problem Statement */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                className="font-heading"
                style={{ fontSize: "0.95rem", color: "#78350f", marginBottom: "0.4rem" }}
              >
                PROBLEM SPECIFICATION:
              </h4>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "#27150a" }}>
                {activeModalProblem.problem}
              </p>
            </div>

            {/* Core Requirements */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--parchment-border)",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h5
                className="font-heading"
                style={{
                  fontSize: "0.9rem",
                  color: "#991b1b",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <CheckCircle2 size={16} color="#991b1b" />
                CORE REQUIREMENTS:
              </h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {activeModalProblem.requirements.map((req, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.92rem",
                      color: "#2c1810",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#b45309", fontWeight: 700 }}>•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bonus Points */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--parchment-border)",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5
                className="font-heading"
                style={{
                  fontSize: "0.9rem",
                  color: "#15803d",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Sparkles size={16} color="#15803d" />
                BONUS POINTS (OPTIONAL ACCELERATORS):
              </h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {activeModalProblem.bonus.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.92rem",
                      color: "#2c1810",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#15803d", fontWeight: 700 }}>★</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Close / Action */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setActiveModalProblem(null)}
                className="btn-pirate-crimson"
                style={{ fontSize: "0.85rem", padding: "0.6rem 1.4rem" }}
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
