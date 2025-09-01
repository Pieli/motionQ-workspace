/**
 * Stable frontend ChatMessage interface
 * This interface is owned by the frontend and won't break if backend generated types change
 */
export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

/**
 * Utility to generate a unique chat message ID
 */
export function generateChatMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36)}`;
}

/**
 * Utility to create a new chat message
 */
export function createChatMessage(
  role: "user" | "agent",
  content: string,
  id?: string,
): ChatMessage {
  return {
    id: id || generateChatMessageId(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Utility to create an agent message from full LLM response
 * Stores full response for context but extracts comment for display
 */
export function createAgentMessageFromResponse(
  fullResponse: object,
  displayComment: string,
  id?: string,
): ChatMessage {
  const content = JSON.stringify({
    type: "llm_response",
    fullResponse,
    displayComment,
  });
  
  return createChatMessage("agent", content, id);
}

/**
 * Extract display content from agent message
 * Returns the comment for UI display, full response for LLM context
 */
export function extractMessageContent(message: ChatMessage): {
  displayContent: string;
  fullResponse?: object;
} {
  if (message.role === "user") {
    return { displayContent: message.content };
  }

  try {
    const parsed = JSON.parse(message.content);
    if (parsed.type === "llm_response") {
      return {
        displayContent: parsed.displayComment,
        fullResponse: parsed.fullResponse,
      };
    }
  } catch {
    // Fallback for old format messages
  }
  
  return { displayContent: message.content };
}
