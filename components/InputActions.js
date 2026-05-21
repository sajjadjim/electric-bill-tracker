"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBill, calculateUnitsFromBill, getSlabInfo } from "@/lib/desco";

const QUICK = [50, 100, 200, 500];

export default function InputActions({ onSync }) {
  const [activeTab, setActiveTab]   = useState("quick"); // "quick" or "desco"
  const [amount, setAmount]         = useState("");
  const [processing, setProcessing] = useState(false);
  const [showBtns, setShowBtns]     = useState(false);

  // DESCO calculator state
  const [calcUnits, setCalcUnits]   = useState("");
  const [demandCharge, setDemandCharge] = useState(80);
  const [meterRent, setMeterRent]       = useState(40);
  const [vatPercent, setVatPercent]     = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const quickEstimatedUnits = amount ? calculateUnitsFromBill(Number(amount)) : 0;
  const quickSlab = quickEstimatedUnits ? getSlabInfo(quickEstimatedUnits) : null;

  const calculatedBill = calcUnits ? calculateBill(Number(calcUnits), Number(demandCharge), Number(meterRent), Number(vatPercent)) : null;
  const calcSlab = calcUnits ? getSlabInfo(Number(calcUnits)) : null;

  const handleAction = async (type, amtOverride = null) => {
    const finalAmount = amtOverride !== null ? amtOverride : Number(amount);
    if (!finalAmount || finalAmount <= 0) return alert("Enter a valid amount");
    setProcessing(true);
    try {
      await onSync(type, finalAmount);
      setAmount("");
      setCalcUnits("");
      setShowBtns(false);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ borderRadius: 22, padding: 24, position: "relative", overflow: "hidden" }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 120, height: 120,
        borderRadius: "50%", background: "rgba(124,58,237,0.10)", filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      {/* Title & Tabs */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10, marginBottom: 18
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" fill="none" stroke="#a78bfa" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.2em", color: "rgba(148,163,184,0.6)" }}>
            VoltActions
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 3
        }}>
          <button
            onClick={() => setActiveTab("quick")}
            style={{
              padding: "5px 12px", border: "none", borderRadius: 8, fontSize: 11,
              fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
              background: activeTab === "quick" ? "rgba(124,58,237,0.22)" : "transparent",
              color: activeTab === "quick" ? "#a78bfa" : "rgba(148,163,184,0.5)",
              border: activeTab === "quick" ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
            }}
          >
            Quick ৳
          </button>
          <button
            onClick={() => setActiveTab("desco")}
            style={{
              padding: "5px 12px", border: "none", borderRadius: 8, fontSize: 11,
              fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
              background: activeTab === "desco" ? "rgba(124,58,237,0.22)" : "transparent",
              color: activeTab === "desco" ? "#a78bfa" : "rgba(148,163,184,0.5)",
              border: activeTab === "desco" ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
            }}
          >
            DESCO Calculator
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "quick" ? (
          <motion.div
            key="quick-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Amount input */}
            <div style={{
              marginBottom: 14, borderRadius: 14, overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${amount ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: amount ? "0 0 0 3px rgba(124,58,237,0.10)" : "none",
              transition: "all 0.25s",
            }}>
              <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#a78bfa", flexShrink: 0 }}>৳</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#f0f4ff", fontSize: 26, fontWeight: 900,
                    textAlign: "right", letterSpacing: "-0.03em", minWidth: 0,
                  }}
                />
              </div>
            </div>

            {/* Live Units Estimator */}
            {amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: 10, background: "rgba(124,58,237,0.06)",
                  border: "1px solid rgba(124,58,237,0.12)", marginBottom: 14, fontSize: 11
                }}
              >
                <span style={{ color: "rgba(148,163,184,0.7)", fontWeight: 600 }}>Estimated Power:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: quickSlab?.color || "#fff", fontWeight: 800 }}>
                    {quickSlab?.label}
                  </span>
                  <span style={{ color: "#a78bfa", fontWeight: 900, fontSize: 13 }}>
                    ⚡ {quickEstimatedUnits.toFixed(1)} kWh
                  </span>
                </div>
              </motion.div>
            )}

            {/* Quick chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
              {QUICK.map((q) => {
                const active = amount === String(q);
                return (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setAmount(String(q))}
                    style={{
                      padding: "8px 4px", borderRadius: 10, cursor: "pointer", fontSize: 12,
                      fontWeight: 700, border: "1px solid",
                      background: active ? "rgba(124,58,237,0.22)" : "rgba(255,255,255,0.04)",
                      borderColor: active ? "rgba(124,58,237,0.55)" : "rgba(255,255,255,0.08)",
                      color: active ? "#a78bfa" : "rgba(148,163,184,0.65)",
                      transition: "all 0.2s",
                    }}
                  >
                    ৳{q}
                  </motion.button>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 18 }} />

            {/* Action buttons */}
            <AnimatePresence mode="wait">
              {!showBtns ? (
                <motion.button
                  key="main"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBtns(true)}
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px", borderRadius: 14, fontSize: 13 }}
                >
                  ⚡ Choose Transaction Type
                </motion.button>
              ) : (
                <motion.div
                  key="split"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={processing}
                      onClick={() => handleAction("recharge")}
                      className="btn-topup"
                      style={{
                        padding: "14px", borderRadius: 14, fontSize: 13,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      {processing ? "Saving…" : "Top-up"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={processing}
                      onClick={() => handleAction("bill")}
                      className="btn-bill"
                      style={{
                        padding: "14px", borderRadius: 14, fontSize: 13,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"/>
                      </svg>
                      {processing ? "Saving…" : "Bill Pay"}
                    </motion.button>
                  </div>
                  <button
                    onClick={() => setShowBtns(false)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "rgba(148,163,184,0.45)", fontSize: 11, fontWeight: 600,
                      textTransform: "uppercase", letterSpacing: "0.12em", padding: 6,
                    }}
                  >
                    ✕ Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="desco-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Units Input */}
            <div style={{
              marginBottom: 14, borderRadius: 14, overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${calcUnits ? "rgba(6,182,212,0.55)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: calcUnits ? "0 0 0 3px rgba(6,182,212,0.10)" : "none",
              transition: "all 0.25s",
            }}>
              <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Units</span>
                <input
                  type="number"
                  value={calcUnits}
                  onChange={(e) => setCalcUnits(e.target.value)}
                  placeholder="0.0"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#f0f4ff", fontSize: 26, fontWeight: 900,
                    textAlign: "right", letterSpacing: "-0.03em", minWidth: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(148,163,184,0.6)" }}>kWh</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            {calculatedBill && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "16px", borderRadius: 14, background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)", marginBottom: 14,
                  display: "flex", flexDirection: "column", gap: 8, fontSize: 12
                }}
              >
                {/* Active Slab Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 6 }}>
                  <span style={{ color: "rgba(148,163,184,0.6)" }}>Slab Class:</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                    padding: "3px 8px", borderRadius: 6, background: `${calcSlab?.color}15`, border: `1px solid ${calcSlab?.color}40`, color: calcSlab?.color
                  }}>
                    {calcSlab?.label} ({calcSlab?.range})
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(148,163,184,0.6)" }}>Energy Charge:</span>
                  <span style={{ fontWeight: 600 }}>৳{calculatedBill.energyCharge.toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(148,163,184,0.6)" }}>Fixed Charges (Rent + Demand):</span>
                  <span style={{ fontWeight: 600 }}>৳{(Number(demandCharge) + Number(meterRent)).toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(148,163,184,0.6)" }}>Govt VAT ({vatPercent}%):</span>
                  <span style={{ fontWeight: 600 }}>৳{calculatedBill.vat.toFixed(2)}</span>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 6, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <span style={{ fontWeight: 700, color: "#fff" }}>Total Electric Bill:</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#06b6d4" }}>
                    ৳{calculatedBill.total.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Expandable Settings */}
            <div style={{ marginBottom: 14 }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: "none", border: "none", cursor: "pointer", fontSize: 10,
                  fontWeight: 700, color: "rgba(148,163,184,0.45)", textTransform: "uppercase",
                  letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 4, padding: 0
                }}
              >
                {showSettings ? "▼ Hide Calculator Settings" : "▶ Show Calculator Settings"}
              </button>

              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{
                    marginTop: 10, padding: 12, borderRadius: 10,
                    background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", flexDirection: "column", gap: 10, fontSize: 11
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <span style={{ color: "rgba(148,163,184,0.5)", display: "block", marginBottom: 3 }}>Demand Charge (৳)</span>
                      <input
                        type="number"
                        value={demandCharge}
                        onChange={(e) => setDemandCharge(e.target.value)}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8, padding: "6px 10px", color: "#fff", fontWeight: 600
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ color: "rgba(148,163,184,0.5)", display: "block", marginBottom: 3 }}>Meter Rent (৳)</span>
                      <input
                        type="number"
                        value={meterRent}
                        onChange={(e) => setMeterRent(e.target.value)}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8, padding: "6px 10px", color: "#fff", fontWeight: 600
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "rgba(148,163,184,0.5)", display: "block", marginBottom: 3 }}>VAT Rate ({vatPercent}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      value={vatPercent}
                      onChange={(e) => setVatPercent(e.target.value)}
                      style={{ width: "100%", accentColor: "#06b6d4" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Save Bill Action */}
            <motion.button
              whileHover={{ scale: calculatedBill ? 1.02 : 1 }}
              whileTap={{ scale: calculatedBill ? 0.98 : 1 }}
              disabled={!calculatedBill || processing}
              onClick={() => handleAction("bill", Number(calculatedBill.total.toFixed(2)))}
              style={{
                width: "100%", padding: "14px", borderRadius: 14, fontSize: 13,
                border: "none", fontWeight: 700, cursor: calculatedBill ? "pointer" : "not-allowed",
                background: calculatedBill ? "linear-gradient(135deg, #06b6d4, #0891b2)" : "rgba(255,255,255,0.05)",
                color: calculatedBill ? "#fff" : "rgba(148,163,184,0.3)",
                boxShadow: calculatedBill ? "0 8px 24px rgba(6,182,212,0.3)" : "none",
                transition: "all 0.25s"
              }}
            >
              {processing ? "Saving..." : "⚡ Save as Bill Transaction"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}