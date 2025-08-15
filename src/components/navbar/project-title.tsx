import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ProjectTitleProps {
  title?: string;
  onTitleChange?: (newTitle: string) => void;
}

export const ProjectTitle: React.FC<ProjectTitleProps> = ({
  title,
  onTitleChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");

  if (!title) return null;

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      onTitleChange?.(trimmedTitle);
    }
    setIsEditing(false);
    setEditTitle(title || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(title || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm max-w-[200px]"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={handleSave}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={handleCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <span onClick={() => setIsEditing(true)}>
              <h1 className="text-sm font-medium text-foreground/80 truncate max-w-[200px]">
                {title}
              </h1>
            </span>
          </>
        )}
      </div>
    </>
  );
};
