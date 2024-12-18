import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { RecordsControllers } from "./Records.controllers";
import { RecordsValidations } from "./Records.validations";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  RecordsControllers.getRecords
);

router.post(
  "/add-record",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(RecordsValidations.createRecordValidationSchema),
  RecordsControllers.createRecord
);

export const RecordsRoutes = router;
