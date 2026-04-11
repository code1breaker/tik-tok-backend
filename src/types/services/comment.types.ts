export interface AddCommentIf {
  videoId: string;
  userId: string;
  message: string;
  parentId?: string;
}

export interface GetCommentIf {
  videoId: string;
  limit: number;
  page: number;
}
