import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, FolderKanban, MoreHorizontal, Trash, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ProjectMembersModal } from "./ProjectMembersModal";
import { ProjectModal } from "./ProjectModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteProjectMutation } from "@/hooks/useProject";
import { type ProjectDto } from "@/types/project.types";

export const ProjectActionCell = ({ project }: { project: ProjectDto }) => {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const deleteProjectMutation = useDeleteProjectMutation();

  const handleDelete = async () => {
    await deleteProjectMutation.mutateAsync(project.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">
              {t("common.openMenu", "Open menu")}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("common.actions", "Actions")}
          </DropdownMenuLabel>
          <Link to={`/projects/${project.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <FolderKanban className="mr-2 h-4 w-4" />
              {t("project.viewBoard", "View Board")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <ProjectModal
            project={project}
            customTrigger={
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit", "Edit")}
              </DropdownMenuItem>
            }
          />
          <ProjectMembersModal
            projectId={project.id}
            currentMembers={project.members || []}
            customTrigger={
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <User className="mr-2 h-4 w-4" />
                {t("common.members", "Members")}
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            {t("common.delete", "Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t("project.confirmDeleteTitle", { name: project.name, defaultValue: `Delete project ${project.name}?` })}
        description={t("project.confirmDeleteDescription", "Are you sure you want to delete this project? This action cannot be undone.")}
        confirmText={t("common.delete", "Delete")}
        cancelText={t("common.cancel", "Cancel")}
        isDestructive={true}
        isLoading={deleteProjectMutation.isPending}
      />
    </>
  );
};
