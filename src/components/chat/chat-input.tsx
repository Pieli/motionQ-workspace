import React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

export const ChatInput: React.FC<{
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
    <div className="relative w-full">
      <Textarea
        ref={textareaRef}
        className="min-h-[80px] max-h-[200px] w-full pr-12 resize-none rounded-xl transition-[height] duration-150 box-border overflow-y-auto mb-0"
        placeholder="Describe your animation..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={1}
        style={{ minHeight: "80px", maxHeight: "200px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isGenerating && prompt) {
              onSend();
            }
          }
        }}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="absolute right-2 bottom-2"
            size="lg"
            onClick={onSend}
            disabled={isGenerating || !prompt}
          >
            <SendHorizonal />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          Press <kbd>Enter</kbd> to send and <kbd>Shift</kbd>+<kbd>Enter</kbd>{" "}
          for a linebreak.
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
