import mongoose from "mongoose";
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Electric Bill Management Database");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
export default connectDB;