import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

// Photograph sources: Unsplash. Store image bytes in Atlas, not just external URLs.
const samples = [
  ["Studio Headphones", 1499, "Electronics", "Comfortable over-ear headphones for listening to music and studying. The padded ear cups and adjustable headband make them easy to wear.", "photo-1505740420928-5e560c06d30e"],
  ["Everyday Backpack", 1250, "Accessories", "A practical backpack for your daily essentials and school supplies. The roomy main compartment keeps your belongings together.", "photo-1553062407-98eeb64c6a62"],
  ["Classic Wristwatch", 2499, "Accessories", "A classic wristwatch with a clear dial and a comfortable strap. Its simple design works with casual and formal outfits.", "photo-1524805444758-089113d48a6d"],
  ["Instant Camera", 3299, "Electronics", "An instant camera for recording everyday moments and special occasions. Its compact design makes it convenient to carry.", "photo-1516035069371-29a1b244cc32"],
  ["Everyday Sneakers", 1899, "Footwear", "Comfortable sneakers for walking around campus and everyday outings. The versatile design pairs easily with casual clothes.", "photo-1542291026-7eec264c27ff"],
  ["Coffee Mug", 220, "Home", "A reusable mug for your morning coffee or afternoon tea. Its comfortable handle makes it easy to use at home or at your desk.", "photo-1514228742587-6b1558fcca3d"],
];

try {
  await connectDB();
  for (const [name, price, category, description, photo] of samples) {
    if (await Product.exists({ name })) { console.log(`Already exists: ${name}`); continue; }
    const response = await fetch(`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=75`);
    if (!response.ok) throw new Error(`Could not download photograph for ${name}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 1024 * 1024) throw new Error(`Photograph exceeds 1MB: ${name}`);
    const type = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    await Product.create({ name, price, category, description, image: `data:${type};base64,${bytes.toString("base64")}` });
    console.log(`Saved product and image to Atlas: ${name}`);
  }
} finally { await mongoose.disconnect(); }
