'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

export default function PostFeed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [gameTitle, setGameTitle] = useState('')
  const [gameEmoji, setGameEmoji] = useState('')
  const [user, setUser] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)
      setPosts(postsData || [])
      const { data: catalogData } = await supabase
        .from('game_catalog')
        .select('*')
        .order('title')
      setCatalog(catalogData || [])
    }
    load()

    const channel = supabase
      .channel('posts-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts((prev) => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function handlePost() {
    if (!content.trim() || !user) return
    setLoading(true)
    await supabase.from('posts').insert({
      content: content.trim(),
      game_title: gameTitle || null,
      game_emoji: gameEmoji || null,
      user_id: user.id,
      user_email: user.email,
    })
    setContent('')
    setGameTitle('')
    setGameEmoji('')
    setShowForm(false)
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'ora'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m fa`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h fa`
    return `${Math.floor(seconds / 86400)}g fa`
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* Form nuovo post */}
      {user ? (
        <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-2xl p-5 mb-6">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#00f5a0] flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setShowForm(true)}
                placeholder="Cosa stai giocando? Condividi con la community..."
                rows={showForm ? 3 : 1}
                className="w-full bg-transparent text-sm text-white outline-none resize-none placeholder-zinc-600"
              />
              {showForm && (
                <>
                  {/* Scegli gioco */}
                  <div className="mt-3 mb-3">
                    <select
                      value={gameTitle}
                      onChange={(e) => {
                        const selected = catalog.find(g => g.title === e.target.value)
                        setGameTitle(e.target.value)
                        setGameEmoji(selected?.emoji || '')
                      }}
                      className="bg-[#080810] border border-[#1e1e38] rounded-lg px-3 py-2 text-xs text-zinc-400 outline-none focus:border-[#00f5a0] transition-colors w-full"
                    >
                      <option value="">🎮 Tagga un gioco (opzionale)</option>
                      {catalog.map(g => (
                        <option key={g.id} value={g.title}>{g.emoji} {g.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1e1e38]">
                    <button onClick={() => { setShowForm(false); setContent(''); setGameTitle('') }} className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                      Annulla
                    </button>
                    <button
                      onClick={handlePost}
                      disabled={!content.trim() || loading}
                      className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50"
                    >
                      {loading ? '...' : 'Pubblica'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-2xl p-5 mb-6 text-center">
          <p className="font-mono text-xs text-zinc-500 mb-3">Accedi per pubblicare un post</p>
          <a href="/login" className="bg-[#00f5a0] text-black font-bold text-xs tracking-widest uppercase px-5 py-2 rounded-lg hover:bg-[#00e090] transition-colors">
            Accedi →
          </a>
        </div>
      )}

      {/* Feed post */}
      <div className="flex flex-col gap-4">
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📝</div>
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Nessun post ancora — sii il primo!</p>
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-[#0f0f1a] border border-[#1e1e38] rounded-2xl p-5 hover:border-[#00f5a0]/30 transition-colors">

            {/* Header post */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#00f5a0] flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
                {post.user_email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{post.user_email?.split('@')[0]}</div>
                <div className="font-mono text-[10px] text-zinc-600">{timeAgo(post.created_at)}</div>
              </div>
              {post.game_title && (
                <div className="flex items-center gap-1 bg-[#00f5a0]/5 border border-[#00f5a0]/20 rounded-lg px-3 py-1">
                  <span className="text-sm">{post.game_emoji}</span>
                  <span className="font-mono text-[10px] text-[#00f5a0]">{post.game_title}</span>
                </div>
              )}
              {user?.id === post.user_id && (
                <button onClick={() => handleDelete(post.id)} className="text-zinc-700 hover:text-[#ff4d6d] transition-colors text-xs">🗑️</button>
              )}
            </div>

            {/* Contenuto */}
            <p className="text-sm text-zinc-300 leading-relaxed">{post.content}</p>

          </div>
        ))}
      </div>
    </div>
  )
}