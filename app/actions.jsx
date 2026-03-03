"use server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

// আপনার স্ক্রিনশট অনুযায়ী স্কিমা এবং কালেকশন নাম
const BillSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  history: [{
    type: { type: String, enum: ['recharge', 'bill'] },
    amount: Number,
    date: { type: Date, default: Date.now },
    prevBalance: Number
  }]
}, { collection: 'billing_db', timestamps: true }); //

const Bill = mongoose.models.Bill || mongoose.model("Bill", BillSchema);

export async function fetchUserData(email) {
  try {
    await connectDB();
    const record = await Bill.findOne({ userEmail: email });
    return record ? JSON.parse(JSON.stringify(record)) : null;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export async function syncTransaction(email, amount, type) {
  try {
    await connectDB();
    let record = await Bill.findOne({ userEmail: email });
    
    if (!record) {
      record = new Bill({ userEmail: email, balance: 0, history: [] });
    }

    const prevBalance = Number(record.balance || 0); // নিশ্চিত করা হচ্ছে এটি সংখ্যা
    const numAmount = Number(amount); // ইনপুটকে সংখ্যায় রূপান্তর

    let newBalance = type === "recharge" ? prevBalance + numAmount : prevBalance - numAmount;

    // ডাটাবেস আপডেট লজিক
    const updated = await Bill.findOneAndUpdate(
      { userEmail: email },
      { 
        $set: { balance: newBalance },
        $push: { 
          history: { 
            $each: [{ type, amount: numAmount, date: new Date(), prevBalance }],
            $position: 0 
          } 
        }
      },
      { upsert: true, new: true }
    );

    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.error("Database Save Error:", error);
    throw new Error("Failed to save to MongoDB");
  }
}