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
