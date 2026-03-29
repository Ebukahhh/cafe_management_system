import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Product | Jennifer's Café Admin",
  description: "Edit product details, options, and availability.",
};

export default function EditProductPage() {
  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] z-40 bg-deep-espresso/80 backdrop-blur-md flex justify-between items-center px-10 h-20">
        <div className="flex items-center gap-2">
          <Link href="/admin/menu" className="text-on-surface/30 text-xs font-label hover:text-primary transition-colors">Menu Manager</Link>
          <span className="text-on-surface/20 text-xs">›</span>
          <span className="text-primary text-xs font-bold font-label">Edit Product</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30 text-lg">search</span>
            <input className="bg-surface-container border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface/20 text-on-surface outline-none" placeholder="Search menu..." type="text" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 max-w-7xl mx-auto px-10 pb-20">
        <header className="mb-10">
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Edit Product — Single Origin Pour Over</h2>
          <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-on-surface/30 uppercase tracking-widest">
            <span>SKU: CP-SOPO-01</span>
            <span className="w-1 h-1 rounded-full bg-on-surface/20" />
            <span>Last updated: 2 hrs ago</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Basic Info */}
            <section className="bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <h3 className="text-lg font-headline text-on-surface">Basic Info</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Product Name</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" type="text" defaultValue="Single Origin Pour Over" />
                </div>
                <div>
                  <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Category</label>
                  <select className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 outline-none appearance-none cursor-pointer">
                    <option>Coffee</option><option>Tea</option><option>Bakery</option><option>Food</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Price ($)</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-mono text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" type="text" defaultValue="5.50" />
                  </div>
                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Stock Count</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-mono text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" type="number" defaultValue="124" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Short Description</label>
                  <textarea className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 resize-none outline-none" maxLength={160} rows={3} defaultValue="Hand-selected beans curated for a clean, nuanced cup. Vibrant acidity and a silky body define this artisanal brew." />
                  <div className="mt-2 text-[10px] font-mono text-on-surface/20 text-right uppercase">108 / 160 characters</div>
                </div>
              </div>
            </section>

            {/* Product Options */}
            <section className="bg-surface-container-low p-8 rounded-xl">
              <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
                  <h3 className="text-lg font-headline text-on-surface">Product Options</h3>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-sm">add</span> Add Option Group
                </button>
              </div>
              <div className="space-y-6">
                {[{ name: "Size", count: 3, options: ["Small", "Medium", "Large"] }, { name: "Milk Type", count: 4, options: ["Regular", "Oat", "Almond", "Soy"] }].map((group) => (
                  <div key={group.name} className="bg-surface-container-highest p-5 rounded-xl">
                    <div className="flex justify-between mb-4">
                      <h4 className="text-sm font-bold text-on-surface">{group.name}</h4>
                      <span className="text-[10px] font-mono text-on-surface/30 uppercase">{group.count} Choices</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {group.options.map((opt, i) => (
                        <span key={opt} className={`px-4 py-2 rounded-full text-xs font-medium ${i === group.options.length - 1 ? "border border-primary text-primary font-bold" : "bg-surface-container-low text-on-surface"}`} style={i !== group.options.length - 1 ? { border: "1px solid rgba(82,68,57,0.2)" } : undefined}>{opt}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Add-ons */}
                <div className="bg-surface-container-highest p-5 rounded-xl">
                  <div className="flex justify-between mb-4">
                    <h4 className="text-sm font-bold text-on-surface">Add-ons</h4>
                    <span className="text-[10px] font-mono text-on-surface/30 uppercase">Optional</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["Extra Shot", "Honey", "Cinnamon"].map((addon, i) => (
                      <label key={addon} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all group-hover:border-primary ${i === 0 ? "bg-primary/20 border border-primary" : "border border-on-surface/20 bg-surface-container"}`}>
                          {i === 0 && <span className="text-primary text-xs font-bold">✓</span>}
                        </div>
                        <span className="text-xs text-on-surface">{addon}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className="bg-surface-container-low p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                <h3 className="text-lg font-headline text-on-surface">Availability</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Available on menu", desc: "Visible to customers in ordering system", active: true },
                  { label: "Featured item", desc: "Prioritize at top of menu section", active: false },
                  { label: "Show in app promotions", desc: "Include in automated marketing banners", active: false },
                ].map((toggle) => (
                  <div key={toggle.label} className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{toggle.label}</p>
                      <p className="text-[10px] text-on-surface/30 font-label uppercase mt-0.5">{toggle.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer ${toggle.active ? "bg-primary" : "bg-surface-variant"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggle.active ? "right-1" : "left-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6">
              <button className="text-red-400 text-xs font-bold uppercase tracking-widest hover:underline decoration-2 transition-all cursor-pointer">Delete Product</button>
              <div className="flex gap-4">
                <Link href="/admin/menu" className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-colors">Discard</Link>
                <button className="px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest amber-glow text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">Save Changes</button>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="col-span-12 lg:col-span-4 space-y-8 sticky top-24">
            {/* Preview Card */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                <h4 className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface/30">Live Menu Preview</h4>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-on-surface/10" /><span className="w-2 h-2 rounded-full bg-on-surface/10" /><span className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
              <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-on-surface/10">local_cafe</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 bg-primary text-[10px] text-on-primary font-bold uppercase tracking-widest rounded-full">Single Origin</span>
                  <h5 className="text-2xl font-headline mt-2">Ethiopian Yirgacheffe</h5>
                  <p className="text-primary font-mono mt-1">$5.50</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-on-surface/40 leading-relaxed italic line-clamp-2">Hand-selected beans curated for a clean, nuanced cup.</p>
                <button className="w-full mt-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-colors cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.2)" }}>Select Options</button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-surface-container-high p-8 rounded-xl text-center" style={{ border: "2px dashed rgba(82,68,57,0.3)" }}>
              <span className="material-symbols-outlined text-4xl text-primary/40 mb-4">cloud_upload</span>
              <h4 className="text-sm font-bold text-on-surface mb-2">Upload Product Image</h4>
              <p className="text-xs text-on-surface/30 font-label mb-6">Drag and drop, or click to browse</p>
              <div className="space-y-3 text-left bg-surface-container-low p-4 rounded-lg">
                {["Preferred aspect ratio: 1:1", "Min resolution: 1200 × 1200px", "Format: JPG, WebP (Max 2MB)"].map((tip) => (
                  <div key={tip} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <p className="text-[10px] font-label text-on-surface/30">{tip}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-3 bg-surface-container-lowest rounded-xl text-xs font-bold text-primary hover:text-primary-container transition-colors cursor-pointer">Upload new image</button>
            </div>

            {/* Pro Tip */}
            <div className="bg-primary/5 p-6 rounded-xl" style={{ border: "1px solid rgba(200,134,74,0.1)" }}>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Coffee Pro Tip</h4>
                  <p className="text-xs text-on-surface/40 mt-2 leading-relaxed italic">&ldquo;Products with high-quality &apos;pouring&apos; shots see a 24% higher engagement rate in the mobile app.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
