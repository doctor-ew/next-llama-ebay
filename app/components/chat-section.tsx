"use client";

import { useState } from "react";
import { ChatInput, ChatMessages } from "./ui/chat";
import { useClientConfig } from "./ui/chat/hooks/use-config";
import { Message } from "ai";

interface AxiosError extends Error {
  response?: {
    data?: any;
  };
}

export default function ChatSection() {
  const { backend } = useClientConfig();
  const [messages, setMessages] = useState<Message[]>([]); // State to hold chat messages
  const [input, setInput] = useState<string>(""); // State for the user's input

  const handleCustomSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log("Submitting query:", input.trim());

    // Add the user's message to the chat with a generated id
    const userMessage: Message = {
      id: `${Date.now()}`, // Unique ID based on current time
      role: "user",
      content: input.trim()
    };
    await appendMessage(userMessage);

    try {
      const response = await fetch(`${backend}/api/ebay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input.trim() }), // Sending the query in the body as 'query'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      let assistantMessage: Message;
      if (!data || !data.length) {
        assistantMessage = {
          id: `${Date.now() + 1}`, // Unique ID based on current time
          role: "assistant",
          content: "No results found."
        };
      } else {
        const formattedResponse = data
            .map(
                (item: any) =>
                    `${item.title}: ${item.price.value} ${item.price.currency}`
            )
            .join("\n");
        assistantMessage = {
          id: `${Date.now() + 2}`, // Unique ID based on current time
          role: "assistant",
          content: formattedResponse
        };
      }

      // Add the assistant's response to the chat
      await appendMessage(assistantMessage);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching card prices:", axiosError.message);

      const errorMessage: Message = {
        id: `${Date.now() + 3}`, // Unique ID based on current time
        role: "assistant",
        content: "There was an error processing your request.",
      };

      await appendMessage(errorMessage);
    } finally {
      setInput(""); // Clear input after submission
      console.log("Query submitted successfully.");
    }
  };

  // Helper function to append messages and return a promise with a string | null | undefined
  const appendMessage = (message: Message | Omit<Message, "id">): Promise<string | null | undefined> => {
    return new Promise((resolve) => {
      setMessages((prevMessages) => [...prevMessages, message as Message]);
      resolve(null); // Return `null` to satisfy the expected return type
    });
  };

  return (
      <div className="space-y-4 w-full h-full flex flex-col">
        <ChatMessages messages={messages} isLoading={false} />
        <ChatInput
            messages={messages} // Pass the messages state to ChatInput
            input={input}
            handleSubmit={handleCustomSubmit} // Use the custom submit handler
            handleInputChange={(e) => setInput(e.target.value)}
            isLoading={false}
            setInput={setInput}
            append={appendMessage} // Pass the helper function as append
        />
      </div>
  );
}
