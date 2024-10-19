import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { stateValue: string } } //extracting the params for vehicleCategoryId
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // generating api URL
    const apiUrl = `${baseUrl}/links/list?page=1&limit=20&sortOrder=ASC&stateValue=${params.stateValue}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch links: ${res.statusText}`);
    }

    const data = await res.json();
    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching links:", error);
    return Response.json(
      { error: "An error occurred while fetching links." },
      {
        status: 500,
      }
    );
  }
}
