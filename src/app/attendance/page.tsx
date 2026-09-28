"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  Key,
  Unlock,
  Lock,
  X,
  Anchor,
  Ship,
  Compass,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";

/* ─────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────── */
interface ICrewMember {
  name: string;
  email: string;
  rollNo: string;
  role?: string;
}

interface ICaptain {
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  github?: string;
}

interface IMemberAttendance {
  captain?: "present" | "absent" | "unmarked";
  member2?: "present" | "absent" | "unmarked";
  member3?: "present" | "absent" | "unmarked";
  member4?: "present" | "absent" | "unmarked";
  markedAt?: string;
  markedBy?: string;
}

interface ITeam {
  _id: string;
  teamId: string;
  teamName: string;
  division: "Freshers (Level 1)" | "Senior (Levels 2 & 3)";
  flag: string;
  captain: ICaptain;
  member2: ICrewMember;
  member3: ICrewMember;
  member4?: ICrewMember;
  memberAttendance?: IMemberAttendance;
  status: string;
  registeredAt: string;
  createdAt: string;
}

interface IStats {
  totalTeams: number;
  totalMembers: number;
  totalPresent: number;
  totalAbsent: number;
  totalUnmarked: number;
}

/* ─────────────────────────────────────────────────────
   COLOR PALETTE (Light Parchment / Warm Pirate)
───────────────────────────────────────────────────── */
const COLORS = {
  // Page BG — warm light tan/sand
  pageBg: "#f5efe0",
  pageBgGradient: "linear-gradient(170deg, #faf5e8 0%, #f0e7d0 35%, #ede2c8 100%)",
  // Card BG
  cardBg: "#fefcf5",
  cardBorder: "#d4b896",
  cardShadow: "0 4px 16px rgba(120, 80, 30, 0.12)",
  // Header/Banner
  headerBg: "linear-gradient(135deg, #8b2500 0%, #a0522d 50%, #cd853f 100%)",
  headerText: "#fef3c7",
  // Text colors
  textPrimary: "#3d2410",
  textSecondary: "#6b4c2a",
  textMuted: "#9c7e5a",
  // Accents
  gold: "#d4a017",
  goldBright: "#f0c040",
  goldLight: "#fef3c7",
  red: "#a02020",
  redLight: "#fde8e8",
  redBorder: "#e58080",
  green: "#2d7a2d",
  greenLight: "#e8f8e8",
  greenBorder: "#80c880",
  amber: "#b8860b",
  amberLight: "#fef8e0",
  amberBorder: "#d4b060",
  // Present/Absent/Unmarked badge
  presentBg: "#dff5df",
  presentBorder: "#6ab86a",
  presentText: "#1a6030",
  absentBg: "#fde2e2",
  absentBorder: "#e07070",
  absentText: "#8b1818",
  unmarkedBg: "#f5efe0",
  unmarkedBorder: "#c8b090",
  unmarkedText: "#8a7050",
  // Divider
  divider: "#d4c4a8",
};

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function AttendancePortal() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [teams, setTeams] = useState<ITeam[]>([]);
  const [stats, setStats] = useState<IStats>({
    totalTeams: 0,
    totalMembers: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalUnmarked: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");

  // Tracks in-flight PATCH requests per member
  const [updatingMap, setUpdatingMap] = useState<Record<string, boolean>>({});

  // Check saved auth
  useEffect(() => {
    const savedKey = sessionStorage.getItem("attendance_key");
    if (savedKey) {
      setPasscode(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  /* ─── Fetch ─── */
  const fetchTeams = useCallback(
    async (keyToUse?: string) => {
      const key = keyToUse || passcode;
      if (!key) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (divisionFilter !== "All") params.set("division", divisionFilter);
        const res = await fetch(`/api/attendance?${params.toString()}`, {
          headers: { "x-admin-key": key },
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setIsAuthenticated(false);
            sessionStorage.removeItem("attendance_key");
            throw new Error("Invalid passcode. Access denied.");
          }
          throw new Error(data.error || "Failed to load attendance data.");
        }
        setTeams(data.data || []);
        setStats(data.stats || stats);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error loading data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [passcode, searchQuery, divisionFilter, stats]
  );

  useEffect(() => {
    if (isAuthenticated) fetchTeams();
  }, [isAuthenticated, fetchTeams]);

  /* ─── Auth ─── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        headers: { "x-admin-key": passcode },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect Passcode");
      sessionStorage.setItem("attendance_key", passcode);
      setIsAuthenticated(true);
      setTeams(data.data || []);
      setStats(data.stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Auth error";
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("attendance_key");
    setIsAuthenticated(false);
    setPasscode("");
    setTeams([]);
  };

  /* ─── Mark Attendance ─── */
  const markAttendance = async (
    teamId: string,
    memberKey: string,
    status: "present" | "absent"
  ) => {
    const mapKey = `${teamId}_${memberKey}`;
    setUpdatingMap((prev) => ({ ...prev, [mapKey]: true }));
    try {
      const res = await fetch("/api/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": passcode,
        },
        body: JSON.stringify({ teamId, memberKey, status, markedBy: "organizer" }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update attendance");
        return;
      }
      // Optimistic local state update
      setTeams((prev) =>
        prev.map((t) => {
          if (t.teamId !== teamId) return t;
          return {
            ...t,
            memberAttendance: {
              ...t.memberAttendance,
              [memberKey]: status,
              markedAt: new Date().toISOString(),
            },
          };
        })
      );
      // Update stats
      setStats((prev) => {
        const oldTeam = teams.find((t) => t.teamId === teamId);
        const oldStatus =
          oldTeam?.memberAttendance?.[memberKey as keyof IMemberAttendance] || "unmarked";
        let { totalPresent, totalAbsent, totalUnmarked } = { ...prev };
        // Decrement old
        if (oldStatus === "present") totalPresent--;
        else if (oldStatus === "absent") totalAbsent--;
        else totalUnmarked--;
        // Increment new
        if (status === "present") totalPresent++;
        else totalAbsent++;
        return { ...prev, totalPresent, totalAbsent, totalUnmarked };
      });
    } catch {
      alert("Network error while marking attendance.");
    } finally {
      setUpdatingMap((prev) => ({ ...prev, [mapKey]: false }));
    }
  };

  /* ─── CSV Export ─── */
  const handleExportCSV = () => {
    if (!teams.length) return alert("No teams to export.");
    const headers = [
      "Team ID",
      "Team Name",
      "Division",
      "Member Role",
      "Member Name",
      "UID / Roll No",
      "Attendance",
    ];
    const rows: string[][] = [];
    for (const t of teams) {
      const members = getMembersArray(t);
      for (const m of members) {
        rows.push([
          `"${t.teamId}"`,
          `"${t.teamName.replace(/"/g, '""')}"`,
          `"${t.division}"`,
          `"${m.role}"`,
          `"${m.name.replace(/"/g, '""')}"`,
          `"${m.rollNo}"`,
          `"${m.attendance}"`,
        ]);
      }
    }
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute(
      "download",
      `Attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ─── Helpers ─── */
  type MemberRow = {
    key: string;
    role: string;
    name: string;
    rollNo: string;
    email: string;
    attendance: string;
  };

  const getMembersArray = (team: ITeam): MemberRow[] => {
    const att = team.memberAttendance || {};
    const members: MemberRow[] = [
      {
        key: "captain",
        role: "Captain",
        name: team.captain.name,
        rollNo: team.captain.rollNo,
        email: team.captain.email,
        attendance: att.captain || "unmarked",
      },
      {
        key: "member2",
        role: team.member2.role || "Crew Member",
        name: team.member2.name,
        rollNo: team.member2.rollNo,
        email: team.member2.email,
        attendance: att.member2 || "unmarked",
      },
      {
        key: "member3",
        role: team.member3.role || "Crew Member",
        name: team.member3.name,
        rollNo: team.member3.rollNo,
        email: team.member3.email,
        attendance: att.member3 || "unmarked",
      },
    ];
    if (team.member4 && team.member4.name) {
      members.push({
        key: "member4",
        role: team.member4.role || "Crew Member",
        name: team.member4.name,
        rollNo: team.member4.rollNo,
        email: team.member4.email,
        attendance: att.member4 || "unmarked",
      });
    }
    return members;
  };

  const getAttBadgeStyle = (status: string) => {
    if (status === "present")
      return {
        bg: COLORS.presentBg,
        border: COLORS.presentBorder,
        color: COLORS.presentText,
        icon: <CheckCircle2 size={13} />,
        label: "PRESENT",
      };
    if (status === "absent")
      return {
        bg: COLORS.absentBg,
        border: COLORS.absentBorder,
        color: COLORS.absentText,
        icon: <XCircle size={13} />,
        label: "ABSENT",
      };
    return {
      bg: COLORS.unmarkedBg,
      border: COLORS.unmarkedBorder,
      color: COLORS.unmarkedText,
      icon: <HelpCircle size={13} />,
      label: "UNMARKED",
    };
  };

  const presentPercent =
    stats.totalMembers > 0
      ? Math.round((stats.totalPresent / stats.totalMembers) * 100)
      : 0;

  /* ─────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.pageBgGradient,
        color: COLORS.textPrimary,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Subtle pirate map dots background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.04,
          backgroundImage: "radial-gradient(#8b4513 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      {/* ───────── HEADER BANNER ───────── */}
      <header
        style={{
          background: COLORS.headerBg,
          padding: "1.6rem 1.5rem",
          borderBottom: `4px solid ${COLORS.goldBright}`,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(120, 60, 10, 0.3)",
        }}
      >
        {/* Rope decorative border line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `repeating-linear-gradient(90deg, ${COLORS.goldBright} 0px, ${COLORS.goldBright} 6px, transparent 6px, transparent 12px)`,
          }}
        />

        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(254, 243, 199, 0.2)",
                border: `2.5px solid ${COLORS.goldBright}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 18px rgba(240, 192, 64, 0.35)`,
              }}
            >
              <Anchor size={28} color={COLORS.headerText} />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: COLORS.goldBright,
                }}
              >
                <Compass size={13} />
                FRONTEND ROULETTE • B4 UCRD
              </div>
              <h1
                className="font-pirate"
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                  color: COLORS.headerText,
                  lineHeight: 1.1,
                  margin: "0.15rem 0 0",
                  textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                CREW ROLL CALL LEDGER
              </h1>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(254, 243, 199, 0.7)",
                  marginTop: "0.15rem",
                }}
              >
                Pirate Attendance Log — Mark every nakama as Present or Absent
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button
                onClick={handleExportCSV}
                style={{
                  background: "rgba(254, 243, 199, 0.2)",
                  border: `1.5px solid ${COLORS.goldBright}`,
                  color: COLORS.headerText,
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  transition: "all 0.2s",
                }}
              >
                <Download size={15} />
                Export CSV
              </button>
              <button
                onClick={() => fetchTeams()}
                style={{
                  background: "rgba(254, 243, 199, 0.15)",
                  border: `1.5px solid ${COLORS.goldBright}`,
                  color: COLORS.headerText,
                  padding: "0.5rem 0.7rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  transition: "all 0.2s",
                }}
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                Sync
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(180, 40, 40, 0.3)",
                  border: "1.5px solid rgba(254, 200, 200, 0.5)",
                  color: "#fde8e8",
                  padding: "0.5rem 0.8rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Lock size={14} />
                Lock
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ───────── MAIN CONTENT ───────── */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ═══ AUTH GATE ═══ */}
        {!isAuthenticated ? (
          <div
            style={{
              maxWidth: "440px",
              margin: "5rem auto",
              background: COLORS.cardBg,
              border: `2.5px solid ${COLORS.cardBorder}`,
              borderRadius: "12px",
              padding: "2.5rem 2rem",
              boxShadow: "0 12px 40px rgba(120, 80, 30, 0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #d4a017 0%, #b8860b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
                boxShadow: "0 4px 14px rgba(180, 130, 30, 0.35)",
              }}
            >
              <Key size={30} color="#fef3c7" />
            </div>

            <h2
              className="font-pirate"
              style={{
                fontSize: "1.8rem",
                color: COLORS.red,
                marginBottom: "0.4rem",
              }}
            >
              HARBOUR MASTER LOGIN
            </h2>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: "0.9rem",
                lineHeight: 1.5,
                marginBottom: "1.8rem",
              }}
            >
              Enter the organizer passcode to access the crew roll call ledger.
            </p>

            {authError && (
              <div
                style={{
                  background: COLORS.redLight,
                  border: `1px solid ${COLORS.redBorder}`,
                  borderRadius: "6px",
                  padding: "0.6rem",
                  color: COLORS.absentText,
                  fontSize: "0.85rem",
                  marginBottom: "1.2rem",
                }}
              >
                {authError}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="password"
                required
                placeholder="Enter Passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: `2px solid ${COLORS.cardBorder}`,
                  background: COLORS.pageBg,
                  color: COLORS.textPrimary,
                  fontSize: "1rem",
                  textAlign: "center",
                  letterSpacing: "3px",
                  outline: "none",
                  fontWeight: 600,
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "1rem",
                  fontWeight: 800,
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #8b2500 0%, #b8460b 100%)",
                  color: COLORS.goldLight,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(139, 37, 0, 0.3)",
                  transition: "all 0.2s",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Unlock size={18} />
                {loading ? "Verifying..." : "Open Roll Call Ledger"}
              </button>
            </form>
          </div>
        ) : (
          /* ═══ AUTHENTICATED DASHBOARD ═══ */
          <div>
            {/* ─── KPI Stat Cards ─── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "1rem",
                marginBottom: "1.8rem",
              }}
            >
              {/* Total Teams */}
              <StatCard
                label="PIRATE CREWS"
                value={stats.totalTeams}
                icon={<Ship size={22} color={COLORS.amber} />}
                accent={COLORS.amber}
                bg={COLORS.amberLight}
                border={COLORS.amberBorder}
              />
              {/* Total Members */}
              <StatCard
                label="TOTAL NAKAMAS"
                value={stats.totalMembers}
                icon={<Users size={22} color="#5070b0" />}
                accent="#5070b0"
                bg="#eaf0fa"
                border="#a0b8d8"
              />
              {/* Present */}
              <StatCard
                label="PRESENT ✓"
                value={stats.totalPresent}
                icon={<UserCheck size={22} color={COLORS.green} />}
                accent={COLORS.green}
                bg={COLORS.greenLight}
                border={COLORS.greenBorder}
                sub={`${presentPercent}% attendance`}
              />
              {/* Absent */}
              <StatCard
                label="ABSENT ✗"
                value={stats.totalAbsent}
                icon={<UserX size={22} color={COLORS.red} />}
                accent={COLORS.red}
                bg={COLORS.redLight}
                border={COLORS.redBorder}
              />
              {/* Unmarked */}
              <StatCard
                label="UNMARKED"
                value={stats.totalUnmarked}
                icon={<HelpCircle size={22} color={COLORS.textMuted} />}
                accent={COLORS.textMuted}
                bg={COLORS.unmarkedBg}
                border={COLORS.unmarkedBorder}
              />
            </div>

            {/* ─── Search + Filters Bar ─── */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                alignItems: "center",
                background: COLORS.cardBg,
                border: `1.5px solid ${COLORS.cardBorder}`,
                borderRadius: "8px",
                padding: "0.9rem 1.2rem",
                marginBottom: "1.5rem",
                boxShadow: COLORS.cardShadow,
              }}
            >
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: COLORS.pageBg,
                  border: `1px solid ${COLORS.divider}`,
                  borderRadius: "6px",
                  padding: "0.5rem 0.8rem",
                  flex: "1 1 280px",
                  minWidth: "240px",
                }}
              >
                <Search size={17} color={COLORS.amber} />
                <input
                  type="text"
                  placeholder="Search crew, name, roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: COLORS.textPrimary,
                    fontSize: "0.88rem",
                    outline: "none",
                    width: "100%",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: COLORS.textMuted,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Division */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: COLORS.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  Division:
                </span>
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  style={{
                    background: COLORS.pageBg,
                    border: `1px solid ${COLORS.divider}`,
                    color: COLORS.textPrimary,
                    padding: "0.45rem 0.7rem",
                    borderRadius: "6px",
                    fontSize: "0.83rem",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <option value="All">All Divisions</option>
                  <option value="Freshers (Level 1)">Freshers (Level 1)</option>
                  <option value="Senior (Levels 2 & 3)">
                    Senior (Levels 2 &amp; 3)
                  </option>
                </select>
              </div>
            </div>

            {/* ─── Error Message ─── */}
            {error && (
              <div
                style={{
                  background: COLORS.redLight,
                  border: `1px solid ${COLORS.redBorder}`,
                  padding: "0.8rem 1rem",
                  borderRadius: "6px",
                  color: COLORS.absentText,
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </div>
            )}

            {/* ─── Loading State ─── */}
            {loading && teams.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: COLORS.textMuted,
                }}
              >
                <RefreshCw
                  size={28}
                  className="animate-spin"
                  color={COLORS.amber}
                  style={{ margin: "0 auto 0.8rem", display: "block" }}
                />
                Summoning crew manifests from the Grand Line...
              </div>
            )}

            {/* ─── No Teams Found ─── */}
            {!loading && teams.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: COLORS.textMuted,
                  background: COLORS.cardBg,
                  borderRadius: "8px",
                  border: `1px dashed ${COLORS.divider}`,
                }}
              >
                No pirate crews found matching your search.
              </div>
            )}

            {/* ─── TEAM ATTENDANCE CARDS ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {teams.map((team) => {
                const members = getMembersArray(team);
                const presentCount = members.filter(
                  (m) => m.attendance === "present"
                ).length;
                const absentCount = members.filter(
                  (m) => m.attendance === "absent"
                ).length;

                return (
                  <div
                    key={team._id}
                    style={{
                      background: COLORS.cardBg,
                      border: `2px solid ${COLORS.cardBorder}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: COLORS.cardShadow,
                    }}
                  >
                    {/* Card Header — Crew Name Banner */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #f5ecd8 0%, #ede2c4 100%)",
                        borderBottom: `2px solid ${COLORS.cardBorder}`,
                        padding: "1rem 1.4rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {/* Pirate Skull Icon */}
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #8b2500 0%, #cd5c1f 100%)",
                            border: `2px solid ${COLORS.goldBright}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            boxShadow: "0 3px 10px rgba(139, 37, 0, 0.25)",
                          }}
                        >
                          ☠️
                        </div>
                        <div>
                          <div
                            className="font-pirate"
                            style={{
                              fontSize: "1.55rem",
                              color: COLORS.red,
                              lineHeight: 1.1,
                            }}
                          >
                            {team.teamName}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                              fontSize: "0.78rem",
                              color: COLORS.textSecondary,
                              marginTop: "0.15rem",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                color: COLORS.amber,
                              }}
                            >
                              {team.teamId}
                            </span>
                            <span>•</span>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.1rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                background:
                                  team.division === "Freshers (Level 1)"
                                    ? "#fde2e2"
                                    : "#f0e6fa",
                                color:
                                  team.division === "Freshers (Level 1)"
                                    ? "#a02020"
                                    : "#6b30a0",
                                border:
                                  team.division === "Freshers (Level 1)"
                                    ? "1px solid #e0a0a0"
                                    : "1px solid #c8a0e0",
                              }}
                            >
                              {team.division}
                            </span>
                            <span>•</span>
                            <span>{team.flag}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick summary badge */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            background: COLORS.presentBg,
                            color: COLORS.presentText,
                            border: `1px solid ${COLORS.presentBorder}`,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                          }}
                        >
                          ✓ {presentCount}
                        </span>
                        <span
                          style={{
                            background: COLORS.absentBg,
                            color: COLORS.absentText,
                            border: `1px solid ${COLORS.absentBorder}`,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                          }}
                        >
                          ✗ {absentCount}
                        </span>
                        <span
                          style={{
                            color: COLORS.textMuted,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          / {members.length}
                        </span>
                      </div>
                    </div>

                    {/* Card Body — Members Table */}
                    <div style={{ padding: "0.4rem 0" }}>
                      {members.map((member, mIdx) => {
                        const att = getAttBadgeStyle(member.attendance);
                        const mapKey = `${team.teamId}_${member.key}`;
                        const isUpdating = updatingMap[mapKey] || false;

                        return (
                          <div
                            key={member.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.75rem 1.4rem",
                              flexWrap: "wrap",
                              gap: "0.6rem",
                              borderBottom:
                                mIdx < members.length - 1
                                  ? `1px solid ${COLORS.divider}`
                                  : "none",
                              background:
                                member.attendance === "present"
                                  ? "rgba(220, 245, 220, 0.35)"
                                  : member.attendance === "absent"
                                    ? "rgba(253, 230, 230, 0.35)"
                                    : "transparent",
                              transition: "background 0.3s ease",
                            }}
                          >
                            {/* Member Info */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.8rem",
                                flex: "1 1 240px",
                                minWidth: "200px",
                              }}
                            >
                              {/* Role Indicator Dot */}
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background:
                                    member.key === "captain"
                                      ? "linear-gradient(135deg, #d4a017, #b8860b)"
                                      : "linear-gradient(135deg, #a0876a, #8a7050)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 900,
                                  color: "#fef3c7",
                                  flexShrink: 0,
                                  border:
                                    member.key === "captain"
                                      ? `2px solid ${COLORS.goldBright}`
                                      : "2px solid #c8b090",
                                  boxShadow:
                                    member.key === "captain"
                                      ? "0 2px 8px rgba(212, 160, 23, 0.3)"
                                      : "none",
                                }}
                              >
                                {member.key === "captain" ? "C" : member.key.replace("member", "M")}
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    color: COLORS.textPrimary,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {member.name}
                                  {member.key === "captain" && (
                                    <span
                                      style={{
                                        fontSize: "0.65rem",
                                        fontWeight: 800,
                                        color: COLORS.gold,
                                        marginLeft: "0.4rem",
                                        background: COLORS.amberLight,
                                        padding: "0.05rem 0.4rem",
                                        borderRadius: "3px",
                                        border: `1px solid ${COLORS.amberBorder}`,
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      CAPTAIN
                                    </span>
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.78rem",
                                    color: COLORS.textMuted,
                                    marginTop: "0.1rem",
                                  }}
                                >
                                  UID:{" "}
                                  <strong style={{ color: COLORS.textSecondary }}>
                                    {member.rollNo}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            {/* Current Status Badge */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                background: att.bg,
                                border: `1.5px solid ${att.border}`,
                                color: att.color,
                                padding: "0.25rem 0.65rem",
                                borderRadius: "999px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                letterSpacing: "0.5px",
                                minWidth: "90px",
                                justifyContent: "center",
                              }}
                            >
                              {att.icon}
                              {att.label}
                            </div>

                            {/* Action Buttons */}
                            <div
                              style={{
                                display: "flex",
                                gap: "0.4rem",
                                alignItems: "center",
                              }}
                            >
                              <button
                                onClick={() =>
                                  markAttendance(
                                    team.teamId,
                                    member.key,
                                    "present"
                                  )
                                }
                                disabled={
                                  isUpdating || member.attendance === "present"
                                }
                                title="Mark Present"
                                style={{
                                  padding: "0.4rem 0.85rem",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  cursor:
                                    isUpdating || member.attendance === "present"
                                      ? "not-allowed"
                                      : "pointer",
                                  border: `1.5px solid ${COLORS.greenBorder}`,
                                  background:
                                    member.attendance === "present"
                                      ? COLORS.presentBg
                                      : COLORS.cardBg,
                                  color:
                                    member.attendance === "present"
                                      ? COLORS.presentText
                                      : COLORS.green,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                  transition: "all 0.2s",
                                  opacity:
                                    isUpdating || member.attendance === "present"
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                <CheckCircle2 size={14} />
                                Present
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(
                                    team.teamId,
                                    member.key,
                                    "absent"
                                  )
                                }
                                disabled={
                                  isUpdating || member.attendance === "absent"
                                }
                                title="Mark Absent"
                                style={{
                                  padding: "0.4rem 0.85rem",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  cursor:
                                    isUpdating || member.attendance === "absent"
                                      ? "not-allowed"
                                      : "pointer",
                                  border: `1.5px solid ${COLORS.redBorder}`,
                                  background:
                                    member.attendance === "absent"
                                      ? COLORS.absentBg
                                      : COLORS.cardBg,
                                  color:
                                    member.attendance === "absent"
                                      ? COLORS.absentText
                                      : COLORS.red,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                  transition: "all 0.2s",
                                  opacity:
                                    isUpdating || member.attendance === "absent"
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                <XCircle size={14} />
                                Absent
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─── Footer Stamp ─── */}
            {teams.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "3rem",
                  paddingTop: "1.5rem",
                  borderTop: `2px dashed ${COLORS.divider}`,
                  color: COLORS.textMuted,
                  fontSize: "0.82rem",
                }}
              >
                <div className="font-pirate" style={{ fontSize: "1.1rem", color: COLORS.amber, marginBottom: "0.3rem" }}>
                  ☠️ END OF CREW ROLL CALL MANIFEST ☠️
                </div>
                <div>
                  {stats.totalTeams} Crews • {stats.totalMembers} Nakamas •{" "}
                  {presentPercent}% Present
                </div>
                <div style={{ fontSize: "0.75rem", marginTop: "0.2rem" }}>
                  FRONTEND ROULETTE — NexaSoul x B4 UCRD Hackathon
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon,
  accent,
  bg,
  border,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  border: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: "10px",
        padding: "1.2rem",
        borderLeft: `5px solid ${accent}`,
        boxShadow: "0 3px 10px rgba(120, 80, 30, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            color: COLORS.textMuted,
            fontWeight: 800,
            letterSpacing: "0.8px",
          }}
        >
          {label}
        </div>
        {icon}
      </div>
      <div
        className="font-heading"
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.72rem", color: accent, marginTop: "0.2rem", fontWeight: 600 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
