import { getOAuthToken } from "@/utils/getEbayOAuthToken";
import axios from "axios";
import { Document, VectorStoreIndex } from "llamaindex"; // Import LlamaIndex

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

export async function fetchCardPrices(query: string): Promise<EbayItem[]> {
  const accessToken = await getOAuthToken(); // Get the dynamic OAuth token
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

    // Convert the fetched data to a single document for LlamaIndex
    const combinedText = items
      .map(
        (item: { title: any; price: { value: any; currency: any } }) =>
          `${item.title}: ${item.price.value} ${item.price.currency}`,
      )
      .join("\n");
    const document = new Document({ text: combinedText });

    // Create embeddings and store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments([document]);

    // Query the index
    const queryEngine = index.asQueryEngine();
    const responseText = await queryEngine.query({
      query: "What is the most expensive baseball card?",
    });

    console.log("RAG Query Response:", responseText.toString());

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
