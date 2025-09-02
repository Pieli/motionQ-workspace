import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleText } from "@/components/ui/collapsible-text";
import { extractMessageContent } from "@/types/chat";
import type { ChatMessage } from "@/types/chat";

// ChatMessage component for rendering user/agent messages differently
const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
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
          text={extractMessageContent(message).displayContent}
          maxLength={346}
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        />
      </div>
    </li>
  );
};

// ChatHistory component for rendering the chat history with a scrollbar
export const ChatHistory: React.FC<{ history: ChatMessage[] }> = ({ history }) => {
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
