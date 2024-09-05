export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${baseUrl}/vehicle-category/list`, {
    method: 'GET',
  })

  const data = await res.json()

  return Response.json({ data })
}
