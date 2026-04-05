'use client'

import { useState } from "react"

function PlusCircleIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
}

function MapPinIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}

type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  cityZip: string;
  note: string;
}

export default function AddressClient() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "HOME",
      name: "Jennifer Smith",
      line1: "123 Espresso Lane",
      line2: "Apt 4B",
      cityZip: "Coffee District, CA 90210",
      note: "Note: Ring the doorbell twice."
    },
    {
      id: "2",
      label: "WORK",
      name: "Tech Solutions Inc.",
      line1: "404 Innovation Blvd",
      line2: "Floor 12, Reception",
      cityZip: "Coffee District, CA 90212",
      note: ""
    }
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: '', name: '', line1: '', line2: '', cityZip: '', note: '' })

  const handleAdd = () => {
    if (!newAddr.name || !newAddr.line1 || !newAddr.cityZip) return
    const id = Date.now().toString()
    setAddresses([...addresses, { ...newAddr, id, label: newAddr.label || 'OTHER' }])
    setIsAdding(false)
    setNewAddr({ label: '', name: '', line1: '', line2: '', cityZip: '', note: '' })
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id))
  }

  return (
    <>
      <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Saved Addresses</h1>
          <p className="text-on-surface/40 max-w-lg">
            Manage locations for delivery orders and coffee subscriptions.
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm shrink-0 gap-2 cursor-pointer"
          >
            <PlusCircleIcon /> Add Location
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-surface-container rounded-2xl p-6 md:p-8 mb-8 border border-primary/20 animate-fade-in">
          <h3 className="font-headline text-2xl mb-6">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Label (e.g. Home, Work)</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="Home" value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Name / Company</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="John Doe" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Street Address</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="123 Coffee St" value={newAddr.line1} onChange={e => setNewAddr({...newAddr, line1: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Apt, Suite, Details</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="Apt 4B" value={newAddr.line2} onChange={e => setNewAddr({...newAddr, line2: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">City & Zip</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="Metropolis, 12345" value={newAddr.cityZip} onChange={e => setNewAddr({...newAddr, cityZip: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Delivery Instructions</label>
                <input 
                  className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40" 
                  placeholder="Ring doorbell twice" value={newAddr.note} onChange={e => setNewAddr({...newAddr, note: e.target.value})}
                />
              </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleAdd} className="px-6 py-2.5 rounded-xl amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer">
              Save Address
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-xl bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-colors text-sm font-bold cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-surface-container rounded-2xl p-6 relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-surface-container-highest text-on-surface/50 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
              {addr.label}
            </div>
            <div>
              <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-primary mb-4">
                <MapPinIcon />
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-1">{addr.name}</h3>
              <p className="text-sm text-on-surface/50 leading-relaxed">
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.cityZip}
              </p>
              {addr.note && <p className="text-sm text-on-surface/40 mt-3 font-mono">{addr.note}</p>}
            </div>
            <div className="flex gap-4 mt-6">
              <button disabled className="text-sm font-semibold text-primary/50 px-4 py-2 rounded-lg bg-surface-container-highest cursor-not-allowed">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="text-sm font-semibold text-red-500 px-4 py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 transition-colors cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
