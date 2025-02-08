"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Feature_controllers_1 = require("./Feature.controllers");
const Feature_validations_1 = require("./Feature.validations");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Feature_controllers_1.FeatureControllers.getFeatures);
router.post("/add-feature", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Feature_validations_1.FeatureValidations.addFeatureValidationSchema), Feature_controllers_1.FeatureControllers.addFeature);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Feature_validations_1.FeatureValidations.updateFeatureValidationSchema), Feature_controllers_1.FeatureControllers.updateFeature);
router.delete("/delete-features", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(Feature_validations_1.FeatureValidations.deleteFeaturesValidationSchema), Feature_controllers_1.FeatureControllers.deleteFeatures);
exports.FeatureRoutes = router;
