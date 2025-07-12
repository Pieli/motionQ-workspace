"use client";

import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavUser } from "@/components/navbar/user-settings";
import type React from "react";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg?w",
};

export const Navbar: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background-secondary">
      <div className="flex h-12 w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="text-2xl font-semibold dm-mono">MotionQ</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Files</DropdownMenuItem>
              <DropdownMenuItem>Exports</DropdownMenuItem>
              <DropdownMenuItem>Recents</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          {children}
          <NavUser user={user} />
        </div>
      </div>
    </header>
  );
};
