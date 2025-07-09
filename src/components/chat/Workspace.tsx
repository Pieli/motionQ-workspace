import React, { useMemo, useRef, useState } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { createElement } from "react";
import { Series } from "remotion";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChatBoxPanel } from "@/components/chat/chatBoxPanel";
import { Navbar } from "@/components/navbar/navbar";
import { Spacing } from "@/components/ui/spacing";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Timeline } from "@/components/timeline/Timeline";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import { FPS } from "@/globals";

type ParsedElement = {
  prop: object;
  component: React.FC;
};

function elementParser(comp?: CompositionConfig): ParsedElement {
  if (!comp) {
    return { prop: {}, component: React.Fragment };
  }

  const parsedProps = comp.schema.safeParse(comp.props);
  if (!parsedProps.success) {
    console.error(`Error parsing props for ${comp.id}:`, parsedProps.error);
    return { prop: {}, component: React.Fragment };
  }

  return { prop: parsedProps.data, component: comp.component };
}

export const SequenceBuilder: React.FC<{ comps: CompositionConfig[] }> = ({
  comps,
}) => {
  const renderCompositions = useMemo(() => {
    return comps.map((comp, index: number) => {
      const parsedBack = elementParser(comp.background);
      const parsedComp = elementParser(comp);

      return (
        <Series.Sequence durationInFrames={comp.duration} key={index}>
          <>
            {createElement(parsedBack.component, {
              ...parsedBack.prop,
              key: `background-${index}`,
            })}
            {createElement(parsedComp.component, {
              ...parsedComp.prop,
              key: `foreground-${index}`,
            })}
          </>
        </Series.Sequence>
      );
    });
  }, [comps]);

  return <Series>{renderCompositions}</Series>;
};

const Workspace = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const [GeneratedComp, setGeneratedComp] = useState<
    CompositionConfig[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [loop, setLoop] = useState(true);

  const totalDuration = useMemo(
    () =>
      GeneratedComp?.reduce((acc, comp) => {
        const { duration } = comp;
        return acc + duration;
      }, 0),
    [GeneratedComp],
  );

  const inputProps = useMemo(() => GeneratedComp, [GeneratedComp]);

  const playerRef = useRef<PlayerRef>(null);

  return (
    <>
      <div>
        <SidebarProvider
          className="flex flex-col"
          style={{ "--sidebar-width": "calc(30svw)" } as React.CSSProperties}
        >
          <Navbar />
          <div className="flex flex-1">
            <SidebarInset>
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full"
              >
                <ResizablePanel
                  defaultSize={40}
                  collapsible={true}
                  collapsedSize={1}
                  minSize={30}
                  id="chatbox"
                >
                  <ChatBoxPanel
                    setGeneratedComp={setGeneratedComp}
                    setIsGenerating={setIsGenerating}
                    isGenerating={isGenerating}
                  />
                </ResizablePanel>
                <ResizableHandle
                  withHandle
                  style={{
                    backgroundColor: "unset",
                  }}
                />
                <ResizablePanel defaultSize={60} className="py-4 pr-4">
                  <ResizablePanelGroup
                    direction="vertical"
                    className="rounded-lg"
                    style={{
                      backgroundColor: "#c9c1c1",
                    }}
                  >
                    <ResizablePanel
                      defaultSize={inputProps ? 70 : 100}
                      id="player"
                    >
                      <div className="isolate flex-1 h-full">
                        {inputProps ? (
                          <div className="p-8">
                            <Player
                              component={SequenceBuilder}
                              durationInFrames={totalDuration || 1}
                              fps={FPS}
                              ref={playerRef}
                              compositionWidth={compositionWidth}
                              compositionHeight={compositionHeight}
                              inputProps={{ comps: inputProps }}
                              style={{
                                width: "100%",
                                borderRadius: "12px",
                              }}
                              acknowledgeRemotionLicense
                              autoPlay
                              controls
                              loop={loop}
                            />
                            <Spacing y={1} />
                          </div>
                        ) : (
                          <div style={{ color: "#888", padding: "8px" }}>
                            Animation Preview will be shown here
                          </div>
                        )}
                        {isGenerating && (
                          <div style={{ color: "#888" }}>Loading…</div>
                        )}
                      </div>
                    </ResizablePanel>
                    {inputProps && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={30} id="inputProps">
                          <div className=" overflow-hidden p-4">
                            <Timeline
                              comps={GeneratedComp || []}
                              playerRef={playerRef}
                              setLoop={setLoop}
                            />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </SidebarInset>
            <AppSidebar setComps={setGeneratedComp} comps={GeneratedComp} />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Workspace;
