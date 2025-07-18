import { Captions, Command, Component, Folders, ListMusic } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";

// TODO is the NavUser needed (decide later)
import { NavUser } from "@/components/sidebar/nav-user";
import { Transcript } from "@/components/sidebar/transcript";
import { OptionsPanelZ } from "@/components/zodeditor/OptionsPanelZ";
import type { BaseItem } from "@/components/timeline/Timeline";

const SIDEBAR_KEYBOARD_SHORTCUT = "b";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import { AssetBar } from "@/components/sidebar/asset-bar";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg?w",
  },
  navMain: [
    {
      title: "Properties",
      url: "#",
      icon: Component,
      isActive: true,
    },
    {
      title: "Transcript",
      url: "#",
      icon: Captions,
      isActive: false,
    },
    {
      title: "Assets",
      url: "#",
      icon: Folders,
      isActive: false,
    },
    {
      title: "Music",
      url: "#",
      icon: ListMusic,
      isActive: false,
    },
  ],
};

export const AppSidebar: React.FC<{
  comps: CompositionConfig[] | null;
  setComps: React.Dispatch<React.SetStateAction<CompositionConfig[] | null>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
  sidebarTab: string;
  propertiesItem: BaseItem | null;
}> = ({
  comps,
  setComps,
  setSidebarOpen,
  sidebarOpen,
  sidebarTab,
  propertiesItem,
}) => {
  const [activeItem, setActiveItem] = useState(() => {
    const foundItem = data.navMain.find(
      (item) => item.title.toLowerCase() === sidebarTab.toLowerCase(),
    );
    return foundItem || data.navMain[0];
  });

  const { toggleSidebar, state } = useSidebar();

  const isStateOpen = useMemo(() => state === "expanded", [state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        // let the sidebar the other useEffect open it
        setSidebarOpen(!sidebarOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, setSidebarOpen, sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen !== isStateOpen) {
      toggleSidebar();
    }
  }, [sidebarOpen, toggleSidebar, isStateOpen]);

  useEffect(() => {
    // Keep activeItem in sync with sidebarTab
    const foundItem = data.navMain.find(
      (item) => item.title.toLowerCase() === sidebarTab.toLowerCase(),
    );
    if (foundItem) {
      setActiveItem(foundItem);
    }
  }, [sidebarTab]);

  const renderContent = useMemo(() => {
    switch (activeItem.title) {
      case "Properties":
        return (
          <div className="p-4">
            {comps && comps.length > 0 && propertiesItem ? (
              <OptionsPanelZ
                compositions={comps}
                setCompositions={setComps}
                selectedItem={propertiesItem}
              />
            ) : (
              <span>Select a composition to edit its properties</span>
            )}
          </div>
        );
      case "Transcript":
        return <Transcript GeneratedComp={comps} setGeneratedComp={setComps} />;
      case "Assets":
        return <AssetBar />;
      default:
        return <div className="p-4">Default content goes here.</div>;
    }
  }, [comps, activeItem, setComps, propertiesItem]);

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="top-12 !h-[calc(100svh-50px)] overflow-hidden border-none"
    >
      <div className="flex flex-row-reverse h-full w-full">
        <Sidebar
          collapsible="none"
          className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r bg-background border-l"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                  <a href="#">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Acme Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {data.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                        onClick={() => {
                          if (!sidebarOpen) {
                            setSidebarOpen(true);
                          }

                          if (activeItem?.title === item.title) {
                            if (sidebarOpen) {
                              setSidebarOpen(false);
                              return;
                            }
                            return;
                          }

                          setActiveItem(item);
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>
        <Sidebar collapsible="none" className="bg-background">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-md font-semibold tracking-tight">
                {activeItem?.title}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent>{renderContent}</SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </Sidebar>
  );
};
