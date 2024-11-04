export async function GET() {
  const baseUrl = process.env.API_URL;

  const res = await fetch(`${baseUrl}/vehicle-category/list?limit=15`, {
    method: "GET",
  });

  const data = await res.json();

  return Response.json({ data });
}
