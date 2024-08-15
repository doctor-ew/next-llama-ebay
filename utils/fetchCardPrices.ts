import { getOAuthToken } from "@/utils/getEbayOAuthToken";
import axios from "axios";
import { Document, VectorStoreIndex } from "llamaindex";

interface AxiosError extends Error {
  response?: {
    data?: any;
  };
}

interface EbayItem {
  title: string;
  price: {
    value: string;
    currency: string;
  };
}

// Simple query extractor for demonstration purposes
function extractSearchTerm(query: string): string {
  if (query.toLowerCase().includes("expensive")) {
    return "expensive baseball card";
  }
  return "baseball card";
}

export async function fetchCardPrices(query: string): Promise<EbayItem[]> {
  const accessToken = await getOAuthToken();
  const searchTerm = extractSearchTerm(query); // Extract a simplified search term
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  console.log(`Fetching card prices for query: "${searchTerm}" from eBay...`);

  try {
    const response = await axios.get(url, { headers });
    console.log(`Received response from eBay: ${response.status} ${response.statusText}`);

    if (!response.data.itemSummaries) {
      console.log("No items found in the response.");
      return [];
    }

    const items = response.data.itemSummaries.map((item: any) => ({
      title: item.title,
      price: item.price,
    }));

    console.log("Parsed items:", items);

    return items;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching card prices:", axiosError.message);
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data);
    }
    return [];
  }
}
