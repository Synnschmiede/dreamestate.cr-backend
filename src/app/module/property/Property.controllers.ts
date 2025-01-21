import { Request } from "express";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PropertyServices } from "./Property.services";

const createProperty = catchAsync(async (req: Request & { user?: TAuthUser }, res, next) => {
  const result = await PropertyServices.createProperty(req.user as TAuthUser, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.getProperties(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PropertyControllers = {
  createProperty,
  getProperties,
};
