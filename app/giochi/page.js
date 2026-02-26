import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { createClient } from '../lib/supabase'
import CommentsSection from '../components/CommentsSection'

async function getGameStats() {
  const supabase = createClient()
  const { data } = await supabase.from('game_stats').select('*')
  return data || []
}

export default async function Giochi() {
  const games = await getGameStats()

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-10 pt-40 pb-20">

        <p className="font-mono text-xs tracking-widest text-[#00f5a0] mb-2">// catalogo</p>
        <div className="flex items-end justify-between mb-4">
          <h1 className="text-7xl font-bold tracking-wide leading-none">Tutti i<br />giochi</h1>
        </div>
        <p className="font-mono text-sm text-zinc-500 mb-16">{games.length} giochi nel catalogo</p>

        <div className="flex flex-col gap-6">
          {games.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <p className="font-mono text-zinc-500 text-sm tracking-widest uppercase">Nessun gioco ancora</p>
              <a href="/add" className="inline-block mt-6 bg-[#00f5a0] text-black font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-[#00e090] transition-colors">
                + Aggiungi il primo
              </a>
            </div>
          )}

          {games.map((game, i) => (
            <div key={game.id} className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl overflow-hidden">

              {/* Riga principale */}
              <div className="p-5 flex items-center gap-5">
                <div className="font-mono text-2xl font-bold text-zinc-700 w-8 text-center flex-shrink-0">{i + 1}</div>
                <div className="text-3xl flex-shrink-0">{game.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-base mb-1">{game.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{game.genre}</div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-[#00f5a0]">{game.total_players}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">giocatori</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-white">{game.completati}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">completati</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-[#7b61ff]">{game.in_corso}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">in corso</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-[#ff4d6d]">{game.wishlist}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">wishlist</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-yellow-400">
                      {game.voto_medio ? `${game.voto_medio}★` : '—'}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">voto medio</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-zinc-300">{game.ore_totali}h</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">ore totali</div>
                  </div>
                </div>
              </div>

              {/* Sezione commenti */}
              <CommentsSection gameTitle={game.title} />

            </div>
          ))}
        </div>

      </div>
      <Footer />
    </main>
  )
}