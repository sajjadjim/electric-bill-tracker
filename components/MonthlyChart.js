"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MonthlyChart({ history, selectedMonth }) {
  // ১. নির্দিষ্ট মাস এবং বর্তমান বছরের ডাটা ফিল্টার করা
  const currentYear = new Date().getFullYear();
  
  const chartData = history
    .filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => {
      const day = new Date(curr.date).getDate();
      let dayData = acc.find(d => d.day === day);
      if (!dayData) {
        dayData = { day, recharge: 0, bill: 0 };
        acc.push(dayData);
      }
      if (curr.type === 'recharge') dayData.recharge += curr.amount;
      else dayData.bill += curr.amount;
      return acc;
    }, [])
    .sort((a, b) => a.day - b.day);

  return (
    <div className="bg-slate-900/30 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-slate-800/50 h-72 shadow-xl">
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
          <Tooltip cursor={{fill: '#1e293b50'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
          <Bar dataKey="recharge" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="bill" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}