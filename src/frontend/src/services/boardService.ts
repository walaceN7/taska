import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type {
  BoardDto,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "@/types/board.types";

const urlBase = "core/api/board";

export const boardService = {
  createBoard: async (request: CreateBoardRequest): Promise<BoardDto> => {
    const response = await api.post<BoardDto>(`${urlBase}`, request);
    return response.data;
  },

  updateBoard: async (
    id: string,
    request: UpdateBoardRequest,
  ): Promise<BoardDto> => {
    const response = await api.put<BoardDto>(`${urlBase}/${id}`, request);
    return response.data;
  },

  deleteBoard: async (id: string): Promise<void> => {
    await api.delete<void>(`${urlBase}/${id}`);
  },

  getPagedBoards: async (
    projectId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PagedResult<BoardDto>> => {
    const response = await api.get<PagedResult<BoardDto>>(
      `core/api/project/${projectId}/boards/paged`,
      {
        params: { pageNumber, pageSize },
      },
    );
    return response.data;
  },
};
