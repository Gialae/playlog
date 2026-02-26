'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Controlla la tua email per confermare!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-widest text-[#00f5a0] mb-2">PLAYLOG</h1>
          <p className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
            {isRegister ? 'Crea il tuo account' : 'Bentornato'}
          </p>
        </div>

        <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex flex-col gap-4">
          
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#080810] border border-[#1e1e38] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#00f5a0] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-[#ff4d6d] bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#00e090] transition-colors disabled:opacity-50"
          >
            {loading ? 'Caricamento...' : isRegister ? 'Registrati' : 'Accedi'}
          </button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-mono text-xs text-zinc-500 hover:text-[#00f5a0] transition-colors text-center"
          >
            {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
          </button>

        </div>
      </div>
    </main>
  )
}