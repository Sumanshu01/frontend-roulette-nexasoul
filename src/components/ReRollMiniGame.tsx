"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "@/utils/soundEffects";
import {
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  ShieldAlert,
  Mail,
  Copy,
  Check,
  Award,
  Flame,
  ArrowRight,
} from "lucide-react";

interface GameItem {
  id: number;
  type: "coin" | "chest" | "meat" | "hat" | "bomb";
  x: number;
  y: number;
  points: number;
  icon: string;
}

export default function ReRollMiniGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [items, setItems] = useState<GameItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TARGET_SCORE = 100;

  // Check if token already exists in localStorage
  useEffect(() => {
    try {
      const existing = localStorage.getItem("roger_reroll_token");
      if (existing) {
        setGeneratedToken(existing);
      }
    } catch {
      // storage fallback
    }
  }, []);

  // Start the mini game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(25);
    setGameOver(false);
    setIsWon(false);
    setItems([]);
    soundFX.playCannon();

    // Timer countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawning items
    gameLoopRef.current = setInterval(() => {
      spawnItem();
    }, 600);
  };

  const spawnItem = () => {
    const types: GameItem["type"][] = ["coin", "coin", "chest", "meat", "hat", "bomb", "bomb"];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let points = 10;
    let icon = "🪙";

    if (chosenType === "coin") {
      points = 15;
      icon = "🪙";
    } else if (chosenType === "chest") {
      points = 25;
      icon = "💎";
    } else if (chosenType === "meat") {
      points = 20;
      icon = "🍖";
    } else if (chosenType === "hat") {
      points = 30;
      icon = "👒";
    } else if (chosenType === "bomb") {
      points = -30;
      icon = "💣";
    }

    const newItem: GameItem = {
      id: Date.now() + Math.random(),
      type: chosenType,
      x: 8 + Math.random() * 84, // percentage
      y: 10 + Math.random() * 75,
      points,
      icon,
    };

    setItems((prev) => [...prev.slice(-8), newItem]);
  };

  const handleItemClick = (item: GameItem) => {
    if (!isPlaying) return;

    if (item.type === "bomb") {
      soundFX.playCannon();
      setScore((s) => Math.max(0, s + item.points));
    } else {
      soundFX.playCoin();
      setScore((s) => s + item.points);
    }

    // Remove tapped item
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setIsPlaying(false);
    setGameOver(true);

    setScore((finalScore) => {
      if (finalScore >= TARGET_SCORE) {
        setIsWon(true);
        soundFX.playTriumph();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Generate Roger Token
        const randomHex = Math.floor(1000 + Math.random() * 9000);
        const token = `ROGER-RE-ROLL-${randomHex}`;
        setGeneratedToken(token);
        try {
          localStorage.setItem("roger_reroll_token", token);
        } catch {
          // storage fallback
        }
        setEmailModalOpen(true);
      } else {
        soundFX.playBuzzer();
      }
      return finalScore;
    });
  };

  const copyToken = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    soundFX.playCoin();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="mini-game"
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        maxWidth: "1280px",
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
            color: "#f87171",
            fontSize: "0.85rem",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          <Flame size={16} />
          OFFICIAL RE-ROLL TOKEN TRIAL • PDF PAGE 11
        </div>
        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            color: "#fef08a",
            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
            letterSpacing: "1px",
          }}
        >
          GOL D. ROGER&apos;S TREASURE TRIAL
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
          Need to spin the roulette again? Conquer the Pirate Reflex Trial by scoring <strong>{TARGET_SCORE}+ Points</strong> in 25 seconds to unlock your verified Re-Roll Token!
        </p>

        {/* Penalty Warning Callout */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
            background: "rgba(185, 28, 28, 0.25)",
            border: "1px solid #ef4444",
            borderRadius: "6px",
            padding: "0.6rem 1.2rem",
            marginTop: "1.2rem",
            color: "#fca5a5",
            fontSize: "0.85rem",
          }}
        >
          <ShieldAlert size={18} color="#ef4444" />
          <span>
            <strong>Jury Rule (PDF Page 12):</strong> If any team asks for a re-roll without having played and won the game, <strong>-5 Marks penalty</strong> will be imposed!
          </span>
        </div>
      </div>

      {/* Main Mini-Game Canvas Box */}
      <div
        className="parchment-card"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "2rem",
          border: "4px solid #b45309",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Game Stats Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid var(--parchment-border)",
            paddingBottom: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 700 }}>
              CURRENT PIRATE SCORE
            </div>
            <div
              className="font-heading"
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: score >= TARGET_SCORE ? "#15803d" : "#991b1b",
              }}
            >
              {score} <span style={{ fontSize: "1rem", color: "#78350f" }}>/ {TARGET_SCORE} PTS</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 700, textAlign: "right" }}>
              TIME REMAINING
            </div>
            <div
              className="font-heading"
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: timeLeft <= 5 ? "#dc2626" : "#1e1008",
                textAlign: "right",
              }}
            >
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Interactive Play Arena */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "360px",
            background: "radial-gradient(circle, #fcf6ea 0%, #e6d3a8 100%)",
            borderRadius: "6px",
            border: "2px dashed #b45309",
            overflow: "hidden",
            boxShadow: "inset 0 0 25px rgba(120, 53, 15, 0.2)",
          }}
        >
          {/* Start / Idle Screen */}
          {!isPlaying && !gameOver && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(251, 246, 234, 0.85)",
                backdropFilter: "blur(2px)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <h3
                className="font-pirate"
                style={{ fontSize: "2.4rem", color: "#78350f", marginBottom: "0.5rem" }}
              >
                PROVE YOUR REFLEXES TO GOL D. ROGER
              </h3>
              <p
                style={{
                  maxWidth: "480px",
                  fontSize: "0.95rem",
                  color: "#451a03",
                  marginBottom: "1.5rem",
                  lineHeight: 1.5,
                }}
              >
                Tap on gold coins 🪙 (+15), jewels 💎 (+25), meat 🍖 (+20), and straw hats 👒 (+30). Avoid the Marine cannonballs 💣 (-30)! Reach {TARGET_SCORE} points to claim your Re-Roll Token!
              </p>
              <button
                onClick={startGame}
                className="btn-pirate-crimson"
                style={{ fontSize: "1.1rem", padding: "0.9rem 2.2rem" }}
              >
                <Play size={20} />
                BEGIN PIRATE TRIAL
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(251, 246, 234, 0.92)",
                backdropFilter: "blur(3px)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              {isWon ? (
                <>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "#15803d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.8rem",
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
                    }}
                  >
                    <Trophy size={36} color="#fff" />
                  </div>
                  <h3
                    className="font-pirate"
                    style={{ fontSize: "2.6rem", color: "#14532d", marginBottom: "0.4rem" }}
                  >
                    VICTORY! PIRATE RE-ROLL UNLOCKED!
                  </h3>
                  <p style={{ color: "#166534", marginBottom: "1.2rem", fontWeight: 600 }}>
                    You scored {score} points! Roger has dispatched your verified Re-Roll Token.
                  </p>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setEmailModalOpen(true)}
                      className="btn-pirate-gold"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <Mail size={18} />
                      View Official Token Dispatch
                    </button>
                    <button
                      onClick={startGame}
                      className="btn-pirate-secondary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <RotateCcw size={16} />
                      Play Again
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    className="font-pirate"
                    style={{ fontSize: "2.5rem", color: "#991b1b", marginBottom: "0.4rem" }}
                  >
                    TRIAL FAILED: {score} / {TARGET_SCORE} PTS
                  </h3>
                  <p
                    style={{
                      color: "#7f1d1d",
                      marginBottom: "1.2rem",
                      maxWidth: "420px",
                      lineHeight: 1.5,
                    }}
                  >
                    The Grand Line waters are unforgiving! You need {TARGET_SCORE} points to earn Roger&apos;s blessing. Try again!
                  </p>
                  <button
                    onClick={startGame}
                    className="btn-pirate-crimson"
                    style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}
                  >
                    <RotateCcw size={18} />
                    RETRY TRIAL
                  </button>
                </>
              )}
            </div>
          )}

          {/* Falling Items during Gameplay */}
          {isPlaying &&
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  position: "absolute",
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: item.type === "bomb" ? "2.6rem" : "2.4rem",
                  transition: "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
                  userSelect: "none",
                  animation: "floatShip 2s ease-in-out infinite",
                }}
                className="game-item-btn"
              >
                {item.icon}
              </button>
            ))}
        </div>

        {/* Footer info & existing token shortcut */}
        <div
          style={{
            marginTop: "1.5rem",
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
            {generatedToken ? (
              <span>
                Active Token Code: <strong style={{ color: "#991b1b" }}>{generatedToken}</strong>
              </span>
            ) : (
              <span>No Token earned yet. Play the trial above to earn one.</span>
            )}
          </div>

          {generatedToken && (
            <a
              href="#roulette"
              style={{
                color: "#991b1b",
                fontWeight: 700,
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                textDecoration: "none",
              }}
              onClick={() => soundFX.playWheelTick(1.4)}
            >
              Jump to Roulette & Apply Token
              <ArrowRight size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Simulated Email / Den Den Mushi Dispatch Modal (PDF Page 11 Requirement) */}
      {emailModalOpen && generatedToken && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setEmailModalOpen(false)}
        >
          <div
            className="parchment-card"
            style={{
              maxWidth: "580px",
              width: "100%",
              padding: "2.2rem",
              border: "4px solid #b45309",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid var(--parchment-border)",
                paddingBottom: "0.8rem",
                marginBottom: "1.2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={22} color="#991b1b" />
                <span className="font-heading" style={{ fontSize: "1rem", color: "#78350f", fontWeight: 800 }}>
                  OFFICIAL TOKEN DISPATCH • PDF SPECIFICATION
                </span>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#78350f",
                }}
              >
                ✕
              </button>
            </div>

            {/* Email Header Details */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--parchment-border)",
                padding: "0.8rem 1rem",
                borderRadius: "4px",
                marginBottom: "1.2rem",
                fontSize: "0.85rem",
                color: "#451a03",
                lineHeight: 1.6,
              }}
            >
              <div>
                <strong>From:</strong> high-admiral-council@nexasoul.grandline
              </div>
              <div>
                <strong>To:</strong> Registered Pirate Captain
              </div>
              <div>
                <strong>Subject:</strong> [CONFIRMED] Official Frontend Roulette Re-Roll Token Issued
              </div>
            </div>

            {/* Email Body */}
            <p style={{ fontSize: "0.95rem", color: "#27150a", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Greetings Pirate Crew! You have demonstrated exceptional swiftness and reflexes in Gol D. Roger&apos;s Loguetown trial. As promised in the Grand Line Charter (PDF Page 11), your crew has been granted strictly <strong>ONE Re-Roll Token</strong>.
            </p>

            {/* Token Highlight Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "2px dashed #b45309",
                borderRadius: "6px",
                padding: "1rem",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#78350f", fontWeight: 800, textTransform: "uppercase" }}>
                OFFICIAL RE-ROLL TOKEN CODE
              </div>
              <div
                className="font-heading"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#991b1b",
                  letterSpacing: "3px",
                  margin: "0.4rem 0",
                }}
              >
                {generatedToken}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#92400e" }}>
                Valid for 1 spin re-allocation • Zero penalty assessed
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <button
                onClick={copyToken}
                className="btn-pirate-gold"
                style={{ flex: 1, fontSize: "0.9rem" }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "TOKEN COPIED!" : "COPY TOKEN CODE"}
              </button>

              <a
                href="#roulette"
                onClick={() => setEmailModalOpen(false)}
                className="btn-pirate-crimson"
                style={{ flex: 1, fontSize: "0.9rem", textAlign: "center" }}
              >
                USE ON ROULETTE NOW
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .game-item-btn:hover {
          transform: translate(-50%, -50%) scale(1.3) !important;
        }
      `}</style>
    </section>
  );
}
