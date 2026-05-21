"use client";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export default function LoginScreen() {
  const handleLogin = async () => {
    try { await signInWithPopup(auth, provider); }
    catch (e) { console.error("Login Error:", e); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 24,
      position: "relative", zIndex: 1,
    }}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 360 }}
      >
        {/* Card */}
        <div className="card" style={{
          borderRadius: 28, padding: 36,
          textAlign: "center", position: "relative", overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.65), 0 0 60px rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.20)",
        }}>
          {/* Gradient top shimmer */}
          <div style={{
            position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.9), rgba(0,200,255,0.6), transparent)",
          }} />

          {/* Background orbs */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 160, height: 160,
            borderRadius: "50%", background: "rgba(124,58,237,0.14)", filter: "blur(50px)",
            pointerEvents: "none", animation: "orb-drift 7s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: -50, left: -50, width: 130, height: 130,
            borderRadius: "50%", background: "rgba(0,150,255,0.10)", filter: "blur(40px)",
            pointerEvents: "none", animation: "orb-drift 9s ease-in-out infinite reverse",
          }} />

          {/* Logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: 28, position: "relative", zIndex: 1 }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 22, margin: "0 auto",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              boxShadow: "0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.25)",
              animation: "pulse-neon 2.5s ease-in-out infinite",
            }}>
              <svg width="38" height="38" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              {/* Orbiting dot */}
              <div style={{
                position: "absolute", top: -4, right: -4,
                width: 12, height: 12, borderRadius: "50%",
                background: "#06b6d4",
                boxShadow: "0 0 10px #06b6d4",
                animation: "spin-slow 5s linear infinite",
              }} />
            </div>
          </motion.div>

          {/* Title */}
          <h1 style={{
            fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em",
            marginBottom: 4, lineHeight: 1,
          }}>
            <span style={{ color: "#f0f4ff" }}>VOLT</span>
            <span className="gradient-text">DASH</span>
          </h1>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.25em", color: "rgba(148,163,184,0.55)", marginBottom: 28,
          }}>
            Electric Bill Management
          </p>

          {/* Divider */}
          <div style={{
            height: 1, marginBottom: 24,
            background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)",
          }} />

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 12, padding: "14px 20px", borderRadius: 14, cursor: "pointer",
              background: "rgba(255,255,255,0.07)", color: "#f0f4ff",
              border: "1px solid rgba(255,255,255,0.15)", fontSize: 14, fontWeight: 700,
              transition: "all 0.25s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              style={{ width: 20, height: 20 }} alt="G"
            />
            Continue with Google
          </motion.button>

          {/* Footer */}
          <p style={{
            marginTop: 24, fontSize: 10, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.2em", color: "rgba(100,116,139,0.55)",
          }}>
            🔒 Authorized Access Only
          </p>
          <p style={{ marginTop: 4, fontSize: 10, color: "rgba(100,116,139,0.35)" }}>
            sajjadjim15@gmail.com
          </p>
        </div>

        <p style={{
          textAlign: "center", marginTop: 20, fontSize: 11, fontWeight: 500,
          color: "rgba(100,116,139,0.4)",
        }}>
          VoltDash v2.0 · Firebase + MongoDB
        </p>
      </motion.div>

      <style>{`
        @keyframes pulse-neon {
          0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.6), 0 0 50px rgba(124,58,237,0.2); }
          50% { box-shadow: 0 0 35px rgba(124,58,237,1.0), 0 0 80px rgba(124,58,237,0.45); }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes orb-drift {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(25px,-18px) scale(1.06); }
          66%  { transform: translate(-18px,14px) scale(0.94); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </div>
  );
}