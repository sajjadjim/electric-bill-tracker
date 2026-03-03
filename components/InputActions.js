"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputActions({ onSync }) {
  const [amountInput, setAmountInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showButtons, setShowButtons] = useState(false); // বাটন লুকানোর জন্য স্টেট

  const handleAction = async (type) => {
    const num = Number(amountInput);
    if (!num || num <= 0) return alert("Please enter a valid amount");

    setIsProcessing(true);
    try {
      await onSync(type, num);
      setAmountInput("");
      setShowButtons(false); // কাজ শেষ হলে বাটন আবার লুকিয়ে যাবে
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-slate-800/50 shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          Transaction Panel
        </p>
        
        {/* Amount Input Section */}
        <div className="relative mb-8">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500 italic">৳</span>
          <input 
            type="number" 
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="0.00" 
            className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl py-6 pl-12 pr-6 text-white text-4xl font-black outline-none focus:border-blue-500/30 transition-all text-right tracking-tighter shadow-inner"
          />
        </div>

        {/* Main Quick Transaction Button */}
        {!showButtons ? (
          <motion.button
            layoutId="action-btn"
            onClick={() => setShowButtons(true)}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all text-xs tracking-[0.2em] uppercase"
          >
            ⚡ Quick Transaction
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button 
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                onClick={() => handleAction('recharge')} 
                className="bg-emerald-500 text-white py-5 rounded-3xl shadow-lg shadow-emerald-500/20 font-black text-[10px] tracking-widest hover:bg-emerald-400 transition-all"
              >
                {isProcessing ? 'SYNC...' : 'TOPUP +'}
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                onClick={() => handleAction('bill')} 
                className="bg-rose-500 text-white py-5 rounded-3xl shadow-lg shadow-rose-500/20 font-black text-[10px] tracking-widest hover:bg-rose-400 transition-all"
              >
                {isProcessing ? 'SYNC...' : 'EXPENSE -'}
              </motion.button>

              {/* Cancel Button to hide Topup/Expense */}
              <button 
                onClick={() => setShowButtons(false)}
                className="col-span-2 text-[9px] text-slate-600 font-bold uppercase mt-2 hover:text-slate-400 transition-colors"
              >
                ✕ Close Actions
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
    </div>
  );
}