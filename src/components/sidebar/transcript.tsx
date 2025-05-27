import type { CompositionConfig } from "@/components/interfaces/compositions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";

import { Pencil } from "lucide-react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Initialize refs array when component mounts or GeneratedComp changes
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, GeneratedComp?.length ?? 0);
  }, [GeneratedComp]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingId) {
        const clickedInsideAnyRef = itemRefs.current.some(
          (ref) => ref && ref.contains(event.target as Node),
        );
        if (!clickedInsideAnyRef) {
          setEditingId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingId]);

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
    setEditingId(null);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If we're editing and click target is not the textarea or save button
    if (editingId) {
      const target = e.target as HTMLElement;
      if (!target.closest("textarea") && !target.closest("button")) {
        setEditingId(null);
      }
    }
  };

  if (!GeneratedComp) {
    return <div className="p-4">No compositions available.</div>;
  }

  return (
    <ScrollArea className="p-4" onClick={handleContainerClick}>
      {GeneratedComp.map((comp, index) => {
        const starttime =
          index === 0
            ? 0
            : GeneratedComp.slice(0, index).reduce(
                (acc, curr) => acc + curr.duration,
                0,
              );
        const endtime = starttime + comp.duration;

        const formatTime = (time: number) => (time / 1000).toFixed(2) + "s";

        return (
          <div
            key={comp.id}
            className="mb-4"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <div className="text-sm font-medium mb-1">
              [{formatTime(starttime)} - {formatTime(endtime)}]
            </div>
            <div className="relative hover:bg-accent rounded pb-4">
              <div
                className={`text-sm font-medium peer/text ${
                  editingId === comp.id ? "py-2" : "py-1"
                }`}
              >
                {editingId === comp.id ? (
                  <textarea
                    value={editedText[comp.id] || comp.props.text || ""}
                    onChange={(e) => handleTextChange(comp.id, e.target.value)}
                    placeholder="Edit text here"
                    className="w-full p-2 border rounded"
                  />
                ) : (
                    <div className="text-base font-medium">
                    {editedText[comp.id] || comp.props.text || ""}
                    </div>
                )}
              </div>
              {editingId !== comp.id && (
                <Pencil
                  className="w-5 h-5 text-primary absolute top-1/2 -translate-y-1/2 right-2 opacity-100 peer-hover:text-primary-dark cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(comp.id);
                  }}
                />
              )}
              {editingId === comp.id && (
                <div className="flex justify-end">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(comp.id);
                    }}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};
