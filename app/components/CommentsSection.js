'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

export default function CommentsSection({ gameTitle }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('game_title', gameTitle)
        .order('created_at', { ascending: false })
      setComments(data || [])
    }
    load()
  }, [gameTitle])

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('comments').insert({
      game_title: gameTitle,
      content: content.trim(),
      user_id: user.id,
      user_email: user.email,
    }).select().single()
    if (!error) {
      setComments([data, ...comments])
      setContent('')
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from('comments').delete().eq('id', id)
    setComments(comments.filter(c => c.id !== id))
  }

  return (
    <div className="border-t border-[#1e1e38]">

      {/* Toggle commenti */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-[#ffffff05] transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          💬 {comments.length} commenti
        </span>
        <span className="font-mono text-[10px] text-zinc-600 ml-auto">
          {open ? '▲ chiudi' : '▼ apri'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4">

          {/* Form commento */}
          {user ? (
            <div className="flex gap-3">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Lascia un commento..."
                className="flex-1 bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50"
              >
                Invia
              </button>
            </div>
          ) : (
            <a href="/login" className="font-mono text-xs text-zinc-500 hover:text-[#00f5a0] transition-colors">
              → Accedi per commentare
            </a>
          )}

          {/* Lista commenti */}
          {comments.length === 0 && (
            <p className="font-mono text-xs text-zinc-600">Nessun commento ancora — sii il primo!</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#00f5a0] flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                {c.user_email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-zinc-500">{c.user_email?.split('@')[0]}</span>
                  <span className="font-mono text-[9px] text-zinc-700">
                    {new Date(c.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">{c.content}</p>
              </div>
              {user?.id === c.user_id && (
                <button onClick={() => handleDelete(c.id)} className="font-mono text-[10px] text-zinc-700 hover:text-[#ff4d6d] transition-colors">
                  🗑️
                </button>
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  )
}