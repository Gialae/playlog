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

    const games = data.map(g => ({
      id: `igdb-${g.id}`,
      title: g.name,
      genre: g.genres?.[0]?.name || 'Altro',
      emoji: '🎮',
    }))

    return Response.json(games)
  } catch (err) {
    return Response.json([])
  }
}