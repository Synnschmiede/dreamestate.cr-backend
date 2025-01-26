import { PropertyStatus, PropertyType } from "@prisma/client";
import { z } from "zod";

const propertyContactInfoSchema = z.object({
  name: z.string({ invalid_type_error: "Name should be a text" }),
  email: z.string().email("Invalid email"),
  phone: z
    .string({ invalid_type_error: "Phone number should be a text" })
    .optional(),
});

const propertyLocationSchema = z.object({
  city: z.string({ invalid_type_error: "City should be a text" }),
  state: z.string({ invalid_type_error: "State should be a text" }),
  country: z.string({ invalid_type_error: "Country should be a text" }),
  postal_code: z
    .string({ invalid_type_error: "Postal code should be a text" })
    .optional(),
  street: z.string({ invalid_type_error: "Address should be a text" }),
  latitude: z
    .number({ invalid_type_error: "Latitude should be a number" })
    .optional(),
  longitude: z
    .number({ invalid_type_error: "Longitude should be a number" })
    .optional(),
});

const propertyDetailsSchema = z.object({
  area_size: z
    .number({ invalid_type_error: "Size must be a number" })
    .min(0, "Size cannot be negative"),
  bedroom: z
    .number({ invalid_type_error: "Bedrooms must be a number" })
    .int()
    .min(0, "Bedrooms cannot be negative")
    .default(0),
  bathroom: z
    .number({ invalid_type_error: "Bathroom must be a number" })
    .int()
    .min(0, "Bathroom cannot be negative")
    .default(0),
  garage: z
    .number({ invalid_type_error: "Garage must be a number" })
    .int()
    .min(0, "Garage cannot be negative")
    .default(0),
  available_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Should be YYYY-MM-DD")
    .optional(),
  property_lot_size: z.string().optional(),
  year_build: z.string().optional(),
  structure_type: z.string().optional(),
  price_info: z.string().optional(),
  room: z.number().int().min(0, "Rooms cannot be negative").default(0),
  garage_size: z.string().optional(),
});

const propertyFeaturesSchema = z.object({
  interior_details: z.array(z.string()).optional(),
  outdoor_details: z.array(z.string()).optional(),
  utilities: z.array(z.string()).optional(),
  other_features: z.array(z.string()).optional(),
});

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ invalid_type_error: "Title must be a text" })
      .min(1, "Title is required"),
    description: z
      .string({ invalid_type_error: "Description must be a text" })
      .optional(),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price cannot be negative"),
    property_type: z
      .enum(Object.keys(PropertyType) as [string, ...string[]])
      .optional(),
    status: z
      .enum(Object.keys(PropertyStatus) as [string, ...string[]])
      .optional(),
    tags: z.array(z.string()).optional(),
    contact_info: propertyContactInfoSchema.optional(),
    location: propertyLocationSchema.optional(),
    property_details: propertyDetailsSchema.optional(),
    features: propertyFeaturesSchema.optional(),
    feature_image: z.string({ invalid_type_error: "Feature image should be a path/url" }).optional(),
    images: z.array(z.string({ invalid_type_error: "Image should be a path/url" })).optional()
  }),
});

const deletePropertyValidationSchema = z.object({
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

export const PropertyValidations = {
  createPropertyValidationSchema,
  deletePropertyValidationSchema
};
