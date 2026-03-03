"use server";
import connectDB from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { revalidatePath } from "next/cache";

export async function updateBill(email, amount, type) {
  await connectDB();
  let record = await Bill.findOne({ userEmail: email });
  
  if (!record) {
    record = new Bill({ userEmail: email, balance: 0 });
  }

  if (type === "recharge") {
    record.balance += Number(amount);
  } else {
    record.balance -= Number(amount);
  }

  record.history.unshift({ type, amount: Number(amount) });
  await record.save();
  revalidatePath("/"); // Refreshes the UI
}