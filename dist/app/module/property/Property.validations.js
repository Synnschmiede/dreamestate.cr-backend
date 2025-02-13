"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const propertyContactInfoSchema = zod_1.z.object({
    name: zod_1.z.string({ invalid_type_error: "Name should be a text", required_error: "Name is required" }),
    email: zod_1.z.string().email("Invalid email"),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number should be a text" })
        .optional(),
});
const updatePropertyContactInfoSchema = zod_1.z.object({
    name: zod_1.z.string({ invalid_type_error: "Name should be a text" }).nullable().optional(),
    email: zod_1.z.string().email("Invalid email").nullable().optional(),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number should be a text" })
        .nullable().optional(),
});
const propertyLocationSchema = zod_1.z.object({
    city: zod_1.z.string({ invalid_type_error: "City should be a text" }).optional(),
    state: zod_1.z.string({ invalid_type_error: "State should be a text" }).optional(),
    country: zod_1.z.string({ invalid_type_error: "Country should be a text" }).optional(),
    postal_code: zod_1.z
        .string({ invalid_type_error: "Postal code should be a text" })
        .optional(),
    street: zod_1.z.string({ invalid_type_error: "Address should be a text" }).optional(),
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
    parking_spot: zod_1.z
        .number({ invalid_type_error: "Parking spot must be a number" })
        .int()
        .min(0, "Parking spot cannot be negative")
        .default(0),
    available_from: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Should be YYYY-MM-DD")
        .optional(),
    property_lot_size: zod_1.z.string().optional(),
    year_build: zod_1.z.string().optional(),
    structure_type: zod_1.z.string().optional(),
    price_info: zod_1.z.string().optional(),
    room: zod_1.z.number().int().min(0, "Rooms cannot be negative").default(0)
});
const updatePropertyDetailsSchema = zod_1.z.object({
    area_size: zod_1.z
        .number({ invalid_type_error: "Size must be a number" })
        .min(0, "Size cannot be negative").nullable().optional(),
    bedroom: zod_1.z
        .number({ invalid_type_error: "Bedrooms must be a number" })
        .int()
        .min(0, "Bedrooms cannot be negative")
        .nullable().optional(),
    bathroom: zod_1.z
        .number({ invalid_type_error: "Bathroom must be a number" })
        .int()
        .min(0, "Bathroom cannot be negative")
        .nullable().optional(),
    parking_spot: zod_1.z
        .number({ invalid_type_error: "Parking spot must be a number" })
        .int()
        .min(0, "Parking spot cannot be negative")
        .nullable().optional(),
    available_from: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Should be YYYY-MM-DD")
        .nullable().optional(),
    property_lot_size: zod_1.z.string().nullable().optional(),
    year_build: zod_1.z.string().nullable().optional(),
    structure_type: zod_1.z.string().nullable().optional(),
    price_info: zod_1.z.string().nullable().optional(),
    room: zod_1.z.number().int().min(0, "Rooms cannot be negative").nullable().optional()
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
        tags: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Tag id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID")).optional(),
        contact_info: propertyContactInfoSchema,
        location: propertyLocationSchema.optional(),
        property_details: propertyDetailsSchema.optional(),
        features: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Feature id should be a text" })).optional(),
        feature_image: zod_1.z.string({ invalid_type_error: "Feature image should be a path/url" }).optional(),
        images: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Image should be a path/url" })).optional()
    }),
});
const updatePropertyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ invalid_type_error: "Title must be a text" }).nullable().optional(),
        description: zod_1.z
            .string({ invalid_type_error: "Description must be a text" })
            .nullable().optional(),
        price: zod_1.z
            .number({ invalid_type_error: "Price must be a number" })
            .nullable().optional(),
        property_type: zod_1.z
            .enum(Object.keys(client_1.PropertyType))
            .nullable().optional(),
        status: zod_1.z
            .enum(Object.keys(client_1.PropertyStatus))
            .nullable().optional(),
        tags: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Tag id should be a text" })).nullable().optional(),
        contact_info: updatePropertyContactInfoSchema.optional(),
        location: propertyLocationSchema.optional(),
        property_details: updatePropertyDetailsSchema.optional(),
        features: zod_1.z.array(zod_1.z
            .string({ invalid_type_error: "Feature id should be a text" })
            .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid ID")).nullable().optional(),
        feature_image: zod_1.z.string({ invalid_type_error: "Feature image should be a path/url" }).nullable().optional(),
        images: zod_1.z.array(zod_1.z.string({ invalid_type_error: "Image should be a path/url" })).nullable().optional()
    }),
});
const deletePropertyValidationSchema = zod_1.z.object({
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
exports.PropertyValidations = {
    createPropertyValidationSchema,
    deletePropertyValidationSchema,
    updatePropertyValidationSchema
};
