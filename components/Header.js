"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function Header({ user, selectedMonth, setMonth }) {
  const today  = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: 28 }}
    >
      {/* Top row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.div
            animate={{ boxShadow: [
              "0 0 12px rgba(124,58,237,0.5)",
              "0 0 28px rgba(124,58,237,0.9)",
              "0 0 12px rgba(124,58,237,0.5)",
            ]}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </motion.div>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
            }}>
              <span style={{ color: "#f0f4ff" }}>VOLT</span>
              <span className="gradient-text">DASH</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 6px #34d399",
                animation: "pulse 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.2em", color: "rgba(148,163,184,0.65)" }}>
                Live · {user?.displayName || "Sajjad Hossain Jim"}
              </span>
            </div>
          </div>
        </div>

        {/* Date (desktop) */}
        <p style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", fontWeight: 500 }}
          className="hide-mobile">
          {dateStr}
        </p>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

          {/* Month selector */}
          <div className="card" style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 14px", borderRadius: 12,
          }}>
            <svg width="14" height="14" fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <select
              value={selectedMonth}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#c8d8ff", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m} {today.getFullYear()}</option>
              ))}
            </select>
          </div>

          {/* Avatar */}
          {user?.photoURL && (
            <img src={user.photoURL} alt="avatar"
              style={{
                width: 32, height: 32, borderRadius: "50%",
                boxShadow: "0 0 0 2px #7c3aed, 0 0 12px rgba(124,58,237,0.5)",
              }}
            />
          )}

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => signOut(auth)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px", borderRadius: 12, cursor: "pointer",
              background: "rgba(248,113,113,0.10)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#f87171", fontSize: 12, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              transition: "all 0.2s",
            }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </motion.button>
        </div>
      </div>

      {/* Gradient separator */}
      <div className="header-sep" />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @media(max-width:640px){ .hide-mobile{display:none;} }
      `}</style>
    </motion.header>
  );
}