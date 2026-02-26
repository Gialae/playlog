export default function GameCard({ id, title, genre, status, emoji, rating, onDelete, onEdit }) {
  const statusStyles = {
    completato: "bg-[#00f5a0]/10 text-[#00f5a0] border-[#00f5a0]/30",
    in_corso: "bg-[#7b61ff]/10 text-[#7b61ff] border-[#7b61ff]/30",
    wishlist: "bg-[#ff4d6d]/10 text-[#ff4d6d] border-[#ff4d6d]/30",
  };

  const statusLabels = {
    completato: "Completato",
    in_corso: "In corso",
    wishlist: "Wishlist",
  };

  return (
    <div className="bg-[#0f0f1a] border border-[#1e1e38] rounded-xl overflow-hidden hover:border-[#00f5a0] hover:-translate-y-1 transition-all duration-300 group">
      <div className="h-36 bg-gradient-to-br from-[#0f0f2a] to-[#1a1a0f] flex items-center justify-center text-5xl relative">
        {emoji}
        <span className={`absolute top-2 right-2 text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded border ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
        {(onDelete || onEdit) && (
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button onClick={() => onEdit(id)} className="bg-[#080810]/80 border border-[#1e1e38] text-zinc-400 hover:text-[#00f5a0] hover:border-[#00f5a0] text-xs px-2 py-1 rounded font-mono transition-colors">
                ✏️
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(id)} className="bg-[#080810]/80 border border-[#1e1e38] text-zinc-400 hover:text-[#ff4d6d] hover:border-[#ff4d6d] text-xs px-2 py-1 rounded font-mono transition-colors">
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="font-medium text-sm truncate mb-1">{title}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-3">{genre}</div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={star <= rating ? "text-yellow-400" : "text-zinc-700"}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
}