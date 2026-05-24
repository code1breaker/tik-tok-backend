import type { NextFunction, Request, Response } from "express";

// service
import * as FollowService from "../services/follow.service.ts";
import { BadRequest } from "../utils/api-error.ts";
import apiResponse from "../utils/api-response.ts";
import ERROR_CODE from "../constants/error-code.ts";

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followingId = req.params.userId;
    const followerId = (req as any).user._id;

    if (!followingId) {
      throw new BadRequest({
        message: "Following id is missing",
        code: ERROR_CODE.FOLLOWING_ID_MISSING,
      });
    }

    if (followerId === followingId) {
      throw new BadRequest({
        message: "User cannot follow self",
        code: ERROR_CODE.CANNOT_FOLLOW_SELF,
      });
    }
    await FollowService.followUser({ followingId, followerId });

    apiResponse(res, {
      status: 200,
      message: "User follow successfully",
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

    if (!followingId) {
      throw new BadRequest({
        message: "Following id is missing",
        code: ERROR_CODE.FOLLOWING_ID_MISSING,
      });
    }

    if (followerId === followingId) {
      throw new BadRequest({
        message: "User cannot unfollow self",
        code: ERROR_CODE.CANNOT_UNFOLLOW_SELF,
      });
    }

    await FollowService.unFollowUser({ followingId, followerId });

    apiResponse(res, {
      status: 200,
      message: "User unfollow successfully",
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
    const followerId = req.params.userId;
    const followingId = (req as any).user._id;
    const { status } = req.body;
    if (!followerId) {
      throw new BadRequest({
        message: "followerId id is missing",
        code: ERROR_CODE.FOLLOWER_ID_MISSING,
      });
    }

    if (followerId === followingId) {
      throw new BadRequest({
        message: "User cannot update status",
        code: ERROR_CODE.INVALID_FOLLOW_REQUEST_STATE,
      });
    }

    await FollowService.updateFollowStatus({ followingId, followerId, status });

    apiResponse(res, {
      status: 200,
      message: "Update follow status successfully",
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

    apiResponse(res, {
      status: 200,
      message: "Fetch incoming follow request successfully",
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

    apiResponse(res, {
      status: 200,
      message: "Fetch outgoing follow request successfully",
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

    apiResponse(res, {
      status: 200,
      message: "Fetch follower successfully",
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
    apiResponse(res, {
      status: 200,
      message: "Fetch following successfully",
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
