import { z } from "zod";

const createPostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ invalid_type_error: "Title should be a text" })
            .min(1, { message: "Title is required" })
            .max(100, {
                message: "Title must be at most 100 characters long",
            }),
        content: z
            .string({ invalid_type_error: "Content should be a text" })
            .min(1, { message: "Content is required" }),
        tags: z.array(z.string({ invalid_type_error: "Tag should be a text" })).optional(),
        thumbnail: z.string({ invalid_type_error: "Thumbnail should be a path/url" }).optional(),
        images: z.array(z.string({ invalid_type_error: "Image should be a path/url" })).optional(),
    }).strict()
});

export const BlogValidations = {
    createPostValidationSchema
}