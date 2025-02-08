import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FeatureControllers } from "./Feature.controllers";
import { FeatureValidations } from "./Feature.validations";

const router = Router();

router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    FeatureControllers.getFeatures
);

router.post(
    "/add-feature",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.addFeatureValidationSchema),
    FeatureControllers.addFeature
);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.updateFeatureValidationSchema),
    FeatureControllers.updateFeature
);

router.delete(
    "/delete-features",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(FeatureValidations.deleteFeaturesValidationSchema),
    FeatureControllers.deleteFeatures
);

export const FeatureRoutes = router;
