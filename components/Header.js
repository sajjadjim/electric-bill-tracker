"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header({ user, selectedMonth, setMonth }) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-20">
      {/* Brand & User Info */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
          <span className="text-blue-500">⚡</span> VOLT-DASH
        </h1>
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            System Online • {user?.displayName || "User"}
          </p>
        </div>
      </div>

      {/* Controls: Month Selector & Logout */}
      <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2 px-3">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <select 
            value={selectedMonth} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="bg-transparent text-xs font-black text-slate-300 outline-none cursor-pointer hover:text-blue-400 transition-colors"
          >
            {months.map((month, index) => (
              <option key={index} value={index} className="bg-slate-900 text-white">
                {month} Statistics
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => signOut(auth)}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-rose-500/20"
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
}