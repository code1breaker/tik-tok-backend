export interface FollowUserIf {
  followingId: string;
  followerId: string;
}

export interface UpdateFollowStatusIf {
  followingId: string;
  followerId: string;
  status: "accepted" | "rejected";
}

export interface IncomingFollowRequestIf {
  userId: string;
  limit: number;
  page: number;
}

export interface OutgoingFollowRequestIf {
  userId: string;
  limit: number;
  page: number;
}

export interface GetFollowerIf {
  userId: string | undefined;
  limit: number;
  page: number;
}

export interface GetFollowingIf {
  userId: string | undefined;
  limit: number;
  page: number;
}
