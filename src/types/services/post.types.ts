export interface PostIf {
  filename: string;
  duration: number;
  url: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  visibility: string;
  userId: string;
}

export interface UpdatePostIf extends PostIf {
  postId: string;
  status: string;
}

export type SortTypeIf = "latest" | "oldest" | "popular";

export interface UserPostIf {
  username: string;
  limit: number;
  page: number;
  sort: SortTypeIf;
}
export interface UserPostByIdContextIf {
  username: string;
  postId: string;
  limit: number;
}
export interface UserPostByIdDirectionIf {
  username: string;
  direction: string;
  postId: string;
  limit: number;
}
