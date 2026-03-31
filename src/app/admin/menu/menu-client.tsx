"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProducts } from "@/lib/supabase/mutations/products";
import type { Category } from "@/lib/supabase/types/app.types";
import type { ProductWithOptions } from "@/lib/supabase/types/app.types";

function StockDot({ stock }: { stock: number }) {
  let status = "out";
  if (stock > 10) status = "in";
  else if (stock > 0) status = "low";

  const colors: Record<string, string> = {
    in: "bg-emerald-500",
    low: "bg-amber-500 animate-pulse",
    out: "bg-red-400",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status] || "bg-gray-400"}`} />;
}

export function MenuClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: ProductWithOptions[];
  initialCategories: Category[];
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState<ProductWithOptions[]>(initialProducts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ["All", ...initialCategories.map((c) => c.name)];

  const filteredItems =
    activeTab === "All"
      ? items
      : items.filter((item) => item.categories?.name === activeTab);

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.preventDefault(); // stop the parent <Link> from navigating
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      await deleteProducts(idsToDelete);
      
      setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to delete products", error);
    } finally {
      setIsDeleting(false);
    }
  }

  const selectedCount = selectedIds.size;

  return (
    <>
      {/* Top App Bar */}
      <header className="flex justify-between items-center px-8 py-6 w-full z-30 bg-deep-espresso/80 backdrop-blur-xl sticky top-0">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Menu Manager</h2>
          <p className="text-sm text-on-surface/30 font-label">Curate your seasonal offerings</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="px-5 py-2.5 rounded-full text-on-surface font-medium hover:bg-surface-container transition-colors text-sm"
            style={{ border: "1px solid rgba(159,141,129,0.3)" }}
          >
            Manage Categories
          </button>
          <Link
            href="/admin/menu/edit"
            className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-bold hover:opacity-90 transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Item
          </Link>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="px-8 mt-4 whitespace-nowrap overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveTab(c)}
              className={`pb-4 text-sm font-medium transition-colors cursor-pointer ${
                c === activeTab
                  ? "text-primary font-bold border-b-2 border-primary-container"
                  : "text-on-surface/30 hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <div className="px-8 mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32 w-full max-w-full overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface/10 mb-4">category</span>
            <p className="text-on-surface/30 font-medium text-sm">
              No items in the <span className="text-primary">{activeTab}</span> category yet.
            </p>
            <Link
              href="/admin/menu/edit"
              className="mt-6 px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-bold hover:opacity-90 transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New Item
            </Link>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const isLowStock = item.stock_count > 0 && item.stock_count <= 10;
            const isOutStock = item.stock_count === 0;

            const stockLabel = isOutStock
              ? "Out of Stock"
              : isLowStock
              ? `Low Stock: ${item.stock_count} remaining`
              : "In Stock";

            return (
              <Link
                href={`/admin/menu/edit?id=${item.id}`}
                key={item.id}
                className={`group relative bg-surface-container-low rounded-xl overflow-hidden transition-all hover:translate-y-[-4px] ${
                  isSelected ? "ring-2 ring-primary-container" : ""
                }`}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-surface-container-highest">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface/10">
                      <span className="material-symbols-outlined text-6xl">image</span>
                    </div>
                  )}

                  {/* Checkbox — clicks are captured here, not bubbled to <Link> */}
                  <div
                    className="absolute top-4 left-4 z-10"
                    onClick={(e) => toggleSelect(item.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // controlled via onClick above
                      className="w-5 h-5 rounded bg-surface/50 text-primary accent-primary cursor-pointer"
                    />
                  </div>

                  {!item.is_available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-[2px]">
                      <span
                        className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                        style={{ border: "1px solid rgba(82,68,57,0.2)" }}
                      >
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest mb-1 block ${
                          !item.is_available ? "text-on-surface/30" : "text-primary/70"
                        }`}
                      >
                        {item.categories?.name || "Uncategorized"}
                      </span>
                      <h3
                        className={`font-headline text-lg font-bold text-on-surface ${
                          !item.is_available ? "opacity-70" : ""
                        }`}
                      >
                        {item.name}
                      </h3>
                    </div>
                    <span
                      className={`font-mono font-bold text-lg ${
                        !item.is_available ? "text-on-surface/30" : "text-primary"
                      }`}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <StockDot stock={item.stock_count} />
                      <span
                        className={`text-xs font-medium ${
                          isOutStock
                            ? "text-red-400"
                            : isLowStock
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {stockLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-on-surface/30">
                        {item.is_available ? "ONLINE" : "OFFLINE"}
                      </span>
                      <div
                        className={`w-10 h-5 rounded-full relative cursor-pointer ${
                          item.is_available ? "bg-primary-container" : "bg-surface-variant"
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${
                            item.is_available ? "right-[2px]" : "left-[2px]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Bulk Actions Bar — only visible when at least one item is selected */}
      {selectedCount > 0 && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[calc(240px+((100%-240px)/2))] z-50 w-full max-w-md"
          style={{ marginLeft: "-200px" }}
        >
          <div
            className="bg-deep-espresso/70 backdrop-blur-2xl rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl"
            style={{ border: "1px solid rgba(82,68,57,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-xs">
                {selectedCount}
              </div>
              <span className="text-sm font-medium text-on-surface">
                {selectedCount === 1 ? "item" : "items"} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg text-xs font-bold hover:bg-surface-variant/50 transition-colors flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-sm">published_with_changes</span>
                Toggle
              </button>
              <div className="h-4 w-px bg-on-surface/10 mx-1" />
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-900/10 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
