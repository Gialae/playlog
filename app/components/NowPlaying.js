export default function NowPlaying() {
  return (
    <div className="mt-16">
      <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-3">
        In gioco ora
        <span className="flex-1 h-px bg-[#1e1e38]"></span>
      </p>

      <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl overflow-hidden">
        
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-[#1a0a2e] via-[#0a1628] to-[#0a2810] relative flex items-start p-3">
          <div className="flex items-center gap-2 bg-[#ff4d6d] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Live
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7b61ff] to-[#ff4d6d] flex items-center justify-center text-2xl flex-shrink-0">
            ⚔️
          </div>
          <div className="flex-1">
            <div className="font-medium text-base mb-1">Elden Ring</div>
            <div className="font-mono text-xs text-zinc-500 mb-2">RPG · FromSoftware</div>
            <div className="h-1 bg-[#1e1e38] rounded-full overflow-hidden">
              <div className="h-full w-[67%] bg-gradient-to-r from-[#7b61ff] to-[#00f5a0] rounded-full"></div>
            </div>
            <div className="font-mono text-[10px] text-zinc-600 mt-1">67% completato</div>
          </div>
        </div>

      </div>
    </div>
  );
}