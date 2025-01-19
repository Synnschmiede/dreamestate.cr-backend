import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BlogServices } from "./Blog.services";

const createPost = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
    const result = await BlogServices.createPost(req.user as TAuthUser, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});

export const BlogControllers = {
    createPost
}