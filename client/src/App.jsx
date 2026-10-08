import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import ManagePage from "./pages/ManagePage";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./api";

function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("gallery");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    getProducts().then((data) => { if (active) setProducts(data); })
      .catch((err) => { if (active) setError(err.message + ". If the API is waking up, refresh in a minute."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const saveProduct = async (data) => {
    setError("");
    if (editingProduct) {
      const updated = await updateProduct(editingProduct._id, data);
      setProducts((previous) => previous.map((product) => product._id === updated._id ? updated : product));
      setEditingProduct(null);
      setNotice("Product updated successfully.");
    } else {
      const created = await createProduct(data);
      setProducts((previous) => [created, ...previous]);
      setNotice("Product added successfully.");
    }
  };
  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((previous) => previous.filter((product) => product._id !== id));
      if (editingProduct?._id === id) setEditingProduct(null);
      setError(""); setNotice("Product deleted successfully.");
    } catch (err) { setError(err.message); }
  };
  const startEdit = (product) => {
    setEditingProduct(product); setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar view={view} onChangeView={setView} />
      {error && <p role="alert" className="mx-auto mt-6 max-w-6xl rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {notice && <p role="status" className="mx-auto mt-6 max-w-6xl rounded-xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
      {view === "gallery" ? <GalleryPage products={products} loading={loading} /> :
        <ManagePage products={products} editingProduct={editingProduct} onSave={saveProduct}
          onCancel={() => setEditingProduct(null)} onEdit={startEdit} onDelete={removeProduct} />}
      <footer className="py-10 text-center text-sm text-slate-500">Made by April Mark Sarmiento · INF233</footer>
    </div>
  );
}
export default App;
