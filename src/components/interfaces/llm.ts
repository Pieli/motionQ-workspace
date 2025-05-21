
export interface LLMService {
  generateComponentCode(prompt: string): Promise<string>;
}
