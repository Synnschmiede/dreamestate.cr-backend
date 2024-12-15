import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { PropertyValidations } from "./Property.validations";
import { PropertyControllers } from "./Property.controllers";

const router = Router();

router.post(
    "/add-property",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(PropertyValidations.createPropertyValidationSchema),
    PropertyControllers.createProperty
);

export const PropertyRoutes = router;