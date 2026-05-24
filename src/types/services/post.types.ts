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
  userId: string;
  limit: number;
  page: number;
  sort: SortTypeIf;
}
