import { NextRequest, NextResponse } from "next/server";
import { scanUrl, UrlScanError } from "../../lib/url-scanner";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a URL to scan" },
        { status: 400 }
      );
    }

    const result = await scanUrl(url);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UrlScanError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
