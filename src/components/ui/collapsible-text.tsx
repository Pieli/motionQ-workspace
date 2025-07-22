import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleTextProps {
  text: string;
  maxLength: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  text,
  maxLength,
  className = "",
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  if (text.length <= maxLength) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  const truncatedText = text.slice(0, maxLength);
  const displayText = isExpanded ? text : truncatedText;

  return (
    <div className={`${className} relative`}>
      <div
        className={`cursor-pointer ${!isExpanded ? "pb-1" : ""}`}
        onClick={toggleExpanded}
        style={style}
      >
        {isExpanded ? text : `${displayText}...`}
      </div>
      {!isExpanded && (
        <>
          <div className="absolute bottom-6 left-0 right-0 h-8 bg-gradient-to-t from-muted to-transparent pointer-events-none" />
          <div className="flex justify-end relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="h-auto p-1 text-xs"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Show more
            </Button>
          </div>
        </>
      )}
      {isExpanded && (
        <div className="flex justify-end mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="h-auto p-1 text-xs"
          >
            <ChevronUp className="h-3 w-3 mr-1" />
            Show less
          </Button>
        </div>
      )}
    </div>
  );
};
