import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateWithoutTime } from "@/lib/utils";
import { type ProjectDto, ProjectStatus } from "@/types/project.types";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, FolderKanban, MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

export function useProjectColumns(): ColumnDef<ProjectDto>[] {
  const { t } = useTranslation();

  const getStatusVariant = (status: number) => {
    switch (status) {
      case ProjectStatus.Active:
        return "default";
      case ProjectStatus.Planning:
        return "secondary";
      case ProjectStatus.Completed:
        return "outline";
      default:
        return "destructive";
    }
  };

  const getStatusText = (status: number) => {
    const statusKey = Object.keys(ProjectStatus).find(
      (key) => ProjectStatus[key as keyof typeof ProjectStatus] === status,
    );
    return statusKey
      ? t(`project.status.${statusKey.toLowerCase()}`, statusKey)
      : t("project.status.unknown", "Unknown");
  };

  return [
    {
      accessorKey: "name",
      header: t("project.name", "Name"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.companyName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("project.statusLabel", "Status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusText(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: t("project.startDate", "Start Date"),
      cell: ({ row }) => {
        const date = row.original.startDate;
        return date ? formatDateWithoutTime(date) : "---";
      },
    },
    {
      accessorKey: "endDate",
      header: t("project.endDate", "End Date"),
      cell: ({ row }) => {
        const date = row.original.endDate;
        return date ? formatDateWithoutTime(date) : "---";
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
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
              <DropdownMenuItem className="cursor-pointer">
                <FolderKanban className="mr-2 h-4 w-4" />
                {t("project.viewBoard", "View Board")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit", "Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                {t("common.delete", "Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
