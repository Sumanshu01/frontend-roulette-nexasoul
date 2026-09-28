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
  Copy,
  Check,
  Compass,
  Ship,
  Flame,
  FileText,
  Lightbulb,
  ExternalLink,
  Tag,
  Zap,
} from "lucide-react";
import { DEVIL_FRUIT_POWERS, HAKI_POWERS } from "@/data/mechanics";

export default function ProblemVault() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [activeModalProblem, setActiveModalProblem] = useState<ProblemStatement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<"statement" | "requirements" | "solution" | "theme" | "mechanics">("statement");

  // Extract all unique domains
  const domains = useMemo(() => {
    const list = Array.from(new Set(PROBLEM_STATEMENTS.map((p) => p.domain)));
    return ["All", ...list.sort()];
  }, []);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return PROBLEM_STATEMENTS.filter((p) => {
      // Number match
      if (selectedNumber !== null && p.number !== selectedNumber) {
        return false;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.statement.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        `problem ${p.number}`.includes(q) ||
        `problem #${p.number}`.includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.requirements.some((r) => r.toLowerCase().includes(q));

      const matchDomain = selectedDomain === "All" || p.domain === selectedDomain;

      return matchSearch && matchDomain;
    });
  }, [searchQuery, selectedNumber, selectedDomain]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playCoin();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFullMarkdown = (prob: ProblemStatement) => {
    return `### ${prob.code} (Problem ${prob.number}): ${prob.title}
**Unique ID:** ${prob.id}
**Domain:** ${prob.domain}

#### Problem Statement
${prob.statement}

#### Problem Description
${prob.description}

#### Requirements
${prob.requirements.map((r) => `- ${r}`).join("\n")}

#### Proposed Solution
${prob.proposedSolution}

#### Theme Integration Note
${prob.themeIntegration}

#### One Piece Theme Concept
- **Concept:** ${prob.onePieceFlavor.themeConcept}
- **Context:** ${prob.onePieceFlavor.suggestedPirateContext}
- **Lore Hook:** ${prob.onePieceFlavor.loreHook}
`;
  };

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
      {/* Decorative Background Anchor */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "-5%",
          width: "350px",
          height: "350px",
          opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #f59e0b 10%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

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
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            background: "rgba(245, 158, 11, 0.1)",
            padding: "0.4rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <BookOpen size={16} />
          GRAND LINE ARCHIVES • 10 OFFICIAL PROBLEM STATEMENTS
        </div>

        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
            color: "#fef08a",
            textShadow: "0 4px 18px rgba(0,0,0,0.9)",
            letterSpacing: "1.5px",
            lineHeight: 1.1,
            marginBottom: "0.8rem",
          }}
        >
          THE PROBLEM STATEMENT VAULT
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            maxWidth: "760px",
            margin: "0 auto",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          Explore the official 10 hackathon problem statements. Each challenge has been assigned a{" "}
          <strong style={{ color: "#fbbf24" }}>unique number (Problems #01 through #10 / PS-01 through PS-10)</strong>{" "}
          and must be integrated with the <strong style={{ color: "#f87171" }}>One Piece</strong> theme.
        </p>

        {/* Devil Fruit + Haki Mechanics Callout Banner */}
        <div
          style={{
            marginTop: "1.2rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
            background: "linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(2, 132, 199, 0.3) 100%)",
            border: "1px solid rgba(192, 132, 252, 0.4)",
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            fontSize: "0.9rem",
            color: "#e2e8f0",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#fef08a", fontWeight: 800 }}>
            <Zap size={16} color="#fbbf24" />
            <span>Problem Modifier Protocol:</span>
          </span>
          <span>Each crew also awakens a <strong>Devil Fruit or Haki Power</strong> via Dual Roulette!</span>
          <a
            href="#mechanics"
            style={{
              color: "#fbbf24",
              fontWeight: 800,
              textDecoration: "underline",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <span>Spin Dual Roulettes</span> →
          </a>
        </div>
      </div>

      {/* Quick Number Selector Bar */}
      <div
        style={{
          background: "rgba(13, 21, 39, 0.9)",
          border: "2px solid rgba(245, 158, 11, 0.35)",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Tag size={16} color="#fbbf24" />
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fef08a", letterSpacing: "1px" }}>
              SELECT BY UNIQUE PROBLEM NUMBER:
            </span>
          </div>

          {selectedNumber !== null && (
            <button
              onClick={() => {
                setSelectedNumber(null);
                soundFX.playWheelTick(1.0);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.8rem",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Clear Number Filter
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              setSelectedNumber(null);
              soundFX.playWheelTick(1.1);
            }}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              border: selectedNumber === null ? "1px solid #fbbf24" : "1px solid rgba(255, 255, 255, 0.12)",
              background: selectedNumber === null ? "linear-gradient(180deg, #b45309 0%, #78350f 100%)" : "rgba(30, 41, 59, 0.6)",
              color: selectedNumber === null ? "#fef08a" : "#cbd5e1",
              transition: "all 0.15s ease",
            }}
          >
            All 10 Problems
          </button>

          {PROBLEM_STATEMENTS.map((prob) => {
            const isSelected = selectedNumber === prob.number;
            return (
              <button
                key={prob.id}
                onClick={() => {
                  setSelectedNumber(isSelected ? null : prob.number);
                  soundFX.playWheelTick(1.2);
                }}
                title={prob.title}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  border: isSelected ? "2px solid #fbbf24" : "1px solid rgba(245, 158, 11, 0.25)",
                  background: isSelected
                    ? "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)"
                    : "rgba(17, 24, 39, 0.7)",
                  color: isSelected ? "#fef08a" : "#e2e8f0",
                  boxShadow: isSelected ? "0 0 12px rgba(245, 158, 11, 0.4)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    color: isSelected ? "#ffffff" : "#fbbf24",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                  }}
                >
                  {prob.code}
                </span>
                <span>P{prob.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Domain Filters */}
      <div
        className="pirate-panel"
        style={{
          padding: "1.4rem",
          marginBottom: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: "relative",
            width: "100%",
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
            placeholder="Search by ID (PS-01, #01), title, domain, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1rem 0.8rem 2.7rem",
              background: "rgba(7, 11, 19, 0.9)",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              borderRadius: "6px",
              color: "#f8fafc",
              fontSize: "0.92rem",
            }}
          />
        </div>

        {/* Domain Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "0.3rem",
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
              {dom === "All" ? `All Domains (${domains.length - 1})` : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          color: "#94a3b8",
          fontSize: "0.9rem",
        }}
      >
        <div>
          Showing <strong style={{ color: "#fbbf24" }}>{filteredProblems.length}</strong> of{" "}
          <strong style={{ color: "#f8fafc" }}>10</strong> Problem Statements
          {selectedNumber && ` (Filtered by Problem #${selectedNumber})`}
        </div>

        {(searchQuery || selectedNumber !== null || selectedDomain !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedNumber(null);
              setSelectedDomain("All");
              soundFX.playWheelTick(1.0);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#fbbf24",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Problem Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(370px, 1fr))",
          gap: "1.8rem",
        }}
      >
        {filteredProblems.map((prob) => {
          return (
            <div
              key={prob.id}
              className="parchment-card"
              style={{
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "transform 0.25s, box-shadow 0.25s",
                position: "relative",
                overflow: "hidden",
                border: "2px solid #bca476",
              }}
              onClick={() => {
                setActiveModalProblem(prob);
                setModalTab("statement");
                soundFX.playCoin();
              }}
            >
              {/* Top Banner Ribbon: Unique Problem Number */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
                  color: "#fef08a",
                  padding: "0.35rem 1rem",
                  borderBottomLeftRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  borderLeft: "1px solid #fbbf24",
                  borderBottom: "1px solid #fbbf24",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span>PROBLEM #{prob.number}</span>
              </div>

              <div>
                {/* Header: ID and Domain */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    borderBottom: "1px dashed var(--parchment-border)",
                    paddingBottom: "0.75rem",
                    paddingRight: "6rem", // room for ribbon
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        color: "#991b1b",
                        background: "rgba(185, 28, 28, 0.1)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        border: "1px solid rgba(185, 28, 28, 0.3)",
                      }}
                    >
                      {prob.id}
                    </span>
                  </div>

                  <span
                    style={{
                      background: "rgba(120, 53, 15, 0.15)",
                      border: "1px solid #78350f",
                      color: "#78350f",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "3px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {prob.domain}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-pirate"
                  style={{
                    fontSize: "1.75rem",
                    color: "#27150a",
                    lineHeight: 1.15,
                    marginBottom: "0.85rem",
                  }}
                >
                  {prob.title}
                </h3>

                {/* Problem Statement excerpt */}
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#78350f",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "0.2rem",
                    }}
                  >
                    PROBLEM STATEMENT
                  </div>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "#3b1e10",
                      lineHeight: 1.55,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {prob.statement}
                  </p>
                </div>

                {/* Requirements Count Badge */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "4px",
                    padding: "0.6rem 0.8rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    color: "#27150a",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700 }}>
                    <CheckCircle2 size={14} color="#15803d" />
                    {prob.requirements.length} Core Requirements
                  </span>
                  <span style={{ color: "#78350f", fontSize: "0.72rem" }}>
                    Click to inspect all
                  </span>
                </div>

                {/* One Piece Theme Hook Badge */}
                <div
                  style={{
                    background: "rgba(185, 28, 28, 0.08)",
                    border: "1px dashed rgba(185, 28, 28, 0.4)",
                    borderRadius: "4px",
                    padding: "0.55rem 0.75rem",
                    marginBottom: "1.2rem",
                    fontSize: "0.76rem",
                    color: "#7f1d1d",
                    lineHeight: 1.4,
                  }}
                >
                  <strong style={{ display: "block", color: "#991b1b", marginBottom: "0.15rem" }}>
                    ☠️ One Piece Concept:
                  </strong>
                  {prob.onePieceFlavor.themeConcept}
                </div>
              </div>

              {/* Card Footer: View Details Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px dashed var(--parchment-border)",
                  paddingTop: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    color: "#78350f",
                  }}
                >
                  <Compass size={15} color="#991b1b" />
                  <span>Grand Line Challenge</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "#78350f",
                    background: "rgba(245, 158, 11, 0.2)",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(120, 53, 15, 0.3)",
                  }}
                >
                  <Eye size={15} />
                  View Full Spec
                  <ChevronRight size={15} />
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
            background: "rgba(13, 21, 39, 0.6)",
            borderRadius: "8px",
            border: "1px dashed rgba(245, 158, 11, 0.25)",
          }}
        >
          <BookOpen size={36} color="#fbbf24" style={{ margin: "0 auto 1rem", opacity: 0.6 }} />
          <h3 className="font-pirate" style={{ fontSize: "1.8rem", color: "#fef08a", marginBottom: "0.5rem" }}>
            NO MATCHING PROBLEM STATEMENTS FOUND
          </h3>
          <p style={{ maxWidth: "450px", margin: "0 auto 1.5rem", fontSize: "0.95rem" }}>
            No problem statement matches your current search or filter. Try clearing filters to see all 10 challenges.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedNumber(null);
              setSelectedDomain("All");
            }}
            className="btn-pirate-gold"
            style={{ padding: "0.6rem 1.4rem" }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detailed Problem Modal */}
      {activeModalProblem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(10px)",
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
              maxWidth: "880px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "2.4rem",
              border: "4px solid #b45309",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
              position: "relative",
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
                paddingBottom: "1.2rem",
                marginBottom: "1.2rem",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                  <span
                    style={{
                      background: "#991b1b",
                      color: "#fef08a",
                      fontWeight: 900,
                      fontSize: "0.85rem",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "4px",
                      letterSpacing: "1px",
                    }}
                  >
                    PROBLEM #{activeModalProblem.number} ({activeModalProblem.id})
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#78350f" }}>
                    OFFICIAL HACKATHON SPECIFICATION
                  </span>
                </div>

                <h3
                  className="font-pirate"
                  style={{ fontSize: "2.3rem", color: "#2d1810", lineHeight: 1.1 }}
                >
                  {activeModalProblem.title}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() =>
                    handleCopy(
                      getFullMarkdown(activeModalProblem),
                      activeModalProblem.id
                    )
                  }
                  title="Copy complete specification markdown"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "rgba(120, 53, 15, 0.15)",
                    border: "1px solid #78350f",
                    borderRadius: "4px",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#78350f",
                    cursor: "pointer",
                  }}
                >
                  {copiedId === activeModalProblem.id ? (
                    <>
                      <Check size={14} color="#15803d" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Spec
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveModalProblem(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    color: "#78350f",
                    fontWeight: 900,
                    lineHeight: 1,
                    padding: "0 0.4rem",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Badges Bar */}
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
                  background: "#15803d",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                }}
              >
                Unique Number: #{activeModalProblem.number} ({activeModalProblem.id})
              </span>
              <span
                style={{
                  background: "#991b1b",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                }}
              >
                {activeModalProblem.requirements.length} Core Requirements
              </span>
            </div>

            {/* Modal Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                borderBottom: "2px solid var(--parchment-border)",
                marginBottom: "1.4rem",
                overflowX: "auto",
              }}
            >
              {[
                { id: "statement", label: "Statement & Context", icon: FileText },
                { id: "requirements", label: `Requirements (${activeModalProblem.requirements.length})`, icon: CheckCircle2 },
                { id: "solution", label: "Proposed Solution", icon: Lightbulb },
                { id: "theme", label: "One Piece Theme Note", icon: Ship },
                { id: "mechanics", label: "⚡ Devil Fruit + Haki", icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setModalTab(tab.id as typeof modalTab);
                      soundFX.playWheelTick(1.2);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 1rem",
                      border: "none",
                      borderBottom: isActive ? "3px solid #991b1b" : "3px solid transparent",
                      background: isActive ? "rgba(185, 28, 28, 0.1)" : "transparent",
                      color: isActive ? "#991b1b" : "#78350f",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Statement & Context */}
            {modalTab === "statement" && (
              <div>
                {/* Official Problem Statement */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1.2rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "0.95rem",
                      color: "#991b1b",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <FileText size={16} />
                    OFFICIAL PROBLEM STATEMENT:
                  </h4>
                  <p style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "#1f100a", fontWeight: 500 }}>
                    {activeModalProblem.statement}
                  </p>
                </div>

                {/* Problem Description */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1.2rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "0.95rem",
                      color: "#78350f",
                      marginBottom: "0.5rem",
                    }}
                  >
                    PROBLEM DESCRIPTION & SCENARIO:
                  </h4>
                  <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "#27150a" }}>
                    {activeModalProblem.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Requirements */}
            {modalTab === "requirements" && (
              <div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1.4rem",
                    marginBottom: "1.2rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "0.95rem",
                      color: "#991b1b",
                      marginBottom: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <CheckCircle2 size={18} color="#991b1b" />
                    CORE SPECIFICATION REQUIREMENTS ({activeModalProblem.requirements.length}):
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem" }}>
                    {activeModalProblem.requirements.map((req, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "0.95rem",
                          color: "#2c1810",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.65rem",
                          padding: "0.5rem 0.6rem",
                          background: i % 2 === 0 ? "rgba(245, 158, 11, 0.05)" : "transparent",
                          borderRadius: "4px",
                        }}
                      >
                        <span
                          style={{
                            background: "#991b1b",
                            color: "#fff",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ lineHeight: 1.5 }}>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonus Ideas */}
                {activeModalProblem.bonus && activeModalProblem.bonus.length > 0 && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--parchment-border)",
                      borderRadius: "6px",
                      padding: "1.2rem",
                    }}
                  >
                    <h4
                      className="font-heading"
                      style={{
                        fontSize: "0.9rem",
                        color: "#15803d",
                        marginBottom: "0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Sparkles size={16} color="#15803d" />
                      SUGGESTED BONUS ENHANCEMENTS:
                    </h4>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {activeModalProblem.bonus.map((b, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.9rem",
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
                )}
              </div>
            )}

            {/* Tab 3: Proposed Solution */}
            {modalTab === "solution" && (
              <div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1.4rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "0.95rem",
                      color: "#78350f",
                      marginBottom: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Lightbulb size={18} color="#b45309" />
                    PROPOSED SOLUTION (FROM HACKATHON JURY):
                  </h4>
                  <p style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "#27150a" }}>
                    {activeModalProblem.proposedSolution}
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(30, 41, 59, 0.08)",
                    border: "1px dashed var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1rem 1.2rem",
                    fontSize: "0.9rem",
                    color: "#451a03",
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: "#78350f" }}>💡 Implementation Architecture Tip:</strong>{" "}
                  Deliver a working frontend prototype with interactive mock data, state management, dynamic user flows, responsive layouts, and rich micro-interactions.
                </div>
              </div>
            )}

            {/* Tab 4: One Piece Theme Note */}
            {modalTab === "theme" && (
              <div>
                {/* Official Note */}
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(185, 28, 28, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)",
                    border: "2px solid #b91c1c",
                    borderRadius: "8px",
                    padding: "1.4rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#991b1b",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      marginBottom: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Ship size={16} />
                    MANDATORY THEME INTEGRATION NOTE:
                  </div>
                  <blockquote
                    style={{
                      fontSize: "1.05rem",
                      fontStyle: "italic",
                      color: "#450a0a",
                      lineHeight: 1.7,
                      borderLeft: "4px solid #b91c1c",
                      paddingLeft: "1rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    &ldquo;{activeModalProblem.themeIntegration}&rdquo;
                  </blockquote>
                </div>

                {/* Creative Flavor Details */}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--parchment-border)",
                    borderRadius: "6px",
                    padding: "1.4rem",
                  }}
                >
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: "0.95rem",
                      color: "#991b1b",
                      marginBottom: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Flame size={16} color="#991b1b" />
                    CREATIVE PIRATE INSPIRATION & LORE:
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <div>
                      <strong style={{ color: "#78350f", fontSize: "0.85rem", textTransform: "uppercase" }}>
                        Grand Line Concept:
                      </strong>
                      <p style={{ color: "#27150a", fontSize: "0.95rem", marginTop: "0.2rem" }}>
                        {activeModalProblem.onePieceFlavor.themeConcept}
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: "#78350f", fontSize: "0.85rem", textTransform: "uppercase" }}>
                        Pirate Context & Setting:
                      </strong>
                      <p style={{ color: "#27150a", fontSize: "0.95rem", marginTop: "0.2rem" }}>
                        {activeModalProblem.onePieceFlavor.suggestedPirateContext}
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: "#78350f", fontSize: "0.85rem", textTransform: "uppercase" }}>
                        Story / Lore Hook:
                      </strong>
                      <p style={{ color: "#27150a", fontSize: "0.95rem", marginTop: "0.2rem", fontStyle: "italic" }}>
                        &ldquo;{activeModalProblem.onePieceFlavor.loreHook}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Devil Fruit + Haki Mechanics */}
            {modalTab === "mechanics" && (
              <div>
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(88, 28, 135, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)",
                    border: "2px solid #b45309",
                    borderRadius: "8px",
                    padding: "1.4rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#78350f",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      marginBottom: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Zap size={16} color="#fbbf24" />
                    CHALLENGE MODIFIER INTEGRATION
                  </div>
                  <p style={{ color: "#27150a", fontSize: "1rem", lineHeight: 1.6, margin: "0.2rem 0 0.8rem" }}>
                    While your team implements <strong>{activeModalProblem.title} (Problem #{activeModalProblem.number})</strong>,
                    your evaluation will be modified by your team&apos;s awakened <strong>Devil Fruit or Haki Power</strong> obtained through the Dual Roulette!
                  </p>
                  <a
                    href="#mechanics"
                    onClick={() => setActiveModalProblem(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "#991b1b",
                      color: "#fef08a",
                      padding: "0.4rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      textDecoration: "none",
                      border: "1px solid #fbbf24",
                    }}
                  >
                    <span>Spin Crew&apos;s Dual Roulette</span> →
                  </a>
                </div>

                {/* The 4 Devil Fruit Powers */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#7e22ce", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>☠️</span> 4 Common Devil Fruit Powers
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem" }}>
                    {DEVIL_FRUIT_POWERS.map((df) => (
                      <div
                        key={df.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid rgba(147, 51, 234, 0.3)",
                          borderRadius: "6px",
                          padding: "0.85rem",
                        }}
                      >
                        <strong style={{ color: "#78350f", fontSize: "0.95rem" }}>
                          {df.icon} {df.name}
                        </strong>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "0.3rem" }}>
                          <strong>Effect:</strong> {df.commonEffect}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#16a34a", marginTop: "0.2rem" }}>
                          <strong>Benefit:</strong> {df.benefit}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#dc2626", marginTop: "0.2rem" }}>
                          <strong>Disadvantage:</strong> {df.disadvantage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The 4 Haki Powers */}
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#0284c7", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>⚡</span> 4 Common Haki Powers
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.8rem" }}>
                    {HAKI_POWERS.map((haki) => (
                      <div
                        key={haki.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid rgba(2, 132, 199, 0.3)",
                          borderRadius: "6px",
                          padding: "0.85rem",
                        }}
                      >
                        <strong style={{ color: "#78350f", fontSize: "0.95rem" }}>
                          {haki.icon} {haki.name}
                        </strong>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "0.3rem" }}>
                          <strong>Challenge:</strong> {haki.challenge}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#ca8a04", marginTop: "0.2rem" }}>
                          <strong>Pass Condition:</strong> {haki.passCondition}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#0284c7", marginTop: "0.2rem" }}>
                          <strong>Awarded Power:</strong> {haki.power}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.8rem",
                paddingTop: "1rem",
                borderTop: "1px dashed var(--parchment-border)",
                flexWrap: "wrap",
                gap: "0.8rem",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#78350f" }}>
                Assigned ID: <strong style={{ color: "#991b1b" }}>{activeModalProblem.id}</strong> (Problem #{activeModalProblem.number})
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  onClick={() =>
                    handleCopy(
                      getFullMarkdown(activeModalProblem),
                      activeModalProblem.id
                    )
                  }
                  className="btn-pirate-secondary"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
                >
                  <Copy size={15} />
                  {copiedId === activeModalProblem.id ? "Copied!" : "Copy Full Markdown"}
                </button>

                <button
                  onClick={() => setActiveModalProblem(null)}
                  className="btn-pirate-crimson"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.3rem" }}
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
