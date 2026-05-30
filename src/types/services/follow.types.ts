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
  loggedInUserId: string;
  username: string | undefined;
  limit: number;
  page: number;
}

export interface GetFollowingIf {
  loggedInUserId: string;
  username: string | undefined;
  limit: number;
  page: number;
}
