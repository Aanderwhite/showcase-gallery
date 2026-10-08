import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name is required"], trim: true },
  price: { type: Number, required: [true, "Price is required"], min: [0, "Price cannot be negative"] },
  description: { type: String, default: "", trim: true },
  image: { type: String, required: [true, "Image is required"] },
  category: { type: String, default: "General", trim: true },
}, { timestamps: true });
export default mongoose.model("Product", productSchema);
