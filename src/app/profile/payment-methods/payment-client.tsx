'use client'

import { useState } from "react"
import Image from "next/image"

function PlusCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
}

function LockIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  name: string;
  isDefault: boolean;
}

export default function PaymentClient() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      brand: "VISA",
      last4: "4747",
      expMonth: "12",
      expYear: "26",
      name: "Jennifer Smith",
      isDefault: true
    }
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nameOnCard, setNameOnCard] = useState('')

  const handleMakeDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })))
  }

  const handleDelete = (id: string) => {
    setMethods(methods.filter(m => m.id !== id))
  }

  const handleMockSave = () => {
    setIsSaving(true)
    // Simulate Stripe setup intent delay
    setTimeout(() => {
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        brand: "MASTERCARD",
        last4: "4242",
        expMonth: "08",
        expYear: "28",
        name: nameOnCard || 'Cardholder Name',
        isDefault: methods.length === 0
      }
      setMethods([...methods, newMethod])
      setIsSaving(false)
      setIsAdding(false)
      setNameOnCard('')
    }, 1500)
  }

  return (
    <>
      <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Payment Methods</h1>
          <p className="text-on-surface/40 max-w-lg">
            Manage cards used for orders, reservations, and subscriptions.
          </p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="inline-flex items-center justify-center px-6 py-3 rounded-full amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm shrink-0 gap-2 cursor-pointer">
            <PlusCircleIcon /> Add Payment Method
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-surface-container rounded-2xl p-6 md:p-8 mb-8 border border-primary/20 animate-fade-in relative overflow-hidden">
          {/* Mock Stripe Element Wrapper */}
          <div className="absolute top-4 right-6 flex items-center gap-1.5 text-on-surface/30">
            <LockIcon />
            <span className="text-[10px] font-bold tracking-wider uppercase">Secured by Stripe</span>
          </div>
          
          <h3 className="font-headline text-2xl mb-6">Add a new card</h3>
          
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Name on card</label>
              <input 
                className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                placeholder="John Doe" 
                value={nameOnCard} 
                onChange={(e) => setNameOnCard(e.target.value)}
              />
            </div>

            {/* Simulated Stripe Element */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Card Details</label>
              <div className="w-full bg-surface-container-highest rounded-lg px-3 py-3.5 ring-1 ring-white/5 flex items-center justify-between opacity-80 select-none">
                <span className="text-on-surface/50 font-mono tracking-widest text-sm">•••• •••• •••• ••••</span>
                <span className="text-on-surface/40 font-mono text-sm tracking-widest">MM/YY CVC</span>
              </div>
              <p className="text-[10px] text-primary/60 mt-2">* This is a visual mock. Stripe Elements will be embedded here.</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button onClick={handleMockSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center gap-2">
                {isSaving ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> Saving securely...</>
                ) : 'Save Card'}
              </button>
              <button disabled={isSaving} onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-xl bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-colors text-sm font-bold cursor-pointer disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div key={method.id} className={`bg-surface-container rounded-2xl p-6 relative overflow-hidden transition-all ${method.isDefault ? 'ring-2 ring-primary/40' : 'ring-1 ring-white/5'}`}>
            {method.isDefault && (
              <div className="absolute top-0 right-0 bg-primary text-deep-espresso text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                DEFAULT
              </div>
            )}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-10 bg-deep-espresso rounded flex items-center justify-center text-blue-400 font-bold italic text-sm">
                {method.brand}
              </div>
              <div>
                <p className="font-bold text-lg text-on-surface font-mono">•••• {method.last4}</p>
                <p className="text-sm text-on-surface/30">Expires {method.expMonth}/{method.expYear}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-label uppercase tracking-widest text-on-surface/40">{method.name}</p>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-6 absolute bottom-6 right-6 border-none">
                {!method.isDefault && (
                  <button onClick={() => handleMakeDefault(method.id)} className="text-xs font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-wider cursor-pointer">
                    Make Default
                  </button>
                )}
                <button onClick={() => handleDelete(method.id)} className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {methods.length === 0 && !isAdding && (
          <div className="md:col-span-2 text-center py-12 rounded-2xl border border-white/5 bg-surface-container-low">
            <p className="text-on-surface/40">You have no saved payment methods.</p>
          </div>
        )}
      </div>
    </>
  )
}
