"use client";

import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { NavUser } from "@/components/navbar/user-settings";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type React from "react";

interface NavbarProps {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  leftContent, 
  centerContent, 
  rightContent 
}) => {
  const { user: firebaseUser, backendUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const user = {
    name:
      firebaseUser?.displayName || backendUser?.email.split("@")[0] || "User",
    email: backendUser?.email || firebaseUser?.email || "",
    avatar: firebaseUser?.photoURL || "/avatars/default.jpg",
  };

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background-secondary backdrop-blur-sm">
      <div className="flex h-12 w-full items-center gap-2 px-4">
        <div className="flex items-center gap-4 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isHome}>
              <span className="text-2xl font-semibold dm-mono">MotionQ</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => navigate("/")}>
                Files
              </DropdownMenuItem>
              <DropdownMenuItem>Exports</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {leftContent}
        </div>
        <div className="flex items-center justify-center flex-1">
          {centerContent}
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          {rightContent}
          <NavUser user={user} />
        </div>
      </div>
    </header>
  );
};
