import { projectService } from "@/services/projectService";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteProjects(pageSize: number = 6) {
  return useInfiniteQuery({
    queryKey: ["projects", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      projectService.getPagedCompanyProjects(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
  });
}
