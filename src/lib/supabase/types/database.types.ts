/**
 * Database Types — Jennifer's Café Management System
 *
 * These types mirror the Supabase database schema documented in
 * the Frontend Integration Guide (Section 8).
 *
 * IMPORTANT: Once you have supabase CLI authenticated, regenerate with:
 *   npx supabase login
 *   npx supabase gen types typescript --project-id qxkemouklbhirywdxjxx --schema public > src/lib/supabase/types/database.types.ts
 */

/* ── Enum Types ──────────────────────────────────────────── */

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type OrderType = 'pickup' | 'delivery' | 'dine_in'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type PaymentMethod = 'card' | 'mobile_money' | 'cash'
export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'completed'
export type SubscriptionFrequency = 'daily' | 'weekdays' | 'specific_days' | 'weekly'
export type SubscriptionRunStatus = 'success' | 'failed' | 'skipped'
export type LoyaltyType = 'earn' | 'redeem'
export type PromotionType = 'percent' | 'flat'
export type UserRole = 'customer' | 'admin' | 'barista'
export type NotificationType = 'order_update' | 'reservation_update' | 'subscription_alert' | 'promotion' | 'system'

/* ── Row Types (mirrors DB tables) ───────────────────────── */

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  dietary_flags: string[] | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  stock_count: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductOption {
  id: string
  product_id: string
  label: string
  type: string
  choices: Record<string, unknown>[]
  is_required: boolean
}

export interface Order {
  id: string
  user_id: string
  payment_id: string | null
  status: OrderStatus
  order_type: OrderType
  subtotal: number
  total: number
  note: string | null
  promo_code: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  selected_options: Record<string, unknown> | null
  line_total: number
}

export interface Payment {
  id: string
  user_id: string
  provider_ref: string | null
  status: PaymentStatus
  amount: number
  method: PaymentMethod
  created_at: string
}

export interface LoyaltyPoint {
  id: string
  user_id: string
  order_id: string | null
  points: number
  type: LoyaltyType
  description: string | null
  created_at: string
}

export interface Promotion {
  id: string
  code: string
  type: PromotionType
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  action_url: string | null
  is_read: boolean
  created_at: string
}

export interface Reservation {
  id: string
  user_id: string
  date: string
  time_slot: string
  party_size: number
  status: ReservationStatus
  note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface SlotCapacity {
  id: string
  time_slot: string
  max_covers: number
}

export interface BlockedSlot {
  id: string
  date: string
  time_slot: string | null
  reason: string | null
}

export interface Subscription {
  id: string
  user_id: string
  frequency: SubscriptionFrequency
  days_of_week: number[] | null
  preferred_time: string
  status: SubscriptionStatus
  next_run_at: string | null
  end_date: string | null
  payment_method: string | null
  failed_count: number
  created_at: string
  updated_at: string
}

export interface SubscriptionItem {
  id: string
  subscription_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  selected_options: Record<string, unknown> | null
}

export interface SubscriptionRun {
  id: string
  subscription_id: string
  order_id: string | null
  status: SubscriptionRunStatus
  error_message: string | null
  run_at: string
}
