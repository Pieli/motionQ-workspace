import React, { useMemo, useRef, useState, useEffect } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

import { FPS } from "@/globals";
import { useAuth } from "@/lib/AuthContext";
import {
  getProject,
  updateProject,
  addToProjectHistory,
  createProject,
  updateProjectName,
} from "@/lib/api-client";
import type { Composition, Project } from "@/client/types.gen";
import type { ChatMessage } from "@/types/chat";
import {
  hydrateCompositions,
  dehydrateCompositions,
} from "@/lib/composition-hydrator";

import { SequenceBuilder } from "@/components/tree-builder/sequence";
import { toast } from "sonner";
import { CompositionProvider, useComposition } from "@/lib/CompositionContext";
import { ColorPaletteProvider } from "@/lib/ColorPaletteContext";

const WorkspaceContent = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const {
    compositions,
    setCompositions,
    selectedItem,
    setSelectedItem,
    isGenerating,
  } = useComposition();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messageQueue, setMessageQueue] = useState<ChatMessage[]>([]);

  // when transitioning from the start to the workspace screen
  const [initialPrompt, setInitialPrompt] = useState<string>(
    location?.state?.initialPrompt || "",
  );
  const initialPromptProcessedRef = useRef<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("Untitled");

  const [loop, setLoop] = useState(true);

  // Initialize sidebar state as closed
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<string>("properties");

  // Prevent duplicate project creation in React StrictMode
  const projectCreationRef = useRef<boolean>(false);
  const chatBoxPanelRef = useRef<{
    generate: (prompt?: string) => Promise<void>;
  } | null>(null);

  const handleApplyPalette = React.useCallback(async (palettePrompt: string) => {
    if (chatBoxPanelRef.current) {
      await chatBoxPanelRef.current.generate(palettePrompt);
    }
  }, []);


  const generateProjectName = React.useCallback((): string => {
    return "Untitled";
  }, []);

  const processQueuedMessages = React.useCallback(
    async (targetProjectId: string) => {
      if (messageQueue.length === 0 || !user) return;

      console.log(
        `Processing ${messageQueue.length} queued messages for project ${targetProjectId}`,
      );

      for (const queuedMessage of messageQueue) {
        try {
          await addToProjectHistory(
            user,
            targetProjectId,
            queuedMessage.role,
            queuedMessage.content,
          );
        } catch (error) {
          console.error("Failed to save queued message to backend:", error);
        }
      }

      // Clear the queue after processing
      setMessageQueue([]);
    },
    [messageQueue, user],
  );

  const recordMessage = React.useCallback(
    async (message: ChatMessage) => {
      // Add to local history
      setChatHistory((prev) => [...prev, message]);

      // Save to backend if we have a project and user
      const effectiveProjectId = project?.id || projectId;

      if (effectiveProjectId && user) {
        try {
          await addToProjectHistory(
            user,
            effectiveProjectId,
            message.role,
            message.content,
          );
        } catch (error) {
          console.error("Failed to save message to backend:", error);
        }
      } else if (user) {
        // Queue message if project not ready yet
        // console.log( "Queueing message until project is ready:", message.content.slice(0, 30),);
        setMessageQueue((prev) => [...prev, message]);
      }
    },
    [project?.id, projectId, user],
  );

  // Fetch project data or create new project if none exists
  useEffect(() => {
    const initializeProject = async () => {
      // console.log("initializeProject called");
      if (!user) {
        setProjectLoading(false);
        return;
      }

      // If no projectId, create a new project
      if (!projectId) {
        // Prevent duplicate creation in React StrictMode
        if (projectCreationRef.current) {
          // console.log("Project creation already in progress, skipping");
          setProjectLoading(false);
          return;
        }

        projectCreationRef.current = true;
        // console.log("No projectId, creating new project");
        try {
          const projectName = generateProjectName();
          const newProject = await createProject(user, projectName);

          if (newProject) {
            setProject(newProject);
            setProjectTitle(projectName);
            navigate(`/workspace/${newProject.id}`, { replace: true });
            toast.success(`Project "${projectName}" created successfully`);
            // console.log(`Project "${projectName}" created successfully`);

            // Process any queued messages now that project is created
            await processQueuedMessages(newProject.id);
          } else {
            toast.error("Failed to create project");
            navigate("/");
          }
        } catch (error) {
          console.error("Error creating project:", error);
          toast.error("Failed to create project");
          navigate("/");
        } finally {
          setProjectLoading(false);
          projectCreationRef.current = false;
        }
        return;
      }

      try {
        const projectData = await getProject(user, projectId);
        if (projectData) {
          setProject(projectData);
          setProjectTitle(projectData.name);

          // console.log(projectData);

          // Process any queued messages now that project is loaded
          await processQueuedMessages(projectData.id);

          // Load chat history from project
          if (projectData.chatHistory && projectData.chatHistory.length > 0) {
            setChatHistory(projectData.chatHistory);
          }

          // Hydrate compositions from backend format to CompositionConfig format
          if (projectData.compositions && projectData.compositions.length > 0) {
            try {
              const hydratedCompositions = hydrateCompositions(
                projectData.compositions as Composition[],
              );
              setCompositions(hydratedCompositions);
            } catch (error) {
              console.error("Failed to hydrate compositions:", error);
              // Set empty compositions if hydration fails
              setCompositions([]);
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
        // console.log("fetchProject there");
      }
    };

    initializeProject();
  }, [projectId, user, navigate, generateProjectName, processQueuedMessages, setCompositions]);

  // Handle initial prompt processing - only once per project/prompt combination
  useEffect(() => {
    const processInitialPrompt = async () => {
      if (
        initialPrompt &&
        initialPrompt.trim().length > 0 &&
        initialPromptProcessedRef.current !== initialPrompt &&
        chatBoxPanelRef.current &&
        !projectLoading
      ) {
        // console.log("Processing initial prompt:", initialPrompt.slice(0, 30));
        initialPromptProcessedRef.current = initialPrompt;
        setInitialPrompt(""); // Clear immediately to prevent re-processing
        await chatBoxPanelRef.current.generate(initialPrompt);
      }
    };

    processInitialPrompt();
  }, [initialPrompt, projectLoading]);

  // Update project when compositions change - history is handled separately via chat endpoint
  useEffect(() => {
    const updateProjectInternal = async () => {
      if (projectId && user && compositions) {
        try {
          const updateData: {
            compositions?: Composition[];
            name?: string;
          } = {};

          if (compositions) {
            const dehydratedCompositions = dehydrateCompositions(compositions);
            updateData.compositions = dehydratedCompositions;
            updateData.name = project?.name || "Untitled";
          }

          if (Object.keys(updateData).length > 0) {
            await updateProject(user, projectId, updateData);
            // console.log("Project updated with:", Object.keys(updateData));
          }
        } catch (error) {
          console.error("Failed to update project:", error);
        }
      }
    };

    updateProjectInternal();
  }, [compositions, projectId, user, project?.name]);

  const totalDuration = useMemo(
    () =>
      compositions?.reduce((acc, comp) => {
        const { duration } = comp;
        return acc + duration;
      }, 0),
    [compositions],
  );

  const inputProps = useMemo(() => compositions, [compositions]);
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
            centerContent={
              <ProjectTitle
                title={projectTitle}
                onTitleChange={async (newTitle) => {
                  if (user && project) {
                    setProjectTitle(newTitle);
                    setProject({ ...project, name: newTitle });
                    try {
                      const success = await updateProjectName(
                        user,
                        project.id,
                        newTitle,
                      );

                      if (!success) {
                        toast.error("Failed to update project name");
                      }
                    } catch (error) {
                      console.error("Failed to update project name:", error);
                    }
                  }
                }}
              />
            }
            rightContent={
              <>
                <PreviewDialog
                  compositions={compositions}
                  totalDuration={totalDuration}
                  handleOpenChange={(open) => {
                    if (open) {
                      playerRef.current?.pause();
                    }
                  }}
                />
                {/* <ShareDialog /> */}
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
                    ref={chatBoxPanelRef}
                    project={project}
                    projectId={projectId}
                    initialHistory={chatHistory}
                    recordMessage={recordMessage}
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
                                  selectedItem ? selectedItem.start : null
                                }
                                outFrame={
                                  selectedItem ? selectedItem.end - 1 : null
                                }
                              />
                              <Spacing y={1} />
                              <div className="flex justify-center items-center px-4">
                                {inputProps && selectedItem && (
                                  <Button
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSelectedItem(null);
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
                        </div>
                      </>
                    </ResizablePanel>
                    {inputProps && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={30} id="inputProps">
                          <div className="overflow-hidden px-4 pb-4">
                            <Timeline
                              playerRef={playerRef}
                              setLoop={setLoop}
                              setSidebarOpen={setSidebarOpen}
                              setSidebarTab={setSidebarTab}
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
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sidebarTab={sidebarTab}
              onApplyPalette={handleApplyPalette}
            />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

const Workspace = () => {
  return (
    <ColorPaletteProvider>
      <CompositionProvider>
        <WorkspaceContent />
      </CompositionProvider>
    </ColorPaletteProvider>
  );
};

export default Workspace;
