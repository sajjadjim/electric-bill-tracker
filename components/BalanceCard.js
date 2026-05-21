"use client";
import { motion } from "framer-motion";

export default function BalanceCard({ balance }) {
  const isLow    = balance < 100;
  const isMedium = balance >= 100 && balance < 500;

  const statusLabel = isLow ? "Low Balance" : isMedium ? "Moderate" : "Sufficient";
  const barColor    = isLow
    ? "linear-gradient(90deg,#f87171,#fb923c)"
    : isMedium
    ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
    : "linear-gradient(90deg,#34d399,#06b6d4)";
  const barGlow = isLow ? "#f87171" : isMedium ? "#fbbf24" : "#34d399";
  const statusColor = isLow ? "#f87171" : isMedium ? "#fbbf24" : "#34d399";

  const pct = Math.min((balance / 1000) * 100, 100);

  return (
    <motion.div
      initial={{ scale: 0.93, opacity: 0, y: 20 }}
      animate={{ scale: 1,    opacity: 1, y: 0  }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="balance-card"
      style={{ padding: 28 }}
    >
      {/* Orb decorations */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 180, height: 180,
        borderRadius: "50%", background: "rgba(120,60,255,0.22)", filter: "blur(50px)",
        pointerEvents: "none", animation: "orb-drift 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: -40, left: -40, width: 130, height: 130,
        borderRadius: "50%", background: "rgba(0,150,255,0.15)", filter: "blur(40px)",
        pointerEvents: "none", animation: "orb-drift 10s ease-in-out infinite reverse",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          {/* Icon + label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>
                Power Credit
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>
                ● {statusLabel}
              </p>
            </div>
          </div>

          {/* Sync badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 99,
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.28)",
          }}>
            <div style={{ position: "relative", width: 6, height: 6 }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#34d399",
                animation: "ping 1.5s ease-out infinite",
              }} />
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#34d399",
              }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: "rgba(52,211,153,0.9)" }}>
              Synced
            </span>
          </div>
        </div>

        {/* Balance amount */}
        <div style={{ marginBottom: 22 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: "flex", alignItems: "baseline", gap: 8 }}
          >
            <span style={{
              fontSize: 52, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.04em", lineHeight: 1,
            }}>
              ৳{balance?.toLocaleString("en-IN") || "0"}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>
              BDT
            </span>
          </motion.div>
          <p style={{ fontSize: 11, marginTop: 5, color: "rgba(255,255,255,0.4)" }}>
            Available balance · updated now
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)",
            marginBottom: 7,
          }}>
            <span>Usage Level</span>
            <span>{Math.round(pct)}% of ৳1,000</span>
          </div>
          <div style={{
            height: 6, borderRadius: 99, overflow: "hidden",
            background: "rgba(255,255,255,0.12)",
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 99,
                background: barColor,
                boxShadow: `0 0 10px ${barGlow}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: "absolute", right: 20, bottom: 12,
        fontSize: 70, fontWeight: 900, fontStyle: "italic",
        color: "rgba(255,255,255,0.04)",
        pointerEvents: "none", userSelect: "none", lineHeight: 1,
      }}>⚡</div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes orb-drift {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(20px,-15px) scale(1.06); }
          66%  { transform: translate(-15px,12px) scale(0.94); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </motion.div>
  );
}