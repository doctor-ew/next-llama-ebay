import {
  Document,
  VectorStoreIndex,
  ResponseSynthesizer,
  TreeSummarize,
  TreeSummarizePrompt,
} from "llamaindex";

// Create a summarization prompt focused on extracting just the core subject
const treeSummarizePrompt: TreeSummarizePrompt = ({ context, query }) => {
  return `Context information is provided below.
---------------------
${context}
---------------------
Given this information, extract the core subject of the following query in the simplest form, without adjectives or additional details. For example: 'What is the most expensive baseball card' would distill to 'baseball card' and 'what pokemon card is most valuable' would distill to 'pokemon card'. 'baseball card' is its most simple form. 'Mickey Mantle's rookie card' would be  'Mickey Mantle's rookie card' and 'Michael Jordan card' would be 'Michael Jordan card':
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

  // Update the prompt to use the refined tree summarize prompt
  queryEngine.updatePrompts({
    "responseSynthesizer:summaryTemplate": treeSummarizePrompt,
  });

  // Query the index with the specific query asking for the main subject
  const response = await queryEngine.query({ query });

  // Assuming response has a `response` field containing the relevant text
  const searchTerm = response.response.trim();

  console.log("|-E-| Extracted Search Term:", searchTerm);
  return searchTerm;
}
