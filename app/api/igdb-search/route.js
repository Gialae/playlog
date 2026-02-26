export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')

  try {
    const res = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json',
      },
      body: `search "${query}"; fields name,genres.name; limit 6;`
    })

    const data = await res.json()

    const emojiByGenre = {
      'Role-playing (RPG)': '⚔️',
      'Action': '👊',
      'Adventure': '🗺️',
      'Shooter': '🔫',
      'Sport': '⚽',
      'Racing': '🏎️',
      'Strategy': '♟️',
      'Puzzle': '🧩',
      'Horror': '👻',
      'Platform': '🍄',
      'Fighting': '🥊',
      'Simulation': '🎲',
      'Indie': '🌟',
      'Arcade': '👾',
      'Music': '🎵',
    }

    const games = data.map(g => {
      const genre = g.genres?.[0]?.name || 'Altro'
      return {
        id: `igdb-${g.id}`,
        title: g.name,
        genre: genre,
        emoji: emojiByGenre[genre] || '🎮',
      }
    })

    return Response.json(games)

  } catch (err) {
    return Response.json([])
  }
}