import type { ChatMessage } from "@/types/chat";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { ColorPalette } from "@/lib/ColorPaletteContext";

export function convertChatHistoryToOpenAI(chatHistory: ChatMessage[]) {
  return chatHistory.map((message) => ({
    role:
      message.role == "agent"
        ? "assistant"
        : (message.role as "user" | "assistant"),
    content:
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content),
  }));
}

export function createCompositionContextMessage(
  currentCompositions: CompositionConfig[] | null,
) {
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
    role: "developer" as const,
    content: `Current compositions in the project: ${JSON.stringify(compositionSummary, null, 2)}`,
  };
}

export function createColorPaletteContextMessage(
  colorPalette: ColorPalette | null,
) {
  if (
    !colorPalette ||
    !colorPalette.colors ||
    colorPalette.colors.length === 0
  ) {
    return null;
  }

  return {
    role: "developer" as const,
    content: `Active color palette: ${colorPalette.colors.join(", ")}. Use these colors consistently throughout the animation while maintaining good contrast and readability.`,
  };
}
