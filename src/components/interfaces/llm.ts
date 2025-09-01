import type { ResponseType } from "@/api/llm-types";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { ChatMessage } from "@/types/chat";

export interface LLMService {
  generateCompositions(
    prompt: string,
    chatHistory: ChatMessage[],
    currentCompositions: CompositionConfig[] | null,
  ): Promise<ResponseType>;
  responseToGeneratedComposition(resp: object): CompositionConfig[];
  abort(): void;
}

export interface AnimationBinding {
  name: string;
  usecase: string;
  settings: string;
}
