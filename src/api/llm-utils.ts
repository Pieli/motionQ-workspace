import type { ChatMessage } from "@/types/chat";
import type { CompositionConfig } from "@/components/interfaces/compositions";

export function convertChatHistoryToOpenAI(chatHistory: ChatMessage[]) {
  return chatHistory.map((message) => ({
    role: message.role as "user" | "assistant",
    content: typeof message.content === "string" ? message.content : JSON.stringify(message.content),
  }));
}

export function createCompositionContextMessage(currentCompositions: CompositionConfig[] | null) {
  if (!currentCompositions || currentCompositions.length === 0) {
    return null;
  }

  const compositionSummary = currentCompositions.map((comp) => ({
    id: comp.id,
    component: comp.component,
    duration: comp.duration,
    props: comp.props,
  }));

  return {
    role: "system" as const,
    content: `Current compositions in the project: ${JSON.stringify(compositionSummary, null, 2)}`,
  };
}