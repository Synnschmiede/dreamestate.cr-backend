"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureValidations = void 0;
const zod_1 = require("zod");
const addFeatureValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
            message: "Title must be at most 100 characters long",
        }),
        type: zod_1.z
            .string({ invalid_type_error: "Type should be a text" })
            .min(1, { message: "Type is required" })
            .max(50, {
            message: "Type must be at most 50 characters long",
        }),
    }).strict()
});
const updateFeatureValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
            message: "Title must be at most 100 characters long",
        }).optional(),
        type: zod_1.z
            .string({ invalid_type_error: "Type should be a text" })
            .min(1, { message: "Type is required" })
            .max(50, {
            message: "Type must be at most 50 characters long",
        }).optional(),
    }).strict()
});
const deleteFeaturesValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        ids: zod_1.z
            .array(zod_1.z
            .string({ invalid_type_error: "Id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID"))
            .min(1, "Id is required"),
    })
        .strict(),
});
exports.FeatureValidations = {
    addFeatureValidationSchema,
    deleteFeaturesValidationSchema,
    updateFeatureValidationSchema
};
