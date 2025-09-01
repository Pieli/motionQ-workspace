import React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { SendHorizonal, Square } from "lucide-react";

export const ChatInput: React.FC<{
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
}> = ({ prompt, setPrompt, onSend, onStop, isGenerating }) => {
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
            if (isGenerating) {
              onStop();
            } else if (prompt) {
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
            onClick={isGenerating ? onStop : onSend}
            disabled={!isGenerating && !prompt}
            variant={isGenerating ? "destructive" : "default"}
          >
            {isGenerating ? <Square /> : <SendHorizonal />}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          {isGenerating ? (
            <>Press <kbd>Enter</kbd> to stop generation</>
          ) : (
            <>
              Press <kbd>Enter</kbd> to send
              <br />
              and <kbd>Shift</kbd>+<kbd>Enter</kbd> for a linebreak.
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
