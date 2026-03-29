import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Menu Manager | Jennifer's Café Admin",
  description: "Curate your seasonal offerings and manage your menu catalog.",
};

const categories = ["All", "Coffee", "Cold Drinks", "Food", "Desserts", "Specials"];

const menuItems = [
  { name: "Single Origin Pour Over", category: "Coffee", price: "$5.50", stock: "in", stockLabel: "In Stock", online: true, image: "/products/pour-over.jpg" },
  { name: "Battenberg Cake", category: "Desserts", price: "$4.00", stock: "out", stockLabel: "Out of Stock", online: false, archived: true, image: "/products/croissant.jpg" },
  { name: "Oat Milk Latte", category: "Coffee", price: "$4.50", stock: "low", stockLabel: "Low Stock: 2 remaining", online: true, image: "/products/flat-white.jpg" },
  { name: "Avocado Toast", category: "Food", price: "$12.00", stock: "in", stockLabel: "In Stock", online: true, image: "/products/avocado-toast.jpg" },
  { name: "Cold Brew", category: "Coffee", price: "$5.00", stock: "in", stockLabel: "In Stock", online: true, image: "/products/cold-brew.jpg" },
  { name: "Croissant", category: "Food", price: "$3.50", stock: "in", stockLabel: "In Stock", online: true, image: "/products/croissant.jpg" },
];

function StockDot({ stock }: { stock: string }) {
  const colors: Record<string, string> = { in: "bg-emerald-500", low: "bg-amber-500 animate-pulse", out: "bg-red-400" };
  return <span className={`w-2 h-2 rounded-full ${colors[stock] || "bg-gray-400"}`} />;
}

export default function MenuManagerPage() {
  return (
    <>
      {/* Top App Bar */}
      <header className="flex justify-between items-center px-8 py-6 w-full z-30 bg-deep-espresso/80 backdrop-blur-xl sticky top-0">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Menu Manager</h2>
          <p className="text-sm text-on-surface/30 font-label">Curate your seasonal offerings</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-full text-on-surface font-medium hover:bg-surface-container transition-colors text-sm" style={{ border: "1px solid rgba(159,141,129,0.3)" }}>Manage Categories</button>
          <Link href="/admin/menu/edit" className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-bold hover:opacity-90 transition-all flex items-center gap-2 text-sm shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Item
          </Link>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="px-8 mt-4">
        <div className="flex items-center gap-8" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
          {categories.map((c) => (
            <button key={c} className={`pb-4 text-sm font-medium transition-colors cursor-pointer ${c === "Coffee" ? "text-primary font-bold border-b-2 border-primary-container" : "text-on-surface/30 hover:text-primary"}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <div className="px-8 mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
        {menuItems.map((item) => (
          <Link href="/admin/menu/edit" key={item.name} className="group relative bg-surface-container-low rounded-xl overflow-hidden transition-all hover:translate-y-[-4px]">
            <div className="aspect-[4/3] w-full relative overflow-hidden bg-surface-container-highest">
              <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface/10">
                <span className="material-symbols-outlined text-6xl">image</span>
              </div>
              <div className="absolute top-4 left-4">
                <input type="checkbox" className="w-5 h-5 rounded bg-surface/50 text-primary accent-primary cursor-pointer" readOnly />
              </div>
              {item.archived && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-[2px]">
                  <span className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(82,68,57,0.2)" }}>Archived</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest mb-1 block ${item.archived ? "text-on-surface/30" : "text-primary/70"}`}>{item.category}</span>
                  <h3 className={`font-headline text-lg font-bold text-on-surface ${item.archived ? "opacity-70" : ""}`}>{item.name}</h3>
                </div>
                <span className={`font-mono font-bold text-lg ${item.archived ? "text-on-surface/30" : "text-primary"}`}>{item.price}</span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <StockDot stock={item.stock} />
                  <span className={`text-xs font-medium ${item.stock === "in" ? "text-emerald-500" : item.stock === "low" ? "text-amber-500" : "text-red-400"}`}>{item.stockLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-on-surface/30">{item.online ? "ONLINE" : "OFFLINE"}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer ${item.online ? "bg-primary-container" : "bg-surface-variant"}`}>
                    <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${item.online ? "right-[2px]" : "left-[2px]"}`} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[calc(240px+((100%-240px)/2))] z-50 w-full max-w-md" style={{ marginLeft: "-200px" }}>
        <div className="bg-deep-espresso/70 backdrop-blur-2xl rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl" style={{ border: "1px solid rgba(82,68,57,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-xs">3</div>
            <span className="text-sm font-medium text-on-surface">items selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg text-xs font-bold hover:bg-surface-variant/50 transition-colors flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">published_with_changes</span> Toggle
            </button>
            <div className="h-4 w-px bg-on-surface/10 mx-1" />
            <button className="px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-900/10 transition-colors flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">delete</span> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
