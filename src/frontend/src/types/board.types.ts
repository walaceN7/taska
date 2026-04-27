export interface BoardDto {
  id: string;
  projectId: string;
  name: string;
  type: BoardType;
}

export interface CreateBoardRequest {
  projectId: string;
  name: string;
  type: BoardType;
}

export interface UpdateBoardRequest {
  name: string;
}

export const BoardType = {
  Kanban: 0,
  Scrum: 1,
};

export type BoardType = (typeof BoardType)[keyof typeof BoardType];
