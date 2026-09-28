"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "@/utils/soundEffects";
import {
  DEVIL_FRUIT_POWERS,
  HAKI_POWERS,
  DevilFruitPower,
  HakiPower,
  MechanicPower,
} from "@/data/mechanics";
import {
  Skull,
  Zap,
  Lock,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Award,
  Ship,
  LogIn,
} from "lucide-react";

interface IMechanicCrewData {
  _id?: string;
  teamId: string;
  teamName: string;
  division?: string;
  flag?: string;
  captainName?: string;
  captainEmail?: string;
  assignedProblemTitle?: string | null;
  assignedProblemId?: string | null;
  assignedProblemNumber?: number | null;
  hasSpunMechanic?: boolean;
  assignedMechanicType?: "Devil Fruit" | "Haki" | null;
  assignedMechanicName?: string | null;
  assignedMechanicDetails?: MechanicPower | null;
  mechanicAssignedAt?: string | null;
}

export default function MechanicsRoulette() {
  // Login / Auth State
  const [teamNameInput, setTeamNameInput] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeCrew, setActiveCrew] = useState<IMechanicCrewData | null>(null);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPhase, setSpinPhase] = useState<"idle" | "spinning_wheel1" | "spinning_wheel2" | "done">("idle");
  const [wheel1Rotation, setWheel1Rotation] = useState(0);
  const [wheel2Rotation, setWheel2Rotation] = useState(0);

  // Displayed Category for Wheel 2 (Devil Fruit or Haki)
  const [activeCategory, setActiveCategory] = useState<"Devil Fruit" | "Haki">("Devil Fruit");
  const [assignedMechanic, setAssignedMechanic] = useState<MechanicPower | null>(null);
  const [spinError, setSpinError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for shared crew session on mount
  useEffect(() => {
    try {
      const savedCrewStr = sessionStorage.getItem("roulette_crew_session");
      if (savedCrewStr) {
        const parsed = JSON.parse(savedCrewStr);
        if (parsed.teamName) {
          fetchFreshCrewData(parsed.teamName);
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  const fetchFreshCrewData = async (name: string) => {
    try {
      const res = await fetch("/api/roulette/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: name }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const crew: IMechanicCrewData = data.data;
        setActiveCrew(crew);
        if (crew.hasSpunMechanic && crew.assignedMechanicName) {
          const all = [...DEVIL_FRUIT_POWERS, ...HAKI_POWERS];
          const matched = all.find((m) => m.name === crew.assignedMechanicName) || crew.assignedMechanicDetails;
          if (matched) {
            setAssignedMechanic(matched);
            setActiveCategory(matched.type);
            positionWheelsToResult(matched.type, matched.name);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load crew mechanic status:", e);
    }
  };

  const positionWheelsToResult = (type: "Devil Fruit" | "Haki", name: string) => {
    if (type === "Devil Fruit") {
      setWheel1Rotation(270);
    } else {
      setWheel1Rotation(90);
    }

    const pool = type === "Devil Fruit" ? DEVIL_FRUIT_POWERS : HAKI_POWERS;
    const idx = pool.findIndex((p) => p.name === name);
    if (idx !== -1) {
      const sliceAngle = 90;
      const centerAngle = idx * sliceAngle + sliceAngle / 2;
      setWheel2Rotation((360 - centerAngle + 360) % 360);
    }
  };

  // Login handler
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

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Crew authentication failed.");
        soundFX.playBuzzer();
        return;
      }

      const crew: IMechanicCrewData = data.data;
      setActiveCrew(crew);
      setIsTrialMode(false);
      soundFX.playCoin();

      // Sync with shared session
      sessionStorage.setItem("roulette_crew_session", JSON.stringify(crew));

      if (crew.hasSpunMechanic && crew.assignedMechanicName) {
        const all = [...DEVIL_FRUIT_POWERS, ...HAKI_POWERS];
        const matched = all.find((m) => m.name === crew.assignedMechanicName) || crew.assignedMechanicDetails;
        if (matched) {
          setAssignedMechanic(matched);
          setActiveCategory(matched.type);
          positionWheelsToResult(matched.type, matched.name);
        }
      }
    } catch {
      setAuthError("Network error while verifying pirate crew.");
      soundFX.playBuzzer();
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setActiveCrew(null);
    setAssignedMechanic(null);
    setSpinError(null);
    setWheel1Rotation(0);
    setWheel2Rotation(0);
    setSpinPhase("idle");
    setIsTrialMode(false);
    soundFX.playWheelTick(1);
  };

  // Spin sequence: Wheel 1 then Wheel 2
  const handleSpinWheels = async (isTrial: boolean = false) => {
    if (isSpinning) return;

    if (!isTrial && !activeCrew) {
      setAuthError("Please authenticate with your crew name to spin the official roulette.");
      soundFX.playBuzzer();
      return;
    }

    if (!isTrial && activeCrew && activeCrew.hasSpunMechanic) {
      soundFX.playBuzzer();
      setSpinError("Your crew has already awakened their power! Fate is sealed.");
      return;
    }

    setSpinError(null);
    setIsSpinning(true);
    setSpinPhase("spinning_wheel1");
    if (isTrial) setIsTrialMode(true);

    // 1. Pick Destiny (Devil Fruit or Haki) and specific Power
    const chosenType: "Devil Fruit" | "Haki" = Math.random() < 0.5 ? "Devil Fruit" : "Haki";
    const powerPool = chosenType === "Devil Fruit" ? DEVIL_FRUIT_POWERS : HAKI_POWERS;
    const chosenPowerIdx = Math.floor(Math.random() * powerPool.length);
    const chosenPower = powerPool[chosenPowerIdx];

    // Audio SFX: Cannon shot to start fate
    soundFX.playCannon();

    // Wheel 1 Math: 2 slices (180 deg each).
    // Slice 0 (Devil Fruit): 0° to 180° -> Center 90°. Target angle to reach top pointer is (360 - 90) = 270°.
    // Slice 1 (Haki): 180° to 360° -> Center 270°. Target angle to reach top pointer is (360 - 270) = 90°.
    const w1SliceCenter = chosenType === "Devil Fruit" ? 90 : 270;
    const w1TargetStop = (360 - w1SliceCenter + 360) % 360;
    const w1Spins = 360 * (5 + Math.floor(Math.random() * 2));
    const w1FinalRotation = wheel1Rotation + w1Spins + ((w1TargetStop - (wheel1Rotation % 360) + 360) % 360);

    setWheel1Rotation(w1FinalRotation);

    // Audio ticks during Wheel 1
    let tickCount1 = 0;
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = setInterval(() => {
      tickCount1++;
      if (tickCount1 < 25) {
        soundFX.playWheelTick(1 + (tickCount1 % 5) * 0.1);
      }
    }, 140);

    // After 4.2 seconds, Wheel 1 finishes!
    setTimeout(() => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      soundFX.playCannon();
      setActiveCategory(chosenType);
      setSpinPhase("spinning_wheel2");

      // Short pause then trigger Wheel 2
      setTimeout(() => {
        // Wheel 2 Math: 4 slices (90 deg each).
        const w2SliceCenter = chosenPowerIdx * 90 + 45;
        const w2TargetStop = (360 - w2SliceCenter + 360) % 360;
        const w2Spins = 360 * (6 + Math.floor(Math.random() * 2));
        const w2FinalRotation = wheel2Rotation + w2Spins + ((w2TargetStop - (wheel2Rotation % 360) + 360) % 360);

        setWheel2Rotation(w2FinalRotation);

        // Audio ticks during Wheel 2
        let tickCount2 = 0;
        tickIntervalRef.current = setInterval(() => {
          tickCount2++;
          if (tickCount2 < 30) {
            soundFX.playWheelTick(1.2 + (tickCount2 % 4) * 0.1);
          }
        }, 130);

        // Persist to DB if not trial mode
        if (!isTrial && activeCrew) {
          fetch("/api/roulette/mechanic-spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teamId: activeCrew.teamId,
              teamName: activeCrew.teamName,
              mechanicType: chosenType,
              mechanicName: chosenPower.name,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              if (!result.success && !result.alreadySpun) {
                console.error("Mechanic persistence error:", result.error);
              }
            })
            .catch((err) => console.error("API error:", err));
        }

        // After 5.5 seconds, Wheel 2 lands!
        setTimeout(() => {
          if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
          setIsSpinning(false);
          setSpinPhase("done");
          setAssignedMechanic(chosenPower);

          if (!isTrial && activeCrew) {
            const updatedCrew: IMechanicCrewData = {
              ...activeCrew,
              hasSpunMechanic: true,
              assignedMechanicType: chosenPower.type,
              assignedMechanicName: chosenPower.name,
              assignedMechanicDetails: chosenPower,
              mechanicAssignedAt: new Date().toISOString(),
            };
            setActiveCrew(updatedCrew);
            sessionStorage.setItem("roulette_crew_session", JSON.stringify(updatedCrew));
          }

          soundFX.playTriumph();
          setTimeout(() => soundFX.playCannon(), 300);

          confetti({
            particleCount: 160,
            spread: 85,
            origin: { y: 0.6 },
            colors: chosenType === "Devil Fruit"
              ? ["#9333ea", "#ef4444", "#fbbf24", "#ffffff", "#c084fc"]
              : ["#0284c7", "#fbbf24", "#10b981", "#ffffff", "#38bdf8"],
          });
        }, 5500);
      }, 500);
    }, 4200);
  };

  const handleCopyResult = () => {
    if (!assignedMechanic) return;
    const text = `⚓ GRAND LINE AWAKENED POWER ASSIGNMENT ⚓
Crew: ${activeCrew?.teamName || "Trial Fleet"}
Captain: ${activeCrew?.captainName || "Leader"}
Awakened Path: ${assignedMechanic.type}
Power Name: ${assignedMechanic.name}
${
  assignedMechanic.type === "Devil Fruit"
    ? `Common Effect: ${(assignedMechanic as DevilFruitPower).commonEffect}
Benefit: ${(assignedMechanic as DevilFruitPower).benefit}
Disadvantage: ${(assignedMechanic as DevilFruitPower).disadvantage}`
    : `Challenge: ${(assignedMechanic as HakiPower).challenge}
Pass Condition: ${(assignedMechanic as HakiPower).passCondition}
Power: ${(assignedMechanic as HakiPower).power}`
}
Lore: ${assignedMechanic.lore}
Status: Officially Sealed on the Grand Line Ledger`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    soundFX.playCoin();
    setTimeout(() => setCopiedText(false), 2500);
  };

  const currentWheel2Pool =
    activeCategory === "Devil Fruit" ? DEVIL_FRUIT_POWERS : HAKI_POWERS;

  return (
    <section
      id="mechanics"
      style={{
        position: "relative",
        padding: "6.5rem 1.5rem",
        background: "radial-gradient(ellipse at 50% 25%, rgba(76, 29, 149, 0.22) 0%, rgba(13, 21, 39, 0.95) 75%, #050814 100%)",
        borderTop: "2px solid rgba(147, 51, 234, 0.35)",
        borderBottom: "2px solid rgba(245, 158, 11, 0.35)",
      }}
    >
      <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
        {/* SECTION HEADER */}
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
              background: "rgba(147, 51, 234, 0.2)",
              padding: "0.45rem 1.3rem",
              borderRadius: "999px",
              border: "1.5px solid rgba(147, 51, 234, 0.5)",
              boxShadow: "0 0 25px rgba(147, 51, 234, 0.35)",
            }}
          >
            <Zap size={16} color="#fbbf24" />
            <span>DEVIL FRUIT & HAKI PROTOCOL • DUAL ROULETTE</span>
            <Skull size={16} color="#f87171" />
          </div>

          <h2
            className="font-pirate"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "#fef08a",
              textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 0 35px rgba(147, 51, 234, 0.45)",
              letterSpacing: "1.5px",
              marginBottom: "0.9rem",
              lineHeight: 1.15,
            }}
          >
            DEVIL FRUIT + HAKI MECHANICS ROULETTE
          </h2>

          <p
            style={{
              maxWidth: "820px",
              margin: "0 auto",
              fontSize: "1.08rem",
              color: "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            Every pirate crew takes on a Hackathon Problem Statement <em>and</em> awakens an ancient power modifier.
            Enter your crew name to spin the <strong>Dual Roulettes</strong>:{" "}
            <strong style={{ color: "#c084fc" }}>Roulette 1</strong> chooses your path (Devil Fruit or Haki), and{" "}
            <strong style={{ color: "#38bdf8" }}>Roulette 2</strong> selects your 1 of 4 Awakened Powers!
          </p>
        </div>

        {/* CAPTAIN AUTHENTICATION / STATUS TERMINAL */}
        <div style={{ maxWidth: "860px", margin: "0 auto 3rem" }}>
          {!activeCrew ? (
            /* Unauthenticated: Sleek Pirate Verification Box */
            <div
              className="pirate-panel"
              style={{
                padding: "1.6rem 2rem",
                background: "rgba(13, 21, 39, 0.95)",
                border: "2px solid #b45309",
                borderRadius: "12px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.7), 0 0 25px rgba(245, 158, 11, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #7e22ce 0%, #3b0764 100%)",
                      border: "2px solid #fbbf24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    ☠️
                  </div>
                  <div>
                    <h3 className="font-pirate" style={{ fontSize: "1.35rem", color: "#fef08a", margin: 0, lineHeight: 1.2 }}>
                      ENTER PIRATE CREW NAME TO UNLOCK OFFICIAL SPIN
                    </h3>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      Strict rule: 1 official spin per crew recorded on Grand Line ledger.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSpinWheels(true)}
                  disabled={isSpinning}
                  style={{
                    background: "rgba(147, 51, 234, 0.15)",
                    border: "1px dashed #c084fc",
                    color: "#e9d5ff",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: isSpinning ? "not-allowed" : "pointer",
                  }}
                >
                  ⚡ Test Spin (Trial Mode)
                </button>
              </div>

              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 300px", position: "relative" }}>
                  <Ship
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
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="Enter exact Crew Name (e.g. Straw Hat Pirates, Heart Pirates)..."
                    disabled={isLoadingAuth || isSpinning}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem 0.8rem 2.6rem",
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      background: "rgba(10, 15, 29, 0.9)",
                      border: "2px solid rgba(245, 158, 11, 0.4)",
                      borderRadius: "6px",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoadingAuth || isSpinning}
                  className="btn-pirate-gold"
                  style={{
                    padding: "0.8rem 1.8rem",
                    fontSize: "1rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: isLoadingAuth || isSpinning ? "wait" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isLoadingAuth ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Verify & Unlock</span>
                    </>
                  )}
                </button>
              </form>

              {authError && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    background: "rgba(220, 38, 38, 0.2)",
                    border: "1px solid #ef4444",
                    borderRadius: "6px",
                    padding: "0.6rem 0.9rem",
                    color: "#fca5a5",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Authenticated: Crew Status Bar */
            <div
              className="pirate-panel"
              style={{
                padding: "1.2rem 1.8rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                background: "rgba(13, 21, 39, 0.95)",
                border: "2px solid #9333ea",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #7e22ce 0%, #3b0764 100%)",
                    border: "2px solid #fbbf24",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#c084fc", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                    AUTHENTICATED CREW ({activeCrew.teamId})
                  </div>
                  <div className="font-pirate" style={{ fontSize: "1.8rem", color: "#fef08a", lineHeight: 1.1 }}>
                    {activeCrew.teamName}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "0.2rem" }}>
                    Captain: <strong>{activeCrew.captainName || "Leader"}</strong>
                    {activeCrew.division && ` • ${activeCrew.division}`}
                    {activeCrew.assignedProblemTitle && (
                      <span style={{ marginLeft: "0.6rem", color: "#fbbf24" }}>
                        • Problem: <strong>{activeCrew.assignedProblemTitle}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                {activeCrew.hasSpunMechanic ? (
                  <div
                    style={{
                      background: "rgba(34, 197, 94, 0.2)",
                      border: "1px solid #22c55e",
                      color: "#86efac",
                      padding: "0.45rem 1rem",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Lock size={15} />
                    Fate Sealed (Power Awakened)
                  </div>
                ) : (
                  <div
                    style={{
                      background: "rgba(147, 51, 234, 0.25)",
                      border: "1px solid #c084fc",
                      color: "#fef08a",
                      padding: "0.45rem 1rem",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Sparkles size={15} color="#fbbf24" />
                    1 Official Spin Authorized
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
          )}
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

        {/* DUAL ROULETTE WHEELS ARENA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {/* WHEEL 1: THE DESTINY WHEEL (DEVIL FRUIT VS HAKI - 2 OPTIONS) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(10, 15, 29, 0.85)",
              border: "2px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "16px",
              padding: "2rem 1.2rem",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  color: "#fbbf24",
                  background: "rgba(245, 158, 11, 0.15)",
                  padding: "0.25rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                }}
              >
                ROULETTE 1 • 2 OPTIONS
              </span>
              <h3
                className="font-pirate"
                style={{
                  fontSize: "1.75rem",
                  color: "#fef08a",
                  marginTop: "0.5rem",
                  marginBottom: "0.2rem",
                }}
              >
                THE PATH OF DESTINY
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                Fate decides: Forbidden Devil Fruit or Pure Haki Willpower
              </p>
            </div>

            {/* WHEEL 1 SVG CONTAINER */}
            <div
              style={{
                position: "relative",
                width: "min(82vw, 360px)",
                height: "min(82vw, 360px)",
                margin: "0 auto",
              }}
            >
              {/* Pointer Needle at Top */}
              <div
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #fbbf24 30%, #b45309 90%)",
                    border: "2px solid #ffffff",
                    boxShadow: "0 0 12px #fbbf24",
                    marginBottom: "-3px",
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "13px solid transparent",
                    borderRight: "13px solid transparent",
                    borderTop: "28px solid #fbbf24",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
                  }}
                />
              </div>

              {/* ROTATING SVG WHEEL 1 */}
              <svg
                viewBox="0 0 400 400"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${wheel1Rotation}deg)`,
                  transition: spinPhase === "spinning_wheel1"
                    ? "transform 4.2s cubic-bezier(0.12, 0.98, 0.28, 1.0)"
                    : "transform 0.4s ease-out",
                  filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
                  borderRadius: "50%",
                }}
              >
                {/* Outer Rim */}
                <circle cx="200" cy="200" r="196" fill="#1c0d07" stroke="#d97706" strokeWidth="8" />
                <circle cx="200" cy="200" r="188" fill="#0b0f19" stroke="#78350f" strokeWidth="3" />

                {/* Slice 0: DEVIL FRUIT (0 to 180 deg) */}
                <path
                  d="M 200 200 L 200 15 A 185 185 0 0 1 200 385 Z"
                  fill="url(#devilFruitGradient)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />

                {/* Slice 1: HAKI (180 to 360 deg) */}
                <path
                  d="M 200 200 L 200 385 A 185 185 0 0 1 200 15 Z"
                  fill="url(#hakiGradient)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />

                <defs>
                  <linearGradient id="devilFruitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a044e" />
                    <stop offset="50%" stopColor="#7e22ce" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                  <linearGradient id="hakiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c4a6e" />
                    <stop offset="50%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>

                {/* Devil Fruit Text on Right Half */}
                <g transform="translate(200, 200) rotate(90) translate(0, -95)">
                  <text
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="21"
                    fontWeight="900"
                    fontFamily="'Cinzel Decorative', Georgia, serif"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                  >
                    ☠️ DEVIL FRUIT
                  </text>
                  <text
                    y="22"
                    textAnchor="middle"
                    fill="#f3e8ff"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1"
                  >
                    ANCIENT CURSE
                  </text>
                </g>

                {/* Haki Text on Left Half */}
                <g transform="translate(200, 200) rotate(270) translate(0, -95)">
                  <text
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="21"
                    fontWeight="900"
                    fontFamily="'Cinzel Decorative', Georgia, serif"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                  >
                    ⚡ HAKI WILL
                  </text>
                  <text
                    y="22"
                    textAnchor="middle"
                    fill="#e0f2fe"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1"
                  >
                    CONQUEROR&apos;S SPIRIT
                  </text>
                </g>

                {/* Center Hub */}
                <circle cx="200" cy="200" r="48" fill="#18181b" stroke="#fbbf24" strokeWidth="4" />
                <circle cx="200" cy="200" r="40" fill="#27272a" />
                <text x="200" y="208" textAnchor="middle" fill="#fbbf24" fontSize="24">
                  ⚖️
                </text>
              </svg>
            </div>

            {/* Status indicator for Wheel 1 */}
            <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.95rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  background: activeCategory === "Devil Fruit" ? "rgba(147, 51, 234, 0.25)" : "rgba(2, 132, 199, 0.25)",
                  border: `1px solid ${activeCategory === "Devil Fruit" ? "#c084fc" : "#38bdf8"}`,
                  color: "#fef08a",
                }}
              >
                {activeCategory === "Devil Fruit" ? "🍇 Destiny: DEVIL FRUIT" : "⚡ Destiny: HAKI"}
              </span>
            </div>
          </div>

          {/* WHEEL 2: THE AWAKENED POWER WHEEL (4 OPTIONS OF SELECTED CATEGORY) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(10, 15, 29, 0.85)",
              border: "2px solid rgba(147, 51, 234, 0.5)",
              borderRadius: "16px",
              padding: "2rem 1.2rem",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  color: "#c084fc",
                  background: "rgba(147, 51, 234, 0.15)",
                  padding: "0.25rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(147, 51, 234, 0.4)",
                }}
              >
                ROULETTE 2 • 4 POWERS OF {activeCategory.toUpperCase()}
              </span>
              <h3
                className="font-pirate"
                style={{
                  fontSize: "1.75rem",
                  color: "#fef08a",
                  marginTop: "0.5rem",
                  marginBottom: "0.2rem",
                }}
              >
                THE AWAKENED POWER
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                {activeCategory === "Devil Fruit"
                  ? "Overdrive, Future Sight, Mirror, or Risk-Risk"
                  : "Observation, Armament, Conqueror's, or Advanced Haki"}
              </p>
            </div>

            {/* WHEEL 2 SVG CONTAINER */}
            <div
              style={{
                position: "relative",
                width: "min(82vw, 360px)",
                height: "min(82vw, 360px)",
                margin: "0 auto",
              }}
            >
              {/* Pointer Needle at Top */}
              <div
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #ef4444 30%, #7f1d1d 90%)",
                    border: "2px solid #fbbf24",
                    boxShadow: "0 0 12px #ef4444",
                    marginBottom: "-3px",
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "13px solid transparent",
                    borderRight: "13px solid transparent",
                    borderTop: "28px solid #fbbf24",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
                  }}
                />
              </div>

              {/* ROTATING SVG WHEEL 2 (4 SLICES, 90 DEG EACH) */}
              <svg
                viewBox="0 0 400 400"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${wheel2Rotation}deg)`,
                  transition: spinPhase === "spinning_wheel2"
                    ? "transform 5.5s cubic-bezier(0.12, 0.98, 0.28, 1.0)"
                    : "transform 0.4s ease-out",
                  filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
                  borderRadius: "50%",
                }}
              >
                <circle cx="200" cy="200" r="196" fill="#1c0d07" stroke="#fbbf24" strokeWidth="8" />
                <circle cx="200" cy="200" r="188" fill="#0b0f19" stroke="#78350f" strokeWidth="3" />

                {/* 4 Slices */}
                {currentWheel2Pool.map((power, idx) => {
                  const sliceAngle = 90;
                  const startAngle = idx * sliceAngle;
                  const endAngle = (idx + 1) * sliceAngle;

                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;

                  const r = 185;
                  const x1 = 200 + r * Math.cos(startRad);
                  const y1 = 200 + r * Math.sin(startRad);
                  const x2 = 200 + r * Math.cos(endRad);
                  const y2 = 200 + r * Math.sin(endRad);

                  const midAngle = startAngle + sliceAngle / 2;

                  const sliceFillColors =
                    activeCategory === "Devil Fruit"
                      ? ["#991b1b", "#581c87", "#0e7490", "#b45309"]
                      : ["#065f46", "#334155", "#854d0e", "#9d174d"];

                  return (
                    <g key={power.id}>
                      <path
                        d={`M 200 200 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                        fill={sliceFillColors[idx % 4]}
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                      />

                      <g transform={`translate(200, 200) rotate(${midAngle}) translate(0, -95)`}>
                        <text
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="20"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                        >
                          {power.icon}
                        </text>
                        <text
                          y="20"
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="13"
                          fontWeight="800"
                          letterSpacing="0.5"
                          fontFamily="'Cinzel Decorative', Georgia, serif"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                        >
                          {power.name}
                        </text>
                        <text
                          y="34"
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="8.5"
                          fontWeight="700"
                        >
                          {activeCategory === "Devil Fruit"
                            ? (power as DevilFruitPower).benefit.slice(0, 18)
                            : (power as HakiPower).passCondition}
                        </text>
                      </g>
                    </g>
                  );
                })}

                <circle cx="200" cy="200" r="46" fill="#18181b" stroke="#fbbf24" strokeWidth="4" />
                <circle cx="200" cy="200" r="38" fill="#2e1065" />
                <text x="200" y="207" textAnchor="middle" fill="#fbbf24" fontSize="22">
                  👑
                </text>
              </svg>
            </div>

            {/* Quick Preview Toggle & Status */}
            <div style={{ marginTop: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setActiveCategory(activeCategory === "Devil Fruit" ? "Haki" : "Devil Fruit");
                  soundFX.playWheelTick(1.1);
                }}
                disabled={isSpinning}
                style={{
                  background: "rgba(147, 51, 234, 0.2)",
                  border: "1px solid rgba(147, 51, 234, 0.5)",
                  color: "#c084fc",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  cursor: isSpinning ? "not-allowed" : "pointer",
                }}
              >
                Switch Wheel 2 Preview ({activeCategory === "Devil Fruit" ? "Show Haki" : "Show Devil Fruit"})
              </button>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.95rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  color: "#fef08a",
                }}
              >
                {assignedMechanic ? `Awakened: ${assignedMechanic.name}` : "Ready for Awakening"}
              </span>
            </div>
          </div>
        </div>

        {/* MASTER SPIN ACTION BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          {activeCrew?.hasSpunMechanic ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(34, 197, 94, 0.15)",
                border: "2px solid #22c55e",
                padding: "0.9rem 2.2rem",
                borderRadius: "999px",
                color: "#86efac",
                fontSize: "1.05rem",
                fontWeight: 800,
              }}
            >
              <Lock size={20} />
              <span>Your Crew Has Awakened their Power! Fate is Officially Sealed.</span>
            </div>
          ) : (
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
              <button
                onClick={() => handleSpinWheels(false)}
                disabled={isSpinning || (!activeCrew && !isTrialMode)}
                className="btn-pirate-gold"
                style={{
                  padding: "1.2rem 3.2rem",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  borderRadius: "999px",
                  cursor: isSpinning ? "wait" : !activeCrew ? "not-allowed" : "pointer",
                  boxShadow: "0 0 45px rgba(147, 51, 234, 0.65), 0 10px 30px rgba(0,0,0,0.8)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  border: "3px solid #fbbf24",
                  opacity: !activeCrew ? 0.6 : isSpinning ? 0.8 : 1,
                  transform: isSpinning ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                {isSpinning ? (
                  <>
                    <RotateCcw size={26} className="animate-spin" />
                    <span>
                      {spinPhase === "spinning_wheel1"
                        ? "WHEEL 1: CHOOSING DESTINY..."
                        : "WHEEL 2: AWAKENING POWER..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap size={26} color="#1c0d07" />
                    <span>AWAKEN POWER (SPIN DUAL WHEELS)</span>
                    <Sparkles size={26} color="#1c0d07" />
                  </>
                )}
              </button>

              {!activeCrew && (
                <div style={{ fontSize: "0.85rem", color: "#fbbf24", fontWeight: 700 }}>
                  ↑ Enter and verify your Crew Name in the box above to enable official spin!
                </div>
              )}
            </div>
          )}
        </div>

        {/* AWAKENED POWER RESULT SCROLL (IF SPUN) */}
        {assignedMechanic && (
          <div
            style={{
              maxWidth: "880px",
              margin: "0 auto 4rem",
              animation: "fadeIn 0.6s ease-out",
            }}
          >
            <div
              className="parchment-card"
              style={{
                padding: "2.5rem 2rem",
                border: "3px solid #b45309",
                borderRadius: "14px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 50px rgba(147, 51, 234, 0.35)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: assignedMechanic.type === "Devil Fruit" ? "rgba(147, 51, 234, 0.2)" : "rgba(2, 132, 199, 0.2)",
                    border: `1.5px solid ${assignedMechanic.type === "Devil Fruit" ? "#9333ea" : "#0284c7"}`,
                    color: assignedMechanic.type === "Devil Fruit" ? "#7e22ce" : "#0369a1",
                    fontSize: "0.88rem",
                    fontWeight: 900,
                    padding: "0.35rem 0.9rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  <CheckCircle2 size={16} />
                  OFFICIAL GRAND LINE POWER AWAKENING
                </div>

                <div style={{ fontSize: "0.82rem", color: "#78350f", fontWeight: 700 }}>
                  {activeCrew?.mechanicAssignedAt
                    ? new Date(activeCrew.mechanicAssignedAt).toLocaleString()
                    : "Live Awakening Recorded"}
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontSize: "3.2rem", marginBottom: "0.4rem" }}>
                  {assignedMechanic.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    color: assignedMechanic.type === "Devil Fruit" ? "#7e22ce" : "#0369a1",
                    textTransform: "uppercase",
                  }}
                >
                  {assignedMechanic.type} Power Awakened
                </div>
                <h3
                  className="font-pirate"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                    color: "#78350f",
                    margin: "0.3rem 0 0.8rem",
                    lineHeight: 1.1,
                  }}
                >
                  {assignedMechanic.name}
                </h3>
                <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1rem", color: "#92400e", fontStyle: "italic", lineHeight: 1.6 }}>
                  &ldquo;{assignedMechanic.lore}&rdquo;
                </p>
              </div>

              {/* SPECIFICATION TABLE */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "2px solid #b45309",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 900,
                    color: "#78350f",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                    borderBottom: "1px solid rgba(180, 83, 9, 0.3)",
                    paddingBottom: "0.4rem",
                  }}
                >
                  ⚖️ Jury Evaluation Rules & Modifiers
                </h4>

                {assignedMechanic.type === "Devil Fruit" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
                    <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                        Common Effect
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginTop: "0.3rem" }}>
                        {(assignedMechanic as DevilFruitPower).commonEffect}
                      </div>
                    </div>

                    <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "6px", border: "1px solid #86efac" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
                        Benefit
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 900, color: "#15803d", marginTop: "0.3rem" }}>
                        {(assignedMechanic as DevilFruitPower).benefit}
                      </div>
                    </div>

                    <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: "6px", border: "1px solid #fca5a5" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#991b1b", textTransform: "uppercase" }}>
                        Disadvantage / Constraint
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#b91c1c", marginTop: "0.3rem" }}>
                        {(assignedMechanic as DevilFruitPower).disadvantage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
                    <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                        Challenge
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginTop: "0.3rem" }}>
                        {(assignedMechanic as HakiPower).challenge}
                      </div>
                    </div>

                    <div style={{ background: "#fefce8", padding: "1rem", borderRadius: "6px", border: "1px solid #fde047" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#854d0e", textTransform: "uppercase" }}>
                        Pass Condition
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 900, color: "#a16207", marginTop: "0.3rem" }}>
                        {(assignedMechanic as HakiPower).passCondition}
                      </div>
                    </div>

                    <div style={{ background: "#f0f9ff", padding: "1rem", borderRadius: "6px", border: "1px solid #7dd3fc" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0369a1", textTransform: "uppercase" }}>
                        Awarded Power
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 900, color: "#0284c7", marginTop: "0.3rem" }}>
                        {(assignedMechanic as HakiPower).power}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  borderTop: "1px dashed var(--parchment-border)",
                  paddingTop: "1.2rem",
                }}
              >
                <div style={{ fontSize: "0.88rem", color: "#78350f" }}>
                  Crew: <strong>{activeCrew?.teamName || "Trial Fleet"}</strong> • Captain: <strong>{activeCrew?.captainName || "Leader"}</strong>
                </div>

                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                  <button
                    onClick={handleCopyResult}
                    style={{
                      background: "#ffffff",
                      border: "2px solid #b45309",
                      color: "#78350f",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Copy size={15} />
                    <span>{copiedText ? "Copied to Ledger!" : "Copy Details"}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "#991b1b",
                      border: "2px solid #fbbf24",
                      color: "#fef08a",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Printer size={15} />
                    <span>Print Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8 ANCIENT POWERS MASTER REFERENCE SHOWCASE */}
        <div style={{ marginTop: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#fbbf24",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              <Award size={16} />
              <span>THE 8 ANCIENT MODIFIERS • COMPLETE SPECIFICATION</span>
            </div>
            <h3
              className="font-pirate"
              style={{
                fontSize: "2rem",
                color: "#fef08a",
                margin: 0,
              }}
            >
              ALL 4 DEVIL FRUITS & ALL 4 HAKI POWERS
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {/* DEVIL FRUIT COLUMN */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "2px solid rgba(147, 51, 234, 0.4)",
                borderRadius: "12px",
                padding: "1.8rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem", borderBottom: "1px solid rgba(147, 51, 234, 0.3)", paddingBottom: "0.8rem" }}>
                <span style={{ fontSize: "1.8rem" }}>🍇</span>
                <div>
                  <h4 className="font-pirate" style={{ fontSize: "1.5rem", color: "#c084fc", margin: 0, lineHeight: 1.1 }}>
                    4 Common Devil Fruit Powers
                  </h4>
                  <div style={{ fontSize: "0.78rem", color: "#e9d5ff" }}>Forbidden powers with massive benefits & mandatory constraints</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {DEVIL_FRUIT_POWERS.map((df) => (
                  <div
                    key={df.id}
                    style={{
                      background: "rgba(30, 41, 59, 0.6)",
                      border: "1px solid rgba(147, 51, 234, 0.3)",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ color: "#fef08a", fontSize: "1.05rem" }}>
                        {df.icon} {df.name}
                      </strong>
                      <span style={{ fontSize: "0.72rem", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 800 }}>
                        Devil Fruit
                      </span>
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      <strong style={{ color: "#94a3b8" }}>Common Effect:</strong> {df.commonEffect}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#4ade80", marginBottom: "0.3rem" }}>
                      <strong>Benefit:</strong> {df.benefit}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#f87171" }}>
                      <strong>Disadvantage:</strong> {df.disadvantage}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HAKI COLUMN */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "2px solid rgba(2, 132, 199, 0.4)",
                borderRadius: "12px",
                padding: "1.8rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem", borderBottom: "1px solid rgba(2, 132, 199, 0.3)", paddingBottom: "0.8rem" }}>
                <span style={{ fontSize: "1.8rem" }}>⚡</span>
                <div>
                  <h4 className="font-pirate" style={{ fontSize: "1.5rem", color: "#38bdf8", margin: 0, lineHeight: 1.1 }}>
                    4 Common Haki Powers
                  </h4>
                  <div style={{ fontSize: "0.78rem", color: "#bae6fd" }}>Willpower challenges judged by the jury to unlock score bonuses</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {HAKI_POWERS.map((haki) => (
                  <div
                    key={haki.id}
                    style={{
                      background: "rgba(30, 41, 59, 0.6)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ color: "#fef08a", fontSize: "1.05rem" }}>
                        {haki.icon} {haki.name}
                      </strong>
                      <span style={{ fontSize: "0.72rem", background: "rgba(2, 132, 199, 0.2)", color: "#7dd3fc", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 800 }}>
                        Haki Willpower
                      </span>
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      <strong style={{ color: "#94a3b8" }}>Challenge:</strong> {haki.challenge}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#fcd34d", marginBottom: "0.3rem" }}>
                      <strong>Pass Condition:</strong> {haki.passCondition}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "#38bdf8" }}>
                      <strong>Power:</strong> {haki.power}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
