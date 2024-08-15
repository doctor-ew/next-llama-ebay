import { fetchCardPrices } from "@/utils/fetchCardPrices";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Safely parse JSON request body
    const jsonData = await request.json();
    const query = jsonData?.query;

    if (!query) {
      return NextResponse.json(
          { error: "Invalid query parameter" },
          { status: 400 }
      );
    }

    const items = await fetchCardPrices(query);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error in /api/ebay:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}
