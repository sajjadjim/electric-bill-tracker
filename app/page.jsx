"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { syncTransaction, fetchUserData } from "./actions"; // MongoDB Server Actions

// কম্পোনেন্ট ইমপোর্ট
import Header from "@/components/Header";
import LoginScreen from "@/components/LoginScreen";
import BalanceCard from "@/components/BalanceCard";
import InputActions from "@/components/InputActions";
import MonthlyChart from "@/components/MonthlyChart";
import TransactionTable from "@/components/TransactionTable";

export default function ElectricDashboard() {
  // --- ১. স্টেট ম্যানেজমেন্ট ---
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);

  const MY_EMAIL = "sajjadjim15@gmail.com"; // আপনার ভেরিফাইড ইমেইল

  // --- ২. অথেন্টিকেশন এবং ডাটা ফেচিং ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email === MY_EMAIL) {
        setUser(currentUser);
        // ডাটাবেস থেকে প্রাথমিক ডাটা নিয়ে আসা
        const data = await fetchUserData(currentUser.email);
        if (data) {
          setBalance(Number(data.balance) || 0); // নিশ্চিত করা হচ্ছে এটি সংখ্যা
          setHistory(data.history || []);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- ৩. ট্রানজ্যাকশন হ্যান্ডেলার (Recharge/Bill) ---
  const handleTransaction = async (type, amount) => {
    if (!user) return alert("Please login first");

    try {
      // সার্ভার অ্যাকশন কল করে ডাটাবেসে সেভ করা
      const updatedData = await syncTransaction(user.email, amount, type);
      
      if (updatedData) {
        // রিয়েল-টাইম UI আপডেট (NaN এরর প্রতিরোধ করতে Number ব্যবহার)
        setBalance(Number(updatedData.balance));
        setHistory(updatedData.history);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      alert("Failed to save to database. Check MongoDB IP Access.");
    }
  };

  // --- ৪. লোডিং এবং লগইন গার্ড ---
  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  if (!user) return <LoginScreen />;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-10 font-sans">
      {/* Background Glows for Eye-smoothing UI */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* টপ বার এবং মাস সিলেক্টর */}
        <Header 
          user={user} 
          selectedMonth={selectedMonth} 
          setMonth={setSelectedMonth} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* বাম পাশ: ব্যালেন্স এবং ইনপুট অ্যাকশন */}
          <aside className="lg:col-span-4 space-y-8">
            <BalanceCard balance={balance} />
            <InputActions onSync={handleTransaction} />
          </aside>

          {/* ডান পাশ: গ্রাফ এবং হিস্ট্রি টেবিল */}
          <section className="lg:col-span-8 space-y-8">
            {/* মাসিক গ্রাফ (হিস্টোগ্রাম) */}
            <MonthlyChart 
              history={history} 
              selectedMonth={selectedMonth} 
            />
            
            {/* ট্রানজ্যাকশন লগ টেবিল */}
            <TransactionTable 
              history={history} 
              selectedMonth={selectedMonth} 
            />
          </section>
        </div>
      </div>
    </main>
  );
}