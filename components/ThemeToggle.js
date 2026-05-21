"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(124,92,247,0.15))"
          : "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(249,115,22,0.15))",
        border: isDark
          ? "1px solid rgba(79,142,247,0.3)"
          : "1px solid rgba(251,191,36,0.35)",
        boxShadow: isDark
          ? "0 0 12px rgba(79,142,247,0.15)"
          : "0 0 12px rgba(251,191,36,0.2)",
      }}
    >
      {/* Track */}
      <div
        className="relative w-9 h-5 rounded-full transition-all duration-500"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #4f8ef7, #7c5cf7)"
            : "linear-gradient(135deg, #fbbf24, #f97316)",
        }}
      >
        {/* Thumb */}
        <motion.div
          layout
          animate={{ x: isDark ? 16 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-[8px] leading-none"
            >
              {isDark ? "🌙" : "☀️"}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Label */}
      <span
        className="text-[10px] font-bold uppercase tracking-wider hidden sm:block"
        style={{
          color: isDark ? "rgba(148,163,184,0.8)" : "rgba(92,75,50,0.9)",
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </motion.button>
  );
}
