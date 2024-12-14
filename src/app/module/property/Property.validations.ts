import { z } from "zod";

const propertyLocationSchema = z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

const propertyContactInfoSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
});

const propertyOverviewSchema = z.object({
    updated_on: z.string(),
    bedrooms: z.number().int().min(0, "Bedrooms cannot be negative"),
    bathrooms: z.number().int().min(0, "Bathrooms cannot be negative"),
    area_size: z.number().int().min(0, "Area size cannot be negative"),
    garage: z.number().int().min(0, "Garage cannot be negative"),
});

const propertyDetailsSchema = z.object({
    id: z.string(),
    size: z.number().min(0, "Size cannot be negative"),
    bedrooms: z.number().int().min(0, "Bedrooms cannot be negative"),
    garage: z.number().int().min(0, "Garage cannot be negative"),
    available_from: z.string(),
    price: z.number().min(0, "Price cannot be negative"),
    property_lot_size: z.string(),
    bathrooms: z.string(),
    year_build: z.string(),
    structure_type: z.string(),
    price_info: z.string(),
    rooms: z.number().int().min(0, "Rooms cannot be negative"),
    garage_size: z.string(),
});

const propertyFeaturesSchema = z.object({
    interior_details: z.array(z.string()),
    outdoor_details: z.array(z.string()),
    utilities: z.array(z.string()),
    other_features: z.array(z.string()),
});

const createPropertyValidationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price cannot be negative"),
    property_type: z.enum(["APARTMENT", "HOUSE", "CONDO", "VILLA", "LAND"]),
    status: z.enum(["AVAILABLE", "SOLD", "RENTED"]),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    overview: propertyOverviewSchema.optional(),
    contactInfo: propertyContactInfoSchema,
    documents: z.array(z.string()).optional(),
    location: propertyLocationSchema.optional(),
    property_details: propertyDetailsSchema.optional(),
    features: propertyFeaturesSchema.optional(),
});

export const PropertyValidations = {
    createPropertyValidationSchema,
};
