'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import type { ProductOption, ProductWithOptions } from "@/lib/supabase/types/app.types";

type ProductDetailClientProps = {
  product: ProductWithOptions;
};

type Choice = {
  label: string;
  value: string;
  priceAdjustment: number;
};

type ProductOptionLike = {
  id: string;
  label: string;
  choices: Record<string, unknown>[];
  is_required: boolean;
};

function StarIcon({ filled = true }: { filled?: boolean }) {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function normalizeChoice(choice: Record<string, unknown>, index: number): Choice {
  const label =
    typeof choice.label === "string"
      ? choice.label
      : typeof choice.name === "string"
        ? choice.name
        : typeof choice.value === "string"
          ? choice.value
          : `Option ${index + 1}`;

  const value =
    typeof choice.value === "string"
      ? choice.value
      : typeof choice.id === "string"
        ? choice.id
        : label;

  const priceAdjustment =
    typeof choice.price_adjustment === "number"
      ? choice.price_adjustment
      : typeof choice.priceAdjustment === "number"
        ? choice.priceAdjustment
        : typeof choice.price === "number"
          ? choice.price
          : 0;

  return { label, value, priceAdjustment };
}

function getDefaultSelections(options: ProductOption[]) {
  return options.reduce<Record<string, string>>((acc, option) => {
    const firstChoice = option.choices[0];
    if (firstChoice) {
      acc[option.id] = normalizeChoice(firstChoice, 0).value;
    }
    return acc;
  }, {});
}

function getSelectedChoice(option: ProductOption, selectedValue?: string) {
  if (!selectedValue) {
    return null;
  }

  return option.choices
    .map((choice, index) => normalizeChoice(choice, index))
    .find((choice) => choice.value === selectedValue) ?? null;
}

function isCoffeeProduct(product: ProductWithOptions) {
  const categoryName = product.categories?.name?.toLowerCase() ?? "";
  const productName = product.name.toLowerCase();

  return (
    categoryName.includes("coffee") ||
    categoryName.includes("espresso") ||
    /latte|espresso|cappuccino|americano|macchiato|mocha|flat white|pour over|brew/.test(productName)
  );
}

function getFallbackCoffeeOptions(product: ProductWithOptions): ProductOptionLike[] {
  if (!isCoffeeProduct(product) || product.product_options.length > 0) {
    return [];
  }

  return [
    {
      id: "cup-size",
      label: "Cup Size",
      is_required: true,
      choices: [
        { label: "Small", value: "small", price_adjustment: -0.5 },
        { label: "Medium", value: "medium", price_adjustment: 0 },
        { label: "Large", value: "large", price_adjustment: 0.75 },
      ],
    },
    {
      id: "temperature",
      label: "Temperature",
      is_required: true,
      choices: [
        { label: "Hot", value: "hot", price_adjustment: 0 },
        { label: "Iced", value: "iced", price_adjustment: 0 },
      ],
    },
    {
      id: "milk",
      label: "Milk Selection",
      is_required: true,
      choices: [
        { label: "Regular", value: "regular", price_adjustment: 0 },
        { label: "Oat", value: "oat", price_adjustment: 0.8 },
        { label: "Almond", value: "almond", price_adjustment: 0.7 },
        { label: "Soy", value: "soy", price_adjustment: 0.6 },
      ],
    },
    {
      id: "enhancement",
      label: "Enhancements",
      is_required: false,
      choices: [
        { label: "None", value: "none", price_adjustment: 0 },
        { label: "Extra Espresso Shot", value: "extra-shot", price_adjustment: 1.5 },
        { label: "Vanilla Syrup", value: "vanilla", price_adjustment: 0.5 },
      ],
    },
  ];
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { addItem, openCart } = useCartStore();
  const optionGroups = (product.product_options.length > 0
    ? product.product_options
    : getFallbackCoffeeOptions(product)) as ProductOptionLike[];

  const [selectedImage, setSelectedImage] = useState(product.image_url || "/images/coffee-cappuccino.png");
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    getDefaultSelections(optionGroups as ProductOption[])
  );

  const fullStars = 4;
  const imageGallery = Array.from(
    new Set([
      product.image_url || "/images/coffee-cappuccino.png",
      product.image_url || "/images/coffee-cappuccino.png",
      product.image_url || "/images/coffee-cappuccino.png",
    ])
  );

  const optionPriceDelta = optionGroups.reduce((sum, option) => {
    const choice = getSelectedChoice(option as ProductOption, selectedOptions[option.id]);
    return sum + (choice?.priceAdjustment ?? 0);
  }, 0);

  const unitPrice = product.price + optionPriceDelta;
  const totalPrice = unitPrice * quantity;
  const selectedOptionLabels = optionGroups.reduce<Record<string, string>>((acc, option) => {
    const choice = getSelectedChoice(option as ProductOption, selectedOptions[option.id]);
    if (choice) {
      if (!option.is_required && choice.value === "none") {
        return acc;
      }
      acc[option.label] = choice.label;
    }
    return acc;
  }, {});

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/product/${product.id}`)}`);
      return false;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.image_url,
      unitPrice,
      quantity,
      selectedOptions: selectedOptionLabels,
    });
    openCart();
    return true;
  };

  const handleReviewCheckout = () => {
    const added = handleAddToCart();
    if (!added) {
      return;
    }
    router.push("/checkout");
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 lg:py-20 pb-40 md:pb-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        <div className="w-full lg:w-[60%] space-y-8 lg:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface-container-low relative">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {imageGallery.map((thumb, index) => (
                <button
                  key={`${thumb}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(thumb)}
                  className={`aspect-square rounded-xl overflow-hidden relative cursor-pointer transition-all ${
                    selectedImage === thumb ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-outline-variant"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.name} preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 20vw"
                  />
                </button>
              ))}
            </div>
          </div>

          <section className="space-y-6 pt-4">
            <div>
              <h3 className="font-headline text-2xl md:text-3xl text-on-surface">What to Expect</h3>
              <div className="flex items-center mt-2 gap-2">
                <div className="flex text-primary gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < fullStars} />
                  ))}
                </div>
                <span className="text-lg font-mono font-medium text-on-surface/60">4.8 / 5.0</span>
              </div>
            </div>

            <p className="text-on-surface/50 text-sm md:text-base leading-relaxed font-body">
              {product.description || "Freshly prepared to order with the same care our baristas bring to every service."}
            </p>

            {product.categories?.name ? (
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
                {product.categories.name}
              </p>
            ) : null}
          </section>
        </div>

        <aside className="w-full lg:w-[40%] lg:sticky lg:top-32 space-y-8 lg:space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-headline font-bold text-on-surface leading-tight">
              {product.name}
            </h1>
            <p className="text-base lg:text-lg text-on-surface/50 leading-relaxed font-body font-light">
              {product.description || "Freshly prepared every day."}
            </p>
            <div className="text-3xl font-mono text-primary font-bold">{formatCurrency(unitPrice)}</div>
          </div>

          {optionGroups.length > 0 ? (
            <div className="space-y-8">
              {optionGroups.map((option) => (
                <div key={option.id} className="space-y-3">
                  <label className="text-xs uppercase tracking-widest font-bold text-on-surface/30 font-label block">
                    {option.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.choices.map((choice, index) => {
                      const normalized = normalizeChoice(choice, index);
                      const isSelected = selectedOptions[option.id] === normalized.value;

                      return (
                        <button
                          key={`${option.id}-${normalized.value}`}
                          type="button"
                          onClick={() =>
                            setSelectedOptions((current) => ({
                              ...current,
                              [option.id]: normalized.value,
                            }))
                          }
                          className={`px-4 py-2.5 rounded-full text-sm transition-all cursor-pointer ${
                            isSelected
                              ? "amber-glow text-on-primary font-bold"
                              : "bg-surface-container-highest text-on-surface hover:bg-surface-bright"
                          }`}
                        >
                          {normalized.label}
                          {normalized.priceAdjustment > 0 ? ` (+${formatCurrency(normalized.priceAdjustment)})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="pt-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-surface-container-high rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors cursor-pointer"
                >
                  <MinusIcon />
                </button>
                <span className="px-4 font-mono font-bold">{String(quantity).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors cursor-pointer"
                >
                  <PlusIcon />
                </button>
              </div>
              <div className="text-right">
                <div className="text-xs text-on-surface/30 uppercase font-bold tracking-widest font-label">Total</div>
                <div className="text-3xl font-mono text-on-surface font-bold">{formatCurrency(totalPrice)}</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-5 rounded-xl amber-glow text-on-primary font-headline text-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleReviewCheckout}
                className="w-full py-4 rounded-xl bg-surface-container-high text-on-surface font-bold hover:bg-surface-bright transition-all"
              >
                Review at Checkout
              </button>
              <Link
                href="/subscription"
                className="flex items-center justify-center gap-2 text-primary text-sm font-medium hover:underline underline-offset-4"
              >
                <RepeatIcon />
                Subscribe to this order
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-[72px] left-0 w-full z-40 px-4 py-3 bg-deep-espresso/80 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={handleReviewCheckout}
          className="flex w-full amber-glow text-on-primary py-4 rounded-xl font-headline text-lg font-bold active:scale-[0.98] transition-all items-center justify-center"
        >
          Checkout - {formatCurrency(totalPrice)}
        </button>
      </div>
    </main>
  );
}
