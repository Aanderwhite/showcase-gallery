import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.get("/", (req, res) => res.json({ message: "ShowCase API is running!" }));
app.use("/api/products", productRoutes);
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));
app.use((error, req, res, next) => {
  const status = error.type === "entity.too.large" ? 413 : error.status || 500;
  res.status(status).json({ message: status === 413 ? "Image payload is too large" : status === 400 ? "Invalid JSON body" : "Server error" });
});
try {
  await connectDB();
  app.listen(process.env.PORT || 5000, "0.0.0.0", () => console.log(`Server running on port ${process.env.PORT || 5000}`));
} catch {
  console.error("MongoDB connection failed. Check MONGO_URI, database credentials, and Atlas network access.");
  process.exit(1);
}
