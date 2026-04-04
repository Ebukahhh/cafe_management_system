'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SecurityClient() {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleUpdatePassword = async () => {
    setMessage(null)
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill out all fields.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    setIsUpdating(true)
    const supabase = createClient()
    
    // In a real app, verifying the 'current' password requires an RPC call or re-authentication,
    // but Supabase updateUser allows password updates directly if the session is recently established.
    // For this flow, we will just call updateUser for the new password.
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password successfully updated.' })
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setIsUpdating(false)
  }

  return (
    <div className="space-y-10">
      {/* Change Password */}
      <section className="bg-surface-container rounded-2xl p-6 md:p-8">
        <h2 className="font-headline text-2xl text-on-surface mb-6">Change Password</h2>
        <div className="max-w-md space-y-6">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Current Password (optional)</label>
            <input 
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" 
              type="password" 
              placeholder="Enter current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">New Password</label>
            <input 
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" 
              type="password" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Confirm New Password</label>
            <input 
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" 
              type="password" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            onClick={handleUpdatePassword}
            disabled={isUpdating}
            className="px-8 py-3 rounded-2xl amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </section>

      {/* 2FA */}
      <section className="bg-surface-container rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-headline text-2xl text-on-surface">Two-Factor Authentication (2FA)</h2>
            <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Coming Soon</span>
          </div>
          <p className="text-sm text-on-surface/40 max-w-sm">
            Add an extra layer of security to your account by requiring a code from your mobile authenticator app.
          </p>
        </div>
        <button disabled className="whitespace-nowrap px-6 py-3 rounded-xl bg-surface-container-highest text-primary font-bold transition-colors text-sm border border-primary/20 cursor-not-allowed">
          Enable 2FA
        </button>
      </section>
    </div>
  )
}
