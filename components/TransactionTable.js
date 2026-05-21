"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TransactionTable({ history, selectedMonth }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page whenever selected month changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth]);

  const filtered = history
    .filter(item => new Date(item.date).getMonth() === selectedMonth)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalTopup = filtered.filter(i => i.type === "recharge").reduce((s, i) => s + i.amount, 0);
  const totalBill  = filtered.filter(i => i.type === "bill").reduce((s, i) => s + i.amount, 0);
  const net        = totalTopup - totalBill;

  // Pagination parameters
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const COL = "48px 1fr 120px 110px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="card"
      style={{ borderRadius: 22, overflow: "hidden" }}
    >
      {/* Table header */}
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="15" height="15" fill="none" stroke="#a78bfa" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#f0f4ff",
              textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Transaction History
            </h3>
            <p style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", marginTop: 2 }}>
              {filtered.length} entries this month
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.15em", color: "rgba(148,163,184,0.45)", marginBottom: 2 }}>
            Net Balance
          </p>
          <p style={{
            fontSize: 16, fontWeight: 900,
            color: net >= 0 ? "#34d399" : "#f87171",
            letterSpacing: "-0.02em",
          }}>
            {net >= 0 ? "+" : ""}৳{net.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div style={{
          padding: "60px 24px", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, fontSize: 24,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>📋</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(148,163,184,0.45)" }}>
            No transactions yet
          </p>
          <p style={{ fontSize: 12, color: "rgba(148,163,184,0.3)" }}>
            Add your first transaction above
          </p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: COL,
            padding: "10px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.02)",
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "rgba(100,116,139,0.6)",
          }}>
            <span>#</span>
            <span>Date &amp; Time</span>
            <span>Type</span>
            <span style={{ textAlign: "right" }}>Amount</span>
          </div>

          {/* Rows (paginated) */}
          {paginated.map((item, i) => {
            const isTopup = item.type === "recharge";
            const date    = new Date(item.date);
            const absoluteIndex = (currentPage - 1) * itemsPerPage + i + 1;
            return (
              <motion.div
                key={absoluteIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.25) }}
                style={{
                  display: "grid", gridTemplateColumns: COL,
                  padding: "13px 24px", alignItems: "center",
                  borderBottom: i < paginated.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Index */}
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(100,116,139,0.45)",
                  fontVariantNumeric: "tabular-nums" }}>
                  {String(absoluteIndex).padStart(2, "0")}
                </span>

                {/* Date */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#c8d8ff" }}>
                    {date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p style={{ fontSize: 10, marginTop: 2, color: "rgba(148,163,184,0.5)" }}>
                    {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Badge */}
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 99, fontSize: 10,
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    background: isTopup ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                    border: `1px solid ${isTopup ? "rgba(52,211,153,0.28)" : "rgba(248,113,113,0.28)"}`,
                    color: isTopup ? "#34d399" : "#f87171",
                  }}>
                    {isTopup ? "▲" : "▼"} {isTopup ? "Top-up" : "Bill"}
                  </span>
                </div>

                {/* Amount */}
                <p style={{
                  fontSize: 14, fontWeight: 900, textAlign: "right",
                  letterSpacing: "-0.02em",
                  color: isTopup ? "#34d399" : "#f87171",
                }}>
                  {isTopup ? "+" : "-"}৳{item.amount?.toLocaleString()}
                </p>
              </motion.div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.01)"
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  background: currentPage === 1 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: currentPage === 1 ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.85)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (currentPage !== 1) e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; }}
                onMouseLeave={e => { if (currentPage !== 1) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                ◀ Prev
              </button>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.55)" }}>
                Page <span style={{ color: "#a78bfa", fontWeight: 800 }}>{currentPage}</span> of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  background: currentPage === totalPages ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: currentPage === totalPages ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.85)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (currentPage !== totalPages) e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; }}
                onMouseLeave={e => { if (currentPage !== totalPages) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                Next ▶
              </button>
            </div>
          )}

          {/* Footer total */}
          <div style={{
            display: "grid", gridTemplateColumns: COL,
            padding: "14px 24px", alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.025)",
          }}>
            <span />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: "rgba(148,163,184,0.5)", gridColumn: "2/4" }}>
              Monthly Net
            </span>
            <span style={{
              fontSize: 15, fontWeight: 900, textAlign: "right", letterSpacing: "-0.02em",
              color: net >= 0 ? "#34d399" : "#f87171",
            }}>
              {net >= 0 ? "+" : ""}৳{net.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}