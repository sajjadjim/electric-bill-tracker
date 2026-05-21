"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark"); // default until hydration
  // On mount: check localStorage → then system preference
  useEffect(() => {
    const stored = localStorage.getItem("voltdash-theme");
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      applyTheme(initial);
      setTheme(initial);
    }

    // Listen for OS-level changes (only when no manual pref stored)
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("voltdash-theme")) {
        const next = e.matches ? "dark" : "light";
        applyTheme(next);
        setTheme(next);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    localStorage.setItem("voltdash-theme", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
