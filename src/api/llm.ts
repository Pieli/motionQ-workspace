import type { LLMService } from "@/components/interfaces/llm"


export class OpenAIService implements LLMService {
  private apiKey: string;
  private endpoint = 'https://api.openai.com/v1/chat/completions';
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateComponentCode(prompt: string): Promise<string> {
    const system = {
      role: 'system',
      content:
        'You are an AI that writes a complete React component for a Remotion composition. ' +
        'Use only built-in HTML, CSS, and SVG; no external assets. ' +
        'Output ONLY valid ES module code including imports for React and Remotion. ' +
        'Do not return code wrapped in markdowns "```".' +
        'Return the raw string only.' +
        'Use remotuion funtions like useCurrentFrame... to manage the ticks' +
        'Name the component "GeneratedComp" and export it as default.' +
        'Defaults are window width=640, height=360, fps=30, durationInFrames=90.',
    };
    const user = { role: 'user', content: prompt };

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [system, user], temperature: 0.7, max_tokens: 1500 }),
    });

    const data = await res.json();
    console.log(data.choices[0].message.content.trim())
    return data.choices[0].message.content.trim();
  }
}
