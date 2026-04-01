'use client'

import { useState } from 'react'

export default function AdminOrdersClient() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <main className="flex-1 pt-24 pb-20 md:pb-8 pl-4 md:pl-8 pr-4 md:pr-[26rem] transition-all min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-4xl font-headline italic text-on-surface">Live Orders</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-xs font-mono text-on-surface-variant/70 tracking-tight">Wednesday, 8 April 2025 — updated just now</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-xl border border-outline/30 bg-transparent flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Active</span>
              <span className="text-xl font-headline font-bold text-on-surface">47 orders today</span>
            </div>
            <div className="px-5 py-2.5 rounded-xl amber-glow shadow-xl shadow-primary/10 flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-on-primary-container">Total</span>
              <span className="text-xl font-headline font-bold text-on-primary-container">$384.50 revenue</span>
            </div>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl w-max md:w-full">
            {['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-surface-container-highest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
                {tab === 'Pending' && <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[10px] font-mono">3</span>}
                {tab === 'Preparing' && <span className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-[10px] font-mono">2</span>}
                {tab === 'Ready' && <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-mono">1</span>}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 pr-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Pending Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="font-headline text-lg italic flex items-center gap-2">
                Pending
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </h3>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border-t-4 border-amber-500 shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-500/80 uppercase">#0047 • Pickup</span>
                  <h4 className="text-lg font-headline font-bold text-on-surface mt-1">Abena Mensah</h4>
                </div>
                <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface">3 items</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">2x Espresso Macchiato, 1x Croissant</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="font-mono text-primary">$9.00</span>
                <button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg">Confirm</button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border-t-4 border-amber-500 shadow-lg shadow-black/10 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-500/80 uppercase">#0046 • Delivery</span>
                  <h4 className="text-lg font-headline font-bold text-on-surface mt-1">Kofi Asante</h4>
                </div>
                <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface">1 item</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">1x Pour Over (Ethiopia)</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="font-mono text-primary">$5.50</span>
                <button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs transition-all shadow-lg hover:opacity-90 active:scale-95">Confirm</button>
              </div>
            </div>
          </div>

          {/* Preparing Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="font-headline text-lg italic flex items-center gap-2">
                Preparing
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              </h3>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border-t-4 border-orange-500 shadow-xl shadow-black/20 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-orange-500/80 uppercase">#0045 • Dine In</span>
                  <h4 className="text-lg font-headline font-bold text-on-surface mt-1">Efua Darko</h4>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-mono text-xs">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  08:24
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">1x Cortado, 1x Avo Toast</p>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[70%]" />
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border-t-4 border-orange-500 shadow-xl shadow-black/20 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-orange-500/80 uppercase">#0044 • Pickup</span>
                  <h4 className="text-lg font-headline font-bold text-on-surface mt-1">James Owusu</h4>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-mono text-xs">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  04:12
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">1x Iced Latte</p>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[40%]" />
              </div>
            </div>
          </div>

          {/* Ready Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="font-headline text-lg italic flex items-center gap-2">
                Ready
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </h3>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border-t-4 border-emerald-500 shadow-xl shadow-black/20 cursor-pointer">
              <div className="mb-4 bg-emerald-500/10 text-emerald-400 py-1.5 px-3 rounded-lg text-center text-[10px] font-bold tracking-widest uppercase">
                Ready for Pickup
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-500/80 uppercase">#0043 • Pickup</span>
                  <h4 className="text-lg font-headline font-bold text-on-surface mt-1">Ama Boateng</h4>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">3x Flat Whites</p>
              <div className="flex flex-col gap-2">
                <button className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:opacity-90 transition-opacity">Mark as Delivered</button>
                <button className="w-full py-2 bg-surface-container-highest text-on-surface-variant font-bold text-xs rounded-lg hover:bg-surface-container-high transition-colors">Notify Customer</button>
              </div>
            </div>
          </div>

          {/* Delivered Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="font-headline text-lg italic flex items-center gap-2">
                Delivered
                <span className="w-2 h-2 rounded-full bg-stone-500" />
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-low/50 rounded-xl p-3 border-l-4 border-stone-600 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="text-xs font-mono text-stone-500 uppercase">#0042</p>
                  <p className="font-headline text-on-surface text-sm">John Doe</p>
                </div>
                <span className="text-xs font-mono text-on-surface-variant">$12.50</span>
              </div>
              <div className="bg-surface-container-low/50 rounded-xl p-3 border-l-4 border-stone-600 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="text-xs font-mono text-stone-500 uppercase">#0041</p>
                  <p className="font-headline text-on-surface text-sm">Sarah Lee</p>
                </div>
                <span className="text-xs font-mono text-on-surface-variant">$4.20</span>
              </div>
              <div className="bg-surface-container-low/50 rounded-xl p-3 border-l-4 border-stone-600 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="text-xs font-mono text-stone-500 uppercase">#0040</p>
                  <p className="font-headline text-on-surface text-sm">Tom Cook</p>
                </div>
                <span className="text-xs font-mono text-on-surface-variant">$18.90</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside className="fixed right-0 top-0 bottom-0 w-[24rem] bg-surface-container border-l border-white/5 z-40 hidden md:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 pt-24">
          <div className="flex items-center justify-between mb-6">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <div className="flex items-center gap-2">
              <button className="text-primary-container hover:text-primary transition-colors">
                <span className="material-symbols-outlined">print</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-highest">
              <img
                className="w-full h-full object-cover"
                alt="Abena Mensah"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaKHTx6ezolNye2fXjEfoLpTWM-vqqRyXbuVR--BB0QRkTNLJZIxAiw8eAjaA0MWfKU5L6myTqihi32Odzf_-QmZG8dxwzaVBcbraQtJmaVuQuMuldszECNa-HaqgaH8GOeCafKn-86kzihvvfyIVsfIqb8xMEv2yaD3pufn8PTLmkPyvzwk1JxjLH29SRcoNlfoDQ1UW0K6PD0JnP03RUIpj4D_InkTQZKH8A2fv-LrZ5_p-Z4anIysWHrm7Tq-3rZ3zivdL25UKQ"
              />
            </div>
            <div>
              <h2 className="text-2xl font-headline italic">Abena Mensah</h2>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mt-1">#0047 • Pickup</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scrollbar-hide">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-4">Order Items</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <span className="font-mono text-primary">2x</span>
                  <div>
                    <p className="text-sm font-bold">Espresso Macchiato</p>
                    <p className="text-xs text-on-surface-variant italic">Double shot, Oat milk</p>
                  </div>
                </div>
                <span className="text-sm font-mono">$6.00</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <span className="font-mono text-primary">1x</span>
                  <div>
                    <p className="text-sm font-bold">Butter Croissant</p>
                    <p className="text-xs text-on-surface-variant italic">Warm with jam</p>
                  </div>
                </div>
                <span className="text-sm font-mono">$3.00</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-headline italic opacity-70">Subtotal</span>
              <span className="text-xl font-headline font-bold">$9.00</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-5 border border-white/5">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-4">Payment Method</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-stone-900 rounded flex items-center justify-center border border-white/10">
                <span className="text-[8px] font-bold text-white tracking-widest">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium">Visa ending in 4747</p>
                <p className="text-[10px] font-mono text-emerald-500 uppercase">Verified Transaction</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/50 mb-6">Order Timeline</h3>
            <div className="flex flex-col gap-8 relative before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/5">
              <div className="flex gap-6 relative">
                <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/10 z-10" />
                <div>
                  <p className="text-sm font-bold">Order Received</p>
                  <p className="text-xs text-on-surface-variant">08:12 AM by Web Portal</p>
                </div>
              </div>
              <div className="flex gap-6 relative">
                <div className="w-4 h-4 rounded-full bg-surface-container-highest ring-4 ring-white/5 z-10" />
                <div className="opacity-40">
                  <p className="text-sm font-bold">Preparation Started</p>
                  <p className="text-xs">Awaiting confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface-container-high">
          <button className="w-full amber-glow text-on-primary-container font-bold py-4 rounded-2xl shadow-xl shadow-amber-900/10 active:scale-[0.98] transition-all">
            Confirm &amp; Start Prep
          </button>
        </div>
      </aside>

      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        <button className="bg-amber-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <span className="material-symbols-outlined text-sm">notifications_active</span>
          3 new orders
        </button>
      </div>
    </div>
  )
}
