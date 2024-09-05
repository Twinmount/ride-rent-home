import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { stateId: string } }
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/city/list?stateId=${params.stateId}`, {
    method: 'GET',
  })

  const data = await res.json()

  return Response.json({ data })
}
