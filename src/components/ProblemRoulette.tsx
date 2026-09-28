"use client";

import React, { useState, useEffect, useRef } from "react";
import { PROBLEM_STATEMENTS, ProblemStatement } from "@/data/problems";
import { soundFX } from "@/utils/soundEffects";
import confetti from "canvas-confetti";
import {
  Skull,
  Compass,
  Ship,
  Sparkles,
  CheckCircle2,
  Lock,
  Printer,
  RotateCcw,
  AlertCircle,
  LogIn,
  Search,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  HelpCircle,
} from "lucide-react";

interface IRegisteredTeamData {
  _id?: string;
  teamId: string;
  teamName: string;
  division?: string;
  flag?: string;
  captainName?: string;
  captainEmail?: string;
  hasSpunRoulette: boolean;
  assignedProblemTitle?: string | null;
  assignedProblemId?: string | null;
  assignedProblemNumber?: number | null;
  assignedAt?: string | null;
}

export default function ProblemRoulette() {
  // Login / Auth State
  const [teamNameInput, setTeamNameInput] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeCrew, setActiveCrew] = useState<IRegisteredTeamData | null>(null);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [assignedProblem, setAssignedProblem] = useState<ProblemStatement | null>(null);
  const [spinError, setSpinError] = useState<string | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved session on mount if available
  useEffect(() => {
    const savedCrew = sessionStorage.getItem("roulette_crew_session");
    if (savedCrew) {
      try {
        const parsed: IRegisteredTeamData = JSON.parse(savedCrew);
        setActiveCrew(parsed);
        if (parsed.hasSpunRoulette && parsed.assignedProblemNumber) {
          const problem = PROBLEM_STATEMENTS.find(
            (p) => p.number === parsed.assignedProblemNumber
          );
          if (problem) {
            setAssignedProblem(problem);
            // Position wheel to point to this problem
            const sliceAngle = 360 / PROBLEM_STATEMENTS.length;
            const targetSliceIndex = PROBLEM_STATEMENTS.findIndex(
              (p) => p.number === parsed.assignedProblemNumber
            );
            if (targetSliceIndex !== -1) {
              const centerAngle = targetSliceIndex * sliceAngle + sliceAngle / 2;
              setWheelRotation((360 - centerAngle) % 360);
            }
          }
        }
      } catch {
        sessionStorage.removeItem("roulette_crew_session");
      }
    }
  }, []);

  // Team Leader Login handler
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = teamNameInput.trim();
    if (!query) {
      setAuthError("Please enter your registered crew (team) name.");
      return;
    }

    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/roulette/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: query }),
      });

      const result = await res.json();

      if (!res.ok) {
        setAuthError(result.error || "Crew authentication failed.");
        soundFX.playWheelTick(0.8);
        return;
      }

      const crew: IRegisteredTeamData = result.data;
      setActiveCrew(crew);
      sessionStorage.setItem("roulette_crew_session", JSON.stringify(crew));
      soundFX.playCoin();

      // Check if crew already has a problem assigned
      if (crew.hasSpunRoulette && crew.assignedProblemNumber) {
        const prob = PROBLEM_STATEMENTS.find(
          (p) => p.number === crew.assignedProblemNumber
        );
        if (prob) {
          setAssignedProblem(prob);
          const sliceAngle = 360 / PROBLEM_STATEMENTS.length;
          const targetSliceIndex = PROBLEM_STATEMENTS.findIndex(
            (p) => p.number === crew.assignedProblemNumber
          );
          if (targetSliceIndex !== -1) {
            const centerAngle = targetSliceIndex * sliceAngle + sliceAngle / 2;
            setWheelRotation((360 - centerAngle) % 360);
          }
        }
      } else {
        setAssignedProblem(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setAuthError("Failed to reach Grand Line Registry: " + msg);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Logout / Switch Crew
  const handleLogout = () => {
    if (isSpinning) return;
    setActiveCrew(null);
    setAssignedProblem(null);
    setTeamNameInput("");
    setAuthError(null);
    setSpinError(null);
    sessionStorage.removeItem("roulette_crew_session");
    soundFX.playWheelTick(1.0);
  };

  // Execute Spin
  const handleSpin = async () => {
    if (!activeCrew || isSpinning) return;
    if (activeCrew.hasSpunRoulette) {
      setSpinError("This crew has already spun the roulette and claimed their problem statement!");
      return;
    }

    setIsSpinning(true);
    setSpinError(null);

    // Pick random target problem index (0 to 9)
    const targetIndex = Math.floor(Math.random() * PROBLEM_STATEMENTS.length);
    const chosenProblem = PROBLEM_STATEMENTS[targetIndex];

    // Compute target rotation
    // Pointer needle is at top center (0 deg / 12 o'clock).
    // Slice `targetIndex` starts at `targetIndex * 36` and ends at `(targetIndex + 1) * 36`.
    // Slice center is `targetIndex * 36 + 18`.
    // To position slice center at 0 deg, wheel must stop at: (360 - sliceCenter) % 360.
    const sliceAngle = 360 / PROBLEM_STATEMENTS.length; // 36
    const sliceCenterAngle = targetIndex * sliceAngle + sliceAngle / 2;
    const targetStopAngle = (360 - sliceCenterAngle + 360) % 360;

    // Add 6 to 8 full spins for dramatic tension
    const fullSpins = 360 * 7;
    const currentBase = wheelRotation - (wheelRotation % 360);
    const finalAngle = currentBase + fullSpins + targetStopAngle;

    setWheelRotation(finalAngle);

    // Audio click ticks during spin
    let tickCount = 0;
    const totalTicks = 32;
    const tickInterval = 6500 / totalTicks;

    spinIntervalRef.current = setInterval(() => {
      soundFX.playWheelTick(1.0 + Math.random() * 0.4);
      tickCount++;
      if (tickCount >= totalTicks && spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    }, tickInterval);

    // Persist spin assignment on server simultaneously
    try {
      const res = await fetch("/api/roulette/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: activeCrew.teamId,
          teamName: activeCrew.teamName,
          problemNumber: chosenProblem.number,
        }),
      });

      const result = await res.json();
      if (!res.ok && !result.alreadySpun) {
        console.error("Spin persistence failed:", result.error);
      }
    } catch (e) {
      console.error("Spin API error:", e);
    }

    // Spin animation duration is 6.5s
    setTimeout(() => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      setIsSpinning(false);
      setAssignedProblem(chosenProblem);

      // Update local crew state
      const updatedCrew: IRegisteredTeamData = {
        ...activeCrew,
        hasSpunRoulette: true,
        assignedProblemTitle: chosenProblem.title,
        assignedProblemId: chosenProblem.id,
        assignedProblemNumber: chosenProblem.number,
        assignedAt: new Date().toISOString(),
      };
      setActiveCrew(updatedCrew);
      sessionStorage.setItem("roulette_crew_session", JSON.stringify(updatedCrew));

      // Celebration effects!
      soundFX.playCannon();
      setTimeout(() => soundFX.playCoin(), 400);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#ef4444", "#ffffff", "#38bdf8", "#b45309"],
      });
    }, 6500);
  };

  // Color theme generator for the 10 slices
  const sliceColors = [
    { bg: "#881337", stroke: "#fbbf24", text: "#fef08a", sub: "#fecdd3" }, // Crimson
    { bg: "#1e293b", stroke: "#fbbf24", text: "#f8fafc", sub: "#94a3b8" }, // Navy
    { bg: "#78350f", stroke: "#fbbf24", text: "#fef08a", sub: "#fde68a" }, // Gold Amber
    { bg: "#064e3b", stroke: "#fbbf24", text: "#a7f3d0", sub: "#6ee7b7" }, // Emerald
    { bg: "#4c0519", stroke: "#fbbf24", text: "#fef08a", sub: "#fda4af" }, // Dark Maroon
    { bg: "#0f172a", stroke: "#fbbf24", text: "#f8fafc", sub: "#94a3b8" }, // Dark Slate
    { bg: "#92400e", stroke: "#fbbf24", text: "#fef08a", sub: "#fcd34d" }, // Warm Bronze
    { bg: "#134e4a", stroke: "#fbbf24", text: "#99f6e4", sub: "#5eead4" }, // Deep Teal
    { bg: "#7f1d1d", stroke: "#fbbf24", text: "#fef08a", sub: "#fca5a5" }, // Scarlet
    { bg: "#1e1b4b", stroke: "#fbbf24", text: "#c7d2fe", sub: "#a5b4fc" }, // Indigo Night
  ];

  return (
    <section
      id="roulette"
      style={{
        position: "relative",
        padding: "6.5rem 1.5rem",
        maxWidth: "1340px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
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
            marginBottom: "0.8rem",
            background: "rgba(245, 158, 11, 0.12)",
            padding: "0.4rem 1.2rem",
            borderRadius: "999px",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
          }}
        >
          <Compass size={16} />
          GRAND LINE WHEEL OF DESTINY • OFFICIAL PROBLEM ROULETTE
        </div>

        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
            color: "#fef08a",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            letterSpacing: "1.5px",
            lineHeight: 1.1,
            marginBottom: "0.8rem",
          }}
        >
          SPIN FOR YOUR PROBLEM STATEMENT
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
          Team Leaders: Enter your registered <strong>Pirate Crew (Team) Name</strong> to unlock the roulette.
          Every crew is granted <strong>EXACTLY ONE SPIN</strong>. Once spun, your assigned challenge title is
          permanently sealed and visible to hackathon organizers on the Admin Portal!
        </p>
      </div>

      {/* STEP 1: TEAM LEADER LOGIN PORTAL (If not logged in) */}
      {!activeCrew ? (
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto 3rem",
          }}
        >
          <div
            className="parchment-card"
            style={{
              padding: "2.8rem 2.2rem",
              border: "3px solid #bca476",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
                color: "#fef08a",
                padding: "0.4rem 1.4rem",
                borderBottomLeftRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 900,
                letterSpacing: "1px",
                borderLeft: "1px solid #fbbf24",
                borderBottom: "1px solid #fbbf24",
              }}
            >
              CAPTAIN ACCESS REQUIRED
            </div>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #78350f 0%, #451a03 100%)",
                  border: "2px solid #fbbf24",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <Skull size={32} color="#fef08a" />
              </div>
              <h3
                className="font-pirate"
                style={{ fontSize: "2.2rem", color: "#2d1810", lineHeight: 1.1, marginBottom: "0.4rem" }}
              >
                CAPTAIN LOGIN PORTAL
              </h3>
              <p style={{ color: "#78350f", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Enter the exact Team Name registered for your pirate crew.
              </p>
            </div>

            {authError && (
              <div
                style={{
                  background: "rgba(220, 38, 38, 0.12)",
                  border: "1px solid #b91c1c",
                  borderRadius: "6px",
                  padding: "0.85rem 1rem",
                  color: "#991b1b",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{authError}</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.6rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "#451a03",
                    letterSpacing: "0.5px",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  PIRATE CREW (TEAM) NAME *
                </label>
                <div style={{ position: "relative" }}>
                  <Ship
                    size={18}
                    color="#78350f"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Straw Hat Pirates, Red Hair Fleet..."
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    className="parchment-input"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.8rem",
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "2px solid #854d0e",
                      borderRadius: "6px",
                      color: "#1f100a",
                      fontSize: "1rem",
                      fontWeight: 700,
                      outline: "none",
                    }}
                    autoFocus
                  />
                </div>
                <div style={{ fontSize: "0.78rem", color: "#78350f", marginTop: "0.4rem" }}>
                  Must match the Team Name provided during hackathon registration.
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="btn-pirate-crimson"
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  fontSize: "1.05rem",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  cursor: isLoadingAuth ? "not-allowed" : "pointer",
                  opacity: isLoadingAuth ? 0.7 : 1,
                  boxShadow: "0 6px 20px rgba(185, 28, 28, 0.4)",
                }}
              >
                {isLoadingAuth ? (
                  <>Verifying Admiralty Records...</>
                ) : (
                  <>
                    <LogIn size={20} />
                    AUTHORIZE & UNLOCK ROULETTE
                  </>
                )}
              </button>
            </form>

            <div
              style={{
                marginTop: "1.8rem",
                paddingTop: "1.2rem",
                borderTop: "1px dashed var(--parchment-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.6rem",
                fontSize: "0.85rem",
                color: "#78350f",
              }}
            >
              <span>Not registered yet?</span>
              <a
                href="#register"
                style={{
                  color: "#991b1b",
                  fontWeight: 800,
                  textDecoration: "underline",
                }}
                onClick={() => soundFX.playWheelTick(1.1)}
              >
                Register your Pirate Crew here →
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2 & 3: LOGGED IN CREW ROULETTE ARENA */
        <div>
          {/* Crew Status Bar */}
          <div
            className="pirate-panel"
            style={{
              padding: "1rem 1.6rem",
              marginBottom: "2.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              background: "rgba(13, 21, 39, 0.95)",
              border: "2px solid #b45309",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
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
                  fontSize: "1.2rem",
                }}
              >
                ☠️
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                  AUTHORIZED PIRATE CREW ({activeCrew.teamId})
                </div>
                <div
                  className="font-pirate"
                  style={{ fontSize: "1.7rem", color: "#fef08a", lineHeight: 1.1 }}
                >
                  {activeCrew.teamName}
                </div>
                {activeCrew.captainName && (
                  <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                    Captain: <strong>{activeCrew.captainName}</strong>
                    {activeCrew.division && ` • ${activeCrew.division}`}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              {activeCrew.hasSpunRoulette ? (
                <div
                  style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid #22c55e",
                    color: "#86efac",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Lock size={14} />
                  Fate Sealed (1 Spin Complete)
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid #fbbf24",
                    color: "#fef08a",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Flame size={14} color="#f59e0b" />
                  1 Spin Authorized
                </div>
              )}

              <button
                onClick={handleLogout}
                disabled={isSpinning}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#94a3b8",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: isSpinning ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Log Out / Switch
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {spinError && (
            <div
              style={{
                maxWidth: "700px",
                margin: "0 auto 2rem",
                background: "rgba(220, 38, 38, 0.2)",
                border: "1px solid #ef4444",
                padding: "1rem",
                borderRadius: "6px",
                color: "#fca5a5",
                fontSize: "0.95rem",
                textAlign: "center",
              }}
            >
              {spinError}
            </div>
          )}

          {/* MAIN ROULETTE WHEEL CONTAINER */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "3.5rem",
            }}
          >
            {/* The 10-Segment Wheel Arena */}
            <div
              style={{
                position: "relative",
                width: "min(92vw, 490px)",
                height: "min(92vw, 490px)",
                margin: "0 auto 2.5rem",
              }}
            >
              {/* TOP POINTER NEEDLE */}
              <div
                style={{
                  position: "absolute",
                  top: "-22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Glowing Ruby Gem */}
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #ef4444 30%, #7f1d1d 90%)",
                    border: "2px solid #fbbf24",
                    boxShadow: "0 0 15px #ef4444",
                    marginBottom: "-2px",
                  }}
                />
                {/* Needle Arrow */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderTop: "32px solid #fbbf24",
                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.9))",
                  }}
                />
              </div>

              {/* ROTATING SVG WHEEL */}
              <svg
                viewBox="0 0 500 500"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning
                    ? "transform 6.5s cubic-bezier(0.12, 0.98, 0.28, 1.0)"
                    : "transform 0.4s ease-out",
                  filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.9))",
                  borderRadius: "50%",
                }}
              >
                {/* Outer Wooden Nautical Rim */}
                <circle cx="250" cy="250" r="246" fill="#3b1a0e" stroke="#d97706" strokeWidth="8" />
                <circle cx="250" cy="250" r="236" fill="#1c0d07" stroke="#78350f" strokeWidth="4" />

                {/* 10 Wheel Slices */}
                {PROBLEM_STATEMENTS.map((prob, idx) => {
                  const total = PROBLEM_STATEMENTS.length; // 10
                  const angle = 360 / total; // 36 deg per slice
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;

                  // Convert to radians (0 deg is Top = -90 in standard polar coordinates)
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;

                  const radius = 230;
                  const x1 = 250 + radius * Math.cos(startRad);
                  const y1 = 250 + radius * Math.sin(startRad);
                  const x2 = 250 + radius * Math.cos(endRad);
                  const y2 = 250 + radius * Math.sin(endRad);

                  const theme = sliceColors[idx % sliceColors.length];
                  const midAngle = startAngle + angle / 2;

                  // Truncate title for slice text display
                  const shortTitle =
                    prob.title.length > 28 ? prob.title.slice(0, 26) + "…" : prob.title;

                  return (
                    <g
                      key={prob.id}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Segment Path */}
                      <path
                        d={`M250,250 L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                        fill={theme.bg}
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                      />

                      {/* Text Group Rotated to Center of Slice */}
                      <g transform={`rotate(${midAngle}, 250, 250)`}>
                        {/* Problem Code Badge (#01, #02, etc.) */}
                        <text
                          x="250"
                          y="62"
                          fill="#fef08a"
                          fontSize="13"
                          fontWeight="900"
                          fontFamily="var(--font-heading), sans-serif"
                          textAnchor="middle"
                          letterSpacing="1px"
                        >
                          {prob.code} ({prob.id})
                        </text>

                        {/* Title text along radial line */}
                        <text
                          x="250"
                          y="85"
                          fill="#ffffff"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          textAnchor="middle"
                          style={{
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {shortTitle}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Outer Golden Studs/Rivets */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const rivetAngle = ((i * 18 - 90) * Math.PI) / 180;
                  const rx = 250 + 241 * Math.cos(rivetAngle);
                  const ry = 250 + 241 * Math.sin(rivetAngle);
                  return (
                    <circle
                      key={i}
                      cx={rx}
                      cy={ry}
                      r="3.5"
                      fill="#fef08a"
                      stroke="#78350f"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Center Pirate Hub */}
                <circle cx="250" cy="250" r="52" fill="#2d1308" stroke="#f59e0b" strokeWidth="5" />
                <circle cx="250" cy="250" r="42" fill="#881337" stroke="#fbbf24" strokeWidth="2" />

                {/* Inner Compass / Jolly Roger Emblem */}
                <circle cx="250" cy="250" r="32" fill="#450a0a" />
                <text
                  x="250"
                  y="257"
                  fill="#fef08a"
                  fontSize="22"
                  fontFamily="var(--font-pirate), cursive"
                  textAnchor="middle"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  ☠️
                </text>
              </svg>
            </div>

            {/* Currently Hovered / Inspected Slice Preview Bar */}
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                background: "rgba(13, 21, 39, 0.8)",
                border: "1px dashed rgba(245, 158, 11, 0.4)",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                textAlign: "center",
                marginBottom: "2rem",
                minHeight: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e2e8f0",
                fontSize: "0.85rem",
              }}
            >
              {hoveredSlice !== null ? (
                <span>
                  Inspect Wheel Slice:{" "}
                  <strong style={{ color: "#fbbf24" }}>
                    {PROBLEM_STATEMENTS[hoveredSlice].code} —{" "}
                    {PROBLEM_STATEMENTS[hoveredSlice].title}
                  </strong>
                </span>
              ) : (
                <span style={{ color: "#94a3b8" }}>
                  All 10 official problem statement titles are mounted on this wheel.
                </span>
              )}
            </div>

            {/* SPIN BUTTON / ACTION CONTROLS */}
            {!activeCrew.hasSpunRoulette ? (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="btn-pirate-crimson"
                  style={{
                    padding: "1.2rem 3rem",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    cursor: isSpinning ? "not-allowed" : "pointer",
                    boxShadow: isSpinning
                      ? "none"
                      : "0 0 35px rgba(220, 38, 38, 0.6), 0 8px 25px rgba(0,0,0,0.8)",
                    border: "2px solid #fbbf24",
                    transform: isSpinning ? "scale(0.98)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Sparkles size={24} color="#fef08a" />
                  {isSpinning ? "ROULETTE IS SPINNING..." : "SPIN ROULETTE (1 CHANCE ONLY)"}
                  <Sparkles size={24} color="#fef08a" />
                </button>

                <div
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginTop: "1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  ⚠️ WARNING: Your crew gets exactly ONE spin. Result is locked in the database permanently!
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "2px solid #22c55e",
                    color: "#86efac",
                    padding: "0.8rem 1.8rem",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    marginBottom: "1rem",
                  }}
                >
                  <CheckCircle2 size={22} color="#22c55e" />
                  ROULETTE SPIN COMPLETE • ASSIGNMENT SEALED
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  Your crew&apos;s challenge title is officially logged in the Admiral Records.
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: ASSIGNED PROBLEM STATEMENT SLIP / CERTIFICATE */}
          {assignedProblem && (
            <div
              className="parchment-card"
              style={{
                maxWidth: "880px",
                margin: "0 auto",
                padding: "2.8rem 2.4rem",
                border: "4px solid #bca476",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
                position: "relative",
              }}
            >
              {/* Top Banner */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                  color: "#ffffff",
                  padding: "0.45rem 1.6rem",
                  borderBottomLeftRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  borderLeft: "2px solid #fbbf24",
                  borderBottom: "2px solid #fbbf24",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                OFFICIAL HACKATHON ASSIGNMENT
              </div>

              {/* Header */}
              <div style={{ borderBottom: "2px dashed var(--parchment-border)", paddingBottom: "1.5rem", marginBottom: "1.8rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#78350f", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  ASSIGNED TO PIRATE CREW:
                </div>
                <div
                  className="font-pirate"
                  style={{ fontSize: "2.6rem", color: "#2c150b", lineHeight: 1.1, marginBottom: "0.5rem" }}
                >
                  {activeCrew.teamName}
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#5c2b0e" }}>
                  <span>Captain: <strong>{activeCrew.captainName}</strong></span>
                  <span>•</span>
                  <span>Crew ID: <strong>{activeCrew.teamId}</strong></span>
                  <span>•</span>
                  <span>Assignment Date: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Problem ID & Title Banner */}
              <div
                style={{
                  background: "rgba(185, 28, 28, 0.08)",
                  border: "2px solid #991b1b",
                  borderRadius: "8px",
                  padding: "1.6rem",
                  marginBottom: "1.8rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: "#991b1b",
                      color: "#fef08a",
                      fontWeight: 900,
                      fontSize: "0.85rem",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                    }}
                  >
                    {assignedProblem.id} (Problem #{assignedProblem.number})
                  </span>
                  <span
                    style={{
                      background: "#78350f",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                    }}
                  >
                    Domain: {assignedProblem.domain}
                  </span>
                </div>

                <h3
                  className="font-pirate"
                  style={{
                    fontSize: "2.2rem",
                    color: "#1e0e07",
                    lineHeight: 1.15,
                    marginBottom: "0.8rem",
                  }}
                >
                  {assignedProblem.title}
                </h3>

                <p style={{ fontSize: "1.05rem", color: "#2d160b", lineHeight: 1.65, fontWeight: 500 }}>
                  {assignedProblem.statement}
                </p>
              </div>

              {/* Problem Description */}
              <div style={{ marginBottom: "1.6rem" }}>
                <h4
                  className="font-heading"
                  style={{ fontSize: "0.95rem", color: "#78350f", marginBottom: "0.4rem", fontWeight: 900 }}
                >
                  PROBLEM SCENARIO & CONTEXT:
                </h4>
                <p style={{ fontSize: "0.98rem", color: "#3a1b0d", lineHeight: 1.65 }}>
                  {assignedProblem.description}
                </p>
              </div>

              {/* Core Requirements Preview */}
              <div style={{ marginBottom: "1.8rem" }}>
                <h4
                  className="font-heading"
                  style={{ fontSize: "0.95rem", color: "#991b1b", marginBottom: "0.6rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <CheckCircle2 size={16} color="#991b1b" />
                  CORE DELIVERABLE REQUIREMENTS ({assignedProblem.requirements.length}):
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.5rem" }}>
                  {assignedProblem.requirements.slice(0, 6).map((req, i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "1px solid var(--parchment-border)",
                        borderRadius: "4px",
                        padding: "0.5rem 0.7rem",
                        fontSize: "0.85rem",
                        color: "#27150a",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span style={{ color: "#15803d", fontWeight: 800 }}>✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* One Piece Theme Concept */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
                  border: "1px dashed #b91c1c",
                  borderRadius: "6px",
                  padding: "1rem 1.2rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.2rem" }}>
                  ☠️ ONE PIECE THEME INTEGRATION CONCEPT:
                </div>
                <div style={{ fontSize: "0.95rem", color: "#450a0a", fontStyle: "italic", lineHeight: 1.5 }}>
                  &ldquo;{assignedProblem.onePieceFlavor.themeConcept}&rdquo; — {assignedProblem.onePieceFlavor.suggestedPirateContext}
                </div>
              </div>

              {/* Slip Actions */}
              <div
                style={{
                  borderTop: "2px dashed var(--parchment-border)",
                  paddingTop: "1.4rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#78350f" }}>
                  Status: <strong style={{ color: "#15803d" }}>Officially Recorded in Admin Portal</strong>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => window.print()}
                    className="btn-pirate-secondary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Printer size={15} />
                    Print Assignment Slip
                  </button>

                  <a
                    href="#problems"
                    className="btn-pirate-gold"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
                    onClick={() => soundFX.playWheelTick(1.2)}
                  >
                    <BookOpen size={15} />
                    View Full Spec in Problem Vault
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
