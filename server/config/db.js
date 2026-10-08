import mongoose from "mongoose";
export default async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("Set MONGO_URI in server/.env or Render Environment.");
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log("MongoDB Atlas connected!");
}
