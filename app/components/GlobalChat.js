'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '../lib/supabase'

export default function GlobalChat() {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const bottomRef = useRef(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)
      setMessages(data || [])
    }
    load()
    const channel = supabase
      .channel('global-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function handleSend() {
    if (!content.trim() || !user) return
    const msg = content.trim()
    setContent('')
    await supabase.from('chat_messages').insert({
      content: msg,
      user_id: user.id,
      user_email: user.email,
    })
  }

  async function handleDelete(id) {
    await supabase.from('chat_messages').delete().eq('id', id)
    setMessages(messages.filter(m => m.id !== id))
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px'}}>
      {open && (
        <div style={{width:'320px', height:'420px', background:'#0f0f1a', border:'1px solid #1e1e38', borderRadius:'16px', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 25px 50px rgba(0,0,0,0.5)'}}>
          <div style={{padding:'12px 16px', borderBottom:'1px solid #1e1e38', display:'flex', alignItems:'center', gap:'8px', background:'#080810'}}>
            <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#00f5a0'}} />
            <span style={{fontFamily:'monospace', fontSize:'11px', textTransform:'uppercase', letterSpacing:'2px', color:'#d4d4d8'}}>Chat globale</span>
            <span style={{fontFamily:'monospace', fontSize:'10px', color:'#52525b', marginLeft:'auto'}}>{messages.length} msg</span>
          </div>
          <div style={{flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'8px'}}>
            {messages.length === 0 && (
              <p style={{fontFamily:'monospace', fontSize:'11px', color:'#52525b', textAlign:'center', marginTop:'32px'}}>Nessun messaggio ancora 🧊</p>
            )}
            {messages.map((m) => (
              <div key={m.id} style={{display:'flex', gap:'8px', alignItems:'flex-start', flexDirection: m.user_id === user?.id ? 'row-reverse' : 'row'}}>
                <div style={{width:'24px', height:'24px', borderRadius:'50%', background:'linear-gradient(135deg, #7b61ff, #00f5a0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'bold', color:'black', flexShrink:0}}>
                  {m.user_email?.[0]?.toUpperCase()}
                </div>
                <div style={{maxWidth:'180px', display:'flex', flexDirection:'column', gap:'4px', alignItems: m.user_id === user?.id ? 'flex-end' : 'flex-start'}}>
                  <div style={{padding:'8px 12px', borderRadius:'12px', fontSize:'12px', lineHeight:'1.4', background: m.user_id === user?.id ? 'rgba(0,245,160,0.1)' : '#1e1e38', color: m.user_id === user?.id ? 'white' : '#d4d4d8', border: m.user_id === user?.id ? '1px solid rgba(0,245,160,0.2)' : 'none'}}>
                    {m.content}
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                    <span style={{fontFamily:'monospace', fontSize:'9px', color:'#52525b'}}>{m.user_email?.split('@')[0]}</span>
                    {m.user_id === user?.id && (
                      <button onClick={() => handleDelete(m.id)} style={{fontFamily:'monospace', fontSize:'9px', color:'#3f3f46', background:'none', border:'none', cursor:'pointer'}}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{padding:'12px', borderTop:'1px solid #1e1e38', background:'#080810'}}>
            {user ? (
              <div style={{display:'flex', gap:'8px'}}>
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Scrivi un messaggio..."
                  style={{flex:1, background:'#1e1e38', border:'none', borderRadius:'8px', padding:'8px 12px', fontSize:'12px', color:'white', outline:'none'}}
                />
                <button onClick={handleSend} disabled={!content.trim()} style={{background:'#00f5a0', color:'black', fontWeight:'bold', fontSize:'12px', padding:'8px 12px', borderRadius:'8px', border:'none', cursor:'pointer'}}>→</button>
              </div>
            ) : (
              <a href="/login" style={{fontFamily:'monospace', fontSize:'11px', color:'#71717a', display:'block', textAlign:'center'}}>→ Accedi per chattare</a>
            )}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{width:'56px', height:'56px', background:'#00f5a0', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', fontSize:'24px', boxShadow:'0 8px 25px rgba(0,245,160,0.3)'}}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}