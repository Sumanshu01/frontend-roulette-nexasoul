"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import RegistrationPortal from "@/components/RegistrationPortal";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", paddingTop: "5rem" }}>
      <Navbar />
      <RegistrationPortal />
      <Footer />
    </main>
  );
}
