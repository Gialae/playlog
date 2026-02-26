'use client'

const colors = ["#00f5a0", "#7b61ff", "#ff4d6d", "#ffd700", "#ff8c42"]

export default function Charts({ games }) {
  if (!games || games.length === 0) return null

  // Calcola generi dai giochi reali
  const genreMap = {}
  games.forEach(g => {
    if (!g.genre) return
    const genre = g.genre.split('·')[0].trim()
    genreMap[genre] = (genreMap[genre] || 0) + 1
  })
  const genres = Object.entries(genreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({
      name,
      count,
      pct: Math.round((count / games.length) * 100),
      color: colors[i]
    }))

  // Calcola completati per mese (ultimi 7 mesi)
  const now = new Date()
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1)
    return {
      label: d.toLocaleString('it-IT', { month: 'short' }).toUpperCase().slice(0, 3),
      month: d.getMonth(),
      year: d.getFullYear(),
      count: 0,
      active: i === 6
    }
  })

  games.filter(g => g.status === 'completato').forEach(g => {
    const d = new Date(g.created_at)
    const m = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear())
    if (m) m.count++
  })

  const maxCount = Math.max(...months.map(m => m.count), 1)
  const monthsWithPct = months.map(m => ({ ...m, pct: Math.round((m.count / maxCount) * 100) || 4 }))

  const bestMonth = [...months].sort((a, b) => b.count - a.count)[0]
  const avg = (games.filter(g => g.status === 'completato').length / 7).toFixed(1)

  return (
    <div className="grid grid-cols-2 gap-5 mt-16">

      {/* Generi */}
      <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6">
        <h3 className="font-mono text-xs tracking-widest uppercase text-zinc-500 mb-6">Generi preferiti</h3>
        {genres.length === 0 ? (
          <p className="font-mono text-xs text-zinc-600">Nessun dato ancora</p>
        ) : (
          <div className="flex flex-col gap-4">
            {genres.map((g) => (
              <div key={g.name} className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 w-20 flex-shrink-0 truncate">{g.name}</span>
                <div className="flex-1 h-2 bg-[#1e1e38] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}55)` }} />
                </div>
                <span className="font-mono text-[10px] text-zinc-600 w-6 text-right">{g.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mesi */}
      <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6">
        <h3 className="font-mono text-xs tracking-widest uppercase text-zinc-500 mb-6">Completati per mese</h3>
        <div className="flex items-end gap-2 h-28">
          {monthsWithPct.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${m.pct}%`,
                  background: m.active
                    ? "linear-gradient(180deg, #00f5a0, rgba(0,245,160,0.2))"
                    : "linear-gradient(180deg, #7b61ff, rgba(123,97,255,0.2))"
                }}
              />
              <span className={`font-mono text-[9px] uppercase tracking-widest ${m.active ? "text-[#00f5a0]" : "text-zinc-600"}`}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 font-mono text-[10px] text-zinc-600">
          <span>🏆 Miglior mese: {bestMonth.label} ({bestMonth.count})</span>
          <span>Media: {avg}/mese</span>
        </div>
      </div>

    </div>
  )
}