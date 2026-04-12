import type { NextFunction, Request, Response } from "express";

// service
import * as FollowService from "../services/follow.service.ts";
import { BadRequest } from "../utils/apiError.ts";

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followingId = req.params.userId;
    const followerId = (req as any).user._id;

    if (!followingId) throw new BadRequest("following id is missing");
    if (followerId === followingId)
      throw new BadRequest("user cannot follow self");

    await FollowService.followUser({ followingId, followerId });

    return res.status(200).json({
      success: true,
      message: "user follow successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const unFollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followingId = req.params.userId;
    const followerId = (req as any).user._id;

    if (!followingId) throw new BadRequest("following id is missing");
    if (followerId === followingId)
      throw new BadRequest("user cannot unfollow self");

    await FollowService.unFollowUser({ followingId, followerId });

    return res.status(200).json({
      success: true,
      message: "user unfollow successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateFollowStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followingId = req.params.userId;
    const followerId = (req as any).user._id;
    const { status } = req.body;

    if (!followingId) throw new BadRequest("following id is missing");
    if (followerId === followingId)
      throw new BadRequest("user cannot unfollow self");

    await FollowService.updateFollowStatus({ followingId, followerId, status });

    return res.status(200).json({
      success: true,
      message: "update follow status successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const incomingFollowRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user._id;
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    const { user, count } = await FollowService.incomingFollowRequest({
      userId,
      limit,
      page,
    });

    return res.status(200).json({
      success: true,
      message: "fetch incoming follow request successfully",
      data: user,
      pagination: {
        limit,
        page,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const outgoingFollowRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user._id;
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    const { user, count } = await FollowService.outgoingFollowRequest({
      userId,
      limit,
      page,
    });
    return res.status(200).json({
      success: true,
      message: "fetch outgoing follow request successfully",
      data: user,
      pagination: {
        limit,
        page,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFollower = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user._id;
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    const { user, count } = await FollowService.getFollower({
      userId,
      limit,
      page,
    });

    return res.status(200).json({
      success: true,
      message: "fetch follower successfully",
      data: user,
      pagination: {
        limit,
        page,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user._id;
    const limit = Number(req.query.limit ?? 10);
    const page = Number(req.query.page ?? 1);

    const { user, count } = await FollowService.getFollowing({
      userId,
      limit,
      page,
    });
    return res.status(200).json({
      success: true,
      message: "fetch following successfully",
      data: user,
      pagination: {
        limit,
        page,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
