import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { vehicleCategoryId: string } } //extracting the params for vehicleCategoryId
) {
  try {
    const baseUrl = process.env.API_URL;

    // generating api URL
    const apiUrl = `${baseUrl}/vehicle-type/list?page=1&limit=20&sortOrder=ASC&vehicleCategoryId=${params.vehicleCategoryId}`;

    const res = await fetch(apiUrl, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicle types: ${res.statusText}`);
    }

    const data = await res.json();
    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return Response.json(
      { error: "An error occurred while fetching vehicle types." },
      {
        status: 500,
      }
    );
  }
}
