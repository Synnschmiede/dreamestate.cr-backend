import { z } from "zod";

const addFeatureValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
                message: "Title must be at most 100 characters long",
            }),
        type: z
            .string({ invalid_type_error: "Type should be a text" })
            .min(1, { message: "Type is required" })
            .max(50, {
                message: "Type must be at most 50 characters long",
            }),
    }).strict()
});

const updateFeatureValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
                message: "Title must be at most 100 characters long",
            }).optional(),
        type: z
            .string({ invalid_type_error: "Type should be a text" })
            .min(1, { message: "Type is required" })
            .max(50, {
                message: "Type must be at most 50 characters long",
            }).optional(),
    }).strict()
});

const deleteFeaturesValidationSchema = z.object({
    body: z
        .object({
            ids: z
                .array(
                    z
                        .string({ invalid_type_error: "Id should be a text" })
                        .regex(
                            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                            "Invalid ID"
                        )
                )
                .min(1, "Id is required"),
        })
        .strict(),
});

export const FeatureValidations = {
    addFeatureValidationSchema,
    deleteFeaturesValidationSchema,
    updateFeatureValidationSchema
}