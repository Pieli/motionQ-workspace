import type { CompositionConfig } from "@/components/interfaces/compositions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";

interface TranscriptProps {
  GeneratedComp: CompositionConfig[] | null;
  setGeneratedComp: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
}

export const Transcript: React.FC<TranscriptProps> = ({
  GeneratedComp,
  setGeneratedComp,
}) => {
  const [editedText, setEditedText] = useState<Record<string, string>>({});

  const handleTextChange = (id: string, newText: string) => {
    setEditedText((prev) => ({ ...prev, [id]: newText }));
  };

  const handleSave = (id: string) => {
    if (!GeneratedComp) return;

    const updatedComp = GeneratedComp.map((comp) => {
      if (comp.id === id) {
        return {
          ...comp,
          props: {
            ...comp.props,
            text: editedText[id] || comp.props.text,
          },
        };
      }
      return comp;
    });

    setGeneratedComp(updatedComp);
  };

  if (!GeneratedComp) {
    return <div className="p-4">No compositions available.</div>;
  }

  return (
    <ScrollArea className="p-4">
      {GeneratedComp.map((comp) => (
        <div key={comp.id} className="mb-4">
          <div className="text-sm font-medium mb-1">
            Timestamp: {comp.duration}s
          </div>
          <Input
            value={editedText[comp.id] || comp.props.text || ""}
            onChange={(e) => handleTextChange(comp.id, e.target.value)}
            placeholder="Edit text here"
          />
          <Button className="mt-2" onClick={() => handleSave(comp.id)}>
            Save
          </Button>
        </div>
      ))}
    </ScrollArea>
  );
};
