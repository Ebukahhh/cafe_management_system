/* ─────────────────────────────────────────────
   Product Data — Shared product catalog
   Used by both the landing page and product detail page.
   When a real backend is added, replace this with API calls.
   ───────────────────────────────────────────── */

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  image: string;
  badge?: string;
  origin: string;
  rating: number;
  reviewCount: number;
  thumbnails: { src: string; alt: string }[];
  reviews: { name: string; time: string; stars: number; text: string }[];
}

const products: Product[] = [
  {
    id: "oak-smoked-latte",
    name: "Oak-Smoked Latte",
    description: "Double shot espresso with steamed milk and a hint of smoked hickory syrup.",
    longDescription:
      "A bold, proprietary roast finished over white oak chips. Paired with velvety steamed milk and our house-made hickory syrup for a campfire warmth in every sip.",
    price: "$6.50",
    image: "/images/coffee-cappuccino.png",
    badge: "Seasonal",
    origin: "Colombia • Huila",
    rating: 4.8,
    reviewCount: 96,
    thumbnails: [
      { src: "/images/coffee-cappuccino.png", alt: "Oak-Smoked Latte" },
      { src: "/images/coffee-grounds.png", alt: "Freshly ground beans" },
      { src: "/images/pour-over-set.png", alt: "Brew equipment" },
    ],
    reviews: [
      {
        name: "Sophia L.",
        time: "3d ago",
        stars: 5,
        text: "\"The smoky undertones paired with the sweetness — absolutely divine. My new go-to.\"",
      },
      {
        name: "James R.",
        time: "1w ago",
        stars: 5,
        text: "\"Bold but not bitter. The hickory syrup is a genius touch.\"",
      },
    ],
  },
  {
    id: "nitro-velvet-cold-brew",
    name: "Nitro Velvet Cold Brew",
    description: "18-hour slow steeped brew infused with nitrogen for a silky, creamy finish.",
    longDescription:
      "Cold brewed for 18 hours using a proprietary blend of Brazilian and Guatemalan beans, then infused with micro-fine nitrogen for a cascading, Guinness-like pour and a velvety mouthfeel.",
    price: "$5.75",
    image: "/images/cold-brew.png",
    origin: "Brazil • Cerrado",
    rating: 4.6,
    reviewCount: 142,
    thumbnails: [
      { src: "/images/cold-brew.png", alt: "Nitro Velvet Cold Brew" },
      { src: "/images/pour-over.png", alt: "Brewing process" },
      { src: "/images/coffee-grounds.png", alt: "Coffee grounds" },
    ],
    reviews: [
      {
        name: "Olivia M.",
        time: "1d ago",
        stars: 5,
        text: "\"So smooth it's unreal. The nitrogen infusion makes it feel like a dessert.\"",
      },
      {
        name: "Daniel K.",
        time: "5d ago",
        stars: 4,
        text: "\"Refreshing and potent. Perfect for hot afternoons. Wish the large was bigger!\"",
      },
    ],
  },
  {
    id: "heritage-flat-white",
    name: "Heritage Flat White",
    description: "The perfect balance of micro-foam and espresso using our signature medium roast.",
    longDescription:
      "Our signature heritage blend — a medium roast with notes of caramel and toasted almond — pulled as a velvety ristretto and topped with the silkiest micro-foam for the quintessential flat white.",
    price: "$5.25",
    image: "/images/flat-white.png",
    badge: "Classic",
    origin: "Kenya • Nyeri",
    rating: 4.9,
    reviewCount: 203,
    thumbnails: [
      { src: "/images/flat-white.png", alt: "Heritage Flat White" },
      { src: "/images/pour-over-set.png", alt: "Brew setup" },
      { src: "/images/pour-over.png", alt: "Pouring" },
    ],
    reviews: [
      {
        name: "Elena G.",
        time: "2d ago",
        stars: 5,
        text: "\"This is the benchmark flat white. Perfect every single time.\"",
      },
      {
        name: "Marcus T.",
        time: "1w ago",
        stars: 5,
        text: "\"The micro-foam is liquid silk. Best flat white in the city, no contest.\"",
      },
    ],
  },
  {
    id: "single-origin-pour-over",
    name: "Single Origin Pour Over",
    description: "Bright citrus notes with a smooth chocolate finish. Ethically sourced from a single farm in Ethiopia.",
    longDescription:
      "Experience the delicate notes of jasmine, lemon zest, and wild honey. Our rotating single-origin beans are meticulously hand-poured to highlight the unique terroir of the region.",
    price: "$5.50",
    image: "/images/pour-over.png",
    origin: "Ethiopia • Yirgacheffe",
    rating: 4.7,
    reviewCount: 128,
    thumbnails: [
      { src: "/images/pour-over.png", alt: "Pour over process" },
      { src: "/images/coffee-grounds.png", alt: "Coffee grounds blooming" },
      { src: "/images/pour-over-set.png", alt: "Pour over set" },
    ],
    reviews: [
      {
        name: "Elena G.",
        time: "2d ago",
        stars: 5,
        text: "\"The clarity of flavor in this Ethiopian bean is remarkable. Perfectly balanced acidity.\"",
      },
      {
        name: "Marcus T.",
        time: "1w ago",
        stars: 4,
        text: "\"My daily ritual. It's consistently smooth and the floral notes are just right.\"",
      },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts() {
  return products;
}

export function getProductIds() {
  return products.map((p) => p.id);
}

export default products;
