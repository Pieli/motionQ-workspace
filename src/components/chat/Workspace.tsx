import React, { useMemo, useRef, useState, useEffect } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { useLocation, useNavigate } from "react-router-dom";

import { ShareDialog } from "@/components/navbar/share";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChatBoxPanel } from "@/components/chat/chatBoxPanel";
import { Navbar } from "@/components/navbar/navbar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Timeline } from "@/components/timeline/Timeline";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spacing } from "@/components/ui/spacing";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { BaseItem } from "@/components/timeline/Timeline";
import { FPS } from "@/globals";

import { SequenceBuilder } from "@/components/tree-builder/sequence";

const Workspace = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // when transitioning from the start to the workspace screen
  const [initialPrompt, setInitialPrompt] = useState<string>(
    location?.state?.initialPrompt || "",
  );
  const [GeneratedComp, setGeneratedComp] = useState<
    CompositionConfig[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(location.state || false);

  const [loop, setLoop] = useState(true);

  // Initialize sidebar state as closed
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<string>("properties");
  const [propertiesItem, setPropertiesItem] = useState<BaseItem | null>(null);

  const clearSelectedProperty = React.useCallback(() => {
    setPropertiesItem(null);
  }, []);

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
          style={{ "--sidebar-width": "calc(28rem)" } as React.CSSProperties}
        >
          <Navbar>
            <Button variant={"outline"}>Preview</Button>
            <ShareDialog />
            <Button>Export</Button>
          </Navbar>
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
                    initialPrompt={initialPrompt}
                    setInitialPrompt={setInitialPrompt}
                    preUpdateCleanup={clearSelectedProperty}
                  />
                </ResizablePanel>
                <ResizableHandle
                  withHandle
                  style={{
                    backgroundColor: "unset",
                  }}
                />
                <ResizablePanel defaultSize={60} className="py-4">
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
                      <>
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
                                className="shadow-xl"
                                style={{
                                  width: "100%",
                                  borderRadius: "12px",
                                }}
                                acknowledgeRemotionLicense
                                autoPlay
                                controls
                                loop={loop}
                                inFrame={
                                  propertiesItem ? propertiesItem.start : null
                                }
                                outFrame={
                                  propertiesItem ? propertiesItem.end - 1 : null
                                }
                              />
                              <Spacing y={1} />
                              <div className="flex justify-center items-center px-4">
                                {inputProps && propertiesItem && (
                                  <Button
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setPropertiesItem(null);
                                    }}
                                  >
                                    <X />
                                    Sequence Loop
                                  </Button>
                                )}
                              </div>
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
                      </>
                    </ResizablePanel>
                    {inputProps && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={30} id="inputProps">
                          <div className="overflow-hidden px-4 pb-4">
                            <Timeline
                              comps={GeneratedComp || []}
                              playerRef={playerRef}
                              setLoop={setLoop}
                              setSidebarOpen={setSidebarOpen}
                              setSidebarTab={setSidebarTab}
                              selectedItem={propertiesItem}
                              setSelectedItem={setPropertiesItem}
                            />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </SidebarInset>
            <AppSidebar
              setComps={setGeneratedComp}
              comps={GeneratedComp}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sidebarTab={sidebarTab}
              propertiesItem={propertiesItem}
            />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Workspace;
