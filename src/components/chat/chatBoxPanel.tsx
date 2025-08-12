import React, { useCallback, useEffect, useState } from "react";

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
import { useAuth } from "@/lib/AuthContext";
import { createProject } from "@/lib/api-client";
import type { Project } from "@/client";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types/chat";
import { createChatMessage } from "@/types/chat";

// keep service null if undefined env
let llm: LLMService = new NullLLMService();

if (import.meta.env.VITE_APP_OPENAI_KEY !== undefined) {
  llm = new OpenAIService(import.meta.env.VITE_APP_OPENAI_KEY);
}

// ChatMessage component for rendering user/agent messages differently
const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
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
          text={message.content}
          maxLength={346}
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        />
      </div>
    </li>
  );
};

// ChatHistory component for rendering the chat history with a scrollbar
const ChatHistory: React.FC<{ history: ChatMessage[] }> = ({ history }) => {
  return (
    <ScrollArea className="h-[calc(100vh-130px)] w-full">
      <div className="p-4 space-y-3 pb-14">
        {history.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
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
  setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
  project: Project | null;
  projectId?: string;
  onHistoryUpdate: (history: ChatMessage[]) => void;
  initialHistory?: ChatMessage[];
}> = ({
  setGeneratedComp,
  setIsGenerating,
  isGenerating,
  initialPrompt,
  setInitialPrompt,
  preUpdateCleanup,
  setProjectTitle,
  projectId,
  onHistoryUpdate,
  initialHistory = [],
}) => {
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [prompt, setPrompt] = useState("");
  const [currentProject, setCurrentProject] = useState<string | null>(null);

  const initialPromptProcessedRef = React.useRef(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generate a project name from the user prompt
  const generateProjectName = useCallback((): string => {
    return "Untitled";
  }, []);

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

      const userMessage = createChatMessage('user', usedPrompt);
      setHistory((prev) => [...prev, userMessage]);
      const currentPrompt = usedPrompt;
      setPrompt("");
      setIsGenerating(true);

      // Create project if this is the first prompt and we don't have a current project
      if (!currentProject && user && history.length === 0) {
        try {
          const projectName = generateProjectName();
          const newProject = await createProject(user, projectName);

          if (newProject) {
            setCurrentProject(newProject.id);
            setProjectTitle(projectName);
            // Update URL to include the new project ID without page reload
            navigate(`/workspace/${newProject.id}`, { replace: true });
            toast.success(`Project "${projectName}" created successfully`);
          } else {
            toast.error(
              "Failed to create project, but animation will still generate",
            );
          }
        } catch (error) {
          console.error("Error creating project:", error);
          toast.error("Failed to create project");
        }
      }

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
        const agentMessage = createChatMessage('agent', response.comment);
        setHistory((prev) => [...prev, agentMessage]);
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
        const errorMessage = createChatMessage('agent', 'An error occurred during generation.');
        setHistory((prev) => [...prev, errorMessage]);
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
      currentProject,
      user,
      history.length,
      generateProjectName,
      setProjectTitle,
      navigate,
    ],
  );

  useEffect(() => {
    if (!initialPromptProcessedRef.current && initialPrompt.length > 0) {
      initialPromptProcessedRef.current = true;
      generate(initialPrompt);
    }
  }, [generate, initialPromptProcessedRef, initialPrompt]);

  // Initialize project state from props
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId]);

  // Update history when initialHistory changes
  useEffect(() => {
    if (initialHistory.length > 0 && history.length === 0) {
      setHistory(initialHistory);
    }
  }, [initialHistory, history.length]);

  // Notify parent component when history changes
  useEffect(() => {
    if (history.length > 0) {
      onHistoryUpdate(history);
    }
  }, [history, onHistoryUpdate]);

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
