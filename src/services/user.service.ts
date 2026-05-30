// model
import User from "../models/user.model.ts";

// utils
import { NotFound } from "../utils/api-error.ts";

// constants
import ERROR_CODE from "../constants/error-code.ts";
import Follow from "../models/follow.model.ts";

export const getProfileByUsername = async ({
  username,
}: {
  username: string;
}) => {
  const user = await User.findOne({ username }).lean();

  if (!user)
    throw new NotFound({
      message: "user not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const [follower, following] = await Promise.all([
    Follow.countDocuments({ followingId: user._id, status: "accepted" }),
    Follow.countDocuments({ followerId: user._id, status: "accepted" }),
  ]);

  return { ...user, follower, following };
};
