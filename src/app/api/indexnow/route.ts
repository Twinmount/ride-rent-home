import { submitUrlsToIndexNow } from "@/utils/indexNow";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.urlList || !Array.isArray(body.urlList)) {
      return NextResponse.json(
        { message: "Invalid request. urlList must be an array." },
        { status: 400 }
      );
    }

    const urlList = body.urlList;

    // Call the helper function to submit URLs
    const result = await submitUrlsToIndexNow(urlList);

    return NextResponse.json(
      { message: "URLs submitted successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting URLs:", error);
    return NextResponse.json(
      { message: "Error submitting URLs", error },
      { status: 500 }
    );
  }
}
