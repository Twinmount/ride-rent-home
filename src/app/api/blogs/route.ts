import { NextRequest, NextResponse } from "next/server";
import { API } from "@/utils/API";
import { FetchBlogsResponse } from "@/types/blog.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, selectedTag, country } = body;

    const requestBody: Record<string, any> = {
      page: page.toString(),
      limit: "8",
      sortOrder: "DESC",
    };

    if (selectedTag && selectedTag.toLowerCase() !== "all") {
      requestBody.blogCategory = [selectedTag];
    }

    const response = await API({
      path: "/blogs/list",
      options: {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
      country: country,
    });

    const data: FetchBlogsResponse = await response.json();
    const blogs = data.result?.list || [];
    const hasMore = parseInt(data.result?.page || "1") < (data.result?.totalNumberOfPages || 1);

    return NextResponse.json({
      blogs,
      hasMore,
      totalPages: data.result?.totalNumberOfPages || 1,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { blogs: [], hasMore: false, totalPages: 1 },
      { status: 500 }
    );
  }
}