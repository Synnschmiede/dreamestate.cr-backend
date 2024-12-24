import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";
import { IProperty, TPropertyFiles } from "./Property.interfaces";
import supabase from "../../shared/supabase";
import config from "../../config";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import prisma from "../../shared/prisma";
import { TImage } from "../Image/Image.interfaces";
import { generateSlug } from "../../utils/generateSlug";
import { Prisma, Property, PropertyStatus } from "@prisma/client";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import {
  propertySearchableFields,
  propertySortableFields,
} from "./Property.constants";
import { sortOrderType } from "../../constants/common";
import pagination from "../../utils/pagination";

const createProperty = async (req: Request & { user?: TAuthUser }) => {
  const data: IProperty = req.body;
  const files = req.files as TPropertyFiles;

  const { contact_info, location, features, property_details } = data;

  let feature_image;
  const images: TImage[] = [];
  const images_path: string[] = [];

  if (files.feature_image) {
    const featureImage = files.feature_image[0];
    const fileName = `${Date.now()}_${featureImage.originalname}`;
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
      name: featureImage.originalname,
      path: data.path,
      bucket_id: data.id,
    };
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Feature image is required");
  }

  if (files.images && files.images?.length > 0) {
    for (let i = 0; i < files.images.length; i++) {
      const file = files.images[i];
      const fileName = `${Date.now()}_${file.originalname}`;
      const { data } = await supabase.storage
        .from(config.supabase_bucket_name)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });
      if (data && data.id) {
        images.push({
          name: file.originalname,
          path: data.path,
          bucket_id: data.id,
        });
        images_path.push(data.path);
      }
    }
  }

  const propertyObj = {
    title: data.title,
    slug: generateSlug(data.title),
    price: data.price,
    user_id: req.user?.id || null,
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
    await tx.image.createMany({
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
  const { searchTerm, page, limit, sortBy, sortOrder, id, ...remainingQuery } =
    query;
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

  if (Object.keys(remainingQuery).length) {
    Object.keys(remainingQuery).forEach((key) => {
      andConditions.push({
        [key]: remainingQuery[key],
      });
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
