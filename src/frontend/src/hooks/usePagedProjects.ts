import { projectService } from "@/services/projectService";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteProjects(pageSize: number = 6) {
  return useInfiniteQuery({
    queryKey: ["projects", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      projectService.getPagedCompanyProjects(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNumber + 1;
      }
      return undefined;
    },
  });
}
