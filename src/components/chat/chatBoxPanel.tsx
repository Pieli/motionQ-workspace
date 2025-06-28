import React, { useState } from "react";

import { SendHorizonal } from "lucide-react";

import { NullLLMService, OpenAIService } from "@/api/llm";
import type { LLMService } from "@/components/interfaces/llm";

import type { CompositionConfig } from "@/components/interfaces/compositions";

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// import { logCompositionConfig } from "@/helpers/composition-logger";
import { exampleComp } from "@/helpers/example-comp";
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
            ? "w-9/10 rounded-2xl bg-muted text-muted-foreground px-4 py-2 break-words break-all text-left ml-auto"
            : "w-8/10 rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 break-words break-all text-left mr-auto border border-primary/20") +
          " max-w-full"
        }
        style={{
          borderTopRightRadius: isUser ? 0 : undefined,
          borderTopLeftRadius: !isUser ? 0 : undefined,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        <span className="block text-xs font-semibold mb-1 opacity-60">
          {isUser ? "You" : "Agent"}
        </span>
        <span style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
          {content}
        </span>
      </div>
    </li>
  );
};

// ChatHistory component for rendering the chat history with a scrollbar
const ChatHistory: React.FC<{ history: string[] }> = ({ history }) => {
  return (
    <ScrollArea className="h-[calc(100vh-130px)] w-full">
      <div className="p-4 space-y-4">
        {history.map((item, index) => (
          <ChatMessage key={index} message={item} />
        ))}
      </div>
    </ScrollArea>
  );
};

// ChatInput component for the input area
const ChatInput: React.FC<{
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onSend: () => void;
  isGenerating: boolean;
}> = ({ prompt, setPrompt, onSend, isGenerating }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="absolute left-0 right-0 bottom-0 bg-background z-20 p-4 pointer-events-auto">
      {isGenerating && (
        <div className="pl-4 pt-2 pb-2 text-right">
          <AnimatedGradientText className="text-sm font-semibold">Generating Animation</AnimatedGradientText>
        </div>
      )}
      <div className="relative w-full">
        <Textarea
          ref={textareaRef}
          className="min-h-[80px] max-h-[200px] w-full pr-12 resize-none rounded-xl transition-[height] duration-150 box-border overflow-y-auto mb-0 block align-bottom"
          placeholder="Describe your animation..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={1}
          style={{ minHeight: "80px", maxHeight: "200px" }}
        />
        <Button
          className="absolute right-2 bottom-2"
          size="lg"
          onClick={onSend}
          disabled={isGenerating || !prompt}
        >
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
};

export const ChatBoxPanel: React.FC<{
  setGeneratedComp: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
}> = ({ setGeneratedComp, setIsGenerating, isGenerating }) => {

  const [history, setHistory] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  function devMode() {
    setHistory([
      "User: I have build an email client called Zero and I want to make a promo for that tool.  What is Zero ?  Zero is an open - source AI email solution that gives users the power to self - host their own email app while also integrating external services like Gmail and other email providers.Our goal is to modernize and improve emails through AI agents to truly modernize emails.  Why Zero ?  Most email services today are either closed - source, data - hungry, or too complex to self - host. 0.email is different: Open - Source – No hidden agendas, fully transparent.  AI Driven - Enhance your emails with Agents & LLMs.  Data Privacy First – Your emails, your data.Zero does not track, collect, or sell your data in any way.Please note: while we integrate with external services, the data passed through them is not under our control and falls under their respective privacy policies and terms of service.  Self - Hosting Freedom – Run your own email app with ease.  Unified Inbox – Connect multiple email providers like Gmail, Outlook, and more.  Customizable UI & Features – Tailor your email experience the way you want it.  Developer - Friendly – Built with extensibility and integrations in mind.",
      "Agent: done so sire",
    ]);
    setGeneratedComp(exampleComp)
    setIsGenerating(false);
  };

const generate = async () => {
  // Add the user prompt to history
  setHistory((prev) => [...prev, `User: ${prompt}`]);
  const currentPrompt = prompt;
  setPrompt("");
  setIsGenerating(true);

  if (prompt === "#dev") {
    devMode()
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
    setGeneratedComp(composition);
    toast.success("Animation has been generated.")
    // logCompositionConfig(composition)

    // Append the agent's comment to the history
    setHistory((prev) => [...prev, `Agent: ${response.comment}`]);
  } catch (e) {
    console.error("Error during generation:", e);
    setGeneratedComp(null);
    // In case of error, you might also want to add an error message to history
    setHistory((prev) => [
      ...prev,
      "Agent: An error occurred during generation.",
    ]);
  }

  setIsGenerating(false);
};

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
    <ChatInput
      prompt={prompt}
      setPrompt={setPrompt}
      onSend={generate}
      isGenerating={isGenerating}
    />
  </div>
);
};
