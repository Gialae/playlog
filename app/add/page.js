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
    const { data } = await supabase.from('game_catalog').select('*').ilike('title', `%${val}%`).limit(6)
    setResults(data || [])
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    let gameId = selected?.id
    if (addingNew) {
      const { data, error } = await supabase.from('game_catalog').insert({ ...newGame, added_by: user.id }).select().single()
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
            <input value={search} onChange={handleSearch} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors" placeholder="es. Elden Ring..." />
            {results.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {results.map((g) => (
                  <button key={g.id} onClick={() => { setSelected(g); setAddingNew(false) }} className="flex items-center gap-3 bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 hover:border-[#00f5a0] transition-colors text-left">
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <div className="text-sm font-medium">{g.title}</div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{g.genre}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {search.length >= 2 && results.length === 0 && (
              <div className="mt-4 text-center">
                <p className="font-mono text-xs text-zinc-500 mb-3">Nessun risultato per "{search}"</p>
                <button onClick={() => { setAddingNew(true); setNewGame({ ...newGame, title: search }) }} className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors">
                  + Aggiungi "{search}" al catalogo
                </button>
              </div>
            )}
          </div>
        )}

        {addingNew && !selected && (
          <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs text-[#00f5a0] tracking-widest uppercase">Nuovo gioco</p>
              <button onClick={() => { setAddingNew(false); setSearch('') }} className="font-mono text-xs text-zinc-500 hover:text-white">← indietro</button>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Titolo</label>
              <input value={newGame.title} onChange={(e) => setNewGame({ ...newGame, title: e.target.value })} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Genere</label>
              <input value={newGame.genre} onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors" placeholder="es. RPG, Indie, Action..." />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {emojis.map((e) => (
                  <button key={e} onClick={() => setNewGame({ ...newGame, emoji: e })} className={`text-2xl p-2 rounded-lg border transition-colors ${newGame.emoji === e ? 'border-[#00f5a0] bg-[#00f5a0]/10' : 'border-[#1e1e38] hover:border-zinc-500'}`}>{e}</button>
                ))}
              </div>
            </div>
            <button onClick={() => setSelected({ ...newGame, isNew: true })} disabled={!newGame.title} className="w-full bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50">
              Continua →
            </button>
          </div>
        )}

        {gameChosen && (
          <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#1e1e38]">
              <span className="text-3xl">{selected?.emoji || newGame.emoji}</span>
              <div>
                <div className="font-medium">{selected?.title || newGame.title}</div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{selected?.genre || newGame.genre}</div>
              </div>
              <button onClick={() => { setSelected(null); setAddingNew(false); setSearch('') }} className="ml-auto font-mono text-xs text-zinc-500 hover:text-white">← cambia</button>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Stato</label>
              <div className="flex gap-2">
                {['completato', 'in_corso', 'wishlist'].map((s) => (
                  <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-2 rounded-lg border font-mono text-xs uppercase tracking-widest transition-colors ${status === s ? 'border-[#00f5a0] bg-[#00f5a0]/10 text-[#00f5a0]' : 'border-[#1e1e38] text-zinc-500 hover:border-zinc-500'}`}>
                    {s === 'in_corso' ? 'In corso' : s === 'wishlist' ? 'Wishlist' : 'Completato'}
                  </button>
                ))}
              </div>
            </div>

            {status === 'completato' && (
              <>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Voto</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-zinc-700 hover:text-zinc-500'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Ore giocate</label>
                  <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Recensione</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors resize-none" placeholder="Cosa ne pensi?" />
                </div>
              </>
            )}

            {status === 'in_corso' && (
              <>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Ore giocate</label>
                  <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Completamento: {progress}%</label>
                  <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} className="w-full accent-[#00f5a0]" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Note</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors resize-none" placeholder="A che punto sei?" />
                </div>
              </>
            )}

            {status === 'wishlist' && (
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Priorità</label>
                <div className="flex gap-2">
                  {['alta', 'media', 'bassa'].map((p) => (
                    <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg border font-mono text-xs uppercase tracking-widest transition-colors ${priority === p ? 'border-[#ff4d6d] bg-[#ff4d6d]/10 text-[#ff4d6d]' : 'border-[#1e1e38] text-zinc-500 hover:border-zinc-500'}`}>{p}</button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="font-mono text-xs text-[#ff4d6d] bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 rounded-lg px-4 py-3">{error}</p>}

            <button onClick={handleSave} disabled={loading} className="w-full bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50">
              {loading ? 'Salvataggio...' : 'Salva gioco'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}