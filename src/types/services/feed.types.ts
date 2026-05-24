export interface FeedIf {
  limit: number;
  page: number;
}

export type SortTypeIf = "latest" | "oldest" | "popular";
export interface UserFeedIf {
  userId: string;
  limit: number;
  page: number;
  sort: SortTypeIf;
}
