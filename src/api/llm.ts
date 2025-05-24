import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';


import { Response } from "./types";

import type { ResponseType } from "./types";
import type { LLMService } from "@/components/interfaces/llm";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { AnimationBinding } from "@/remotion-lib/animation-bindings";
import type { AnimationComponents } from "@/api/animation-factories";


import { animationFactory, schemaFactory } from "./animation-factories";
import { bindings } from "@/remotion-lib/animation-bindings";


export function generateAnimationContext(bindings: AnimationBinding[]): string {
    return bindings.map(animation =>
        `Animation: ${animation.name}\nUse case: ${animation.usecase}\nParameters: ${animation.settings}\n`
    ).join('\n');
}



export class OpenAIService implements LLMService {
  private client: OpenAI;

  constructor(apiKey: string, ) {
    this.client = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true});
  }

  async generateCompositions(prompt: string): Promise<ResponseType> {
    const systemPrompt = (
        'You are an expert AI Animator that writes creates typography motion animations for promo videos' +
        'Your goal is to craft the perfect script and animation for the user and tell a story.' +
        'Promotional videos are delightful, playful, engaging, serendipitous.' +
        'Content per Composition should be kept at a minimum and less is more.' +
        'Only use 1-3 words per slide not more; if the content is longer it should be split in a meaningful way' +
        'The whole sum should tell a story and convice the audience of the topic/prodcut' +
        'You have the following animations available to choose from: ' +
        generateAnimationContext(bindings) +
        'Duration is in frames and the video has 30 FPS' +
        'Output: JSON format with composition-array and commentary.'
    );

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
      console.log(message.parsed.compositions);
      console.log(`answer: ${message.parsed.comment}`);
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
