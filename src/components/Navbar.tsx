"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { SidebarIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background-secondary">
      <div className="flex h-12 w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="text-xl font-bold">MotionQ</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Files</DropdownMenuItem>
              <DropdownMenuItem>Exports</DropdownMenuItem>
              <DropdownMenuItem>Recents</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SidebarIcon />
        </div>
        <div className="flex items-center gap-4">
          <Button>Export</Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>PG</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
