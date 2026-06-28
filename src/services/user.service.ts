// model
import User from "../models/user.model.ts";

// utils
import { NotFound } from "../utils/api-error.ts";

// constants
import ERROR_CODE from "../constants/error-code.ts";
import Follow from "../models/follow.model.ts";

export const getProfileByUsername = async ({
  username,
  userId,
}: {
  username: string;
  userId: string;
}) => {
  const loggedInUser = await User.findById(userId).lean();
  const user = await User.findOne({ username }).lean();

  if (!user)
    throw new NotFound({
      message: "user not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const myFollowingUser = await Follow.findOne({
    followingId: user?._id,
    followerId: loggedInUser?._id,
  });

  const relationship = {
    isFollowing: false,
    requestStatus: "none",
  };

  if (myFollowingUser) {
    relationship.isFollowing = true;
    relationship.requestStatus = myFollowingUser.status;
  }

  const [follower, following] = await Promise.all([
    Follow.countDocuments({ followingId: user._id, status: "accepted" }),
    Follow.countDocuments({ followerId: user._id, status: "accepted" }),
  ]);

  return { ...user, relationship, follower, following };
};
