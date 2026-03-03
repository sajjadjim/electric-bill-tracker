"use client";
export default function TransactionTable({ history, selectedMonth }) {
  const filteredData = history.filter(item => new Date(item.date).getMonth() === selectedMonth);

  return (
    <div className="bg-slate-900/30 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800/50 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
        <h4 className="text-xs font-black text-white uppercase tracking-widest">Monthly Logs</h4>
        <span className="text-[10px] text-slate-500 font-bold">{filteredData.length} entries</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 font-black uppercase tracking-tighter border-b border-slate-800/50">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, i) => (
              <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-mono">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${item.type === 'recharge' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {item.type.toUpperCase()}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-black ${item.type === 'recharge' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ৳{item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}