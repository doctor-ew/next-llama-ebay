import { getOAuthToken } from "@/utils/getEbayOAuthToken";
import axios from "axios";
import { extractSearchTerm } from "@/utils/extractSearchTerm";

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
  url: string; // Include the URL to the seller's page
}

export async function fetchCardPrices(subject: string, intent: string): Promise<{ items: EbayItem[], url: string }> {
  const accessToken = await getOAuthToken();

  // The eBay API URL template
  let url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(subject)}&limit=10`;

  // Adjust query parameters dynamically based on the intent extracted by LlamaIndex
  if (intent.includes("most expensive")) {
    url += "&sort=-price";
  } else if (intent.includes("cheapest")) {
    url += "&sort=price";
  } else if (intent.includes("best investment")) {
    url += "&sort=price&filter=price:[50..1000]"; // Example filter for "best investment"
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  console.log(`Fetching card prices for subject: "${subject}" with intent: "${intent}" from eBay...`);

  try {
    const response = await axios.get(url, { headers });
    console.log(`Received response from eBay: ${response.status} ${response.statusText}`);

    if (!response.data.itemSummaries) {
      console.log("No items found in the response.");
      return { items: [], url };
    }

    const items = response.data.itemSummaries.map((item: any) => ({
      title: item.title,
      price: item.price,
      url: item.itemWebUrl, // Extract the URL for each item
    }));

    console.log("Parsed items:", items);

    return { items, url };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching card prices:", axiosError.message);
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data);
    }
    return { items: [], url };
  }
}
