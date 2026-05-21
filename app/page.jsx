"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { syncTransaction, fetchUserData } from "./actions";
import { calculateUnitsFromBill } from "@/lib/desco";
import Header from "@/components/Header";
import LoginScreen from "@/components/LoginScreen";
import BalanceCard from "@/components/BalanceCard";
import InputActions from "@/components/InputActions";
import MonthlyChart from "@/components/MonthlyChart";
import TransactionTable from "@/components/TransactionTable";

/* ── Stat Card ── */
function StatCard({ icon, label, value, gradFrom, gradTo, glowColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ borderRadius: 18, padding: "18px 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Icon box */}
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${gradFrom}22, ${gradTo}18)`,
          border: `1px solid ${gradFrom}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
          boxShadow: `0 0 12px ${glowColor}20`,
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "rgba(148,163,184,0.6)", marginBottom: 3,
          }}>
            {label}
          </p>
          <p style={{
            fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Loading Screen ── */
function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 20,
    }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#7c3aed", borderRightColor: "rgba(124,58,237,0.3)",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 6, borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#06b6d4", borderRightColor: "rgba(6,182,212,0.3)",
          animation: "spin 0.7s linear infinite reverse",
        }} />
        <div style={{
          position: "absolute", inset: 14, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(124,58,237,0.15)", fontSize: 16,
        }}>⚡</div>
      </div>
      <p style={{
        fontSize: 11, fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.3em", color: "rgba(148,163,184,0.6)",
      }}>
        Loading VoltDash…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function ElectricDashboard() {
  const [user, setUser]           = useState(null);
  const [balance, setBalance]     = useState(0);
  const [history, setHistory]     = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading]     = useState(true);

  const MY_EMAIL = "sajjadjim15@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email === MY_EMAIL) {
        setUser(currentUser);
        const data = await fetchUserData(currentUser.email);
        if (data) {
          setBalance(Number(data.balance) || 0);
          setHistory(data.history || []);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleTransaction = async (type, amount) => {
    if (!user) return alert("Please login first");
    try {
      const updatedData = await syncTransaction(user.email, amount, type);
      if (updatedData) {
        setBalance(Number(updatedData.balance));
        setHistory(updatedData.history);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check MongoDB IP Access.");
    }
  };

  /* Derived stats */
  const monthHistory = history.filter(i => new Date(i.date).getMonth() === selectedMonth);
  const monthTopup   = monthHistory.filter(i => i.type === "recharge").reduce((s, i) => s + i.amount, 0);
  const monthBill    = monthHistory.filter(i => i.type === "bill").reduce((s, i) => s + i.amount, 0);
  const monthUnits   = monthHistory.filter(i => i.type === "bill").reduce((s, i) => s + calculateUnitsFromBill(i.amount), 0);
  const txCount      = monthHistory.length;

  if (loading) return <LoadingScreen />;
  if (!user)   return <LoginScreen />;

  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 20px 48px" }}>

        {/* Header */}
        <Header user={user} selectedMonth={selectedMonth} setMonth={setSelectedMonth} />

        {/* ── Stats Row ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, marginBottom: 28,
        }}
          className="stats-grid"
        >
          <StatCard delay={0}    icon="💳" label="Balance"
            value={`৳${balance.toLocaleString()}`}
            gradFrom="#60a5fa" gradTo="#a78bfa" glowColor="#60a5fa" />
          <StatCard delay={0.07} icon="⬆️"  label="Monthly Top-ups"
            value={`৳${monthTopup.toLocaleString()}`}
            gradFrom="#34d399" gradTo="#06b6d4" glowColor="#34d399" />
          <StatCard delay={0.14} icon="⬇️"  label="Monthly Bills"
            value={`৳${monthBill.toLocaleString()}`}
            gradFrom="#f87171" gradTo="#fb923c" glowColor="#f87171" />
          <StatCard delay={0.21} icon="⚡" label="Est. Consumption"
            value={`${monthUnits.toFixed(1)} kWh`}
            gradFrom="#06b6d4" gradTo="#38bdf8" glowColor="#06b6d4" />
        </div>

        {/* ── Main 2-column Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}
          className="main-grid">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <BalanceCard balance={balance} />
            <InputActions onSync={handleTransaction} />
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <MonthlyChart history={history} selectedMonth={selectedMonth} />
            <TransactionTable history={history} selectedMonth={selectedMonth} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.4)" }}>
            ⚡ VoltDash · Personal Electric Bill Tracker
          </p>
          <p style={{ fontSize: 11, color: "rgba(148,163,184,0.3)" }}>
            Firebase + MongoDB · Real-time Sync
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .main-grid  { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}