'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/80 backdrop-blur-md border-b border-[#1e1e38]">
      <div className="flex items-center justify-between px-5 md:px-10 py-4">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
  <span className="text-xl md:text-2xl tracking-[6px] font-bold text-[#00f5a0]">
    PLAY<span className="text-white">LOG</span>
  </span>
  <span style={{fontFamily:'monospace', fontSize:'9px', fontWeight:'900', background:'#00f5a0', color:'#080810', padding:'2px 6px', borderRadius:'4px', letterSpacing:'1px'}}>
  C.L.
</span>
</a>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 text-xs font-mono tracking-widest uppercase text-zinc-500">
          <li><a href="/" className="hover:text-[#00f5a0] transition-colors">Home</a></li>
          <li><a href="/contatti" className="hover:text-[#00f5a0] transition-colors">Contatti</a></li>
          {user && <li><a href="/dashboard" className="hover:text-[#00f5a0] transition-colors">Dashboard</a></li>}
          {user && <li><a href="/add" className="hover:text-[#00f5a0] transition-colors">+ Aggiungi</a></li>}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:block">
          {user ? (
            <button onClick={handleLogout} className="font-mono text-xs uppercase tracking-widest text-[#ff4d6d] hover:text-[#ff4d6d]/70 transition-colors">
              Logout
            </button>
          ) : (
            <a href="/login" className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors">
              Accedi
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu aperto */}
      {menuOpen && (
        <div className="md:hidden bg-[#080810] border-t border-[#1e1e38] px-5 py-4 flex flex-col gap-4">
          <a href="/" className="font-mono text-sm uppercase tracking-widest text-zinc-400 hover:text-[#00f5a0] transition-colors">Home</a>
          <a href="/contatti" className="font-mono text-sm uppercase tracking-widest text-zinc-400 hover:text-[#00f5a0] transition-colors">Contatti</a>
          {user && <a href="/dashboard" className="font-mono text-sm uppercase tracking-widest text-zinc-400 hover:text-[#00f5a0] transition-colors">Dashboard</a>}
          {user && <a href="/add" className="font-mono text-sm uppercase tracking-widest text-[#00f5a0]">+ Aggiungi gioco</a>}
          <div className="pt-2 border-t border-[#1e1e38]">
            {user ? (
              <button onClick={handleLogout} className="font-mono text-sm uppercase tracking-widest text-[#ff4d6d]">Logout</button>
            ) : (
              <a href="/login" className="bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-5 py-2 rounded-lg inline-block">Accedi</a>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}