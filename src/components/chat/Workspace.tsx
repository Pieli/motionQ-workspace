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

import { AppSidebar } from "@/components/sidebar/app-sidebar";

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
                  <div className="flex-1  h-full">
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
