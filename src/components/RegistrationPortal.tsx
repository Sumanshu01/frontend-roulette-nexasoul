"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { soundFX } from "@/utils/soundEffects";
import {
  Users,
  ShieldCheck,
  Printer,
  Sparkles,
  Trophy,
  CheckCircle2,
  Anchor,
  Flag,
  User,
  Mail,
  Phone,
  Hash,
  Compass,
} from "lucide-react";

interface CrewMember {
  name: string;
  email: string;
  role: string;
}

interface RegisteredCrew {
  id: string;
  crewName: string;
  division: "Freshers (Level 1)" | "Senior (Levels 2 & 3)";
  flag: string;
  captain: {
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    github: string;
  };
  member2: CrewMember;
  member3: CrewMember;
  member4?: CrewMember;
  registeredAt: string;
  bounty: string;
}

export default function RegistrationPortal() {
  const [crewName, setCrewName] = useState("");
  const [division, setDivision] = useState<"Freshers (Level 1)" | "Senior (Levels 2 & 3)">("Freshers (Level 1)");
  const [selectedFlag, setSelectedFlag] = useState("👒 Straw Hat Fleet");

  // Captain details
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [captainRoll, setCaptainRoll] = useState("");
  const [captainGithub, setCaptainGithub] = useState("");

  // Member 2
  const [m2Name, setM2Name] = useState("");
  const [m2Email, setM2Email] = useState("");
  const [m2Role, setM2Role] = useState("Frontend Engineer");

  // Member 3
  const [m3Name, setM3Name] = useState("");
  const [m3Email, setM3Email] = useState("");
  const [m3Role, setM3Role] = useState("UI/UX Designer");

  // Member 4 (Optional)
  const [hasMember4, setHasMember4] = useState(false);
  const [m4Name, setM4Name] = useState("");
  const [m4Email, setM4Email] = useState("");
  const [m4Role, setM4Role] = useState("Full Stack / Integration");

  // Registration state
  const [registeredCrew, setRegisteredCrew] = useState<RegisteredCrew | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("grand_line_registered_crew");
      if (saved) {
        setRegisteredCrew(JSON.parse(saved));
      }
    } catch {
      // storage fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!crewName || !captainName || !captainEmail || !m2Name || !m3Name) {
      alert("Please fill in the required fields for at least 3 pirate crew members!");
      soundFX.playBuzzer();
      return;
    }

    const randomId = "CREW-NEXA-" + Math.floor(1000 + Math.random() * 9000);
    const bountyAmount =
      division === "Freshers (Level 1)" ? "฿ 300,000,000" : "฿ 850,000,000";

    const crewData: RegisteredCrew = {
      id: randomId,
      crewName,
      division,
      flag: selectedFlag,
      captain: {
        name: captainName,
        email: captainEmail,
        phone: captainPhone,
        rollNo: captainRoll,
        github: captainGithub,
      },
      member2: { name: m2Name, email: m2Email, role: m2Role },
      member3: { name: m3Name, email: m3Email, role: m3Role },
      member4: hasMember4 ? { name: m4Name, email: m4Email, role: m4Role } : undefined,
      registeredAt: new Date().toLocaleDateString(),
      bounty: bountyAmount,
    };

    setRegisteredCrew(crewData);
    try {
      localStorage.setItem("grand_line_registered_crew", JSON.stringify(crewData));
    } catch {
      // storage fallback
    }

    soundFX.playCannon();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleResetRegistration = () => {
    if (confirm("Are you sure you want to register a new pirate crew?")) {
      localStorage.removeItem("grand_line_registered_crew");
      setRegisteredCrew(null);
      soundFX.playCoin();
    }
  };

  return (
    <section
      id="register"
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
          <Flag size={16} />
          FLEET ENLISTMENT • 3 TO 4 PIRATES PER CREW
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
          JOIN THE PIRATE FLEET
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
          Enlist your squad of 3 to 4 frontend pirates. Receive an instant official <strong>DEAD OR ALIVE Wanted Poster Pass</strong> and secure your entry for the B4 UCRD Grand Line Arena.
        </p>
      </div>

      {registeredCrew ? (
        /* Display Generated Wanted Poster Pass */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            ref={posterRef}
            className="wanted-poster"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "2.4rem 2rem",
              border: "12px solid #5a371c",
            }}
          >
            <div
              className="font-heading"
              style={{
                fontSize: "3.2rem",
                fontWeight: 900,
                letterSpacing: "6px",
                color: "#24140a",
                lineHeight: 1,
                borderBottom: "4px solid #784725",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              WANTED
            </div>

            {/* Crew Flag / Emblem Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "220px",
                borderRadius: "4px",
                overflow: "hidden",
                border: "3px solid #784725",
                marginBottom: "1rem",
                background: "#1e1008",
              }}
            >
              <Image
                src="/images/join_crew_poster.jpg"
                alt="Crew Wanted Artwork"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.8)",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "3px",
                  color: "#fef08a",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                }}
              >
                {registeredCrew.flag} • {registeredCrew.id}
              </div>
            </div>

            <div
              className="font-pirate"
              style={{ fontSize: "2rem", color: "#831843", letterSpacing: "1px" }}
            >
              DEAD OR ALIVE
            </div>

            {/* Crew Name */}
            <h3
              className="font-heading"
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: "#1e1008",
                letterSpacing: "1px",
                margin: "0.3rem 0",
              }}
            >
              {registeredCrew.crewName.toUpperCase()}
            </h3>

            {/* Bounty */}
            <div
              className="font-heading"
              style={{
                fontSize: "2.3rem",
                fontWeight: 900,
                color: "#991b1b",
                letterSpacing: "2px",
                marginBottom: "0.8rem",
              }}
            >
              {registeredCrew.bounty}-
            </div>

            {/* Crew Roster List */}
            <div
              style={{
                background: "rgba(120, 53, 15, 0.08)",
                border: "1px solid #bca476",
                borderRadius: "4px",
                padding: "0.8rem",
                textAlign: "left",
                marginBottom: "1.2rem",
                fontSize: "0.82rem",
                color: "#2c1810",
              }}
            >
              <div style={{ fontWeight: 800, color: "#78350f", marginBottom: "0.3rem" }}>
                CREW MANIFEST (B4 UCRD):
              </div>
              <div>
                <strong>Captain:</strong> {registeredCrew.captain.name} ({registeredCrew.captain.email})
              </div>
              <div>
                <strong>Member 2:</strong> {registeredCrew.member2.name} — {registeredCrew.member2.role}
              </div>
              <div>
                <strong>Member 3:</strong> {registeredCrew.member3.name} — {registeredCrew.member3.role}
              </div>
              {registeredCrew.member4 && (
                <div>
                  <strong>Member 4:</strong> {registeredCrew.member4.name} — {registeredCrew.member4.role}
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: "0.75rem",
                color: "#603813",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              NEXASOUL OFFICIAL CREW PASS • {registeredCrew.division}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => window.print()}
              className="btn-pirate-gold"
              style={{ fontSize: "0.95rem" }}
            >
              <Printer size={18} />
              Print / Save Wanted Poster Pass
            </button>

            <a
              href="#roulette"
              className="btn-pirate-crimson"
              style={{ fontSize: "0.95rem", textAlign: "center" }}
              onClick={() => soundFX.playWheelTick(1.4)}
            >
              <Compass size={18} />
              Proceed to Dual Roulette
            </a>

            <button
              onClick={handleResetRegistration}
              className="btn-pirate-secondary"
              style={{ fontSize: "0.85rem" }}
            >
              Register Another Crew
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div
          className="parchment-card"
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            padding: "2.5rem",
            border: "4px solid #b45309",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            {/* Step 1: Fleet & Ship Identity */}
            <div>
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.2rem",
                  color: "#991b1b",
                  borderBottom: "2px solid var(--parchment-border)",
                  paddingBottom: "0.4rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Anchor size={20} color="#991b1b" />
                1. SHIP IDENTITY & DIVISION
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.2rem",
                }}
                className="form-row-2"
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#451a03",
                      marginBottom: "0.4rem",
                    }}
                  >
                    PIRATE CREW / SHIP NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mugiwara Coders"
                    value={crewName}
                    onChange={(e) => setCrewName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      border: "1px solid var(--parchment-border)",
                      background: "#fff",
                      fontSize: "0.95rem",
                      color: "#1e1008",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#451a03",
                      marginBottom: "0.4rem",
                    }}
                  >
                    YEAR & DIFFICULTY LEVEL *
                  </label>
                  <select
                    value={division}
                    onChange={(e) =>
                      setDivision(e.target.value as "Freshers (Level 1)" | "Senior (Levels 2 & 3)")
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      border: "1px solid var(--parchment-border)",
                      background: "#fff",
                      fontSize: "0.95rem",
                      color: "#1e1008",
                    }}
                  >
                    <option value="Freshers (Level 1)">1st Year Freshers (Level 1 Roulette)</option>
                    <option value="Senior (Levels 2 & 3)">2nd Year & Above (Levels 2 & 3 Roulette)</option>
                  </select>
                </div>
              </div>

              {/* Pirate Flag Choice */}
              <div style={{ marginTop: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#451a03",
                    marginBottom: "0.4rem",
                  }}
                >
                  SELECT YOUR PIRATE FLAG / JOLLY ROGER
                </label>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  {[
                    "👒 Straw Hat Fleet",
                    "👑 Roger Pirates",
                    "⚔️ Heart Pirates",
                    "🔥 Red Hair Fleet",
                    "⚡ Whitebeard Fleet",
                  ].map((flag) => (
                    <button
                      type="button"
                      key={flag}
                      onClick={() => setSelectedFlag(flag)}
                      style={{
                        padding: "0.45rem 0.9rem",
                        borderRadius: "4px",
                        border: selectedFlag === flag ? "2px solid #b45309" : "1px solid var(--parchment-border)",
                        background: selectedFlag === flag ? "#fef3c7" : "#fff",
                        color: "#2c1810",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Pirate Captain */}
            <div>
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.2rem",
                  color: "#991b1b",
                  borderBottom: "2px solid var(--parchment-border)",
                  paddingBottom: "0.4rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <User size={20} color="#991b1b" />
                2. PIRATE CAPTAIN (LEAD CONTACT)
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
                className="form-row-2"
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#451a03", marginBottom: "0.3rem" }}>
                    CAPTAIN FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Monkey D. Luffy"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "4px", border: "1px solid var(--parchment-border)", background: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#451a03", marginBottom: "0.3rem" }}>
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="captain@grandline.dev"
                    value={captainEmail}
                    onChange={(e) => setCaptainEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "4px", border: "1px solid var(--parchment-border)", background: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#451a03", marginBottom: "0.3rem" }}>
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={captainPhone}
                    onChange={(e) => setCaptainPhone(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "4px", border: "1px solid var(--parchment-border)", background: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#451a03", marginBottom: "0.3rem" }}>
                    COLLEGE ID / ROLL NUMBER *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BCE1004"
                    value={captainRoll}
                    onChange={(e) => setCaptainRoll(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem", borderRadius: "4px", border: "1px solid var(--parchment-border)", background: "#fff" }}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Crew Members 2 & 3 */}
            <div>
              <h3
                className="font-heading"
                style={{
                  fontSize: "1.2rem",
                  color: "#991b1b",
                  borderBottom: "2px solid var(--parchment-border)",
                  paddingBottom: "0.4rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Users size={20} color="#991b1b" />
                3. CREW MATES (MINIMUM 3 TOTAL MEMBERS)
              </h3>

              {/* Member 2 */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--parchment-border)",
                  padding: "1rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#78350f", marginBottom: "0.5rem" }}>
                  MEMBER 2 DETAILS
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }} className="form-subgrid">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={m2Name}
                    onChange={(e) => setM2Name(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={m2Email}
                    onChange={(e) => setM2Email(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              {/* Member 3 */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--parchment-border)",
                  padding: "1rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#78350f", marginBottom: "0.5rem" }}>
                  MEMBER 3 DETAILS
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }} className="form-subgrid">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={m3Name}
                    onChange={(e) => setM3Name(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={m3Email}
                    onChange={(e) => setM3Email(e.target.value)}
                    style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              {/* Optional Member 4 Toggle */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem", color: "#451a03", fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={hasMember4}
                    onChange={(e) => setHasMember4(e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  Add 4th Pirate Crew Member (Optional - Max 4 allowed)
                </label>

                {hasMember4 && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid var(--parchment-border)",
                      padding: "1rem",
                      borderRadius: "4px",
                      marginTop: "0.8rem",
                    }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#78350f", marginBottom: "0.5rem" }}>
                      MEMBER 4 DETAILS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }} className="form-subgrid">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={m4Name}
                        onChange={(e) => setM4Name(e.target.value)}
                        style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={m4Email}
                        onChange={(e) => setM4Email(e.target.value)}
                        style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                type="submit"
                className="btn-pirate-crimson"
                style={{
                  fontSize: "1.15rem",
                  padding: "1rem 2.8rem",
                  letterSpacing: "1px",
                  boxShadow: "0 10px 25px rgba(185, 28, 28, 0.5)",
                }}
              >
                ENLIST CREW & GENERATE WANTED PASS
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .form-subgrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
