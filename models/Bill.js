import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  userEmail: String,
  balance: { type: Number, default: 0 },
  history: [{
    type: { type: String, enum: ['recharge', 'expense'] },
    amount: Number,
    date: { type: Date, default: Date.now }
  }]
});

export default mongoose.models.Bill || mongoose.model("Bill", BillSchema);