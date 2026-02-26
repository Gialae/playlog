export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e38] bg-[#080810] px-10 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-start justify-between mb-10">

          {/* Logo + descrizione */}
          <div className="max-w-xs">
            <div className="text-2xl tracking-[6px] font-bold text-[#00f5a0] mb-3">
              PLAY<span className="text-white">LOG</span>
            </div>
            <p className="font-mono text-xs text-zinc-500 leading-relaxed">
              Il tuo diario di gioco personale. Tieni traccia di tutto quello che giochi, condividi con la community.
            </p>
          </div>

          {/* Link */}
          <div className="flex gap-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Navigazione</p>
              <div className="flex flex-col gap-3">
                <a href="/" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Home</a>
                <a href="/dashboard" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Dashboard</a>
                <a href="/add" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Aggiungi gioco</a>
                <a href="/contatti" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Contatti</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Social</p>
              <div className="flex flex-col gap-3">
                <a href="https://github.com" target="_blank" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">GitHub</a>
                <a href="https://instagram.com" target="_blank" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Instagram</a>
                <a href="mailto:hello@playlog.app" className="font-mono text-xs text-zinc-400 hover:text-[#00f5a0] transition-colors">Email</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-8 border-t border-[#1e1e38]">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            © 2026 PLAYLOG — Fatto con ❤️ e Next.js
          </p>
          <div className="flex gap-6">
            <a href="/login" className="font-mono text-[10px] text-zinc-600 hover:text-[#00f5a0] transition-colors uppercase tracking-widest">Accedi</a>
            <a href="/login" className="font-mono text-[10px] text-zinc-600 hover:text-[#00f5a0] transition-colors uppercase tracking-widest">Registrati</a>
          </div>
        </div>

      </div>
    </footer>
  )
}