import { Prisma, PropertyStatus } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import sharp from "sharp";
import config from "../../config";
import { sortOrderType } from "../../constants/common";
import ApiError from "../../error/ApiError";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import supabase from "../../shared/supabase";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import {
  propertySearchableFields,
  propertySelectedFields,
  propertySortableFields,
} from "./Property.constants";
import { IProperty, TPropertyFiles } from "./Property.interfaces";

const createProperty = async (req: Request & { user?: TAuthUser }) => {
  const data: IProperty = req.body;
  const files = req.files as TPropertyFiles;
  const user = req.user as TAuthUser;

  const { contact_info, location, features, property_details } = data;

  let feature_image;
  const images: Prisma.FileCreateManyInput[] = [];
  const images_path: string[] = [];

  if (files.feature_image) {
    const featureImage = files.feature_image[0];
    const fileName = `${Date.now()}_${featureImage.originalname}`;
    const metadata = await sharp(featureImage.buffer).metadata();
    const { data } = await supabase.storage
      .from(config.supabase_bucket_name)
      .upload(fileName, featureImage.buffer, {
        contentType: featureImage.mimetype,
      });

    if (!data?.id) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload feature image"
      );
    }

    feature_image = {
      user_id: user.id,
      name: featureImage.originalname,
      alt_text: featureImage.originalname.replace(/\.[^/.]+$/, ""),
      type: featureImage.mimetype,
      size: featureImage.size,
      width: metadata.width || 0,
      height: metadata.height || 0,
      path: `/${config.supabase_bucket_name}/${data.path}`,
      bucket_id: data.id,
    };
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Feature image is required");
  }

  if (files.images && files.images?.length > 0) {
    for (let i = 0; i < files.images.length; i++) {
      const file = files.images[i];
      const fileName = `${Date.now()}_${file.originalname}`;
      const metadata = await sharp(file.buffer).metadata();
      const { data } = await supabase.storage
        .from(config.supabase_bucket_name)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });
      if (data && data.id) {
        images.push({
          user_id: user.id,
          name: file.originalname,
          alt_text: file.originalname.replace(/\.[^/.]+$/, ""),
          type: file.mimetype,
          size: file.size,
          width: metadata.width || 0,
          height: metadata.height || 0,
          path: `/${config.supabase_bucket_name}/${data.path}`,
          bucket_id: data.id,
        });
        images_path.push(`/${config.supabase_bucket_name}/${data.path}`);
      }
    }
  }

  const propertyObj = {
    title: data.title,
    slug: generateSlug(data.title),
    price: data.price,
    user_id: user?.id || null,
    feature_image: feature_image.path || null,
    description: data?.description || null,
    property_type: data?.property_type || null,
    status: data?.status || PropertyStatus.AVAILABLE,
    images: images_path,
    tags: data?.tags || [],
    property_details: {
      area_size: property_details?.area_size,
      bedroom: property_details?.bedroom,
      bathroom: property_details?.bathroom,
      garage: property_details?.garage,
      available_from: property_details?.available_from,
      property_lot_size: property_details?.property_lot_size,
      year_build: property_details?.year_build,
      structure_type: property_details?.structure_type,
      price_info: property_details?.price_info,
      room: property_details?.room,
      garage_size: property_details?.garage_size,
    },
    features: {
      interior_details: features?.interior_details,
      outdoor_details: features?.outdoor_details,
      utilities: features?.utilities,
      other_features: features?.other_features,
    },
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.file.createMany({
      data: [...images, feature_image],
    });

    let createdContactInfo;
    if (contact_info) {
      createdContactInfo = await tx.contactInfo.create({
        data: {
          name: contact_info.name,
          email: contact_info.email,
          phone: contact_info.phone || null,
        },
      });
    }

    let createdLoacation;
    if (location) {
      createdLoacation = await tx.location.create({
        data: {
          city: location.city,
          state: location.state,
          country: location.country,
          street: location.street,
          postal_code: location.postal_code || null,
          latitude: location.latitude || null,
          longitude: location.longitude || null,
        },
      });
    }

    const property = await tx.property.create({
      data: {
        ...propertyObj,
        contact_info_id: createdContactInfo?.id || null,
        location_id: createdLoacation?.id || null,
      },
    });

    return {
      ...property,
    };
  });

  return result;
};

const getProperties = async (query: Record<string, any>) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    id,
    slug,
    category,
    city,
  } = query;
  if (sortBy) {
    fieldValidityChecker(propertySortableFields, sortBy);
  }
  if (sortOrder) {
    fieldValidityChecker(sortOrderType, sortOrder);
  }

  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (id)
    andConditions.push({
      id,
    });

  if (slug)
    andConditions.push({
      slug,
    });

  if (searchTerm) {
    andConditions.push({
      OR: propertySearchableFields.map((field) => {
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (category && category !== "ALL") {
    const categories = category.split(",");
    const refineCategories = categories.filter((c: string) => c !== "ALL");
    andConditions.push({
      property_type: {
        in: refineCategories,
      },
    });
  }

  if (city && city !== "ALL") {
    const cities = city.split(",");
    const refineCities = cities.filter((c: string) => c !== "ALL");
    andConditions.push({
      location: {
        OR: refineCities.map((city: string) => ({
          city: {
            contains: city,
            mode: "insensitive",
          },
        })),
      },
    });
  }

  const whereConditons = {
    AND: andConditions,
  };

  const result = await prisma.property.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
    select: {
      ...propertySelectedFields,
    },
  });

  const total = await prisma.property.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

export const PropertyServices = {
  createProperty,
  getProperties,
};
