import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { vehicleCategoryId: string; searchTerm: string } }
) {
  try {
    const { vehicleCategoryId, searchTerm } = params

    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    // generating api URL
    const apiUrl = `${baseUrl}/vehicle-brand/list?page=1&limit=20&sortOrder=ASC&vehicleCategoryId=${vehicleCategoryId}&search=${searchTerm}`

    const res = await fetch(apiUrl, {
      method: 'GET',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicle brands: ${res.statusText}`)
    }

    const data = await res.json()
    return Response.json({ data })
  } catch (error) {
    console.error('Error fetching vehicle brands:', error)
    return Response.json(
      { error: 'An error occurred while fetching vehicle brands.' },
      {
        status: 500,
      }
    )
  }
}
