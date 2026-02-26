const stats = [
  { num: "84", label: "Completati" },
  { num: "3", label: "In corso" },
  { num: "1.2k", label: "Ore giocate" },
  { num: "22", label: "Wishlist" },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-3 mt-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl p-4 text-center hover:border-[#00f5a0] transition-colors group"
        >
          <div className="text-4xl font-bold text-[#00f5a0] font-mono group-hover:drop-shadow-[0_0_10px_rgba(0,245,160,0.5)] transition-all">
            {stat.num}
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-zinc-500 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}