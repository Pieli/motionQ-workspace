import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { getUserProjects, deleteProject } from "@/lib/api-client";
import type { Project } from "@/client/types.gen";
import { MoreVertical, Edit, Copy, Trash2, Plus } from "lucide-react";

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProjectAction = (
    action: "edit" | "duplicate" | "delete",
    projectId: string,
  ) => {
    switch (action) {
      case "edit":
        navigate(`/workspace/${projectId}`);
        break;
      case "duplicate":
        console.log("Duplicate project:", projectId);
        break;
      case "delete": {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          setProjectToDelete(project);
          setDeleteDialogOpen(true);
        }
        break;
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete || !user) return;

    setIsDeleting(true);
    try {
      const success = await deleteProject(user, projectToDelete.id);
      if (success) {
        setProjects(projects.filter((p) => p.id !== projectToDelete.id));
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const formatLastAccessed = (date: string) => {
    const projectDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - projectDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return projectDate.toLocaleDateString();
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setProjectsLoading(false);
        return;
      }

      try {
        const userProjects = await getUserProjects(user);
        console.log("Fetched projects:", userProjects);
        if (userProjects && Array.isArray(userProjects)) {
          setProjects(userProjects);
        } else {
          console.warn("Projects response is not an array:", userProjects);
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your Projects
          </h2>
          <p className="text-muted-foreground">
            Create and manage your animated video projects
          </p>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-64">
                <CardContent className="p-0">
                  <Skeleton className="h-32 w-full rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Plus className="size-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Get started by creating your first animated video project using AI
              or manual editing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(projects) &&
              projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="p-0">
                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-xl flex items-center justify-center overflow-hidden">
                      {project?.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {project.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {project.metadata?.updatedAt
                              ? `Edited ${formatLastAccessed(project.metadata.updatedAt)}`
                              : "Never edited"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 h-8 w-8"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleProjectAction("edit", project.id)
                              }
                            >
                              <Edit className="size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleProjectAction("duplicate", project.id)
                              }
                            >
                              <Copy className="size-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() =>
                                handleProjectAction("delete", project.id)
                              }
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsSection;
