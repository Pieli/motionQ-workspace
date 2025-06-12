import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';


import { Response } from "@/api/types";
import { systemPrompt }  from "@/api/system-prompt"

import type { ResponseType } from "./types";
import type { LLMService } from "@/components/interfaces/llm";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { AnimationComponents } from "@/api/animation-factories";

import { animationFactory, schemaFactory } from "./animation-factories";


export class NullLLMService implements LLMService {
    async generateCompositions(prompt: string): Promise<ResponseType> {
        console.log("No LLM service configured. Returning empty response.", prompt);
        return {
        compositions: [],
        comment: "No LLM service configured.",
        };
    }
    
    responseToGeneratedComposition(resp: ResponseType): CompositionConfig[] {
        console.log("No LLM service configured", resp);
        return [];
    }
};

export class OpenAIService implements LLMService {
  private client: OpenAI;

  constructor(apiKey: string, ) {
    this.client = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true});
  }

  async generateCompositions(prompt: string): Promise<ResponseType> {
    const completion = await this.client.beta.chat.completions.parse({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [{role: 'system', content: systemPrompt}, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: zodResponseFormat(Response, 'response'),
    });

    console.dir(completion, { depth: 5 });
    const message= completion.choices[0]?.message
    if (message?.parsed) {
      // console.log(message.parsed.compositions);
      // console.log(`answer: ${message.parsed.comment}`);
    };

    return message.parsed as ResponseType;
  };

    responseToGeneratedComposition(resp: ResponseType): CompositionConfig[]  {
    const compostitions = resp.compositions.map((comp) => ({
        id:  comp.id,
        component: animationFactory(comp.animationName) as AnimationComponents,
        schema: schemaFactory(comp.animationName),
        props: comp.animationSettings,
        duration: comp.duration,

    }));

    return compostitions;
};
}
