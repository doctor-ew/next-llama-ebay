import {
  Document,
  VectorStoreIndex,
  ResponseSynthesizer,
  TreeSummarize,
  TreeSummarizePrompt,
} from "llamaindex";

// Create a summarization prompt that extracts both the core subject and the user's intent.
const treeSummarizePrompt: TreeSummarizePrompt = ({ context, query }) => {
  return `Context information is provided below.
---------------------
${context}
---------------------
Given this information, extract the core subject of the following query and determine the user's intent. For example, the query 'What is the most expensive baseball card?' would return a JSON object like {"subject": "baseball card", "intent": "most expensive"}. For 'Find the cheapest Pokemon card,' it would return {"subject": "Pokemon card", "intent": "cheapest"}.
Query: ${query}
Result:`;
};

export async function extractSearchTerm(query: string): Promise<{ subject: string; intent: string }> {
  try {
    console.log("|-E-| Creating document with query:", query);
    // Create a document based on the input query
    const document = new Document({ text: query });

    console.log("|-E-| Creating index from document...");
    // Create an index using the document
    const index = await VectorStoreIndex.fromDocuments([document]);

    console.log("|-E-| Initializing response synthesizer...");
    // Initialize the response synthesizer with the TreeSummarize response builder
    const responseSynthesizer = new ResponseSynthesizer({
      responseBuilder: new TreeSummarize(),
    });

    console.log("|-E-| Creating query engine...");
    // Create a query engine from the index and attach the response synthesizer
    const queryEngine = index.asQueryEngine({
      responseSynthesizer,
    });

    console.log("|-E-| Updating query engine prompts...");
    // Update the prompt to use the refined tree summarize prompt
    queryEngine.updatePrompts({
      "responseSynthesizer:summaryTemplate": treeSummarizePrompt,
    });

    console.log("|-E-| Querying the index...");
    // Query the index with the specific query asking for the main subject and intent
    const response = await queryEngine.query({ query });

    console.log("|-E-| Raw response from query engine:", response.response);

    // Ensure that the response is in JSON format
    const cleanedResponse = response.response.replace(/```json|```/g, "").trim();

    // Parse the JSON response safely
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("|-E-| Failed to parse JSON from response:", cleanedResponse, error);
      throw new Error("Failed to parse JSON from the response.");
    }

    const { subject, intent } = parsedResponse;

    console.log("|-E-| Extracted Search Term:", subject, "| Intent:", intent);
    return { subject, intent };
  } catch (error) {
    console.error("|-E-| An error occurred while extracting the search term:", error);
    throw error;
  }
}
