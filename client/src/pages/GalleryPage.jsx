import ProductGrid from "../components/ProductGrid";
import { useState } from "react";
function GalleryPage({ products, loading }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("newest");
    const categories = ["All", ...new Set(products.map((product) => product.category || "General"))];
    const filtered = products.filter((product) =>
        (category === "All" || (product.category || "General") === category) &&
        `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())
    );
    if (sort !== "newest") filtered.sort((a, b) => sort === "ascending" ? a.price - b.price : b.price - a.price);
    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <section
                className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-10 text-white shadow-xl md:p-14"
            >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"></div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                    Product Gallery
                </p>
                <h2 className="mt-3 text-4xl font-bold md:text-5xl">
                    Discover Our Products
                </h2>
                <p className="mt-3 text-white/80">
                    {products.length} items available · by April Mark Sarmiento
                </p>
            </section>
            <section aria-label="Filter products" className="mb-8 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <label className="flex-1 text-sm font-medium">Search products
                        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or description" className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3" />
                    </label>
                    <label className="text-sm font-medium">Sort by price
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                            <option value="newest">Newest first</option>
                            <option value="ascending">Price: low to high</option>
                            <option value="descending">Price: high to low</option>
                        </select>
                    </label>
                </div>
                <div className="flex flex-wrap gap-2">{categories.map((item) =>
                    <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium ${category === item ? "bg-indigo-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-300"}`}>{item}</button>
                )}</div>
                {!loading && <p role="status" className="text-sm text-slate-500">Showing {filtered.length} of {products.length} products</p>}
            </section>
            {loading ? (
                <p className="py-20 text-center text-slate-400">
                    Loading products...
                </p>
            ) : (
                <ProductGrid products={filtered} />
            )}
        </main>
    );
}
export default GalleryPage;
