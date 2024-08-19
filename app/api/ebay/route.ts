// export const runtime = "edge"

import { NextRequest, NextResponse } from "next/server";
import { fetchCardPrices } from "@/utils/fetchCardPrices";
import { extractSearchTerm } from "@/utils/extractSearchTerm"; // Import the search term extractor
// import sharp from 'sharp';
// import { someOnnxruntimeFunction } from 'onnxruntime-node';


let https, fs, path;

if (typeof window === 'undefined') {
  https = require('https');
  fs = require('fs');
  path = require('path');
}



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
    const { subject, intent } = await extractSearchTerm(query);

    // Fetch card prices based on the refined subject and intent
    const items = await fetchCardPrices(subject, intent);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error in /api/ebay:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}
