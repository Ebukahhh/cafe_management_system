/**
 * App-Level Types — Convenience types built on top of DB types
 *
 * These represent the shapes you'll actually use in components,
 * including joined/nested data from Supabase select queries.
 */
import type {
  Product,
  ProductOption,
  Category,
  Order,
  OrderItem,
  Profile,
  Reservation,
  Subscription,
  SubscriptionItem,
  SubscriptionRun,
  Notification,
  LoyaltyPoint,
  Promotion,
  Review,
  OrderStatus,
  OrderType,
} from './database.types'

/* ── Products ──────────────────────────────────────────── */

/** Product with its configurable options and category name */
export interface ProductWithOptions extends Product {
  product_options: ProductOption[]
  categories: Pick<Category, 'name'> | null
}

/* ── Orders ────────────────────────────────────────────── */

/** Order item with embedded product info for display */
export interface OrderItemWithProduct extends OrderItem {
  products: Pick<Product, 'name' | 'image_url'> | null
}

/** Full order with all its line items (for order history / tracking) */
export interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[]
}

/* ── Reservations ──────────────────────────────────────── */

/** Reservation with the user's profile info (admin view) */
export interface ReservationWithUser extends Reservation {
  profiles: Pick<Profile, 'full_name' | 'phone' | 'avatar_url'> | null
}

/* ── Subscriptions ─────────────────────────────────────── */

/** Subscription with its items and recent run history */
export interface SubscriptionWithDetails extends Subscription {
  subscription_items: SubscriptionItem[]
  subscription_runs: SubscriptionRun[]
}

/* ── Cart (client-side only) ───────────────────────────── */

/** A single item in the shopping cart — lives in Zustand, not in DB */
export interface CartItem {
  productId: string
  productName: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  selectedOptions: Record<string, string>
  lineTotal: number
}

/** Cart totals computed from items */
export interface CartTotals {
  subtotal: number
  discount: number
  total: number
  itemCount: number
}

/* ── Re-exports for convenience ────────────────────────── */
export type {
  Product,
  ProductOption,
  Category,
  Order,
  OrderItem,
  Profile,
  Reservation,
  Subscription,
  SubscriptionItem,
  SubscriptionRun,
  Notification,
  LoyaltyPoint,
  Promotion,
  Review,
  OrderStatus,
  OrderType,
}
