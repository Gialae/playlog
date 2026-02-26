'use client'
import { useEffect, useState, use } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function EditGame({ params }) {
  const { id } = use(params)
  const [game, setGame] = useState(null)
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

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('games').select('*').eq('id', id).single()
      if (data) {
        setGame(data)
        setStatus(data.status)
        setRating(data.rating || 5)
        setHours(data.hours || 0)
        setNotes(data.notes || '')
      }
    }
    load()
  }, [])

  async function handleSave() {
    setLoading(true)
    setError('')
    const { error } = await supabase.from('games').update({
      status,
      rating: status === 'completato' ? parseInt(rating) : 0,
      hours: parseInt(hours),
      notes,
    }).eq('id', id)
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  if (!game) return null

  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 py-20">
      <Navbar />
      <div className="max-w-lg mx-auto pt-20">
        <div className="mb-10">
          <p className="font-mono text-xs text-[#00f5a0] tracking-widest uppercase mb-2">// modifica gioco</p>
          <h1 className="text-5xl font-bold tracking-wide">Modifica</h1>
        </div>

        <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#1e1e38]">
            <span className="text-3xl">{game.emoji}</span>
            <div>
              <div className="font-medium">{game.title}</div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{game.genre}</div>
            </div>
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

          <div className="flex gap-3">
            <button onClick={() => router.push('/dashboard')} className="flex-1 border border-[#1e1e38] text-zinc-500 font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:border-zinc-500 transition-colors">
              Annulla
            </button>
            <button onClick={handleSave} disabled={loading} className="flex-1 bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50">
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}