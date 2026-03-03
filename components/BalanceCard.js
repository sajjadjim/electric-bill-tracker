"use client";
import { motion } from "framer-motion";

export default function BalanceCard({ balance }) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 relative overflow-hidden group border border-blue-400/20"
    >
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
            <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-[0.2em]">
            Available Power Credit
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-white tracking-tighter">
            ৳{balance?.toLocaleString() || 0}
          </span>
          <span className="text-blue-200/50 font-bold text-sm">BDT</span>
        </div>

        {/* Sync Indicator Animation */}
        <div className="mt-8 flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <p className="text-blue-100/50 text-[10px] font-bold tracking-widest uppercase">
            Cloud Sync Active
          </p>
        </div>
      </div>

      {/* Modern Background Text Decor */}
      <div className="absolute -bottom-6 -right-4 text-white/5 font-black text-8xl italic select-none pointer-events-none group-hover:text-white/10 transition-all duration-500">
        VOLT
      </div>
    </motion.div>
  );
}