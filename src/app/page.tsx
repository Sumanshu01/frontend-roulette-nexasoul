"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroGolDRoger from "@/components/HeroGolDRoger";
import EventOverview from "@/components/EventOverview";
import ProblemVault from "@/components/ProblemVault";
import RegistrationPortal from "@/components/RegistrationPortal";
import PrizesAndFleet from "@/components/PrizesAndFleet";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Navigation Header */}
      <Navbar />

      {/* Gol D. Roger Hero Section */}
      <HeroGolDRoger />

      {/* Event Overview, Objectives, Schedule, Venue B4 UCRD */}
      <EventOverview />

      {/* Problem Statements Archive & Vault with 10 Official Challenges */}
      <ProblemVault />

      {/* Crew Registration & Live Wanted Poster Pass Generator */}
      <RegistrationPortal />

      {/* High Admirals of the Jury, Mentors, 100-Point Scoring Matrix */}
      <PrizesAndFleet />

      {/* Footer & Roger Manifesto */}
      <Footer />
    </main>
  );
}
