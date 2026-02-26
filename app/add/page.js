'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'

export default function AddGame() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newGame, setNewGame] = useState({ title: '', genre: '', emoji: '🎮' })
  const [status, setStatus] = useState('completato')
  const [rating, setRating] = useState(5)
  const [hours, setHours] = useState(0)
  const [progress, setProgress] = useState(0)
  const [priority, setPriority] = useState('media')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const emojis = ['🎮', '⚔️', '🚀', '🧿', '🤖', '🌌', '🏰', '🌊', '🩸', '🌠', '👾', '🐉']

  async function handleSearch(e) {
    const val = e.target.value
    setSearch(val)
    setSelected(null)
    if (val.length < 2) { setResults([]); return }

    try {
      // 1️⃣ Cerca nel catalogo locale
      const { data: localGames } = await supabase
        .from('game_catalog')
        .select('*')
        .ilike('title', `%${val}%`)
        .limit(3)

      // 2️⃣ Cerca nell'API IGDB
      const res = await fetch(`/api/igdb-search?query=${encodeURIComponent(val)}`)
      const igdbGames = await res.json()

      // 3️⃣ Unisci risultati evitando duplicati
      const localTitles = localGames?.map(g => g.title.toLowerCase()) || []
      const combinedResults = [
        ...(localGames || []),
        ...(igdbGames?.filter(g => !localTitles.includes(g.title.toLowerCase())) || [])
      ]

      setResults(combinedResults)
    } catch (err) {
      console.error(err)
      setResults([])
    }
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let gameId = selected?.id

    if (addingNew) {
      const { data, error } = await supabase
        .from('game_catalog')
        .insert({ ...newGame, added_by: user.id })
        .select()
        .single()
      if (error) { setError(error.message); setLoading(false); return }
      gameId = data.id
    }

    const { error: err } = await supabase.from('games').insert({
      title: addingNew ? newGame.title : selected.title,
      genre: addingNew ? newGame.genre : selected.genre,
      emoji: addingNew ? newGame.emoji : selected.emoji,
      status,
      rating: status === 'completato' ? parseInt(rating) : 0,
      hours: parseInt(hours),
      notes,
      user_id: user.id,
    })

    if (err) setError(err.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  const gameChosen = selected || (addingNew && newGame.title)

  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 py-20">
      <Navbar />
      <div className="max-w-lg mx-auto pt-20">
        <div className="mb-10">
          <p className="font-mono text-xs text-[#00f5a0] tracking-widest uppercase mb-2">// aggiungi gioco</p>
          <h1 className="text-5xl font-bold tracking-wide">Cerca un<br />gioco</h1>
        </div>

        {!gameChosen && (
          <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6">
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Cerca nel catalogo</label>
            <input
              value={search}
              onChange={handleSearch}
              className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors"
              placeholder="es. Elden Ring..."
            />

            {results.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {results.map((g) => (
                  <button
                    key={g.id || g.title}
                    onClick={() => { setSelected(g); setAddingNew(false) }}
                    className="flex items-center gap-3 bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 hover:border-[#00f5a0] transition-colors text-left"
                  >
                    <span className="text-2xl">{g.emoji || '🎮'}</span>
                    <div>
                      <div className="text-sm font-medium">{g.title}</div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{g.genre || '-'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {search.length >= 2 && results.length === 0 && (
              <div className="mt-4 text-center">
                <p className="font-mono text-xs text-zinc-500 mb-3">Nessun risultato per "{search}"</p>
                <button
                  onClick={() => { setAddingNew(true); setNewGame({ ...newGame, title: search }) }}
                  className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors"
                >
                  + Aggiungi "{search}" al catalogo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Qui rimane tutta la logica di aggiunta gioco / form dettagli */}
        {gameChosen && (
          <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex flex-col gap-5">
            {/* ... resto del form identico a prima ... */}
            <button onClick={handleSave} disabled={loading} className="w-full bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50">
              {loading ? 'Salvataggio...' : 'Salva gioco'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}