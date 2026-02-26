import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contatti() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-10 pt-40 pb-20">

        <p className="font-mono text-xs tracking-widest text-[#00f5a0] mb-2">// contatti</p>
        <h1 className="text-7xl font-bold tracking-wide leading-none mb-6">Get in<br />touch</h1>
        <p className="font-mono text-sm text-zinc-500 mb-16 max-w-md">
          PLAYLOG è un progetto open e in continua evoluzione. Hai idee, bug da segnalare o vuoi collaborare? Scrivici!
        </p>

        <div className="flex flex-col gap-4">

          <a href="mailto:ConservaLabs@outlook.it" className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex items-center gap-5 hover:border-[#00f5a0] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#00f5a0]/10 border border-[#00f5a0]/30 flex items-center justify-center text-2xl flex-shrink-0">
              📧
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Email</div>
              <div className="font-medium group-hover:text-[#00f5a0] transition-colors">hello@playlog.app</div>
            </div>
          </a>

          <a href="https://github.com" target="_blank" className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex items-center gap-5 hover:border-[#00f5a0] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#7b61ff]/10 border border-[#7b61ff]/30 flex items-center justify-center text-2xl flex-shrink-0">
              💻
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">GitHub</div>
              <div className="font-medium group-hover:text-[#00f5a0] transition-colors">github.com/playlog</div>
            </div>
          </a>

          <a href="https://instagram.com" target="_blank" className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-6 flex items-center gap-5 hover:border-[#00f5a0] transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 flex items-center justify-center text-2xl flex-shrink-0">
              📸
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Instagram</div>
              <div className="font-medium group-hover:text-[#00f5a0] transition-colors">@playlog.app</div>
            </div>
          </a>

        </div>

        <div className="mt-16 bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">// chi siamo</p>
          <p className="text-zinc-300 leading-relaxed mb-4">
            PLAYLOG nasce dalla passione per i videogiochi e dal desiderio di avere un posto dove tenere traccia di tutto quello che si gioca — senza pubblicità, senza algoritmi, senza distrazioni.
          </p>
          <p className="text-zinc-500 font-mono text-xs">
            Fatto con ❤️ e Next.js
          </p>
        </div>

      </div>
        <Footer />
    </main>
  )
}