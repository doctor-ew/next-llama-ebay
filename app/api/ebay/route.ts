import { NextRequest, NextResponse } from "next/server";
import { fetchCardPrices } from "@/utils/fetchCardPrices";
import { extractSearchTerm } from "@/utils/extractSearchTerm"; // Import the search term extractor

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
          { error: "Invalid query parameter" },
          { status: 400 }
      );
    }

    // Use the extractSearchTerm function to refine the query
    const refinedQuery = await extractSearchTerm(query);

    // Fetch card prices based on the refined query
    const items = await fetchCardPrices(refinedQuery);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error in /api/ebay:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}
