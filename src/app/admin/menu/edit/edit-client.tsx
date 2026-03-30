"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createProduct, updateProduct } from "@/lib/supabase/mutations/products";
import { uploadProductImage } from "@/lib/supabase/storage/upload-product-image";
import type { Category, ProductWithOptions } from "@/lib/supabase/types/app.types";

export function EditClient({
  initialProduct,
  categories,
}: {
  initialProduct: ProductWithOptions | null;
  categories: Category[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [name, setName] = useState(initialProduct?.name || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category_id || ""
  );
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [stockCount, setStockCount] = useState(initialProduct?.stock_count?.toString() || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [isAvailable, setIsAvailable] = useState(initialProduct ? initialProduct.is_available : true);
  const [isFeatured, setIsFeatured] = useState(initialProduct ? initialProduct.is_featured : false);
  const [imageUrl, setImageUrl] = useState(initialProduct?.image_url || "");

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(initialProduct?.image_url || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || "Category";

  /** Handle file selection for image upload */
  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image (JPEG, PNG, WebP, or GIF).");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    setUploadError(null);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    // Upload to Supabase storage
    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
      setImagePreview(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload image. Please try again or paste a URL instead.");
      setImagePreview(initialProduct?.image_url || null);
      setImageUrl(initialProduct?.image_url || "");
    } finally {
      setIsUploading(false);
      // Revoke blob URL to free memory
      URL.revokeObjectURL(localPreview);
    }
  }

  /** Remove current image */
  function handleRemoveImage() {
    setImageUrl("");
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId,
        price: parseFloat(price) || 0,
        stock_count: parseInt(stockCount, 10) || 0,
        description: description.trim() || null,
        is_available: isAvailable,
        is_featured: isFeatured,
        image_url: imageUrl || null,
        sort_order: initialProduct?.sort_order || 0,
      };

      if (initialProduct) {
        await updateProduct(initialProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      router.push("/admin/menu");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Error saving product. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] z-40 bg-deep-espresso/80 backdrop-blur-md flex justify-between items-center px-10 h-20">
        <div className="flex items-center gap-2">
          <Link href="/admin/menu" className="text-on-surface/30 text-xs font-label hover:text-primary transition-colors">Menu Manager</Link>
          <span className="text-on-surface/20 text-xs">›</span>
          <span className="text-primary text-xs font-bold font-label">{initialProduct ? "Edit Product" : "Add New Product"}</span>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 max-w-7xl mx-auto px-10 pb-20">
        <header className="mb-10">
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">
            {initialProduct ? `Edit Product — ${initialProduct.name}` : "Create New Product"}
          </h2>
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
                  <input 
                    id="product-name"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Single Origin Pour Over" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Category</label>
                  <select 
                    id="product-category"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 outline-none appearance-none cursor-pointer"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Price ($)</label>
                    <input 
                      id="product-price"
                      className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-mono text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" 
                      type="number" step="0.01" min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Stock Count</label>
                    <input 
                      id="product-stock"
                      className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-mono text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" 
                      type="number" min="0"
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                      placeholder="e.g. 50" 
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-label uppercase tracking-wider text-on-surface/30 mb-2">Short Description</label>
                  <textarea 
                    id="product-description"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-4 font-medium text-on-surface focus:ring-1 focus:ring-primary/40 resize-none outline-none" 
                    maxLength={160} rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product..." 
                  />
                  <div className="mt-2 text-[10px] font-mono text-on-surface/20 text-right uppercase">{description.length} / 160 characters</div>
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
                {/* Is Available Toggle */}
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Available on menu</p>
                    <p className="text-[10px] text-on-surface/30 font-label uppercase mt-0.5">Visible to customers in ordering system</p>
                  </div>
                  <div 
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isAvailable ? "bg-primary" : "bg-surface-variant"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAvailable ? "right-1" : "left-1"}`} />
                  </div>
                </div>

                {/* Is Featured Toggle */}
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Featured item</p>
                    <p className="text-[10px] text-on-surface/30 font-label uppercase mt-0.5">Prioritize at top of menu section</p>
                  </div>
                  <div 
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isFeatured ? "bg-primary" : "bg-surface-variant"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFeatured ? "right-1" : "left-1"}`} />
                  </div>
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-6">
              <div className="flex gap-4">
                <Link href="/admin/menu" className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-colors">Discard</Link>
                <button 
                  id="save-product-btn"
                  onClick={handleSave}
                  disabled={isSaving || isUploading || !name || !categoryId}
                  className="px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest amber-glow text-on-primary shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : isUploading ? "Uploading image..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Preview + Image Upload */}
          <div className="col-span-12 lg:col-span-4 space-y-8 sticky top-24">
            {/* Preview Card */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="p-4 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
                <h4 className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface/30">Live Menu Preview</h4>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-on-surface/10" /><span className="w-2 h-2 rounded-full bg-on-surface/10" /><span className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
              <div className="relative aspect-square bg-surface-container-highest flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt={name || "Preview"} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-8xl text-on-surface/10">local_cafe</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 bg-primary text-[10px] text-on-primary font-bold uppercase tracking-widest rounded-full">{selectedCategoryName}</span>
                  <h5 className="text-2xl font-headline mt-2">{name || "Product Name"}</h5>
                  <p className="text-primary font-mono mt-1">${price || "0.00"}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-on-surface/40 leading-relaxed italic line-clamp-2">
                  {description || "Product description will appear here..."}
                </p>
                <button className="w-full mt-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface-variant transition-colors cursor-pointer" style={{ border: "1px solid rgba(82,68,57,0.2)" }}>Select Options</button>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-surface-container-high p-6 rounded-xl" style={{ border: "2px dashed rgba(82,68,57,0.3)" }}>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden" 
                id="product-image-input"
                onChange={handleImageSelect}
              />

              {!imagePreview ? (
                /* Empty state — click to upload or paste URL */
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-primary/40 mb-4">image</span>
                  <h4 className="text-sm font-bold text-on-surface mb-2">Product Image</h4>
                  <p className="text-xs text-on-surface/30 font-label mb-4">Upload an image or paste a URL</p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-primary bg-surface-container-highest hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50 mb-3"
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">cloud_upload</span>
                        Choose File
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-on-surface/10" />
                    <span className="text-[10px] text-on-surface/20 uppercase font-label">or paste URL</span>
                    <div className="flex-1 h-px bg-on-surface/10" />
                  </div>

                  <input 
                    id="product-image-url"
                    className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-xs text-on-surface focus:ring-1 focus:ring-primary/40 outline-none" 
                    type="text" 
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              ) : (
                /* Image selected — show actions */
                <div className="text-center">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-on-surface">Product Image</h4>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-2 rounded-lg text-on-surface/50 hover:text-primary hover:bg-surface-variant transition-colors cursor-pointer"
                        title="Replace image"
                      >
                        <span className="material-symbols-outlined text-sm">swap_horiz</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 rounded-lg text-on-surface/50 hover:text-red-400 hover:bg-red-900/10 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-primary font-medium">
                      <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Uploading to storage...
                    </div>
                  )}

                  <p className="text-[10px] text-on-surface/20 font-mono break-all mt-2 line-clamp-2">{imageUrl}</p>
                </div>
              )}

              {/* Upload error message */}
              {uploadError && (
                <div className="mt-3 p-3 rounded-lg bg-red-900/10 text-red-400 text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {uploadError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
