'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { updateProfileInfo, updateProfileAvatar } from './actions'
import { uploadAvatarImage } from '@/lib/supabase/storage/upload-avatar'

type ProfileData = {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  dietary_flags: string[] | null
  email: string | null
}

const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free", "Lactose-Free", "Halal"]

function PersonIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function CameraIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
}

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const initialFirstName = profile.full_name?.split(' ')[0] || ''
  const initialLastName = profile.full_name?.split(' ').slice(1).join(' ') || ''

  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const [phone, setPhone] = useState(profile.phone || '')
  
  const [selectedFlags, setSelectedFlags] = useState<string[]>(profile.dietary_flags || [])

  const toggleFlag = (flag: string) => {
    setSelectedFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag])
  }

  const handleSave = () => {
    setError(null)
    const formData = new FormData()
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('phone', phone)
    selectedFlags.forEach(flag => formData.append('dietary_flags', flag))

    startTransition(async () => {
      try {
        await updateProfileInfo(formData)
        alert('Profile saved successfully!')
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    try {
      const publicUrl = await uploadAvatarImage(file)
      await updateProfileAvatar(publicUrl)
      setAvatarUrl(publicUrl)
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: publicUrl }))
    } catch (err: any) {
      setError('Avatar upload failed: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Profile Section */}
      <section className="bg-surface-container rounded-2xl p-6 md:p-8">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleAvatarSelect} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex items-center gap-6 md:col-span-2 pb-6" style={{ borderBottom: "1px solid rgba(82,68,57,0.1)" }}>
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-highest relative group cursor-pointer"
            >
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface/20">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <PersonIcon />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                {isUploading ? (
                   <span className="animate-pulse text-xs">UPLOADING</span>
                ) : (
                   <CameraIcon />
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-on-surface mb-1">Profile Photo</h4>
              <p className="text-xs text-on-surface/30 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
              <button 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className="text-sm text-primary font-semibold hover:underline cursor-pointer disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Update Photo'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">First Name</label>
            <input 
              value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="text" placeholder="First Name" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Last Name</label>
            <input 
              value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="text" placeholder="Last Name" />
          </div>
          <div className="space-y-2 relative">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Email Address</label>
            <div className="relative">
              <input 
                disabled value={profile.email || ''}
                className="w-full bg-surface-container-highest rounded-lg p-3 pr-24 text-on-surface/50 outline-none ring-1 ring-transparent transition-shadow cursor-not-allowed" type="email" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-900/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ border: "1px solid rgba(52,211,153,0.2)" }}>VERIFIED</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-label uppercase tracking-widest text-on-surface/30 ml-1">Phone Number</label>
            <input 
              value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-surface-container-highest rounded-lg p-3 text-on-surface outline-none ring-1 ring-transparent focus:ring-primary/40 transition-shadow" type="text" placeholder="Add phone number" />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </section>

      {/* Dietary Preferences */}
      <section className="space-y-6">
        <div>
          <h2 className="font-headline text-2xl text-on-surface">Dietary Preferences</h2>
          <p className="text-sm text-on-surface/30">We&apos;ll use these to suggest menu items and tailor our daily specials.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {dietaryOptions.map((opt) => {
            const isActive = selectedFlags.includes(opt)
            return (
              <button 
                key={opt} 
                onClick={() => toggleFlag(opt)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${isActive ? "amber-glow text-on-primary" : "bg-surface-container-highest text-on-surface/40 hover:bg-surface-bright"}`}>
                {opt}
              </button>
            )
          })}
        </div>
      </section>

      {/* Save */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(82,68,57,0.1)" }}>
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="px-8 py-3 rounded-2xl amber-glow text-on-primary font-bold hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:pointer-events-none">
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Danger Zone */}
      <section className="mt-16 md:mt-24 p-8 rounded-2xl space-y-4" style={{ background: "rgba(147,0,10,0.05)", border: "1px solid rgba(147,0,10,0.1)" }}>
        <div>
          <h3 className="font-headline text-xl text-red-400 mb-1">Danger Zone</h3>
          <p className="text-sm text-on-surface/30">Deleting your account is permanent and will remove all your points and history.</p>
        </div>
        <button className="px-6 py-2 rounded-xl font-bold text-sm text-red-400 hover:bg-red-900/10 transition-colors cursor-pointer" style={{ border: "2px solid rgba(239,68,68,0.5)" }}>Delete Account</button>
      </section>
    </div>
  )
}
