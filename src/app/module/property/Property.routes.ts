import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateFormData from "../../middlewares/validateFormData";
import { fileUploader } from "../../utils/fileUploader";
import { PropertyControllers } from "./Property.controllers";
import { PropertyValidations } from "./Property.validations";

const router = Router();

router.get("/", PropertyControllers.getProperties);

router.post(
  "/add-property",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.multipleUploadThroughApi.fields([
    { name: "feature_image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateFormData(PropertyValidations.createPropertyValidationSchema),
  PropertyControllers.createProperty
);

export const PropertyRoutes = router;
