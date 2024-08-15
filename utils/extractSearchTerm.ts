import {
  Document,
  VectorStoreIndex,
  ResponseSynthesizer,
  TreeSummarize,
  TreeSummarizePrompt,
} from "llamaindex";

// Create a summarization prompt
const treeSummarizePrompt: TreeSummarizePrompt = ({ context, query }) => {
  return `Context information is provided below.
---------------------
${context}
---------------------
Based on this information, what is the main subject of the following query?
Query: ${query}
Subject:`;
};

export async function extractSearchTerm(query: string): Promise<string> {
  // Create a document based on the input query
  const document = new Document({ text: query });

  // Create an index using the document
  const index = await VectorStoreIndex.fromDocuments([document]);

  // Initialize the response synthesizer with the TreeSummarize response builder
  const responseSynthesizer = new ResponseSynthesizer({
    responseBuilder: new TreeSummarize(),
  });

  // Create a query engine from the index and attach the response synthesizer
  const queryEngine = index.asQueryEngine({
    responseSynthesizer,
  });

  // Update the prompt to use the tree summarize prompt
  queryEngine.updatePrompts({
    "responseSynthesizer:summaryTemplate": treeSummarizePrompt,
  });

  // Query the index with the specific query asking for the main subject
  const response = await queryEngine.query({ query }); // Using the correct parameter

  // Assuming response has a `response` field containing the relevant text
  const searchTerm = response.response.trim();

  console.log("Extracted Search Term:", searchTerm);
  return searchTerm;
}
