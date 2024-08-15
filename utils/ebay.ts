import { getOAuthToken } from "@/utils/getEbayOAuthToken";
import axios from "axios";

interface AxiosError extends Error {
  response?: {
    data?: any;
  };
}

interface EbayItem {
  title: string;
  price: {
    currency: string;
    value: string;
  };
}

export async function fetchCardPrices(query: string): Promise<EbayItem[]> {
  const accessToken = await getOAuthToken();
  console.log('[-oo-]', accessToken)// Get the dynamic OAuth token
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  console.log(`Fetching card prices for query: "${query}" from eBay...`);

  try {
    const response = await axios.get(url, { headers });
    console.log(
      `Received response from eBay: ${response.status} ${response.statusText}`,
    );
    console.log(`Found ${response.data.itemSummaries.length} items.`);

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
