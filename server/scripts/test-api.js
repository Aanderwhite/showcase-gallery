import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
const results = [];
let id;
async function request(name, method, endpoint, expected, body) {
  const response = await fetch(base + endpoint, { method, headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  results.push({ name, method, url: base + endpoint, expected, actual: response.status, response: data });
  assert.equal(response.status, expected, name);
  return data;
}
try {
  const product = await request("1 Create product", "POST", "/api/products", 201, {
    name: "Disposable API test product", price: 100, description: "Created only for the six required API tests.",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lZkAAAAASUVORK5CYII=",
  });
  id = product._id;
  const all = await request("2 List products", "GET", "/api/products", 200);
  assert.ok(all.some((item) => item._id === id));
  const single = await request("3 Get product", "GET", `/api/products/${id}`, 200);
  assert.equal(single.name, product.name);
  const updated = await request("4 Update price", "PUT", `/api/products/${id}`, 200, { price: 199 });
  assert.equal(updated.price, 199);
  assert.equal(updated.image, product.image);
  await request("5 Delete product", "DELETE", `/api/products/${id}`, 200);
  id = undefined;
  await request("6 Reject missing image", "POST", "/api/products", 400, { name: "x", price: 1 });
  console.log("All six API tests passed.");
} finally {
  if (id) await fetch(`${base}/api/products/${id}`, { method: "DELETE" });
  await mkdir("../submission/evidence", { recursive: true });
  await writeFile("../submission/evidence/api-test-results.json", JSON.stringify({ testedAt: new Date().toISOString(), base, results }, null, 2));
}
