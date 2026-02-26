import GameCard from "./GameCard";

const games = [
  { title: "Elden Ring", genre: "RPG · FromSoftware", status: "in_corso", emoji: "⚔️", rating: 5 },
  { title: "Hades II", genre: "Roguelike", status: "completato", emoji: "🚀", rating: 5 },
  { title: "Baldur's Gate 3", genre: "RPG", status: "completato", emoji: "🌌", rating: 4 },
  { title: "Hollow Knight", genre: "Metroidvania", status: "completato", emoji: "🧿", rating: 5 },
  { title: "NieR: Automata", genre: "Action RPG", status: "completato", emoji: "🤖", rating: 5 },
  { title: "Metaphor", genre: "JRPG", status: "wishlist", emoji: "🌠", rating: 0 },
];

export default function GameGrid() {
  return (
    <div className="mt-16">
      <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-3">
        Giochi
        <span className="flex-1 h-px bg-[#1e1e38]"></span>
      </p>
        <div className="grid grid-cols-3 gap-5">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}