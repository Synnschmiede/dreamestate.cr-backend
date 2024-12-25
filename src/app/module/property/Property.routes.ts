import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PropertyValidations } from "./Property.validations";
import { PropertyControllers } from "./Property.controllers";
import { fileUploader } from "../../utils/fileUploader";
import validateFormData from "../../middlewares/validateFormData";

const router = Router();

router.get("/", PropertyControllers.getProperties);

router.post(
  "/add-property",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.multipleUpload.fields([
    { name: "feature_image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateFormData(PropertyValidations.createPropertyValidationSchema),
  PropertyControllers.createProperty
);

export const PropertyRoutes = router;
