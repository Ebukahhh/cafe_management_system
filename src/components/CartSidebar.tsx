'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/lib/store/cart"
import { useRouter } from "next/navigation"

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function PlusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
}

function MinusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotals } = useCartStore()
  const { subtotal } = getTotals()
  const router = useRouter()
  
  // Prevent hydration errors by keeping initial state closed
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeCart}
      />

      {/* Sidebar panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface-container shadow-2xl z-[110] transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="font-headline text-2xl">Your Array</h2> {/* Custom cafe terminology */}
          <button onClick={closeCart} className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-on-surface/40 pb-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <p className="font-medium">Your cart is empty</p>
              <button onClick={() => { closeCart(); router.push('/menu'); }} className="mt-6 px-6 py-2 rounded-full border border-primary text-primary text-sm font-bold hover:bg-primary/10 transition-colors">
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-4">
                <div className="w-20 h-20 bg-surface-container-highest rounded-xl shrink-0 overflow-hidden relative">
                  <Image src={item.imageUrl || "/images/placeholders/espresso.jpg"} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-tight text-on-surface mb-1">{item.productName}</h4>
                      <button onClick={() => removeItem(item.productId)} className="text-on-surface/30 hover:text-red-400 transition-colors">
                        <TrashIcon />
                      </button>
                    </div>
                    {/* Display options gracefully */}
                    <div className="text-[11px] text-on-surface/40 leading-tight line-clamp-2 pr-4 font-mono">
                      {Object.entries(item.selectedOptions).map(([k, v]) => `${v}`).join(', ')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-surface-container-highest rounded-lg h-8 overflow-hidden border border-white/5">
                       <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-full flex items-center justify-center hover:bg-surface-bright text-on-surface/70 transition-colors"><MinusIcon /></button>
                       <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-surface-bright text-on-surface/70 transition-colors"><PlusIcon /></button>
                    </div>
                    <span className="font-bold text-sm font-mono text-primary">${item.lineTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-deep-espresso shrink-0">
            <div className="flex justify-between items-end mb-6">
              <span className="text-on-surface/50 text-sm">Subtotal</span>
              <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 amber-glow text-on-primary font-bold rounded-xl text-lg flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(200,134,74,0.3)]"
            >
              Continue to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
