import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { FeatureServices } from "./Feature.services";

const addFeature = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.addFeature(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Feature created successfully",
        data: result,
    });
});

const getFeatures = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.getFeatures(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateFeature = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.updateFeature(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features updated successfully",
        data: result,
    });
});

const deleteFeatures = catchAsync(async (req, res, next) => {
    const result = await FeatureServices.deleteFeatures(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Features deleted successfully",
        data: result,
    });
});

export const FeatureControllers = {
    addFeature,
    getFeatures,
    updateFeature,
    deleteFeatures
};