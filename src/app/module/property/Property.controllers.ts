import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PropertyServices } from "./Property.services";

const createProperty = catchAsync(async (req, res, next) => {
    const result = await PropertyServices.createProperty(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Property created successfully",
        data: result,
    });
});

export const PropertyControllers = {
    createProperty
};
