import Product from "../models/Product.js";
const fields = ["name", "price", "description", "image", "category"];
const productData = (body = {}) => Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));
const badRequest = (res, error) => res.status(400).json({ message: error.name === "CastError" ? "Invalid product ID or field value" : error.message });
export async function getProducts(req, res) {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ message: "Could not load products" }); }
}
export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) { badRequest(res, error); }
}
export async function createProduct(req, res) {
  try { res.status(201).json(await Product.create(productData(req.body))); }
  catch (error) { badRequest(res, error); }
}
export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: productData(req.body) }, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) { badRequest(res, error); }
}
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) { badRequest(res, error); }
}
