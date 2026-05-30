// models
import ERROR_CODE from "../constants/error-code.ts";
import Follow from "../models/follow.model.ts";
import User from "../models/user.model.ts";

// types
import type {
  FollowUserIf,
  GetFollowerIf,
  GetFollowingIf,
  IncomingFollowRequestIf,
  OutgoingFollowRequestIf,
  UpdateFollowStatusIf,
} from "../types/services/follow.types.ts";

// utils
import { BadRequest, NotFound } from "../utils/api-error.ts";

export const followUser = async ({ followingId, followerId }: FollowUserIf) => {
  const user = await User.findById(followingId);
  if (!user || (!user.isEmailVerified && !user.isPhoneVerified))
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const existingFollow = await Follow.findOne({
    followingId,
    followerId,
  });

  if (existingFollow)
    throw new BadRequest({
      message: "User allready follow this account",
      code: ERROR_CODE.ALREADY_FOLLOWING,
    });

  const followUser = await Follow.create({
    followerId,
    followingId,
  });

  return followUser;
};

export const unFollowUser = async ({
  followingId,
  followerId,
}: FollowUserIf) => {
  const user = await User.findById(followingId);
  if (!user || (!user.isEmailVerified && !user.isPhoneVerified))
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const existingFollow = await Follow.findOne({
    followingId,
    followerId,
  });
  if (!existingFollow) {
    throw new BadRequest({
      message: "user doesn't follow this account",
      code: ERROR_CODE.NOT_FOLLOWING,
    });
  }
  await Follow.deleteOne({
    followerId,
    followingId,
  });
};

export const updateFollowStatus = async ({
  followingId,
  followerId,
  status,
}: UpdateFollowStatusIf) => {
  const user = await User.findById(followingId);
  if (!user || (!user.isEmailVerified && !user.isPhoneVerified))
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const existingFollow = await Follow.findOneAndUpdate(
    {
      followingId,
      followerId,
      status: "pending",
    },
    {
      status,
    },
    { new: true },
  );

  if (!existingFollow) {
    throw new BadRequest({
      message: "No follow request with status 'pending' found for this user",
      code: ERROR_CODE.NO_FOLLOW_REQUEST,
    });
  }
};

export const incomingFollowRequest = async ({
  userId,
  limit,
  page,
}: IncomingFollowRequestIf) => {
  const skip = (page - 1) * limit;

  const existingFollow = await Follow.find({
    followingId: userId,
    status: "pending",
  })
    .skip(skip)
    .limit(limit)
    .populate("followerId", "username fullname");

  const count = await Follow.countDocuments({
    followingId: userId,
    status: "pending",
  });

  return { user: existingFollow, count };
};

export const outgoingFollowRequest = async ({
  userId,
  limit,
  page,
}: OutgoingFollowRequestIf) => {
  const skip = (page - 1) * limit;
  const existingFollow = await Follow.find({
    followerId: userId,
    status: "pending",
  })
    .skip(skip)
    .limit(limit)
    .populate("followingId", "username fullname");

  const count = await Follow.countDocuments({
    followerId: userId,
    status: "pending",
  });

  return { user: existingFollow, count };
};

export const getFollower = async ({
  loggedInUserId,
  username,
  limit,
  page,
}: GetFollowerIf) => {
  const skip = (page - 1) * limit;
  const targetUser = await User.findOne({ username });

  if (!targetUser)
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const count = await Follow.countDocuments({
    followingId: targetUser._id,
    status: "accepted",
  });

  const targetUserFollower = await Follow.find({
    followingId: targetUser._id,
    status: "accepted",
  })
    .skip(skip)
    .limit(limit)
    .lean()
    .select("followerId")
    .populate("followerId", "username fullname photoUrl");

  if (targetUser._id.toString() === loggedInUserId) {
    return { user: targetUserFollower, count };
  }

  const followerIds = targetUserFollower.map((item) =>
    item.followerId._id?.toString(),
  );

  const myFollowing = await Follow.find({
    followerId: loggedInUserId,
    followingId: { $in: followerIds },
  })
    .select("followingId status")
    .populate("followingId", "username fullname");

  const targetFollowers = targetUserFollower?.map((targetFollower) => {
    const relationship = {
      isFollowing: false,
      requestStatus: "none",
    };

    const targetUserFollowerId = targetFollower.followerId._id;

    const myFollowingUser = myFollowing?.find((myFollowingUser) =>
      targetUserFollowerId.equals(myFollowingUser.followingId._id),
    );

    if (myFollowingUser) {
      relationship.isFollowing = true;
      relationship.requestStatus = myFollowingUser.status;
    }

    return { ...targetFollower, relationship };
  });

  return { user: targetFollowers, count };
};

export const getFollowing = async ({
  loggedInUserId,
  username,
  limit,
  page,
}: GetFollowingIf) => {
  const skip = (page - 1) * limit;
  const targetUser = await User.findOne({ username });

  if (!targetUser)
    throw new NotFound({
      message: "User not found",
      code: ERROR_CODE.USER_NOT_FOUND,
    });

  const count = await Follow.countDocuments({
    followerId: targetUser._id,
    status: "accepted",
  });

  const targetUserFollowing = await Follow.find({
    followerId: targetUser._id,
    status: "accepted",
  })
    .skip(skip)
    .limit(limit)
    .lean()
    .select("followingId")
    .populate("followingId", "username fullname photoUrl");

  if (targetUser._id.toString() === loggedInUserId) {
    return { user: targetUserFollowing, count };
  }

  const followingIds = targetUserFollowing.map((item) =>
    item.followingId._id?.toString(),
  );

  const myFollowing = await Follow.find({
    followerId: loggedInUserId,
    followingId: { $in: followingIds },
  })
    .select("followingId status")
    .populate("followingId", "username fullname");

  const targetFollowing = targetUserFollowing?.map((targetFollowing) => {
    const relationship = {
      isFollowing: false,
      requestStatus: "none",
    };

    const targetUserFollowingId = targetFollowing.followingId._id;

    const myFollowingUser = myFollowing?.find((myFollowingUser) =>
      targetUserFollowingId.equals(myFollowingUser.followingId._id),
    );

    if (myFollowingUser) {
      relationship.isFollowing = true;
      relationship.requestStatus = myFollowingUser.status;
    }

    return { ...targetFollowing, relationship };
  });

  return { user: targetFollowing, count };
};
