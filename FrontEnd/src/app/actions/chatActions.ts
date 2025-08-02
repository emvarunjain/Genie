"use server";

import { getConfig } from '@/lib/config';

interface ChatResponse {
  message: string;
  data?: any; // For structured API response data
}

export async function handleChatMessage(userInput: string): Promise<ChatResponse> {
  if (!userInput.trim()) {
    throw new Error("Message cannot be empty.");
  }

  try {
    const config = await getConfig();
    const apiEndpoint = config.apiEndpoint;

    // Simulate API call
    // In a real scenario, you would use 'fetch' with the userInput as request body
    const response = await fetch(apiEndpoint, {
      method: 'POST', // Assuming the API expects POST for user input
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userInput, userId: "currentUserIdentifier" }), // Example request body
    });

    if (!response.ok) {
      // Try to parse error from API response if available
      let apiErrorMsg = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          apiErrorMsg = errorData.message;
        } else if (errorData) {
          apiErrorMsg = JSON.stringify(errorData);
        }
      } catch (e) {
        // Could not parse JSON error, use status text or default
        apiErrorMsg = response.statusText || apiErrorMsg;
      }
      console.error("API Error:", apiErrorMsg);
      throw new Error(`Sorry, I encountered an issue: ${apiErrorMsg}`);
    }

    const data = await response.json();

    // For demonstration, we'll assume the API returns an object
    // and we want to show a part of it as a message, and the rest as structured data.
    // This structure depends heavily on the actual API.
    let botMessage = "Here's what I found:";
    if (data && data.title) { // Example: if API returns a post with a title
      botMessage = `Regarding "${userInput}", I found: ${data.title}`;
    } else if (data && data.id) {
       botMessage = `Processed your request. Result ID: ${data.id}.`;
    }


    return {
      message: botMessage,
      data: data, // Send the full data structure back for potential display
    };

  } catch (error: any) {
    console.error("Error in handleChatMessage:", error);
    // Return a more user-friendly error message or re-throw
    throw new Error(error.message || "Failed to process your message. Please try again.");
  }
}
