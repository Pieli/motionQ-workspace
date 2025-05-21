import React, { useState } from "react";

import type { CompositionConfig } from "@/components/interfaces/compositions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  FadeInOutTransition,
  fadeInOutSchema,
} from "@/remotion-lib/TextFades/FadeInText";

import {
  SlideInTransition,
  slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";

const composition: CompositionConfig[] = [
  {
    id: "FadeInOutTransition",
    component: FadeInOutTransition,
    schema: fadeInOutSchema,
    props: {
      text: "I am testing this out",
      bgColor: "#f88787",
      textColor: "#ffffff",
    },
    duration: 90,
  },
  {
    id: "SlideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      text: "Wowi this is amazing",
      bgColor: "#99ffad",
      textColor: "#ffffff",
    },
    duration: 60,
  },
];

export const ChatBoxPanel: React.FC<{
  setGeneratedComp: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
}> = ({ setGeneratedComp, setIsGenerating, isGenerating }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const generate = async () => {
    setHistory((prev) => [...prev, prompt]);
    setPrompt("");
    setIsGenerating(true);
    setGeneratedComp(composition);
    setIsGenerating(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="flex-1">
        {history.length > 0 ? (
          <ul className="overflow-auto p-4 space-y-4">
            {history.map((item, index) => (
              <li key={index} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 break-words text-left">
                  {item}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground p-4 text-center">
            No history available
          </div>
        )}
      </div>
      <div className="pt-4 px-4">
        <div className="relative">
          <Textarea
            className="min-h-[60px] w-full pr-12 resize-none rounded-xl"
            placeholder="Describe your animation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
            style={{
              minHeight: "60px",
              maxHeight: "200px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <Button
            className="absolute right-2 bottom-2"
            size="sm"
            onClick={generate}
            disabled={isGenerating || !prompt}
          >
            <span style={{ fontWeight: 900, fontSize: 12 }}>{">"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
