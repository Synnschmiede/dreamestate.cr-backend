import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { RecordsServices } from "./Records.services";

const createRecord = catchAsync(async (req, res, next) => {
  const result = await RecordsServices.createRecord(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Data management record created successfully",
    data: result,
  });
});

const getRecords = catchAsync(async (req, res, next) => {
  const result = await RecordsServices.getRecords(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data management record retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const RecordsControllers = {
  createRecord,
  getRecords,
};
