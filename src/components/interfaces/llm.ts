import type { CompositionConfig } from "@/components/interfaces/compositions";

export interface LLMService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateCompositions(prompt: string): Promise<any>;
  responseToGeneratedComposition(resp: object): CompositionConfig[];
}


export interface AnimationBinding {
    name: string,
    usecase: string,
    settings: string,
}
