/**
 * Cart Store — Zustand with localStorage persistence
 *
 * Manages the shopping cart entirely on the client.
 * No database interaction — cart is converted to an order on checkout.
 */
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartTotals } from '../supabase/types/app.types'

export function getCartItemKey(item: Pick<CartItem, 'productId' | 'selectedOptions'>) {
  return `${item.productId}::${JSON.stringify(item.selectedOptions)}`
}

interface CartState {
  items: CartItem[]
  promoCode: string | null
  discountPercent: number
  isOpen: boolean

  // Actions
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'lineTotal'>) => void
  removeItem: (itemKey: string) => void
  updateQuantity: (itemKey: string, quantity: number) => void
  clearCart: () => void
  setPromoCode: (code: string | null, discountPercent: number) => void

  // Computed
  getTotals: () => CartTotals
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountPercent: 0,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => getCartItemKey(i) === getCartItemKey(item)
          )

          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      lineTotal: (i.quantity + item.quantity) * i.unitPrice,
                    }
                  : i
              ),
            }
          }

          return {
            items: [
              ...state.items,
              { ...item, lineTotal: item.quantity * item.unitPrice },
            ],
          }
        })
      },

      removeItem: (itemKey) => {
        set((state) => ({
          items: state.items.filter((i) => getCartItemKey(i) !== itemKey),
        }))
      },

      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey)
          return
        }

        set((state) => ({
          items: state.items.map((i) =>
            getCartItemKey(i) === itemKey
              ? { ...i, quantity, lineTotal: quantity * i.unitPrice }
              : i
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercent: 0 })
      },

      setPromoCode: (code, discountPercent) => {
        set({ promoCode: code, discountPercent })
      },

      getTotals: () => {
        const { items, discountPercent } = get()
        const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
        const discount = subtotal * (discountPercent / 100)
        const total = subtotal - discount
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

        return { subtotal, discount, total, itemCount }
      },
    }),
    {
      name: 'jennifers-cafe-cart',
    }
  )
)
