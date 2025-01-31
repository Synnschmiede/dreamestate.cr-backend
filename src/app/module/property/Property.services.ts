import { Prisma, PropertyStatus } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import { generateSlug } from "../../utils/generateSlug";
import pagination from "../../utils/pagination";
import {
  propertySearchableFields,
  propertySelectedFields,
  propertySortableFields,
} from "./Property.constants";
import { IProperty } from "./Property.interfaces";

const createProperty = async (user: TAuthUser, data: IProperty) => {
  const { contact_info, location, features, property_details } = data;

  const propertyObj = {
    title: data.title,
    slug: generateSlug(data.title),
    price: data.price,
    user_id: user?.id || null,
    feature_image: data.feature_image || null,
    description: data?.description || null,
    property_type: data?.property_type || null,
    status: data?.status || PropertyStatus.AVAILABLE,
    images: data.images,
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

const deleteProperties = async ({ ids }: { ids: string[] }) => {
  const result = await prisma.property.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
  return {
    deleted_count: result.count,
    message: `${result.count} property deleted successfully`
  }
}

export const PropertyServices = {
  createProperty,
  getProperties,
  deleteProperties
};
