'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import GameCard from '../components/GameCard'
import Charts from '../components/Charts'
import Footer from '../components/Footer'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [games, setGames] = useState([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('games').select('*').eq('user_id', user.id)
      setGames(data || [])
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleDelete(id) {
    if (!confirm('Sei sicuro di voler eliminare questo gioco?')) return
    await supabase.from('games').delete().eq('id', id)
    setGames(games.filter(g => g.id !== id))
  }

  function handleEdit(id) {
    router.push(`/edit/${id}`)
  }

  async function handleToggleShare(id, currentShared) {
    await supabase.from('games').update({ shared: !currentShared }).eq('id', id)
    setGames(games.map(g => g.id === id ? { ...g, shared: !currentShared } : g))
  }

  if (!user) return null

  const completati = games.filter(g => g.status === 'completato')
  const inCorso = games.filter(g => g.status === 'in_corso')
  const wishlist = games.filter(g => g.status === 'wishlist')
  const oreTotal = games.reduce((acc, g) => acc + (g.hours || 0), 0)

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <Navbar onLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-10 pt-40 pb-20">

        <p className="font-mono text-xs tracking-widest text-[#00f5a0] mb-2">// la tua libreria</p>
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-7xl font-bold tracking-wide leading-none">Il tuo<br />Profilo</h1>
          <a href="/add" className="bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#00e090] transition-colors">
            + Aggiungi gioco
          </a>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-16">
          {[
            { num: completati.length, label: 'Completati' },
            { num: inCorso.length, label: 'In corso' },
            { num: oreTotal, label: 'Ore giocate' },
            { num: wishlist.length, label: 'Wishlist' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-4 text-center hover:border-[#00f5a0] transition-colors">
              <div className="text-4xl font-bold text-[#00f5a0] font-mono">{stat.num}</div>
              <div className="text-xs font-mono tracking-widest uppercase text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {inCorso.length > 0 && (
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-3">
              In corso <span className="flex-1 h-px bg-[#1e1e38]"></span>
            </p>
            <div className="grid grid-cols-3 gap-5">
              {inCorso.map((game) => (
                <GameCard key={game.id} {...game} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {completati.length > 0 && (
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-3">
              Completati <span className="flex-1 h-px bg-[#1e1e38]"></span>
            </p>
            <div className="grid grid-cols-3 gap-5">
              {completati.map((game) => (
                <GameCard key={game.id} {...game} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-3">
              Wishlist <span className="flex-1 h-px bg-[#1e1e38]"></span>
            </p>
            <div className="grid grid-cols-3 gap-5">
              {wishlist.map((game) => (
                <GameCard key={game.id} {...game} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <p className="font-mono text-zinc-500 text-sm tracking-widest uppercase">Nessun gioco ancora</p>
            <a href="/add" className="inline-block mt-6 bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#00e090] transition-colors">
              + Aggiungi il primo
            </a>
          </div>
        )}

        <Charts games={games} />
      </div>
      <Footer />
    </main>
  )
}