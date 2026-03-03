"use client";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl max-w-sm w-full text-center relative z-10"
      >
        {/* Animated Icon */}
        <motion.div 
          animate={{ shadow: ["0 0 10px #3b82f6", "0 0 30px #3b82f6", "0 0 10px #3b82f6"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">VOLT-STASH</h1>
        <p className="text-slate-500 mb-10 text-xs font-bold uppercase tracking-widest">
          Personal Billing Management
        </p>

        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" />
          CONTINUE WITH GOOGLE
        </button>

        <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
          Authorized access only • sajjadjim15@gmail.com
        </p>
      </motion.div>
    </div>
  );
}