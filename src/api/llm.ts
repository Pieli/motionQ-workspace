import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import { Response } from "@/api/llm-types";
import { systemPrompt } from "@/api/system-prompt";

import type { ResponseType } from "@/api/llm-types";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { LLMService } from "@/components/interfaces/llm";
import type {
  AnimationComponents,
  BackgroundComponents,
} from "@/remotion-lib/animation-factories";

import {
  animationFactory,
  backgroundFactory,
  backgroundSchemaFactory,
  schemaFactory,
} from "@/remotion-lib/animation-factories";

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

  abort(): void {
    console.log("No LLM service configured - abort called");
  }
}

export class OpenAIService implements LLMService {
  private client: OpenAI;
  private abortController: AbortController | null = null;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
  }

  async generateCompositions(prompt: string): Promise<ResponseType> {
    this.abortController = new AbortController();

    const completion = await this.client.beta.chat.completions.parse(
      {
        model: "gpt-4.1-nano-2025-04-14",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: zodResponseFormat(Response, "response"),
      },
      {
        signal: this.abortController.signal,
      },
    );

    // console.dir(completion, { depth: 5 });
    const message = completion.choices[0]?.message;
    if (message?.parsed) {
      // console.log(message.parsed.compositions);
      // console.log(`answer: ${message.parsed.comment}`);
    }

    return message.parsed as ResponseType;
  }

  responseToGeneratedComposition(resp: ResponseType): CompositionConfig[] {
    const compostitions = resp.compositions.map((comp) => ({
      id: comp.id,
      name: comp.animationName,
      component: animationFactory(comp.animationName) as AnimationComponents,
      schema: schemaFactory(comp.animationName),
      props: comp.animationSettings,
      duration: comp.duration,
      background: {
        id: `${comp.id}-background`,
        name: comp.background.name,
        component: backgroundFactory(
          comp.background.name,
        ) as BackgroundComponents,
        schema: backgroundSchemaFactory(comp.background.name),
        props: comp.background.settings,
        duration: 1,
      },
    }));

    return compostitions;
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
