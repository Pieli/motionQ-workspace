import React, { useEffect, useState } from "react";

import { NullLLMService, OpenAIService } from "@/api/llm";

import { ChatInput } from "@/components/chat/chat-input";
import type { LLMService } from "@/components/interfaces/llm";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChatHistory } from "@/components/chat/chat-message-history";

// import { logCompositionConfig } from "@/helpers/composition-logger";
import { exampleComp, exampleHistory } from "@/helpers/example-comp";
import { toast } from "sonner";
import type { Project } from "@/client";
import type { ChatMessage } from "@/types/chat";
import {
  createChatMessage,
  createAgentMessageFromResponse,
} from "@/types/chat";
import { useComposition } from "@/lib/CompositionContext";
import { useColorPalette } from "@/lib/ColorPaletteContext";

// keep service null if undefined env
let llm: LLMService = new NullLLMService();

if (import.meta.env.VITE_APP_OPENAI_KEY !== undefined) {
  llm = new OpenAIService(import.meta.env.VITE_APP_OPENAI_KEY);
}

interface ChatBoxPanelProps {
  project: Project | null;
  projectId?: string;
  initialHistory?: ChatMessage[];
  recordMessage: (message: ChatMessage) => Promise<void>;
}

export interface ChatBoxPanelRef {
  generate: (
    prompt?: string,
    role?: "user" | "assistant" | "developer",
    metadata?: ChatMessage["metadata"],
  ) => Promise<void>;
}

export const ChatBoxPanel = React.forwardRef<
  ChatBoxPanelRef,
  ChatBoxPanelProps
>(({ initialHistory = [], recordMessage }, ref) => {
  const {
    compositions,
    setCompositions,
    isGenerating,
    setIsGenerating,
    clearSelectedProperty,
  } = useComposition();
  const { currentPalette } = useColorPalette();
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [prompt, setPrompt] = useState("");

  const addMessage = React.useCallback(
    async (msg: ChatMessage) => {
      // console.log("Registering message:", msg.content.slice(0, 30));
      setHistory((prev) => [...prev, msg]);
      await recordMessage(msg);
    },
    [recordMessage, setHistory],
  );

  const devMode = React.useCallback(async () => {
    // Add each example message individually
    for (const message of exampleHistory) {
      await addMessage(message);
    }
    clearSelectedProperty();
    setCompositions(exampleComp);
    setIsGenerating(false);
  }, [addMessage, setCompositions, setIsGenerating, clearSelectedProperty]);

  const stopGeneration = React.useCallback(() => {
    llm.abort();
    setIsGenerating(false);
    toast.info("Agent call interrupted");
  }, [setIsGenerating]);

  const generate = React.useCallback(
    async (
      promptArg?: string,
      role?: "user" | "assistant" | "developer",
      metadata?: ChatMessage["metadata"],
    ) => {
      const usedPrompt = promptArg?.trim() ?? prompt.trim();
      const usedRole = role ?? "user";

      // clear prompt as fast as possible
      setPrompt("");

      if (usedPrompt.length == 0) {
        setIsGenerating(false);
        return;
      }

      const userMessage = createChatMessage(usedRole, usedPrompt, undefined, metadata);
      await addMessage(userMessage);
      setIsGenerating(true);

      if (usedPrompt === "#dev") {
        devMode();
        return;
      }

      try {
        const response = await llm.generateCompositions(
          usedPrompt,
          history,
          compositions,
          currentPalette,
        );
        if (!response) {
          throw new Error("Failed to generate compositions");
        }
        const composition = llm.responseToGeneratedComposition(response);
        if (!composition) {
          throw new Error("Failed to parse generated compositions");
        }
        clearSelectedProperty();
        setCompositions(composition);
        toast.success("Animation has been generated.");
        // logCompositionConfig(composition)

        // Store full response with comment for display
        const agentMessage = createAgentMessageFromResponse(
          response,
          response.comment,
        );
        await addMessage(agentMessage);
      } catch (e) {
        if (typeof e == "string") {
          console.error(e);
          return;
        }
        if (e instanceof Error && e.message == "Request was aborted.") {
          return;
        }

        console.error("Error during generation:", e);

        clearSelectedProperty();
        setCompositions(null);
        // In case of error, you might also want to add an error message to history
        const errorMessage = createChatMessage(
          "assistant",
          "An error occurred during generation.",
        );
        await addMessage(errorMessage);
      }

      setIsGenerating(false);
    },
    [
      prompt,
      addMessage,
      setCompositions,
      setIsGenerating,
      devMode,
      clearSelectedProperty,
      history,
      compositions,
      currentPalette,
    ],
  );

  // Expose generate function to parent component
  React.useImperativeHandle(ref, () => ({
    generate,
  }));

  // Update history when initialHistory changes
  useEffect(() => {
    if (initialHistory.length > 0 && history.length === 0) {
      setHistory(initialHistory);
    }
  }, [initialHistory, history.length]);

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
});

ChatBoxPanel.displayName = "ChatBoxPanel";
