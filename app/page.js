import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommentsSection from './components/CommentsSection'
import { createClient } from './lib/supabase'
import HomeHero from './components/HomeHero'
import PostFeed from './components/PostFeed'

export const revalidate = 0

export default async function Home() {
  const supabase = createClient()
  const { data: games = [] } = await supabase.from('game_stats').select('*')

  const totalPlayers = games.reduce((acc, g) => acc + Number(g.total_players), 0)
  const totalOre = games.reduce((acc, g) => acc + Number(g.ore_totali), 0)
  const totalCompletati = games.reduce((acc, g) => acc + Number(g.completati), 0)
  const topGame = games[0]

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <Navbar />

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-24">
        <HomeHero gamesCount={games.length} />
      </div>

      {/* STATISTICHE GLOBALI */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12 md:py-16" style={{ borderTop: '1px solid #1e1e38' }}>
        <p className="font-mono text-xs tracking-widest uppercase text-zinc-600 mb-6 md:mb-8">// statistiche globali</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { num: games.length, label: 'Giochi', icon: '🎮' },
            { num: totalPlayers, label: 'Partite', icon: '🕹️' },
            { num: totalCompletati, label: 'Completati', icon: '🏆' },
            { num: `${totalOre}h`, label: 'Ore giocate', icon: '⏱️' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#0f0f1a', border: '1px solid #1e1e38', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00f5a0', fontFamily: 'monospace' }}>{stat.num}</div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', color: '#71717a', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP GAME */}
      {topGame && (
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-12 md:py-16" style={{ borderTop: '1px solid #1e1e38' }}>
          <p className="font-mono text-xs tracking-widest uppercase text-zinc-600 mb-6 md:mb-8">// gioco più popolare</p>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,245,160,0.06) 0%, #0f0f1a 50%, rgba(123,97,255,0.06) 100%)', border: '1px solid rgba(0,245,160,0.15)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '56px' }}>{topGame.emoji}</div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{topGame.title}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#71717a' }}>{topGame.genre}</div>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { val: topGame.total_players, label: 'giocatori', color: '#00f5a0' },
                { val: topGame.voto_medio ? `${topGame.voto_medio}★` : '—', label: 'voto medio', color: '#fbbf24' },
                { val: `${topGame.ore_totali}h`, label: 'ore totali', color: '#d4d4d8' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', color: s.color }}>{s.val}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: '#52525b' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEED POST */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12 md:py-16" style={{ borderTop: '1px solid #1e1e38' }}>
        <p className="font-mono text-xs tracking-widest uppercase text-zinc-600 mb-6 md:mb-8">// feed community</p>
        <PostFeed />
      </div>

      {/* LISTA GIOCHI */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12 md:py-16" style={{ borderTop: '1px solid #1e1e38' }}>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <p className="font-mono text-xs tracking-widest uppercase text-zinc-600">// tutti i giochi</p>
          <span className="font-mono text-xs text-zinc-600">{games.length} titoli</span>
        </div>

        {games.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎮</div>
            <p style={{ fontFamily: 'monospace', color: '#71717a', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>Nessun gioco ancora</p>
            <a href="/login" style={{ background: '#00f5a0', color: 'black', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>Sii il primo →</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {games.map((game, i) => (
              <div key={game.id} style={{ background: '#0f0f1a', border: '1px solid #1e1e38', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold', width: '28px', textAlign: 'center', flexShrink: 0, color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : '#3f3f46' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>{game.emoji}</div>
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{game.title}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#71717a' }}>{game.genre}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { val: game.total_players, label: 'player', color: '#00f5a0', bg: 'rgba(0,245,160,0.05)', border: 'rgba(0,245,160,0.1)' },
                      { val: game.completati, label: 'finiti', color: 'white', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
                      { val: `${game.ore_totali}h`, label: 'ore', color: '#d4d4d8', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.05)' },
                    ].map((s) => (
                      <div key={s.label} style={{ textAlign: 'center', padding: '6px 10px', borderRadius: '8px', background: s.bg, border: `1px solid ${s.border}` }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', color: s.color }}>{s.val}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '1px', color: '#52525b' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <CommentsSection gameTitle={game.title} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}