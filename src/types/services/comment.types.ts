export interface AddCommentIf {
  postId: string;
  userId: string;
  message: string;
  parentId?: string;
}

export interface GetCommentIf {
  postId: string;
  limit: number;
  page: number;
}
