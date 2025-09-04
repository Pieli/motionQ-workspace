import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleText } from "@/components/ui/collapsible-text";
import type { ColorPalette } from "@/lib/ColorPaletteContext";

import { extractMessageContent } from "@/types/chat";
import type { ChatMessage } from "@/types/chat";

const ColorPaletteComp: React.FC<{ palette: ColorPalette }> = ({ palette }) => {
  return (
    <div className="flex gap-1">
      {palette.colors.map((color, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};

// User message component
const UserMessageComponent: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
  return (
    <li className="flex justify-end">
      <div
        className="w-9/10 rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 break-words break-all text-left ml-auto max-w-full"
        style={{
          borderTopRightRadius: 0,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        <span className="block text-xs font-semibold mb-1 opacity-80">You</span>
        <CollapsibleText
          text={extractMessageContent(message).displayContent}
          maxLength={346}
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        />
        {message?.metadata?.colorPalette && (
          <div className="flex pt-2 pb-1 justify-end">
            <ColorPaletteComp palette={message?.metadata?.colorPalette} />
          </div>
        )}
      </div>
    </li>
  );
};

// Agent message component
const AgentMessageComponent: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
  return (
    <li className="flex justify-start">
      <div
        className="w-8/10 rounded-2xl text-foreground px-4 py-2 break-words break-all text-left mr-auto max-w-full"
        style={{
          borderTopLeftRadius: 0,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        <span className="block text-xs font-semibold mb-1 opacity-80">
          Agent
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

// Developer message component with special handling for color palette updates
const DeveloperMessageComponent: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
  const messageContent = extractMessageContent(message).displayContent;
  const isColorPaletteUpdate = messageContent.startsWith(
    "Please adjust the current animations to use the new color palette:",
  );

  if (isColorPaletteUpdate) {
    const colorPalette = message.metadata?.colorPalette;
    return (
      <li className="flex justify-center">
        <div className="w-full rounded-lg border-2 border-muted px-4 py-4 text-left max-w-full">
          <div className="flex justify-between items-center">
            <span className="block text-xs font-semibold mb-1">
              🎨 Changed colors
            </span>
            {colorPalette ? (
              <ColorPaletteComp palette={colorPalette} />
            ) : (
              <div className="text-xs text-red-500">No color palette data</div>
            )}
          </div>
          {colorPalette && (
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {colorPalette.name}
            </div>
          )}
        </div>
      </li>
    );
  }

  // Render as user message for other developer messages
  // return <UserMessageComponent message={message} />;

  // ignore other dev instructions
  return <></>;
};

// ChatMessage component using switch statement
const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
  switch (message.role) {
    case "user":
      return <UserMessageComponent message={message} />;
    case "assistant":
      return <AgentMessageComponent message={message} />;
    case "developer":
      return <DeveloperMessageComponent message={message} />;
    default:
      return <AgentMessageComponent message={message} />;
  }
};

// ChatHistory component for rendering the chat history with a scrollbar
export const ChatHistory: React.FC<{ history: ChatMessage[] }> = ({
  history,
}) => {
  const allowedKeys = ["user", "assistant", "developer"];
  return (
    <ScrollArea className="h-[calc(100vh-130px)] w-full">
      <div className="p-4 space-y-3 pb-14">
        {history
          .filter((message) => allowedKeys.includes(message.role))
          .map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
      </div>
    </ScrollArea>
  );
};
