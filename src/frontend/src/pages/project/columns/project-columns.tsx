import { Badge } from "@/components/ui/badge";
import { formatDateWithoutTime } from "@/lib/utils";
import { type ProjectDto, ProjectStatus } from "@/types/project.types";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ProjectActionCell } from "../components/ProjectActionCell";

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
      cell: ({ row }) => <ProjectActionCell project={row.original} />,
    },
  ];
}
