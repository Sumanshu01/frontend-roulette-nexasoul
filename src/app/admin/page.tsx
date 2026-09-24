"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { soundFX } from "@/utils/soundEffects";
import {
  Shield,
  Users,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Key,
  Lock,
  Unlock,
  ArrowLeft,
  Mail,
  Phone,
  Hash,
  ExternalLink,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";

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
  bounty: string;
  status: "Registered" | "Checked-In";
  registeredAt: string;
  createdAt: string;
}

interface IStats {
  totalTeams: number;
  totalParticipants: number;
  freshersCount: number;
  seniorsCount: number;
  checkedInCount: number;
}

export default function AdminPortal() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Teams & Stats
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [stats, setStats] = useState<IStats>({
    totalTeams: 0,
    totalParticipants: 0,
    freshersCount: 0,
    seniorsCount: 0,
    checkedInCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected team for dossier modal
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

  // Check stored auth on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem("admin_grand_line_key");
    if (savedKey) {
      setPasscode(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchTeams = useCallback(async (keyToUse?: string) => {
    const key = keyToUse || passcode;
    if (!key) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (divisionFilter !== "All") params.set("division", divisionFilter);
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetch(`/api/teams?${params.toString()}`, {
        headers: {
          "x-admin-key": key,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem("admin_grand_line_key");
          throw new Error("Invalid admin passcode. Access denied.");
        }
        throw new Error(data.error || "Failed to load teams data.");
      }

      setTeams(data.data || []);
      setStats(
        data.stats || {
          totalTeams: 0,
          totalParticipants: 0,
          freshersCount: 0,
          seniorsCount: 0,
          checkedInCount: 0,
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching teams";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [passcode, searchQuery, divisionFilter, statusFilter]);

  // Fetch when authenticated and filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated, fetchTeams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/teams`, {
        headers: {
          "x-admin-key": passcode,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Incorrect Passcode");
      }

      sessionStorage.setItem("admin_grand_line_key", passcode);
      setIsAuthenticated(true);
      setTeams(data.data || []);
      setStats(data.stats);
      soundFX.playCoin();
    } catch (err: unknown) {
      soundFX.playBuzzer();
      const msg = err instanceof Error ? err.message : "Authentication error";
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_grand_line_key");
    setIsAuthenticated(false);
    setPasscode("");
    setTeams([]);
  };

  const handleToggleCheckIn = async (team: ITeam) => {
    const nextStatus = team.status === "Checked-In" ? "Registered" : "Checked-In";
    try {
      const res = await fetch(`/api/teams/${team._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": passcode,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTeams((prev) =>
        prev.map((t) => (t._id === team._id ? { ...t, status: nextStatus } : t))
      );

      setStats((prev) => ({
        ...prev,
        checkedInCount:
          nextStatus === "Checked-In"
            ? prev.checkedInCount + 1
            : prev.checkedInCount - 1,
      }));

      if (selectedTeam && selectedTeam._id === team._id) {
        setSelectedTeam({ ...selectedTeam, status: nextStatus });
      }

      soundFX.playCoin();
    } catch {
      alert("Error updating team check-in status.");
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from registration records?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": passcode,
        },
      });

      if (!res.ok) throw new Error("Failed to delete crew");

      setTeams((prev) => prev.filter((t) => t._id !== id));
      fetchTeams();
      soundFX.playBuzzer();
    } catch {
      alert("Failed to delete team.");
    }
  };

  const handleExportCSV = () => {
    if (!teams.length) {
      alert("No registered teams to export.");
      return;
    }

    const headers = [
      "Team ID",
      "Team Name",
      "Division",
      "Flag",
      "Status",
      "Captain Name",
      "Captain Email",
      "Captain Phone",
      "Captain Roll No",
      "Captain GitHub",
      "Member 2 Name",
      "Member 2 Email",
      "Member 2 Roll No",
      "Member 2 Role",
      "Member 3 Name",
      "Member 3 Email",
      "Member 3 Roll No",
      "Member 3 Role",
      "Member 4 Name",
      "Member 4 Email",
      "Member 4 Roll No",
      "Member 4 Role",
      "Registered Date",
    ];

    const rows = teams.map((t) => [
      `"${t.teamId}"`,
      `"${t.teamName.replace(/"/g, '""')}"`,
      `"${t.division}"`,
      `"${t.flag}"`,
      `"${t.status}"`,
      `"${t.captain.name.replace(/"/g, '""')}"`,
      `"${t.captain.email}"`,
      `"${t.captain.phone}"`,
      `"${t.captain.rollNo}"`,
      `"${t.captain.github || ""}"`,
      `"${t.member2.name.replace(/"/g, '""')}"`,
      `"${t.member2.email}"`,
      `"${t.member2.rollNo}"`,
      `"${t.member2.role || ""}"`,
      `"${t.member3.name.replace(/"/g, '""')}"`,
      `"${t.member3.email}"`,
      `"${t.member3.rollNo}"`,
      `"${t.member3.role || ""}"`,
      `"${t.member4?.name ? t.member4.name.replace(/"/g, '""') : ""}"`,
      `"${t.member4?.email || ""}"`,
      `"${t.member4?.rollNo || ""}"`,
      `"${t.member4?.role || ""}"`,
      `"${new Date(t.registeredAt || t.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Frontend_Roulette_Teams_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundFX.playCoin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070b13",
        color: "#f8fafc",
        padding: "2rem 1.5rem",
        position: "relative",
      }}
    >
      {/* Background Graphic overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: "radial-gradient(#fbbf24 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1350px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Navigation Bar / Top Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(245, 158, 11, 0.25)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              className="btn-pirate-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.9rem",
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} />
              Return to Deck
            </Link>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#fbbf24",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                <Shield size={16} />
                GRAND LINE HEADQUARTERS
              </div>
              <h1
                className="font-pirate"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                  color: "#fef08a",
                  lineHeight: 1.1,
                  margin: "0.2rem 0 0",
                }}
              >
                ADMIN REGISTRATION COMMAND
              </h1>
            </div>
          </div>

          {isAuthenticated && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <button
                onClick={handleExportCSV}
                className="btn-pirate-gold"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 1rem",
                  fontSize: "0.85rem",
                }}
              >
                <Download size={16} />
                Export CSV
              </button>

              <button
                onClick={() => fetchTeams()}
                className="btn-pirate-secondary"
                title="Refresh Records"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 0.8rem",
                  fontSize: "0.85rem",
                }}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Sync
              </button>

              <button
                onClick={handleLogout}
                className="btn-pirate-crimson"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 0.9rem",
                  fontSize: "0.85rem",
                }}
              >
                <Lock size={15} />
                Lock
              </button>
            </div>
          )}
        </header>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div
            style={{
              maxWidth: "460px",
              margin: "6rem auto",
              background: "rgba(13, 21, 39, 0.95)",
              border: "2px solid #fbbf24",
              borderRadius: "10px",
              padding: "2.5rem 2rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "rgba(185, 28, 28, 0.3)",
                border: "2px solid #fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <Key size={32} color="#fef08a" />
            </div>

            <h2
              className="font-pirate"
              style={{
                fontSize: "2rem",
                color: "#fef08a",
                marginBottom: "0.5rem",
                letterSpacing: "1px",
              }}
            >
              HIGH ADMIRAL LOGIN
            </h2>

            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "1.8rem" }}>
              Enter the Fleet Master Passcode to unlock registered team manifests and B4 UCRD records.
            </p>

            {authError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid #ef4444",
                  borderRadius: "6px",
                  padding: "0.6rem",
                  color: "#fca5a5",
                  fontSize: "0.85rem",
                  marginBottom: "1.2rem",
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="password"
                required
                placeholder="Enter Fleet Passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1.5px solid #fbbf24",
                  background: "rgba(17, 30, 56, 0.9)",
                  color: "#ffffff",
                  fontSize: "1rem",
                  textAlign: "center",
                  letterSpacing: "3px",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-pirate-crimson"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Unlock size={18} />
                {loading ? "Verifying Keys..." : "Access Grand Line Ledger"}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div>
            {/* KPI Metrics Ribbon */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.2rem",
                marginBottom: "2rem",
              }}
            >
              <div
                className="pirate-panel"
                style={{
                  padding: "1.4rem",
                  borderLeft: "4px solid #fbbf24",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                  TOTAL ENLISTED CREWS
                </div>
                <div
                  className="font-heading"
                  style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fef08a", marginTop: "0.3rem" }}
                >
                  {stats.totalTeams}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#fbbf24", marginTop: "0.2rem" }}>
                  Registered in MongoDB
                </div>
              </div>

              <div
                className="pirate-panel"
                style={{
                  padding: "1.4rem",
                  borderLeft: "4px solid #38bdf8",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                  TOTAL PIRATES (PARTICIPANTS)
                </div>
                <div
                  className="font-heading"
                  style={{ fontSize: "2.2rem", fontWeight: 900, color: "#38bdf8", marginTop: "0.3rem" }}
                >
                  {stats.totalParticipants}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Captains + Crew Members
                </div>
              </div>

              <div
                className="pirate-panel"
                style={{
                  padding: "1.4rem",
                  borderLeft: "4px solid #f87171",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                  FRESHERS (LEVEL 1)
                </div>
                <div
                  className="font-heading"
                  style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f87171", marginTop: "0.3rem" }}
                >
                  {stats.freshersCount}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#f87171", marginTop: "0.2rem" }}>
                  1st Year Pirate Rookies
                </div>
              </div>

              <div
                className="pirate-panel"
                style={{
                  padding: "1.4rem",
                  borderLeft: "4px solid #a855f7",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                  SENIORS (LEVELS 2 & 3)
                </div>
                <div
                  className="font-heading"
                  style={{ fontSize: "2.2rem", fontWeight: 900, color: "#c084fc", marginTop: "0.3rem" }}
                >
                  {stats.seniorsCount}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#c084fc", marginTop: "0.2rem" }}>
                  Veteran Pirates
                </div>
              </div>

              <div
                className="pirate-panel"
                style={{
                  padding: "1.4rem",
                  borderLeft: "4px solid #22c55e",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                  CHECKED-IN AT B4 UCRD
                </div>
                <div
                  className="font-heading"
                  style={{ fontSize: "2.2rem", fontWeight: 900, color: "#4ade80", marginTop: "0.3rem" }}
                >
                  {stats.checkedInCount}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#4ade80", marginTop: "0.2rem" }}>
                  Gate Attendance Verified
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(13, 21, 39, 0.8)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: "8px",
                padding: "1rem 1.4rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Search Box */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "rgba(17, 30, 56, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.8rem",
                  minWidth: "280px",
                  flex: "1 1 300px",
                }}
              >
                <Search size={18} color="#fbbf24" />
                <input
                  type="text"
                  placeholder="Search crew name, captain, roll no, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                    outline: "none",
                    width: "100%",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Division Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 700 }}>
                  Division:
                </span>
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  style={{
                    background: "rgba(17, 30, 56, 0.9)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#fef08a",
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="All">All Divisions</option>
                  <option value="Freshers (Level 1)">Freshers (Level 1)</option>
                  <option value="Senior (Levels 2 & 3)">Senior (Levels 2 & 3)</option>
                </select>
              </div>

              {/* Status Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 700 }}>
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    background: "rgba(17, 30, 56, 0.9)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#fef08a",
                    padding: "0.5rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Registered">Registered</option>
                  <option value="Checked-In">Checked-In</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #ef4444",
                  padding: "0.9rem",
                  borderRadius: "6px",
                  color: "#fca5a5",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={20} color="#ef4444" />
                {error}
              </div>
            )}

            {/* Teams Data Table */}
            <div
              style={{
                background: "rgba(13, 21, 39, 0.9)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    fontSize: "0.88rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "rgba(20, 30, 55, 0.95)",
                        borderBottom: "2px solid rgba(245, 158, 11, 0.3)",
                        color: "#fbbf24",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      <th style={{ padding: "1rem" }}>Crew ID & Flag</th>
                      <th style={{ padding: "1rem" }}>Crew Name</th>
                      <th style={{ padding: "1rem" }}>Division</th>
                      <th style={{ padding: "1rem" }}>Captain Details</th>
                      <th style={{ padding: "1rem", textAlign: "center" }}>Crew Size</th>
                      <th style={{ padding: "1rem" }}>Gate Status</th>
                      <th style={{ padding: "1rem" }}>Registered</th>
                      <th style={{ padding: "1rem", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{
                            padding: "3rem",
                            textAlign: "center",
                            color: "#94a3b8",
                            fontSize: "1rem",
                          }}
                        >
                          {loading ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                              <RefreshCw size={20} className="animate-spin" color="#fbbf24" />
                              Loading Grand Line Manifests from MongoDB...
                            </div>
                          ) : (
                            "No pirate crews found matching your query."
                          )}
                        </td>
                      </tr>
                    ) : (
                      teams.map((team, idx) => {
                        const isCheckedIn = team.status === "Checked-In";
                        const totalMembers = 3 + (team.member4 && team.member4.name ? 1 : 0);

                        return (
                          <tr
                            key={team._id}
                            style={{
                              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                              background:
                                idx % 2 === 0
                                  ? "rgba(13, 21, 39, 0.4)"
                                  : "rgba(17, 30, 56, 0.4)",
                              transition: "background 0.2s",
                            }}
                          >
                            {/* ID & Flag */}
                            <td style={{ padding: "0.9rem 1rem", whiteSpace: "nowrap" }}>
                              <div style={{ fontSize: "0.8rem", color: "#fbbf24", fontWeight: 700 }}>
                                {team.teamId}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>
                                {team.flag}
                              </div>
                            </td>

                            {/* Crew Name */}
                            <td style={{ padding: "0.9rem 1rem", fontWeight: 700, color: "#ffffff" }}>
                              <div style={{ fontSize: "0.98rem" }}>{team.teamName}</div>
                              <div style={{ fontSize: "0.75rem", color: "#f87171" }}>
                                {team.bounty}
                              </div>
                            </td>

                            {/* Division */}
                            <td style={{ padding: "0.9rem 1rem" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  fontSize: "0.72rem",
                                  fontWeight: 800,
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "4px",
                                  background:
                                    team.division === "Freshers (Level 1)"
                                      ? "rgba(239, 68, 68, 0.2)"
                                      : "rgba(168, 85, 247, 0.2)",
                                  color:
                                    team.division === "Freshers (Level 1)"
                                      ? "#fca5a5"
                                      : "#d8b4fe",
                                  border:
                                    team.division === "Freshers (Level 1)"
                                      ? "1px solid rgba(239, 68, 68, 0.4)"
                                      : "1px solid rgba(168, 85, 247, 0.4)",
                                }}
                              >
                                {team.division}
                              </span>
                            </td>

                            {/* Captain Details */}
                            <td style={{ padding: "0.9rem 1rem" }}>
                              <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                                {team.captain.name}
                              </div>
                              <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
                                Roll: <strong style={{ color: "#fef08a" }}>{team.captain.rollNo}</strong>
                              </div>
                              <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                {team.captain.email} • {team.captain.phone}
                              </div>
                            </td>

                            {/* Crew Size */}
                            <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                  fontWeight: 700,
                                  color: "#38bdf8",
                                  background: "rgba(14, 165, 233, 0.15)",
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "4px",
                                  fontSize: "0.8rem",
                                }}
                              >
                                <Users size={14} />
                                {totalMembers} Pirates
                              </span>
                            </td>

                            {/* Gate Status Toggle */}
                            <td style={{ padding: "0.9rem 1rem" }}>
                              <button
                                onClick={() => handleToggleCheckIn(team)}
                                title="Click to toggle check-in status"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                  padding: "0.35rem 0.7rem",
                                  borderRadius: "999px",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  border: isCheckedIn
                                    ? "1px solid #22c55e"
                                    : "1px solid rgba(245, 158, 11, 0.4)",
                                  background: isCheckedIn
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : "rgba(245, 158, 11, 0.15)",
                                  color: isCheckedIn ? "#4ade80" : "#fef08a",
                                  transition: "all 0.2s",
                                }}
                              >
                                {isCheckedIn ? (
                                  <>
                                    <CheckCircle2 size={13} color="#4ade80" />
                                    Checked-In
                                  </>
                                ) : (
                                  <>
                                    <Clock size={13} color="#fef08a" />
                                    Registered
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Registered Date */}
                            <td style={{ padding: "0.9rem 1rem", color: "#94a3b8", fontSize: "0.78rem" }}>
                              {new Date(team.registeredAt || team.createdAt).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                                <button
                                  onClick={() => setSelectedTeam(team)}
                                  className="btn-pirate-secondary"
                                  title="View Full Crew Dossier"
                                  style={{
                                    padding: "0.4rem 0.6rem",
                                    fontSize: "0.75rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                  }}
                                >
                                  <Eye size={14} />
                                  Dossier
                                </button>

                                <button
                                  onClick={() => handleDeleteTeam(team._id, team.teamName)}
                                  title="Remove Crew"
                                  style={{
                                    background: "rgba(239, 68, 68, 0.15)",
                                    border: "1px solid #ef4444",
                                    color: "#f87171",
                                    padding: "0.4rem 0.6rem",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREW DOSSIER MODAL */}
            {selectedTeam && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                  zIndex: 200,
                }}
                onClick={() => setSelectedTeam(null)}
              >
                <div
                  className="pirate-panel"
                  style={{
                    maxWidth: "680px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "2rem",
                    border: "3px solid #fbbf24",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                    position: "relative",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedTeam(null)}
                    style={{
                      position: "absolute",
                      top: "1.2rem",
                      right: "1.2rem",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      color: "#cbd5e1",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={18} />
                  </button>

                  {/* Modal Header */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ color: "#fbbf24", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px" }}>
                      CREW DOSSIER • {selectedTeam.teamId}
                    </div>
                    <h3
                      className="font-pirate"
                      style={{ fontSize: "2.2rem", color: "#fef08a", margin: "0.2rem 0" }}
                    >
                      {selectedTeam.teamName.toUpperCase()}
                    </h3>
                    <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.4rem" }}>
                      <span style={{ color: "#f87171", fontWeight: 800 }}>{selectedTeam.bounty}</span>
                      <span>•</span>
                      <span style={{ color: "#cbd5e1" }}>{selectedTeam.division}</span>
                      <span>•</span>
                      <span>{selectedTeam.flag}</span>
                    </div>
                  </div>

                  {/* Captain Block */}
                  <div
                    style={{
                      background: "rgba(185, 28, 28, 0.2)",
                      border: "1.5px solid #f87171",
                      borderRadius: "8px",
                      padding: "1.2rem",
                      marginBottom: "1.2rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#fca5a5", fontWeight: 800, fontSize: "0.82rem", marginBottom: "0.6rem" }}>
                      <Sparkles size={16} color="#fbbf24" />
                      CAPTAIN / SQUAD COMMANDER
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.4rem" }}>
                      {selectedTeam.captain.name}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e2e8f0" }}>
                        <Hash size={14} color="#fbbf24" />
                        Roll No: <strong style={{ color: "#fef08a" }}>{selectedTeam.captain.rollNo}</strong>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e2e8f0" }}>
                        <Phone size={14} color="#38bdf8" />
                        {selectedTeam.captain.phone}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e2e8f0" }}>
                        <Mail size={14} color="#f87171" />
                        {selectedTeam.captain.email}
                      </div>
                      {selectedTeam.captain.github && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e2e8f0" }}>
                          <ExternalLink size={14} color="#cbd5e1" />
                          <a
                            href={selectedTeam.captain.github.startsWith("http") ? selectedTeam.captain.github : `https://${selectedTeam.captain.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#38bdf8", textDecoration: "underline" }}
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Crew Mates */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fbbf24", letterSpacing: "1px" }}>
                      CREW MATES MANIFEST:
                    </div>

                    {/* Member 2 */}
                    <div
                      style={{
                        background: "rgba(17, 30, 56, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "6px",
                        padding: "0.9rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                        <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.98rem" }}>
                          {selectedTeam.member2.name}
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#38bdf8", background: "rgba(14, 165, 233, 0.2)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                          {selectedTeam.member2.role || "Frontend Engineer"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                        Roll No: <strong style={{ color: "#fef08a" }}>{selectedTeam.member2.rollNo}</strong> • {selectedTeam.member2.email}
                      </div>
                    </div>

                    {/* Member 3 */}
                    <div
                      style={{
                        background: "rgba(17, 30, 56, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "6px",
                        padding: "0.9rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                        <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.98rem" }}>
                          {selectedTeam.member3.name}
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#a855f7", background: "rgba(168, 85, 247, 0.2)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                          {selectedTeam.member3.role || "UI/UX Designer"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                        Roll No: <strong style={{ color: "#fef08a" }}>{selectedTeam.member3.rollNo}</strong> • {selectedTeam.member3.email}
                      </div>
                    </div>

                    {/* Member 4 (Optional) */}
                    {selectedTeam.member4 && selectedTeam.member4.name && (
                      <div
                        style={{
                          background: "rgba(17, 30, 56, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "6px",
                          padding: "0.9rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                          <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.98rem" }}>
                            {selectedTeam.member4.name}
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "#f59e0b", background: "rgba(245, 158, 11, 0.2)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                            {selectedTeam.member4.role || "Integration"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                          Roll No: <strong style={{ color: "#fef08a" }}>{selectedTeam.member4.rollNo}</strong> • {selectedTeam.member4.email}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Controls */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem", borderTop: "1px solid rgba(245, 158, 11, 0.2)", paddingTop: "1rem" }}>
                    <button
                      onClick={() => handleToggleCheckIn(selectedTeam)}
                      className={selectedTeam.status === "Checked-In" ? "btn-pirate-secondary" : "btn-pirate-gold"}
                      style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
                    >
                      {selectedTeam.status === "Checked-In" ? "Mark as Registered" : "Check-in Crew at B4 UCRD"}
                    </button>

                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="btn-pirate-secondary"
                      style={{ fontSize: "0.85rem", padding: "0.55rem 1rem" }}
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
