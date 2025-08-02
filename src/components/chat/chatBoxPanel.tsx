import React, { useEffect, useState } from "react";

import { NullLLMService, OpenAIService } from "@/api/llm";

import { ChatInput } from "@/components/chat/chat-input";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { LLMService } from "@/components/interfaces/llm";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleText } from "@/components/ui/collapsible-text";

// import { logCompositionConfig } from "@/helpers/composition-logger";
import { exampleComp, exampleHistory } from "@/helpers/example-comp";
import { toast } from "sonner";

// keep service null if undefined env
let llm: LLMService = new NullLLMService();

if (import.meta.env.VITE_APP_OPENAI_KEY !== undefined) {
  llm = new OpenAIService(import.meta.env.VITE_APP_OPENAI_KEY);
}

// ChatMessage component for rendering user/agent messages differently
const ChatMessage: React.FC<{ message: string }> = ({ message }) => {
  const isUser = message.startsWith("User:");
  const content = message.replace(/^User: |^Agent: /, "");
  return (
    <li className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          (isUser
            ? "w-9/10 rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 break-words break-all text-left ml-auto"
            : "w-8/10 rounded-2xl text-foreground px-4 py-2 break-words break-all text-left mr-auto") +
          " max-w-full"
        }
        style={{
          borderTopRightRadius: isUser ? 0 : undefined,
          borderTopLeftRadius: !isUser ? 0 : undefined,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        <span className="block text-xs font-semibold mb-1 opacity-80">
          {isUser ? "You" : "Agent"}
        </span>
        <CollapsibleText
          text={content}
          maxLength={346}
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        />
      </div>
    </li>
  );
};

// ChatHistory component for rendering the chat history with a scrollbar
const ChatHistory: React.FC<{ history: string[] }> = ({ history }) => {
  return (
    <ScrollArea className="h-[calc(100vh-130px)] w-full">
      <div className="p-4 space-y-3 pb-14">
        {history.map((item, index) => (
          <ChatMessage key={index} message={item} />
        ))}
      </div>
    </ScrollArea>
  );
};

export const ChatBoxPanel: React.FC<{
  setGeneratedComp: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  initialPrompt: string;
  setInitialPrompt: React.Dispatch<React.SetStateAction<string>>;
  preUpdateCleanup: () => void;
}> = ({
  setGeneratedComp,
  setIsGenerating,
  isGenerating,
  initialPrompt,
  setInitialPrompt,
  preUpdateCleanup,
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const initialPromptProcessedRef = React.useRef(false);

  const devMode = React.useCallback(() => {
    setHistory((prev) => [...prev, ...exampleHistory]);
    preUpdateCleanup();
    setGeneratedComp(exampleComp);
    setIsGenerating(false);
  }, [setHistory, setGeneratedComp, setIsGenerating, preUpdateCleanup]);

  const stopGeneration = React.useCallback(() => {
    llm.abort();
    setIsGenerating(false);
    toast.info("Agent call interrupted");
  }, [setIsGenerating]);

  const generate = React.useCallback(
    async (promptArg?: string) => {
      let usedPrompt = prompt.trim();

      if (promptArg !== undefined) {
        usedPrompt = promptArg.trim();
        setInitialPrompt("");
      }

      if (usedPrompt.length == 0) {
        setIsGenerating(false);
        return;
      }

      setHistory((prev) => [...prev, `User: ${usedPrompt}`]);
      const currentPrompt = usedPrompt;
      setPrompt("");
      setIsGenerating(true);

      if (usedPrompt === "#dev") {
        devMode();
        return;
      }

      try {
        const response = await llm.generateCompositions(currentPrompt);
        if (!response) {
          throw new Error("Failed to generate compositions");
        }
        const composition = llm.responseToGeneratedComposition(response);
        if (!composition) {
          throw new Error("Failed to parse generated compositions");
        }
        preUpdateCleanup();
        setGeneratedComp(composition);
        toast.success("Animation has been generated.");
        // logCompositionConfig(composition)

        // Append the agent's comment to the history
        setHistory((prev) => [...prev, `Agent: ${response.comment}`]);
      } catch (e) {
        if (typeof e == "string") {
          console.error(e);
          return;
        }
        if (e instanceof Error && e.message == "Request was aborted.") {
          return;
        }

        console.error("Error during generation:", e);

        preUpdateCleanup();
        setGeneratedComp(null);
        // In case of error, you might also want to add an error message to history
        setHistory((prev) => [
          ...prev,
          "Agent: An error occurred during generation.",
        ]);
      }

      setIsGenerating(false);
    },
    [
      prompt,
      setHistory,
      setGeneratedComp,
      setIsGenerating,
      devMode,
      setInitialPrompt,
      preUpdateCleanup,
    ],
  );

  useEffect(() => {
    if (!initialPromptProcessedRef.current && initialPrompt.length > 0) {
      initialPromptProcessedRef.current = true;
      generate(initialPrompt);
    }
  }, [generate, initialPromptProcessedRef, initialPrompt]);

  return (
    <div className="flex flex-col h-full w-full px-2 bg-background relative">
      <div className="flex-1 overflow-y-auto pb-[60px]">
        {history.length > 0 ? (
          <ChatHistory history={history} />
        ) : (
          <div className="text-muted-foreground p-4 text-center h-[calc(100vh-180px)] w-full">
            No history available
          </div>
        )}
      </div>
      {/* Gradient overlay for fade effect */}
      <div className="relative">
        <div className="absolute left-0 right-0 bottom-0 bg-transparent z-20 px-4 pb-4 pointer-events-auto">
          <div className="h-10 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          <div className="bg-background">
            {isGenerating && (
              <div className="b-1 text-right">
                <AnimatedGradientText className="text-sm font-semibold">
                  Generating Animation
                </AnimatedGradientText>
              </div>
            )}
            <div className="block align-bottom">
              <ChatInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSend={() => generate()}
                onStop={stopGeneration}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
