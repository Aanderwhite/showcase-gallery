import 'dotenv/config';
import mongoose from 'mongoose';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
const samples = JSON.parse(await readFile(new URL('./nike-products.json', import.meta.url), 'utf8'));
const formerNames = ['Studio Headphones', 'Everyday Backpack', 'Classic Wristwatch', 'Instant Camera', 'Everyday Sneakers', 'Coffee Mug'];
const replaceExisting = process.argv.includes('--replace-samples');
try {
  const prepared = [];
  for (const sample of samples) {
    const response = await fetch(sample.image);
    if (!response.ok) throw new Error('Image download failed: ' + sample.name);
    const type = response.headers.get('content-type')?.split(';')[0];
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!type?.startsWith('image/') || !bytes.length || bytes.length > 1024 * 1024) throw new Error('Invalid image: ' + sample.name);
    prepared.push({ name: sample.name, price: sample.price, category: sample.category, description: sample.description, image: 'data:' + type + ';base64,' + bytes.toString('base64') });
  }
  await connectDB();
  if (replaceExisting) {
    const originals = await Product.find({ name: { $in: formerNames } }).lean();
    const folder = new URL('../../submission/evidence/', import.meta.url);
    await mkdir(folder, { recursive: true });
    if (originals.length) await writeFile(new URL('product-backup-before-nike.json', folder), JSON.stringify(originals, null, 2));
  }
  for (let i = 0; i < prepared.length; i++) {
    const product = prepared[i];
    const existing = await Product.findOne({ name: product.name });
    if (existing) {
      if (replaceExisting) await Product.findByIdAndUpdate(existing._id, product, { runValidators: true });
      console.log('Existing Nike product: ' + product.name);
      continue;
    }
    const original = replaceExisting ? await Product.findOne({ name: formerNames[i] }) : null;
    if (original) await Product.findByIdAndUpdate(original._id, product, { runValidators: true });
    else await Product.create(product);
    console.log('Saved Nike product and image to Atlas: ' + product.name);
  }
} finally { await mongoose.disconnect(); }
