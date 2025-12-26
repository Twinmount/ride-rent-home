import { ENV } from "@/config/env";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type PayloadType = {
  type: "path" | "tag";
  value: string;
};

const ALLOWED_ORIGIN =
  ENV.ADMIN_PANEL_DOMAIN || ENV.NEXT_PUBLIC_ADMIN_PANEL_DOMAIN || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/* API endpoint to revalidate cache from admin panel
 *  POST /api/revalidate-cache
 */
export async function POST(request: NextRequest) {
  try {
    const body: PayloadType = await request.json();
    const { type, value } = body;

    if (!type || !value) {
      return NextResponse.json(
        { success: false, message: "Missing type or value" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (type === "path") {
      revalidatePath(value);
      console.log(`✅ Revalidated path: ${value}`);

      return NextResponse.json(
        {
          success: true,
          type: "path",
          value,
          message: `Revalidated path: ${value}`,
          timestamp: new Date().toISOString(),
        },
        {
          headers: corsHeaders,
        }
      );
    }

    if (type === "tag") {
      revalidateTag(value);
      console.log(`✅ Revalidated tag: ${value}`);

      return NextResponse.json(
        {
          success: true,
          type: "tag",
          value,
          message: `Revalidated tag: ${value}`,
          timestamp: new Date().toISOString(),
        },
        {
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid type. Use "path" or "tag"' },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Revalidation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
