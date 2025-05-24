import { useState, useMemo } from "react";

import { Player } from "@remotion/player";
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

import { AppSidebar } from "@/components/app-sidebar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// import { OptionsPanelZ } from "@/components/zodeditor/OptionsPanelZ";
import { Timeline } from "@/components/timeline/Timeline";

import type { CompositionConfig } from "@/components/interfaces/compositions";

const SequenceBuilder: React.FC<{ comps: CompositionConfig[] }> = ({
  comps,
}) => {
  const innerComp = comps.map(
    ({ id, component, schema, props, duration }, index: number) => {
      const parsedProps = schema.safeParse(props);
      if (!parsedProps.success) {
        console.error(`Error parsing props for ${id}:`, parsedProps.error);
        return null;
      }

      const inner = createElement(component, { ...parsedProps.data, key: id });

      return (
        <Series.Sequence durationInFrames={duration} key={index}>
          {inner}
        </Series.Sequence>
      );
    },
  );
  return <Series>{innerComp}</Series>;
};

const Workspace = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const [GeneratedComp, setGeneratedComp] = useState<
    CompositionConfig[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalDuration = useMemo(
    () =>
      GeneratedComp?.reduce((acc, comp) => {
        const { duration } = comp;
        return acc + duration;
      }, 0),
    [GeneratedComp],
  );

  return (
    <>
      <div>
        <SidebarProvider
          className="flex flex-col"
          style={{ "--sidebar-width": "350px" } as React.CSSProperties}
        >
          {/*<Navbar />*/}
          <Navbar />
          <div className="flex flex-1">
            {/*<div className="flex-1 w-full">*/}
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
                <ResizablePanel defaultSize={50}>
                  <div className="flex-1 px-4 h-full">
                    <div className="isolate flex-1 p-20 h-full rounded-xl bg-secondary">
                      {GeneratedComp ? (
                        <>
                          <Player
                            component={SequenceBuilder}
                            durationInFrames={totalDuration || 1}
                            fps={30}
                            compositionWidth={compositionWidth}
                            compositionHeight={compositionHeight}
                            inputProps={{ comps: GeneratedComp }}
                            style={{ width: "100%" }}
                            acknowledgeRemotionLicense
                            autoPlay
                            controls
                            loop
                          />
                          <Spacing y={1} />
                          <Timeline comps={GeneratedComp} />
                        </>
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
                <ResizablePanel defaultSize={25}>
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: "green" }}
                  >
                    hello
                  </div>
                  {/*
                <h2 className="text-xl font-bold my-4">Animation Properties</h2>
                {GeneratedComp && GeneratedComp.length > 0 && (
                  <OptionsPanelZ
                    compositions={GeneratedComp}
                    setCompositions={setGeneratedComp}
                  />
                )}
              */}
                </ResizablePanel>
              </ResizablePanelGroup>
            </SidebarInset>
            <AppSidebar />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Workspace;
