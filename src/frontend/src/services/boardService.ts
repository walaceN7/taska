import { api } from "@/lib/api";
import type { PagedResult } from "@/types/api.types";
import type {
  BoardDto,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "@/types/board.types";
import type { ColumnDto, CreateColumnRequest } from "@/types/column.types";

const urlBase = "core/api/board";

export const boardService = {
  getBoardById: async (id: string): Promise<BoardDto> => {
    const response = await api.get<BoardDto>(`${urlBase}/${id}`);
    return response.data;
  },

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

  getColumnsBoard: async (id: string): Promise<ColumnDto[]> => {
    const response = await api.get<ColumnDto[]>(`${urlBase}/${id}/columns`);
    return response.data;
  },

  createColumn: async (
    id: string,
    request: CreateColumnRequest,
  ): Promise<ColumnDto> => {
    const response = await api.post<ColumnDto>(
      `${urlBase}/${id}/columns`,
      request,
    );
    return response.data;
  },
};
