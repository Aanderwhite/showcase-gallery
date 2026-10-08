const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
async function request(path, options = {}) {
  if (!API_URL) throw new Error("VITE_API_URL is missing. Configure the API URL and rebuild the website.");
  const response = await fetch(`${API_URL}/api/products${path}`, {
    ...options, headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
  return data;
}
export const getProducts = () => request("");
export const createProduct = (data) => request("", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id, data) => request(`/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id) => request(`/${id}`, { method: "DELETE" });
