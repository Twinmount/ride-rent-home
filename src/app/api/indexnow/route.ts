import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { urlList } = await req.json();

    if (!Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: "urlList is required and must be an array" },
        { status: 400 }
      );
    }

    const API_ENDPOINT = "https://api.indexnow.org/indexnow";
    const INDEX_NOW_KEY = process.env.NEXT_PUBLIC_INDEX_NOW_KEY;
    const DOMAIN = process.env.NEXT_PUBLIC_HOST;
    const KEY_LOCATION = `${DOMAIN}/${INDEX_NOW_KEY}.txt`;

    const payload = {
      host: DOMAIN,
      key: INDEX_NOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "URLs submitted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
