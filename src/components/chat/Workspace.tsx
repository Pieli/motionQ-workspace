import React, { useMemo, useRef, useState } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { createElement } from "react";
import { Series } from "remotion";

import { ChatBoxPanel } from "@/components/chat/chatBoxPanel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Navbar } from "@/components/Navbar";
import { Spacing } from "@/components/ui/spacing";

import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Timeline } from "@/components/timeline/Timeline";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import { FPS } from "@/globals";



type ParsedElement = {
  prop: object, component: React.FC
}

function elementParser(comp?: CompositionConfig): ParsedElement {

  if (!comp) {
    return { prop: {}, component: React.Fragment }
  }

  const parsedProps = comp.schema.safeParse(comp.props)
  if (!parsedProps.success) {
    console.error(`Error parsing props for ${comp.id}:`, parsedProps.error);
    return { prop: {}, component: React.Fragment }
  }

  return { prop: parsedProps.data, component: comp.component }
}


const SequenceBuilder: React.FC<{ comps: CompositionConfig[] }> = ({
  comps,
}) => {

  console.log(comps)

  const renderCompositions = useMemo(() => {
    return comps.map((comp, index: number) => {

      const parsedBack = elementParser(comp.background);
      const parsedComp = elementParser(comp);

      return (
        <Series.Sequence durationInFrames={comp.duration} key={index}>
          <>
            {createElement(parsedBack.component, { ...parsedBack.prop, key: `background-${index}` })}
            {createElement(parsedComp.component, { ...parsedComp.prop, key: `foreground-${index}` })}
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

  const [loop, setLoop] = useState(false);

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
                <ResizablePanel defaultSize={25}>
                  <ChatBoxPanel
                    setGeneratedComp={setGeneratedComp}
                    setIsGenerating={setIsGenerating}
                    isGenerating={isGenerating}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={70}>
                      <div className="flex-1  h-full">
                        <div className="isolate flex-1 h-full bg-secondary">
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
                                style={{ width: "100%" }}
                                acknowledgeRemotionLicense
                                autoPlay
                                controls
                                loop={loop}
                              />
                              <Spacing y={1} />
                            </div>
                          ) : (
                            <div style={{ color: "#888" }}>
                              Animation Preview will be shown here
                            </div>
                          )}
                          {isGenerating && (
                            <div style={{ color: "#fff" }}>Loading…</div>
                          )}
                        </div>
                      </div>
                    </ResizablePanel>
                    {inputProps && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={30}>
                          <div className="h-full overflow-hidden">
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
