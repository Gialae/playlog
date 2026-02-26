export async function GET(req) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams)

  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.IGDB_CLIENT_ID,
      'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
      'Accept': 'application/json',
    },
    body: `search "${search}"; fields id,name,genres.name; limit 6;`
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { status: 200 })
}