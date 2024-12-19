import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";
import { TPropertyFiles } from "./Property.interfaces";
import supabase from "../../shared/supabase";
import config from "../../config";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import prisma from "../../shared/prisma";

const createProperty = async (req: Request & { user?: TAuthUser }) => {
  const data = req.body;
  const files = req.files as TPropertyFiles;

  let feature_image;

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
    await prisma.image.create({
      data: {
        name: featureImage.originalname,
        path: data.path,
        bucket_id: data.id,
      },
    });
    feature_image = data.path;
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
    }
  }
  return feature_image;
};

export const PropertyServices = {
  createProperty,
};
