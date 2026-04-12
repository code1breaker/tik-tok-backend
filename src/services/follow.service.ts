// models
import Follow from "../models/follow.model.ts";

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
import { BadRequest } from "../utils/apiError.ts";

export const followUser = async ({ followingId, followerId }: FollowUserIf) => {
  const existingFollow = await Follow.findOne({
    followingId,
    followerId,
  });

  if (existingFollow) throw new BadRequest("user allready follow this account");

  await Follow.create({
    followerId,
    followingId,
  });
};

export const unFollowUser = async ({
  followingId,
  followerId,
}: FollowUserIf) => {
  const existingFollow = await Follow.findOne({
    followingId,
    followerId,
  });

  if (!existingFollow) throw new BadRequest("user don't follow this account");

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
  const existingFollow = await Follow.findOneAndUpdate(
    {
      followingId,
      followerId,
      status: "pending",
    },
    {
      status,
    },
  );

  if (!existingFollow) throw new BadRequest("user don't follow this account");
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
    .populate("followerId", "username firstname lastname");

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
    .populate("followingId", "username firstname lastname");

  const count = await Follow.countDocuments({
    followerId: userId,
    status: "pending",
  });

  return { user: existingFollow, count };
};

export const getFollower = async ({ userId, limit, page }: GetFollowerIf) => {
  const skip = (page - 1) * limit;

  const existingFollow = await Follow.find({
    followingId: userId,
    status: "accepted",
  })
    .skip(skip)
    .limit(limit)
    .populate("followerId", "username firstname lastname");

  const count = await Follow.countDocuments({
    followingId: userId,
    status: "accepted",
  });

  return { user: existingFollow, count };
};

export const getFollowing = async ({ userId, limit, page }: GetFollowingIf) => {
  const skip = (page - 1) * limit;

  const existingFollow = await Follow.find({
    followerId: userId,
    status: "accepted",
  })
    .skip(skip)
    .limit(limit)
    .populate("followingId", "username firs tname lastname");

  const count = await Follow.countDocuments({
    followerId: userId,
    status: "accepted",
  });

  return { user: existingFollow, count };
};
