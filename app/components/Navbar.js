'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  async function handleLogout() {
    if (onLogout) { onLogout(); return }
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 bg-[#080810]/80 backdrop-blur-md border-b border-[#1e1e38]">
      <a href="/" className="text-2xl tracking-[6px] font-bold text-[#00f5a0]">
        PLAY<span className="text-white">LOG</span>
      </a>

      <ul className="flex gap-8 text-xs font-mono tracking-widest uppercase text-zinc-500">
        <li><a href="/" className="hover:text-[#00f5a0] transition-colors">Home</a></li>
        <li><a href="/contatti" className="hover:text-[#00f5a0] transition-colors">Contatti</a></li>
        {user && <li><a href="/dashboard" className="hover:text-[#00f5a0] transition-colors">Dashboard</a></li>}
        {user && <li><a href="/add" className="hover:text-[#00f5a0] transition-colors">+ Aggiungi</a></li>}
        
      </ul>

      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="font-mono text-xs uppercase tracking-widest text-[#ff4d6d] hover:text-[#ff4d6d]/70 transition-colors"
          >
            Logout
          </button>
        ) : (
          <a href="/login" className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors">
            Accedi
          </a>
        )}
      </div>
    </nav>
  )
}