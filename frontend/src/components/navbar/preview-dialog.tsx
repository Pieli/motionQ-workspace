import React from "react";
import { Player } from "@remotion/player";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import { FPS } from "@/globals";
import { SequenceBuilder } from "@/components/tree-builder/sequence";

interface PreviewDialogProps {
  compositions: CompositionConfig[] | null;
  totalDuration: number | undefined;
  handleOpenChange?: (open: boolean) => void;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  compositions,
  totalDuration,
  handleOpenChange,
}) => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Preview</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/70" />
        <DialogContent
          className="w-70/100 p-0 bg-transparent p-0 m-0 rounded-xl gap-0 border-none shadow-xl"
          showCloseButton={false}
        >
          {compositions ? (
            <Player
              component={SequenceBuilder}
              durationInFrames={totalDuration || 1}
              fps={FPS}
              compositionWidth={compositionWidth}
              compositionHeight={compositionHeight}
              inputProps={{ comps: compositions }}
              className="shadow-xl"
              style={{
                width: "100%",
                maxWidth: "1200px",
                borderRadius: "12px",
              }}
              acknowledgeRemotionLicense
              autoPlay
              controls
              loop
            />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No animation to preview. Generate or create an animation first.
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
