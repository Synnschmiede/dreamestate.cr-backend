"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const propertyContactInfoSchema = zod_1.z.object({
    name: zod_1.z.string({ invalid_type_error: "Name should be a text" }),
    email: zod_1.z.string().email("Invalid email"),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number should be a text" })
        .optional(),
});
const propertyLocationSchema = zod_1.z.object({
    city: zod_1.z.string({ invalid_type_error: "City should be a text" }),
    state: zod_1.z.string({ invalid_type_error: "State should be a text" }),
    country: zod_1.z.string({ invalid_type_error: "Country should be a text" }),
    postal_code: zod_1.z
        .string({ invalid_type_error: "Postal code should be a text" })
        .optional(),
    street: zod_1.z.string({ invalid_type_error: "Address should be a text" }),
    latitude: zod_1.z
        .number({ invalid_type_error: "Latitude should be a number" })
        .optional(),
    longitude: zod_1.z
        .number({ invalid_type_error: "Longitude should be a number" })
        .optional(),
});
const propertyDetailsSchema = zod_1.z.object({
    area_size: zod_1.z
        .number({ invalid_type_error: "Size must be a number" })
        .min(0, "Size cannot be negative"),
    bedroom: zod_1.z
        .number({ invalid_type_error: "Bedrooms must be a number" })
        .int()
        .min(0, "Bedrooms cannot be negative")
        .default(0),
    bathroom: zod_1.z
        .number({ invalid_type_error: "Bathroom must be a number" })
        .int()
        .min(0, "Bathroom cannot be negative")
        .default(0),
    garage: zod_1.z
        .number({ invalid_type_error: "Garage must be a number" })
        .int()
        .min(0, "Garage cannot be negative")
        .default(0),
    available_from: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Should be YYYY-MM-DD")
        .optional(),
    property_lot_size: zod_1.z.string().optional(),
    year_build: zod_1.z.string().optional(),
    structure_type: zod_1.z.string().optional(),
    price_info: zod_1.z.string().optional(),
    room: zod_1.z.number().int().min(0, "Rooms cannot be negative").default(0),
    garage_size: zod_1.z.string().optional(),
});
const propertyFeaturesSchema = zod_1.z.object({
    interior_details: zod_1.z.array(zod_1.z.string()).optional(),
    outdoor_details: zod_1.z.array(zod_1.z.string()).optional(),
    utilities: zod_1.z.array(zod_1.z.string()).optional(),
    other_features: zod_1.z.array(zod_1.z.string()).optional(),
});
const createPropertyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title must be a text" })
            .min(1, "Title is required"),
        description: zod_1.z
            .string({ invalid_type_error: "Description must be a text" })
            .optional(),
        price: zod_1.z
            .number({ invalid_type_error: "Price must be a number" })
            .min(0, "Price cannot be negative"),
        property_type: zod_1.z
            .enum(Object.keys(client_1.PropertyType))
            .optional(),
        status: zod_1.z
            .enum(Object.keys(client_1.PropertyStatus))
            .optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        contact_info: propertyContactInfoSchema.optional(),
        location: propertyLocationSchema.optional(),
        property_details: propertyDetailsSchema.optional(),
        features: propertyFeaturesSchema.optional(),
        feature_image: zod_1.z.string({ invalid_type_error: "Feature image should be a path/url" }).optional(),
        images: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Image should be a path/url" })).optional()
    }),
});
exports.PropertyValidations = {
    createPropertyValidationSchema,
};
