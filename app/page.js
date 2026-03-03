import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Fixed import
import connectDB from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { updateBill } from "./actions";

// ... rest of your code

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) return <div className="p-10 text-center">Please Sign In with Google</div>;
  if (session.user.email !== process.env.ALLOWED_EMAIL) return <div className="p-10 text-red-500">Access Denied</div>;

  await connectDB();
  const data = await Bill.findOne({ userEmail: session.user.email });

  return (
    <main className="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Electric Tracker</h1>
      
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg mb-6 text-center">
        <p className="text-sm opacity-80">Current Balance</p>
        <h2 className="text-4xl font-bold">৳ {data?.balance || 0}</h2>
      </div>

      <div className="space-y-4">
        {/* Recharge Form */}
        <form action={async (formData) => {
          "use server";
          await updateBill(session.user.email, formData.get("amount"), "recharge");
        }} className="flex gap-2">
          <input name="amount" type="number" placeholder="Recharge amount" className="border p-2 flex-1 rounded" required />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Recharge</button>
        </form>

        {/* Expense Form */}
        <form action={async (formData) => {
          "use server";
          await updateBill(session.user.email, formData.get("amount"), "expense");
        }} className="flex gap-2">
          <input name="amount" type="number" placeholder="Bill amount" className="border p-2 flex-1 rounded" required />
          <button className="bg-red-500 text-white px-4 py-2 rounded">Add Bill</button>
        </form>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {data?.history.map((item, i) => (
            <div key={i} className="p-3 border-b flex justify-between">
              <span className={item.type === 'recharge' ? 'text-green-600' : 'text-red-600'}>
                {item.type === 'recharge' ? '+' : '-'} {item.amount}
              </span>
              <span className="text-gray-400 text-xs">{new Date(item.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}