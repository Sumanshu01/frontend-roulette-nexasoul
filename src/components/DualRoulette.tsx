"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { PROBLEM_STATEMENTS, ProblemStatement } from "@/data/problems";
import { EVENT_DATA } from "@/data/eventInfo";
import { soundFX } from "@/utils/soundEffects";
import {
  Compass,
  RotateCw,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function DualRoulette() {
  // Tier toggle: 1 = Freshers (Level 1), 2 = 2nd Year & Above (Levels 2 & 3)
  const [tier, setTier] = useState<1 | 2>(1);

  // Filtered problem pool based on selected tier
  const problemPool = PROBLEM_STATEMENTS.filter((p) => p.rouletteTier === tier);
  const conditionPool = EVENT_DATA.specialConditions;

  // Spin states
  const [isSpinning, setIsSpinning] = useState(false);
  const [problemAngle, setProblemAngle] = useState(0);
  const [conditionAngle, setConditionAngle] = useState(0);

  // Assigned results
  const [assignedProblem, setAssignedProblem] = useState<ProblemStatement | null>(null);
  const [assignedCondition, setAssignedCondition] = useState<(typeof EVENT_DATA.specialConditions)[0] | null>(null);

  // Spin lock states
  const [isLocked, setIsLocked] = useState(false);
  const [hasReRollToken, setHasReRollToken] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [reRollUnlocked, setReRollUnlocked] = useState(false);
  const [penaltyWarning, setPenaltyWarning] = useState(false);

  // Sound tick interval reference
  const tickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check localStorage for saved spin or token on mount
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem("grand_line_roulette_result");
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        setAssignedProblem(parsed.problem);
        setAssignedCondition(parsed.condition);
        setTier(parsed.tier || 1);
        setIsLocked(true);
      }

      const savedToken = localStorage.getItem("roger_reroll_token");
      if (savedToken) {
        setHasReRollToken(true);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Handle Wheel Spin
  const spinRoulette = () => {
    if (isSpinning) return;
    if (isLocked && !reRollUnlocked) {
      soundFX.playBuzzer();
      setPenaltyWarning(true);
      return;
    }

    setPenaltyWarning(false);
    setIsSpinning(true);
    soundFX.playCannon();

    // Pick random winners
    const winningProblemIdx = Math.floor(Math.random() * problemPool.length);
    const winningConditionIdx = Math.floor(Math.random() * conditionPool.length);

    const winnerProblem = problemPool[winningProblemIdx];
    const winnerCondition = conditionPool[winningConditionIdx];

    // Compute target angles with 5 to 7 full rotations
    const sliceAngleProblem = 360 / problemPool.length;
    const sliceAngleCondition = 360 / conditionPool.length;

    const extraSpinsP = 360 * (5 + Math.floor(Math.random() * 2));
    const extraSpinsC = 360 * (5 + Math.floor(Math.random() * 2));

    const targetProblemAngle =
      problemAngle + extraSpinsP + (problemPool.length - winningProblemIdx) * sliceAngleProblem;
    const targetConditionAngle =
      conditionAngle + extraSpinsC + (conditionPool.length - winningConditionIdx) * sliceAngleCondition;

    setProblemAngle(targetProblemAngle);
    setConditionAngle(targetConditionAngle);

    // Play ticking sounds
    let tickCount = 0;
    const totalTicks = 28;
    const tickInterval = 120;
    tickTimerRef.current = setInterval(() => {
      tickCount++;
      soundFX.playWheelTick(1.0 + (tickCount / totalTicks) * 0.8);
      if (tickCount >= totalTicks) {
        if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      }
    }, tickInterval);

    // Settle after 4.2 seconds
    setTimeout(() => {
      setIsSpinning(false);
      setAssignedProblem(winnerProblem);
      setAssignedCondition(winnerCondition);
      setIsLocked(true);
      setReRollUnlocked(false);

      // Save to localStorage
      try {
        localStorage.setItem(
          "grand_line_roulette_result",
          JSON.stringify({ problem: winnerProblem, condition: winnerCondition, tier })
        );
        // If re-roll token was consumed, clear it
        localStorage.removeItem("roger_reroll_token");
        setHasReRollToken(false);
      } catch {
        // storage fallback
      }

      soundFX.playTriumph();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#ef4444", "#ffffff", "#b45309"],
      });
    }, 4200);
  };

  // Verify and redeem Re-Roll Token
  const redeemToken = () => {
    const trimmed = tokenInput.trim().toUpperCase();
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("roger_reroll_token") : null;

    if (trimmed.startsWith("ROGER-") || trimmed === storedToken) {
      soundFX.playCoin();
      setReRollUnlocked(true);
      setPenaltyWarning(false);
      alert("✨ RE-ROLL TOKEN ACCEPTED! You may now spin the Grand Roulette ONE more time!");
    } else {
      soundFX.playBuzzer();
      alert("❌ Invalid Re-Roll Token! You must complete Gol D. Roger's Mini-Game to earn a valid token!");
    }
  };

  return (
    <section
      id="roulette"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1320px",
        margin: "0 auto",
      }}
    >
      {/* Background nautical chart subtle overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/images/pirate_wheel_map.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
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
          <Compass size={16} />
          THE MAIN ATTRACTION OF NEXASOUL
        </div>
        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
            color: "#fef08a",
            letterSpacing: "1.5px",
            textShadow: "0 4px 15px rgba(0,0,0,0.9)",
          }}
        >
          THE DUAL PIRATE ROULETTE
        </h2>
        <p
          style={{
            color: "#cbd5e1",
            maxWidth: "720px",
            margin: "0.5rem auto 0",
            fontSize: "1.05rem",
            lineHeight: 1.6,
          }}
        >
          Spin Wheel 1 for your <strong>Problem Statement</strong> and Wheel 2 for your <strong>Grand Line Special Condition</strong>. Once spun, your fate is locked!
        </p>

        {/* Difficulty Level Switcher (From PDF Page 6) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(13, 21, 39, 0.9)",
            border: "2px solid #b45309",
            borderRadius: "8px",
            padding: "0.4rem",
            marginTop: "2rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
          }}
        >
          <button
            onClick={() => {
              if (isSpinning) return;
              setTier(1);
              soundFX.playWheelTick(1.2);
            }}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "5px",
              border: "none",
              background: tier === 1 ? "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)" : "transparent",
              color: tier === 1 ? "#1e1008" : "#94a3b8",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: isSpinning ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            LEVEL 1: FRESHERS 1ST ROULETTE
          </button>

          <button
            onClick={() => {
              if (isSpinning) return;
              setTier(2);
              soundFX.playWheelTick(1.2);
            }}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "5px",
              border: "none",
              background: tier === 2 ? "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)" : "transparent",
              color: tier === 2 ? "#ffffff" : "#94a3b8",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: isSpinning ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            LEVELS 2 & 3: 2ND YEAR+ 2ND ROULETTE
          </button>
        </div>
      </div>

      {/* Dual Wheel Arena */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
          alignItems: "center",
          marginBottom: "3.5rem",
        }}
        className="wheel-grid"
      >
        {/* Wheel 1: Problem Statement Wheel */}
        <div
          className="pirate-panel"
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#fbbf24",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            <Compass size={14} />
            ROULETTE 1 • PROBLEM SELECTION
          </div>
          <h3
            className="font-pirate"
            style={{ fontSize: "2rem", color: "#fef08a", marginBottom: "1.5rem" }}
          >
            WHAT WILL YOU BUILD?
          </h3>

          {/* SVG Wheel 1 */}
          <div style={{ position: "relative", width: "290px", height: "290px" }}>
            {/* Top Indicator Needle */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid #ef4444",
                zIndex: 20,
                filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.8))",
              }}
            />

            <svg
              viewBox="0 0 300 300"
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${problemAngle}deg)`,
                transition: isSpinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.2, 1)" : "none",
                filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.8))",
              }}
            >
              {/* Outer Golden Wooden Rim */}
              <circle cx="150" cy="150" r="146" fill="#451a03" stroke="#f59e0b" strokeWidth="6" />
              <circle cx="150" cy="150" r="136" fill="#1e1008" stroke="#78350f" strokeWidth="3" />

              {/* Slices */}
              {problemPool.map((prob, idx) => {
                const total = problemPool.length;
                const angle = 360 / total;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;

                const x1 = 150 + 130 * Math.cos(startRad);
                const y1 = 150 + 130 * Math.sin(startRad);
                const x2 = 150 + 130 * Math.cos(endRad);
                const y2 = 150 + 130 * Math.sin(endRad);

                const colors = idx % 2 === 0 ? ["#7f1d1d", "#991b1b"] : ["#1e293b", "#0f172a"];
                const textAngle = startAngle + angle / 2;

                return (
                  <g key={prob.id}>
                    <path
                      d={`M150,150 L${x1},${y1} A130,130 0 0,1 ${x2},${y2} Z`}
                      fill={colors[0]}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text
                      x="150"
                      y="40"
                      transform={`rotate(${textAngle}, 150, 150)`}
                      fill="#fef08a"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                      textAnchor="middle"
                      letterSpacing="0.5px"
                    >
                      {prob.domain.length > 11 ? prob.domain.slice(0, 10) + ".." : prob.domain}
                    </text>
                  </g>
                );
              })}

              {/* Center Pirate Hub */}
              <circle cx="150" cy="150" r="32" fill="#78350f" stroke="#fbbf24" strokeWidth="4" />
              <circle cx="150" cy="150" r="22" fill="#b91c1c" />
              <text
                x="150"
                y="156"
                fill="#fef08a"
                fontSize="18"
                fontFamily="Pirata One, cursive"
                textAnchor="middle"
              >
                FR
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: "1.2rem",
              fontSize: "0.85rem",
              color: "#94a3b8",
            }}
          >
            {problemPool.length} Pirate Problem Statements in Pool
          </div>
        </div>

        {/* Wheel 2: Challenge / Special Condition Wheel */}
        <div
          className="pirate-panel"
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#f87171",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            <Sparkles size={14} />
            ROULETTE 2 • SPECIAL TWIST
          </div>
          <h3
            className="font-pirate"
            style={{ fontSize: "2rem", color: "#fef08a", marginBottom: "1.5rem" }}
          >
            GRAND LINE CONSTRAINT
          </h3>

          {/* SVG Wheel 2 */}
          <div style={{ position: "relative", width: "290px", height: "290px" }}>
            {/* Top Indicator Needle */}
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "24px solid #fbbf24",
                zIndex: 20,
                filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.8))",
              }}
            />

            <svg
              viewBox="0 0 300 300"
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${conditionAngle}deg)`,
                transition: isSpinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.2, 1)" : "none",
                filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.8))",
              }}
            >
              {/* Outer Golden Rim */}
              <circle cx="150" cy="150" r="146" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="6" />
              <circle cx="150" cy="150" r="136" fill="#0f172a" stroke="#0369a1" strokeWidth="3" />

              {/* Slices */}
              {conditionPool.map((cond, idx) => {
                const total = conditionPool.length;
                const angle = 360 / total;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const startRad = ((startAngle - 90) * Math.PI) / 180;
                const endRad = ((endAngle - 90) * Math.PI) / 180;

                const x1 = 150 + 130 * Math.cos(startRad);
                const y1 = 150 + 130 * Math.sin(startRad);
                const x2 = 150 + 130 * Math.cos(endRad);
                const y2 = 150 + 130 * Math.sin(endRad);

                const colors = idx % 2 === 0 ? ["#0369a1", "#0284c7"] : ["#4c1d95", "#6b21a8"];
                const textAngle = startAngle + angle / 2;

                return (
                  <g key={cond.id}>
                    <path
                      d={`M150,150 L${x1},${y1} A130,130 0 0,1 ${x2},${y2} Z`}
                      fill={colors[0]}
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                    <text
                      x="150"
                      y="40"
                      transform={`rotate(${textAngle}, 150, 150)`}
                      fill="#fef08a"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                      textAnchor="middle"
                      letterSpacing="0.5px"
                    >
                      {cond.badge}
                    </text>
                  </g>
                );
              })}

              {/* Center Wheel Hub */}
              <circle cx="150" cy="150" r="32" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="4" />
              <circle cx="150" cy="150" r="22" fill="#1e293b" />
              <text
                x="150"
                y="156"
                fill="#38bdf8"
                fontSize="18"
                fontFamily="Pirata One, cursive"
                textAnchor="middle"
              >
                ★
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: "1.2rem",
              fontSize: "0.85rem",
              color: "#94a3b8",
            }}
          >
            6 Grand Line Special Conditions
          </div>
        </div>
      </div>

      {/* Main Spin Action Control Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
          marginBottom: "3.5rem",
        }}
      >
        <button
          onClick={spinRoulette}
          disabled={isSpinning}
          className="btn-pirate-gold"
          style={{
            padding: "1.1rem 2.8rem",
            fontSize: "1.25rem",
            letterSpacing: "2px",
            boxShadow: "0 0 35px rgba(245, 158, 11, 0.6)",
            opacity: isSpinning ? 0.7 : 1,
            cursor: isSpinning ? "not-allowed" : "pointer",
          }}
        >
          <RotateCw
            size={24}
            className={isSpinning ? "animate-spin-slow" : ""}
            style={{ marginRight: "0.5rem" }}
          />
          {isSpinning
            ? "DESTINY IN MOTION..."
            : isLocked && !reRollUnlocked
            ? "OFFICIAL SPIN COMPLETED (LOCKED)"
            : isLocked && reRollUnlocked
            ? "ACTIVATE OFFICIAL RE-ROLL SPIN!"
            : "SPIN THE DUAL ROULETTE WHEELS!"}
        </button>

        {/* Lock Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.85rem",
            color: isLocked ? "#fca5a5" : "#86efac",
            fontWeight: 600,
          }}
        >
          {isLocked ? (
            <>
              <Lock size={16} color="#ef4444" />
              <span>
                RULE APPLIED: ONE OFFICIAL SPIN ONLY. RESULT LOCKED TO YOUR CREW.
              </span>
            </>
          ) : (
            <>
              <Unlock size={16} color="#22c55e" />
              <span>READY FOR OFFICIAL INITIAL SPIN</span>
            </>
          )}
        </div>

        {/* Penalty warning if clicked while locked */}
        {penaltyWarning && (
          <div
            style={{
              maxWidth: "600px",
              background: "rgba(185, 28, 28, 0.25)",
              border: "2px solid #ef4444",
              borderRadius: "6px",
              padding: "1rem 1.4rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <AlertTriangle size={28} color="#ef4444" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.9rem", color: "#fca5a5", lineHeight: 1.5, textAlign: "left" }}>
              <strong>ATTENTION PIRATE:</strong> {EVENT_DATA.rouletteRules.penaltyWarning}
              <br />
              <a
                href="#mini-game"
                style={{ color: "#fbbf24", fontWeight: 700, textDecoration: "underline" }}
              >
                Play Roger's Mini-Game to earn your official Re-Roll Token!
              </a>
            </div>
          </div>
        )}

        {/* Re-Roll Token Input Box */}
        {isLocked && !reRollUnlocked && (
          <div
            className="pirate-panel"
            style={{
              padding: "1.2rem 1.6rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "580px",
              width: "100%",
            }}
          >
            <ShieldCheck size={24} color="#fbbf24" />
            <div style={{ flex: 1, minWidth: "220px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fef08a" }}>
                HAVE A RE-ROLL TOKEN?
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Enter the code received from Roger&apos;s Mini-Game challenge.
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
              <input
                type="text"
                placeholder="e.g. ROGER-TOKEN-7749"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                style={{
                  background: "rgba(7, 11, 19, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.5)",
                  color: "#fbbf24",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                  flex: 1,
                }}
              />
              <button
                onClick={redeemToken}
                className="btn-pirate-crimson"
                style={{ padding: "0.6rem 1.1rem", fontSize: "0.8rem" }}
              >
                Apply Token
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assigned Result Spotlight (PDF Page 5 & 8 Format) */}
      {assignedProblem && assignedCondition && (
        <div
          className="parchment-card"
          style={{
            padding: "2.5rem",
            maxWidth: "960px",
            margin: "0 auto",
            border: "4px solid #b45309",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85)",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              borderBottom: "3px double var(--parchment-border)",
              paddingBottom: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#991b1b",
                  letterSpacing: "1px",
                }}
              >
                OFFICIAL PROBLEM STATEMENT CARD • GRAND LINE ALLOCATION
              </div>
              <h3
                className="font-pirate"
                style={{ fontSize: "2.4rem", color: "#2d1810", lineHeight: 1.1 }}
              >
                {assignedProblem.id}: {assignedProblem.title}
              </h3>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <span
                style={{
                  background: "#78350f",
                  color: "#fef08a",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "4px",
                }}
              >
                {assignedProblem.domain}
              </span>
              <span
                style={{
                  background: "#b91c1c",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "4px",
                }}
              >
                {assignedProblem.difficulty}
              </span>
            </div>
          </div>

          {/* Random Constraint Banner (Roulette 2 result) */}
          <div
            style={{
              background: "linear-gradient(90deg, #1e1b4b 0%, #0c4a6e 100%)",
              color: "#f8fafc",
              padding: "1rem 1.4rem",
              borderRadius: "6px",
              border: "2px solid #38bdf8",
              marginBottom: "1.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.8rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#38bdf8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                ⚡ ROULETTE 2 SPECIAL TWIST CONDITION:
              </div>
              <div
                className="font-heading"
                style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fef08a" }}
              >
                {assignedCondition.name}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
                {assignedCondition.desc}
              </div>
            </div>
            <span
              style={{
                background: "#0284c7",
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.75rem",
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
              }}
            >
              MANDATORY REQUIREMENT
            </span>
          </div>

          {/* Problem Description */}
          <div style={{ marginBottom: "1.6rem" }}>
            <h4
              className="font-heading"
              style={{ fontSize: "1rem", color: "#78350f", marginBottom: "0.4rem" }}
            >
              PROBLEM STATEMENT:
            </h4>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "#27150a" }}>
              {assignedProblem.problem}
            </p>
          </div>

          {/* Two-Column Requirements & Bonus Features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1.5rem",
              marginBottom: "1.8rem",
            }}
            className="req-grid"
          >
            {/* Core Requirements */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--parchment-border)",
                borderRadius: "4px",
                padding: "1.2rem",
              }}
            >
              <h5
                className="font-heading"
                style={{
                  fontSize: "0.92rem",
                  color: "#991b1b",
                  marginBottom: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <CheckCircle2 size={16} color="#991b1b" />
                CORE REQUIREMENTS (APPLICATION MUST INCLUDE):
              </h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {assignedProblem.requirements.map((req, idx) => (
                  <li
                    key={idx}
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

            {/* Bonus Features */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--parchment-border)",
                borderRadius: "4px",
                padding: "1.2rem",
              }}
            >
              <h5
                className="font-heading"
                style={{
                  fontSize: "0.92rem",
                  color: "#15803d",
                  marginBottom: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Sparkles size={16} color="#15803d" />
                BONUS POINTS (TEAMS CAN IMPLEMENT):
              </h5>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {assignedProblem.bonus.map((b, idx) => (
                  <li
                    key={idx}
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
          </div>

          {/* Footer of Card */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              borderTop: "1px dashed var(--parchment-border)",
              paddingTop: "1rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#78350f" }}>
              Grand Line Bounty: <strong>{assignedProblem.bounty}</strong>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              style={{
                background: "transparent",
                border: "1px solid #78350f",
                color: "#78350f",
                padding: "0.4rem 0.9rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              Print / Save Assignment Slip
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 860px) {
          .wheel-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .req-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
