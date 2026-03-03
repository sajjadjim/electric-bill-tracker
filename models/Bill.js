import mongoose from "mongoose";
const BillSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  history: [{
    type: { type: String, enum: ['recharge', 'bill'] },
    amount: Number,
    date: { type: Date, default: Date.now },
    prevBalance: Number
  }]
}, { timestamps: true });
export default mongoose.models.Bill || mongoose.model("Bill", BillSchema);