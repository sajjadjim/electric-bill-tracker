"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { calculateUnitsFromBill, getSlabInfo, DEFAULT_STEP_RATES, DEFAULT_FIXED } from "@/lib/desco";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CustomTooltip = ({ active, payload, label, isUnits }) => {
  if (!active || !payload?.length) return null;
  const dataPoint = payload[0].payload;
  return (
    <div style={{
      background: "rgba(10,5,30,0.96)", border: "1px solid rgba(124,58,237,0.35)",
      borderRadius: 14, padding: "12px 16px", fontSize: 12,
      backdropFilter: "blur(16px)", boxShadow: "0 10px 30px rgba(0,0,0,0.65)",
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.15em", color: "rgba(148,163,184,0.6)", marginBottom: 8 }}>
        Day {label}
      </p>
      {isUnits ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4" }} />
            <span style={{ color: "#06b6d4", fontWeight: 700 }}>
              Power Consumed: {dataPoint.consumption?.toFixed(2)} kWh
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171" }} />
            <span style={{ color: "#f87171", fontWeight: 700 }}>
              Money Expended: ৳{dataPoint.bill?.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        payload.map((e, i) => {
          const val = e.value;
          const name = e.name === "recharge" ? "Top-up" : "Bill";
          const prefix = "৳";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.fill || e.stroke }} />
              <span style={{ color: e.fill || e.stroke, fontWeight: 700 }}>
                {name}: {prefix}{val?.toFixed(2)}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default function MonthlyChart({ history, selectedMonth }) {
  const currentYear = new Date().getFullYear();
  const [chartType, setChartType] = useState("bar"); // "bar" or "area"
  const [metric, setMetric]       = useState("expense"); // "expense" or "units"
  const [showTariff, setShowTariff] = useState(false);

  // Sort monthly bills chronologically to apply cumulative block-billing
  const monthlyBills = history
    .filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === currentYear && item.type === "bill";
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute cumulative units map
  let cumulativeBillSum = 0;
  let prevCumulativeUnits = 0;
  const billUnitsMap = new Map();

  monthlyBills.forEach(item => {
    cumulativeBillSum += item.amount;
    const currentCumulativeUnits = calculateUnitsFromBill(cumulativeBillSum);
    const unitsForThisBill = currentCumulativeUnits - prevCumulativeUnits;
    billUnitsMap.set(item.date, Math.max(0, unitsForThisBill));
    prevCumulativeUnits = currentCumulativeUnits;
  });

  // Group by day of the month
  const chartData = history
    .filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => {
      const day = new Date(curr.date).getDate();
      let d = acc.find(x => x.day === day);
      if (!d) {
        d = { day, recharge: 0, bill: 0, consumption: 0 };
        acc.push(d);
      }
      if (curr.type === "recharge") {
        d.recharge += curr.amount;
      } else {
        d.bill += curr.amount;
        d.consumption += billUnitsMap.get(curr.date) || 0;
      }
      return acc;
    }, [])
    .sort((a, b) => a.day - b.day);

  // Totals for this month
  const totalTopup = chartData.reduce((s, d) => s + d.recharge, 0);
  const totalBill  = chartData.reduce((s, d) => s + d.bill, 0);
  const totalUnits = chartData.reduce((s, d) => s + d.consumption, 0);

  // Average unit cost
  const avgUnitCost = totalUnits > 0 ? totalBill / totalUnits : 0;

  // Active Slab
  const activeSlab = getSlabInfo(totalUnits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ borderRadius: 22, padding: 24, position: "relative", overflow: "hidden" }}
    >
      {/* ── Mini Stats Grid ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 12, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)",
        paddingBottom: 16
      }}>
        {/* Card 1: Total Expense */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "rgba(148,163,184,0.5)", letterSpacing: "0.06em" }}>Expense</span>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#f87171", marginTop: 2 }}>৳{totalBill.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
        </div>

        {/* Card 2: Estimated units */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "rgba(148,163,184,0.5)", letterSpacing: "0.06em" }}>Consumed</span>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#06b6d4", marginTop: 2 }}>{totalUnits.toFixed(1)} kWh</p>
        </div>

        {/* Card 3: Avg rate */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "rgba(148,163,184,0.5)", letterSpacing: "0.06em" }}>Avg Rate</span>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#a78bfa", marginTop: 2 }}>৳{avgUnitCost.toFixed(2)}/u</p>
        </div>

        {/* Card 4: Current Active Slab */}
        <div style={{
          background: `${activeSlab.color}08`, border: `1px solid ${activeSlab.color}25`,
          borderRadius: 12, padding: 12
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: activeSlab.color, letterSpacing: "0.06em" }}>Slab Tier</span>
          <p style={{ fontSize: 14, fontWeight: 900, color: activeSlab.color, marginTop: 4, textTransform: "uppercase" }}>{activeSlab.label}</p>
        </div>
      </div>

      {/* ── Chart Control Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16, marginBottom: 20
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <svg width="15" height="15" fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: "#f0f4ff",
              textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Monthly Overview
            </h2>
          </div>
          <p style={{ fontSize: 11, color: "rgba(148,163,184,0.55)" }}>
            {MONTHS[selectedMonth]} {currentYear} · Daily breakdown
          </p>
        </div>

        {/* Dynamic Toggles */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Metric Toggle */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 3
          }}>
            <button
              onClick={() => setMetric("expense")}
              style={{
                padding: "4px 10px", border: "none", borderRadius: 8, fontSize: 10,
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                background: metric === "expense" ? "rgba(124,58,237,0.2)" : "transparent",
                color: metric === "expense" ? "#a78bfa" : "rgba(148,163,184,0.5)",
              }}
            >
              Money (৳)
            </button>
            <button
              onClick={() => setMetric("units")}
              style={{
                padding: "4px 10px", border: "none", borderRadius: 8, fontSize: 10,
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                background: metric === "units" ? "rgba(6,182,212,0.2)" : "transparent",
                color: metric === "units" ? "#06b6d4" : "rgba(148,163,184,0.5)",
              }}
            >
              Power (kWh)
            </button>
          </div>

          {/* Graph Type Toggle */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 3
          }}>
            <button
              onClick={() => setChartType("bar")}
              style={{
                padding: "4px 10px", border: "none", borderRadius: 8, fontSize: 10,
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                background: chartType === "bar" ? "rgba(255,255,255,0.08)" : "transparent",
                color: chartType === "bar" ? "#fff" : "rgba(148,163,184,0.5)",
              }}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("area")}
              style={{
                padding: "4px 10px", border: "none", borderRadius: 8, fontSize: 10,
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                background: chartType === "area" ? "rgba(255,255,255,0.08)" : "transparent",
                color: chartType === "area" ? "#fff" : "rgba(148,163,184,0.5)",
              }}
            >
              Area
            </button>
          </div>
        </div>
      </div>

      {/* ── Chart Container ── */}
      {chartData.length === 0 ? (
        <div style={{
          height: 220, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>📊</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(148,163,184,0.45)" }}>
            No transactions this month
          </p>
        </div>
      ) : (
        <div style={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData} barGap={3} barCategoryGap="25%">
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 10, fontWeight: 600 }}
                  tickLine={false} axisLine={false} stroke="transparent"
                />
                <YAxis
                  tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 10 }}
                  tickLine={false} axisLine={false} stroke="transparent"
                  width={42} tickFormatter={v => metric === "units" ? `${v}u` : `৳${v}`}
                />
                <Tooltip content={<CustomTooltip isUnits={metric === "units"} />}
                  cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }} />

                {metric === "expense" ? (
                  <>
                    <Bar dataKey="recharge" name="recharge" fill="#60a5fa" radius={[6,6,2,2]} maxBarSize={16} />
                    <Bar dataKey="bill" name="bill" fill="#f87171" radius={[6,6,2,2]} maxBarSize={16} />
                  </>
                ) : (
                  <Bar dataKey="consumption" name="consumption" fill="#06b6d4" radius={[6,6,2,2]} maxBarSize={20} />
                )}
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRecharge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorBill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 10, fontWeight: 600 }}
                  tickLine={false} axisLine={false} stroke="transparent"
                />
                <YAxis
                  tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 10 }}
                  tickLine={false} axisLine={false} stroke="transparent"
                  width={42} tickFormatter={v => metric === "units" ? `${v}u` : `৳${v}`}
                />
                <Tooltip content={<CustomTooltip isUnits={metric === "units"} />} />

                {metric === "expense" ? (
                  <>
                    <Area type="monotone" dataKey="recharge" stroke="#60a5fa" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecharge)" />
                    <Area type="monotone" dataKey="bill" stroke="#f87171" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBill)" />
                  </>
                ) : (
                  <Area type="monotone" dataKey="consumption" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsumption)" />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Expandable Tariff Reference Panel ── */}
      <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
        <button
          onClick={() => setShowTariff(!showTariff)}
          style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 10,
            fontWeight: 700, color: "rgba(148,163,184,0.45)", textTransform: "uppercase",
            letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6, padding: 0
          }}
        >
          <span>{showTariff ? "▼ Hide DESCO Tariff Slab System" : "▶ Show DESCO Tariff Slab System"}</span>
        </button>

        {showTariff && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{
              marginTop: 12, padding: 14, borderRadius: 12,
              background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)",
              fontSize: 11
            }}
          >
            <p style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: 12 }}>DESCO LT-A Residential Tariff Structure</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                <span style={{ color: "#38bdf8" }}>⚡ Lifeline (0–50 units):</span>
                <span style={{ fontWeight: 700, color: "#38bdf8" }}>৳{DEFAULT_STEP_RATES.lifeline} / unit</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                <span style={{ color: "#34d399" }}>⚡ First Step (0–75 units):</span>
                <span style={{ fontWeight: 700, color: "#34d399" }}>৳{DEFAULT_STEP_RATES.step1} / unit</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                <span style={{ color: "#fbbf24" }}>⚡ Second Step (76–200 units):</span>
                <span style={{ fontWeight: 700, color: "#fbbf24" }}>৳{DEFAULT_STEP_RATES.step2} / unit</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                <span style={{ color: "#f97316" }}>⚡ Third Step (201–300 units):</span>
                <span style={{ fontWeight: 700, color: "#f97316" }}>৳{DEFAULT_STEP_RATES.step3} / unit</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 4 }}>
                <span style={{ color: "#f87171" }}>⚡ Higher Steps (300+ units):</span>
                <span style={{ fontWeight: 700, color: "#f87171" }}>৳{DEFAULT_STEP_RATES.step4} / unit</span>
              </div>
            </div>
            <p style={{ fontSize: 9, color: "rgba(148,163,184,0.4)", marginTop: 10, fontStyle: "italic", lineHeight: "1.4em" }}>
              Note: Lifeline rate applies only if your total consumption stays below 50 units. If it exceeds 50, regular steps apply. Total bill includes 5% VAT, a Demand Charge (৳{DEFAULT_FIXED.demandCharge}), and Meter Rent (৳{DEFAULT_FIXED.meterRent}).
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}