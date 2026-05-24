// model
import User from "../models/user.model.ts";

// utils
import { NotFound } from "../utils/api-error.ts";

// constants
import ERROR_CODE from "../constants/error-code.ts";
import Follow from "../models/follow.model.ts";

export const getProfileById = async ({ userId }: { userId: any }) => {
  const [user, follower, following] = await Promise.all([
    User.findById(userId).lean(),
    Follow.countDocuments({ followingId: userId, status: "accepted" }),
    Follow.countDocuments({ followerId: userId, status: "accepted" }),
  ]);

  if (!user)
    throw new NotFound({
      message: "user not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  return { ...user, follower, following };
};
