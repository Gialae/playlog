'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

export default function HomeHero({ gamesCount }) {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-[#00f5a0] mb-4">// community</p>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
        <h1 className="text-4xl md:text-7xl font-bold tracking-wide leading-none">Cosa gioca<br />la community</h1>
        {user ? (
          <a href="/dashboard" className="bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#00e090] transition-colors self-start md:self-auto">
            Dashboard →
          </a>
        ) : (
          <a href="/login" className="bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#00e090] transition-colors self-start md:self-auto">
            Accedi →
          </a>
        )}
      </div>
      <p className="font-mono text-sm text-zinc-500">{gamesCount} giochi nel catalogo</p>
    </div>
  )
}