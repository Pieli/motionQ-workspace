import React from "react";
import { Separator } from "@/components/ui/separator";

interface ProjectTitleProps {
  title?: string;
}

export const ProjectTitle: React.FC<ProjectTitleProps> = ({ title }) => {
  if (!title) return null;

  return (
    <>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center">
        <h1 className="text-sm font-medium text-foreground/80 truncate max-w-[200px]">
          {title}
        </h1>
      </div>
    </>
  );
};