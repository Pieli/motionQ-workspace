import React, { useMemo, useRef, useState, useEffect } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ShareDialog } from "@/components/navbar/share";
import { PreviewDialog } from "@/components/navbar/preview-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChatBoxPanel } from "@/components/chat/chatBoxPanel";
import { Navbar } from "@/components/navbar/navbar";
import { ProjectTitle } from "@/components/navbar/project-title";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Timeline } from "@/components/timeline/Timeline";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spacing } from "@/components/ui/spacing";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { BaseItem } from "@/components/timeline/Timeline";
import { FPS } from "@/globals";
import { useAuth } from "@/lib/AuthContext";
import { getProject, updateProject } from "@/lib/api-client";
import type { Composition, Project } from "@/client/types.gen";
import {
  hydrateCompositions,
  dehydrateCompositions,
} from "@/lib/composition-hydrator";

import { SequenceBuilder } from "@/components/tree-builder/sequence";

const Workspace = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // when transitioning from the start to the workspace screen
  const [initialPrompt, setInitialPrompt] = useState<string>(
    location?.state?.initialPrompt || "",
  );
  const [GeneratedComp, setGeneratedComp] = useState<
    CompositionConfig[] | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(location.state || false);
  const [projectTitle, setProjectTitle] = useState<string>("Untitled");

  const [loop, setLoop] = useState(true);

  // Initialize sidebar state as closed
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<string>("properties");
  const [propertiesItem, setPropertiesItem] = useState<BaseItem | null>(null);

  const clearSelectedProperty = React.useCallback(() => {
    setPropertiesItem(null);
  }, []);

  const handleHistoryUpdate = React.useCallback((history: string[]) => {
    setChatHistory(history);
  }, []);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      console.log("fetchProject called");
      if (!projectId || !user) {
        setProjectLoading(false);
        return;
      }

      console.log("fetchProject here");

      try {
        const projectData = await getProject(user, projectId);
        if (projectData) {
          setProject(projectData);
          setProjectTitle(projectData.name);

          console.log(projectData);
          // Hydrate compositions from backend format to CompositionConfig format
          if (projectData.compositions && projectData.compositions.length > 0) {
            try {
              const hydratedCompositions = hydrateCompositions(
                projectData.compositions as Composition[],
              );
              setGeneratedComp(hydratedCompositions);
            } catch (error) {
              console.error("Failed to hydrate compositions:", error);
              // Set empty compositions if hydration fails
              setGeneratedComp([]);
            }
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        navigate("/");
      } finally {
        setProjectLoading(false);
        console.log("fetchProject there");
      }
    };

    fetchProject();
  }, [projectId, user, navigate]);

  // Update project when compositions or history change - single source of truth
  useEffect(() => {
    const updateProjectInternal = async () => {
      if (projectId && user && (GeneratedComp || chatHistory.length > 0)) {
        try {
          const updateData: { compositions?: Composition[]; name?: string; history?: any } = {};

          if (GeneratedComp) {
            const dehydratedCompositions = dehydrateCompositions(GeneratedComp);
            updateData.compositions = dehydratedCompositions;
            updateData.name = project?.name || "Untitled";
          }

          if (chatHistory.length > 0) {
            updateData.history = chatHistory;
          }

          if (Object.keys(updateData).length > 0) {
            await updateProject(user, projectId, updateData);
            console.log("Project updated with:", Object.keys(updateData));
          }
        } catch (error) {
          console.error("Failed to update project:", error);
        }
      }
    };

    updateProjectInternal();
  }, [GeneratedComp, chatHistory, projectId, user, project?.name]);

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

  // Show loading state while fetching project
  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <SidebarProvider
          className="flex flex-col"
          style={{ "--sidebar-width": "calc(28rem)" } as React.CSSProperties}
        >
          <Navbar
            centerContent={<ProjectTitle title={projectTitle} />}
            rightContent={
              <>
                <PreviewDialog
                  compositions={GeneratedComp}
                  totalDuration={totalDuration}
                  handleOpenChange={(open) => {
                    if (open) {
                      playerRef.current?.pause();
                    }
                  }}
                />
                <ShareDialog />
                <Button>Export</Button>
              </>
            }
          />
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
                    setProjectTitle={setProjectTitle}
                    project={project}
                    projectId={projectId}
                    onHistoryUpdate={handleHistoryUpdate}
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
