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
  Flame,
  Shield,
  Eye,
  Crown,
  Lock,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  Compass,
  ArrowRight,
  HelpCircle,
  Award,
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
  const [showRulesGuide, setShowRulesGuide] = useState(false);

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for shared crew session on mount
  useEffect(() => {
    try {
      const savedCrewStr = sessionStorage.getItem("roulette_crew_session");
      if (savedCrewStr) {
        const parsed = JSON.parse(savedCrewStr);
        if (parsed.teamName) {
          // Verify with server to get fresh mechanic data
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
            // Position wheels to point to existing result
            positionWheelsToResult(matched.type, matched.name);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load crew mechanic status:", e);
    }
  };

  const positionWheelsToResult = (type: "Devil Fruit" | "Haki", name: string) => {
    // Wheel 1: Devil Fruit is slice 0 (center 90° from top = angle 0°). Top pointer is at -90°.
    // Slice 0: [0, 180] -> center 90. To point to top: 360 - 90 = 270 deg.
    // Slice 1: [180, 360] -> center 270. To point to top: 360 - 270 = 90 deg.
    if (type === "Devil Fruit") {
      setWheel1Rotation(270);
    } else {
      setWheel1Rotation(90);
    }

    // Wheel 2: 4 slices, 90 deg each
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
    soundFX.playWheelTick(1);
  };

  // Spin sequence: Wheel 1 then Wheel 2
  const handleSpinWheels = async () => {
    if (!activeCrew || isSpinning) return;

    if (activeCrew.hasSpunMechanic) {
      soundFX.playBuzzer();
      setSpinError("Your crew has already awakened their power! Fate is sealed.");
      return;
    }

    setSpinError(null);
    setIsSpinning(true);
    setSpinPhase("spinning_wheel1");

    // 1. Randomly pick Destiny (Devil Fruit or Haki) and specific Power
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
    const w1Spins = 360 * (5 + Math.floor(Math.random() * 2)); // 5-6 full turns
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

      // Small delay then fire Wheel 2
      setTimeout(() => {
        // Wheel 2 Math: 4 slices (90 deg each).
        // Slice idx: center is idx * 90 + 45.
        // Target angle to reach top pointer is (360 - centerAngle).
        const w2SliceCenter = chosenPowerIdx * 90 + 45;
        const w2TargetStop = (360 - w2SliceCenter + 360) % 360;
        const w2Spins = 360 * (6 + Math.floor(Math.random() * 2)); // 6-7 full turns
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

        // Persist spin to database via API
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

        // After 5.5 seconds, Wheel 2 lands!
        setTimeout(() => {
          if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
          setIsSpinning(false);
          setSpinPhase("done");
          setAssignedMechanic(chosenPower);

          // Update local crew session
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

          // Grand fanfare celebrations!
          soundFX.playVictory();
          setTimeout(() => soundFX.playCannon(), 300);

          confetti({
            particleCount: 150,
            spread: 80,
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
    if (!assignedMechanic || !activeCrew) return;
    const text = `⚓ GRAND LINE AWAKENED POWER ASSIGNMENT ⚓
Crew: ${activeCrew.teamName} (${activeCrew.teamId})
Captain: ${activeCrew.captainName || "N/A"}
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
        maxWidth: "1340px",
        margin: "0 auto",
      }}
    >
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
            background: "rgba(147, 51, 234, 0.15)",
            padding: "0.4rem 1.2rem",
            borderRadius: "999px",
            border: "1px solid rgba(147, 51, 234, 0.4)",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.25)",
          }}
        >
          <Zap size={16} color="#fbbf24" />
          <span>DEVIL FRUIT + HAKI PROTOCOL • DUAL ROULETTE</span>
        </div>

        <h2
          className="font-pirate"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            color: "#fef08a",
            textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(147, 51, 234, 0.4)",
            letterSpacing: "1.5px",
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          AWAKEN YOUR CREW&apos;S ULTIMATE POWER
        </h2>

        <p
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            fontSize: "1.05rem",
            color: "#cbd5e1",
            lineHeight: 1.6,
          }}
        >
          Every pirate crew on the Grand Line possesses either a forbidden{" "}
          <strong style={{ color: "#c084fc" }}>Devil Fruit curse</strong> or an indomitable{" "}
          <strong style={{ color: "#38bdf8" }}>Haki willpower</strong>. Team leaders must enter their crew name
          to spin the <strong>Dual Roulettes</strong>: Wheel 1 selects your Destiny, and Wheel 2 awakens your specific power modifier!
        </p>

        {/* Quick Rules Toggle */}
        <div style={{ marginTop: "1.2rem" }}>
          <button
            onClick={() => {
              setShowRulesGuide(!showRulesGuide);
              soundFX.playWheelTick(1.1);
            }}
            style={{
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#fbbf24",
              padding: "0.45rem 1.1rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
          >
            <HelpCircle size={15} />
            <span>{showRulesGuide ? "Hide Power Mechanics Guide" : "View Official Power Mechanics Reference (4 Fruits & 4 Hakis)"}</span>
            {showRulesGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE POWER MECHANICS GUIDE */}
      {showRulesGuide && (
        <div
          style={{
            background: "rgba(10, 15, 29, 0.95)",
            border: "2px solid #b45309",
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {/* Devil Fruit Table Card */}
            <div
              style={{
                background: "rgba(88, 28, 135, 0.15)",
                border: "1px solid rgba(147, 51, 234, 0.4)",
                borderRadius: "8px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>☠️</span>
                <h3 className="font-pirate" style={{ fontSize: "1.4rem", color: "#c084fc", margin: 0 }}>
                  4 Common Devil Fruit Powers
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {DEVIL_FRUIT_POWERS.map((df) => (
                  <div
                    key={df.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(147, 51, 234, 0.3)",
                      borderRadius: "6px",
                      padding: "0.9rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ color: "#fef08a", fontSize: "1rem" }}>
                        {df.icon} {df.name}
                      </strong>
                      <span style={{ fontSize: "0.75rem", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                        Devil Fruit
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      <strong>Effect:</strong> {df.commonEffect}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#4ade80", marginBottom: "0.3rem" }}>
                      <strong>Benefit:</strong> {df.benefit}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#f87171" }}>
                      <strong>Disadvantage:</strong> {df.disadvantage}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Haki Table Card */}
            <div
              style={{
                background: "rgba(2, 132, 199, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                borderRadius: "8px",
                padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>⚡</span>
                <h3 className="font-pirate" style={{ fontSize: "1.4rem", color: "#38bdf8", margin: 0 }}>
                  4 Common Haki Powers
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {HAKI_POWERS.map((haki) => (
                  <div
                    key={haki.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: "6px",
                      padding: "0.9rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong style={{ color: "#fef08a", fontSize: "1rem" }}>
                        {haki.icon} {haki.name}
                      </strong>
                      <span style={{ fontSize: "0.75rem", background: "rgba(2, 132, 199, 0.2)", color: "#7dd3fc", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                        Haki Willpower
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "0.3rem" }}>
                      <strong>Challenge:</strong> {haki.challenge}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#fcd34d", marginBottom: "0.3rem" }}>
                      <strong>Pass Condition:</strong> {haki.passCondition}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#38bdf8" }}>
                      <strong>Power:</strong> {haki.power}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: LOGIN PORTAL IF NOT AUTHENTICATED */}
      {!activeCrew ? (
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div
            className="parchment-card"
            style={{
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.15)",
              border: "3px solid #b45309",
              borderRadius: "12px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 1rem",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #581c87 0%, #1e1b4b 100%)",
                  border: "2px solid #fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
                }}
              >
                <Skull size={32} color="#fef08a" />
              </div>
              <h3
                className="font-pirate"
                style={{
                  fontSize: "1.9rem",
                  color: "#78350f",
                  marginBottom: "0.4rem",
                  letterSpacing: "1px",
                }}
              >
                PIRATE CREW VERIFICATION
              </h3>
              <p style={{ fontSize: "0.92rem", color: "#92400e", lineHeight: 1.5 }}>
                Enter your registered pirate crew (team) name to unlock the Dual Roulettes of Fate and awaken your powers.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1.4rem" }}>
                <label
                  htmlFor="mechanic-team-name-input"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "#78350f",
                    marginBottom: "0.5rem",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Registered Crew (Team) Name
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="mechanic-team-name-input"
                    type="text"
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="e.g. Straw Hat Pirates, Red Hair Fleet..."
                    disabled={isLoadingAuth}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "#1c0d07",
                      background: "rgba(255, 255, 255, 0.8)",
                      border: "2px solid #b45309",
                      borderRadius: "6px",
                      outline: "none",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>

              {authError && (
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.15)",
                    border: "1px solid #ef4444",
                    borderRadius: "6px",
                    padding: "0.75rem 1rem",
                    color: "#991b1b",
                    fontSize: "0.88rem",
                    marginBottom: "1.4rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoadingAuth}
                className="btn-pirate-gold"
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  cursor: isLoadingAuth ? "wait" : "pointer",
                }}
              >
                {isLoadingAuth ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    <span>Verifying with Grand Line Ledger...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Enter Awakening Chamber</span>
                    <ArrowRight size={18} />
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
              <span>Haven&apos;t spun your problem statement yet?</span>
              <a
                href="#roulette"
                style={{
                  color: "#991b1b",
                  fontWeight: 800,
                  textDecoration: "underline",
                }}
                onClick={() => soundFX.playWheelTick(1.1)}
              >
                Go to Problem Title Roulette →
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: LOGGED IN CREW ARENA */
        <div>
          {/* CREW STATUS BAR */}
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
              border: "2px solid #9333ea",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
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
                  AUTHORIZED CREW ({activeCrew.teamId})
                </div>
                <div className="font-pirate" style={{ fontSize: "1.7rem", color: "#fef08a", lineHeight: 1.1 }}>
                  {activeCrew.teamName}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "0.2rem" }}>
                  Captain: <strong>{activeCrew.captainName || "Registered Captain"}</strong>
                  {activeCrew.division && ` • ${activeCrew.division}`}
                  {activeCrew.assignedProblemTitle && (
                    <span style={{ marginLeft: "0.6rem", color: "#fbbf24" }}>
                      • Assigned: <strong>{activeCrew.assignedProblemTitle}</strong>
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
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Lock size={14} />
                  Power Awakened & Sealed
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(147, 51, 234, 0.25)",
                    border: "1px solid #c084fc",
                    color: "#fef08a",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Sparkles size={14} color="#fbbf24" />
                  1 Power Spin Authorized
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

          {/* DUAL ROULETTE ARENA */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "3.5rem",
            }}
          >
            {/* WHEEL 1: THE DESTINY WHEEL (DEVIL FRUIT VS HAKI) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(10, 15, 29, 0.8)",
                border: "2px solid rgba(245, 158, 11, 0.35)",
                borderRadius: "16px",
                padding: "2rem 1rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
                    padding: "0.2rem 0.7rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                  }}
                >
                  ROULETTE 1 • 2 OPTIONS
                </span>
                <h4
                  className="font-pirate"
                  style={{
                    fontSize: "1.6rem",
                    color: "#fef08a",
                    marginTop: "0.5rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  THE PATH OF DESTINY
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Fate chooses between forbidden Fruit or pure Willpower.
                </p>
              </div>

              {/* WHEEL 1 CONTAINER */}
              <div
                style={{
                  position: "relative",
                  width: "min(80vw, 360px)",
                  height: "min(80vw, 360px)",
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

                {/* SVG WHEEL 1 (2 SLICES: DEVIL FRUIT vs HAKI) */}
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
                  {/* Start at (200, 15) and arc to (200, 385) */}
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

                  {/* Gradients */}
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

                  {/* Labels on Slices */}
                  {/* Devil Fruit Text on Right Half (center at 90 deg) */}
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

                  {/* Haki Text on Left Half (center at 270 deg) */}
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
                  <text
                    x="200"
                    y="208"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="24"
                  >
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
                    padding: "0.35rem 0.9rem",
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
                background: "rgba(10, 15, 29, 0.8)",
                border: "2px solid rgba(147, 51, 234, 0.45)",
                borderRadius: "16px",
                padding: "2rem 1rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
                    padding: "0.2rem 0.7rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(147, 51, 234, 0.4)",
                  }}
                >
                  ROULETTE 2 • 4 POWERS OF {activeCategory.toUpperCase()}
                </span>
                <h4
                  className="font-pirate"
                  style={{
                    fontSize: "1.6rem",
                    color: "#fef08a",
                    marginTop: "0.5rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  THE AWAKENED POWER
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  {activeCategory === "Devil Fruit"
                    ? "Overdrive, Future Sight, Mirror, or Risk-Risk"
                    : "Observation, Armament, Conqueror's, or Advanced Haki"}
                </p>
              </div>

              {/* WHEEL 2 CONTAINER */}
              <div
                style={{
                  position: "relative",
                  width: "min(80vw, 360px)",
                  height: "min(80vw, 360px)",
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

                {/* SVG WHEEL 2 (4 SLICES, 90 DEG EACH) */}
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
                  {/* Outer Nautical Rim */}
                  <circle cx="200" cy="200" r="196" fill="#1c0d07" stroke="#fbbf24" strokeWidth="8" />
                  <circle cx="200" cy="200" r="188" fill="#0b0f19" stroke="#78350f" strokeWidth="3" />

                  {/* 4 Slices */}
                  {currentWheel2Pool.map((power, idx) => {
                    const sliceAngle = 90;
                    const startAngle = idx * sliceAngle;
                    const endAngle = (idx + 1) * sliceAngle;

                    // Polar coordinates (0 deg is top = -90 in math)
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((endAngle - 90) * Math.PI) / 180;

                    const r = 185;
                    const x1 = 200 + r * Math.cos(startRad);
                    const y1 = 200 + r * Math.sin(startRad);
                    const x2 = 200 + r * Math.cos(endRad);
                    const y2 = 200 + r * Math.sin(endRad);

                    const midAngle = startAngle + sliceAngle / 2;

                    // Custom palette for the 4 slices
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

                        {/* Text and Icon along radial direction */}
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

                  {/* Center Hub */}
                  <circle cx="200" cy="200" r="46" fill="#18181b" stroke="#fbbf24" strokeWidth="4" />
                  <circle cx="200" cy="200" r="38" fill="#2e1065" />
                  <text
                    x="200"
                    y="207"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="22"
                  >
                    👑
                  </text>
                </svg>
              </div>

              {/* Status indicator for Wheel 2 */}
              <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.9rem",
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

          {/* MASTER SPIN BUTTON */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            {activeCrew.hasSpunMechanic ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "2px solid #22c55e",
                  padding: "0.8rem 1.8rem",
                  borderRadius: "999px",
                  color: "#86efac",
                  fontSize: "1rem",
                  fontWeight: 800,
                }}
              >
                <Lock size={18} />
                <span>Your Crew has Awakened their Power! Fate is Sealed.</span>
              </div>
            ) : (
              <button
                onClick={handleSpinWheels}
                disabled={isSpinning}
                className="btn-pirate-gold"
                style={{
                  padding: "1.1rem 2.8rem",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  borderRadius: "999px",
                  cursor: isSpinning ? "wait" : "pointer",
                  boxShadow: "0 0 40px rgba(147, 51, 234, 0.6), 0 8px 25px rgba(0,0,0,0.8)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  border: "3px solid #fbbf24",
                  opacity: isSpinning ? 0.75 : 1,
                  transform: isSpinning ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                {isSpinning ? (
                  <>
                    <RotateCcw size={24} className="animate-spin" />
                    <span>
                      {spinPhase === "spinning_wheel1"
                        ? "WHEEL 1: CHOOSING DESTINY..."
                        : "WHEEL 2: AWAKENING POWER..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap size={24} color="#1c0d07" />
                    <span>AWAKEN POWER (SPIN DUAL WHEELS)</span>
                    <Sparkles size={24} color="#1c0d07" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* AWAKENED POWER RESULT SCROLL */}
          {assignedMechanic && (
            <div
              style={{
                maxWidth: "840px",
                margin: "0 auto",
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              <div
                className="parchment-card"
                style={{
                  padding: "2.5rem 2rem",
                  border: "3px solid #b45309",
                  borderRadius: "14px",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 50px rgba(147, 51, 234, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Header Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: assignedMechanic.type === "Devil Fruit" ? "rgba(147, 51, 234, 0.2)" : "rgba(2, 132, 199, 0.2)",
                      border: `1px solid ${assignedMechanic.type === "Devil Fruit" ? "#9333ea" : "#0284c7"}`,
                      color: assignedMechanic.type === "Devil Fruit" ? "#7e22ce" : "#0369a1",
                      fontSize: "0.85rem",
                      fontWeight: 900,
                      padding: "0.3rem 0.8rem",
                      borderRadius: "999px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    <CheckCircle2 size={16} />
                    OFFICIAL GRAND LINE POWER AWAKENING
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#78350f", fontWeight: 700 }}>
                    {activeCrew.mechanicAssignedAt
                      ? new Date(activeCrew.mechanicAssignedAt).toLocaleString()
                      : "Recently Awakened"}
                  </div>
                </div>

                {/* Power Title */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.4rem" }}>
                    {assignedMechanic.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
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
                      fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                      color: "#78350f",
                      margin: "0.3rem 0 0.8rem",
                      lineHeight: 1.1,
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {assignedMechanic.name}
                  </h3>
                  <p style={{ maxWidth: "680px", margin: "0 auto", fontSize: "0.98rem", color: "#92400e", fontStyle: "italic", lineHeight: 1.5 }}>
                    &ldquo;{assignedMechanic.lore}&rdquo;
                  </p>
                </div>

                {/* EXACT SPECIFICATION TABLE FROM USER'S REFERENCE IMAGES */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
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
                    /* DEVIL FRUIT DETAILS TABLE */
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
                    /* HAKI DETAILS TABLE */
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

                {/* Assigned Problem Link & Footer Actions */}
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
                    Crew: <strong>{activeCrew.teamName}</strong> • Captain: <strong>{activeCrew.captainName || "Leader"}</strong>
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
        </div>
      )}
    </section>
  );
}
