import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../utils/pick";
import { propertyFilterableFields } from "./Property.constants";
import { PropertyServices } from "./Property.services";
import httpStatus from "http-status";

const createProperty = catchAsync(async (req, res, next) => {
  const result = await PropertyServices.createProperty(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property created successfully",
    data: result,
  });
});

const getProperties = catchAsync(async (req, res, next) => {
  const filteredQuery = pick(req.query, propertyFilterableFields);
  const result = await PropertyServices.getProperties(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

export const PropertyControllers = {
  createProperty,
  getProperties,
};
