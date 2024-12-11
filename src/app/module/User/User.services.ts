import { Prisma, UserStatus } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import ApiError from "../../error/ApiError";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import {
  userSearchableFields,
  userSelectedFields,
  userSortableFields,
} from "./User.constants";
import prisma from "../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../utils/fileUploader";
import { TImage } from "../Image/Image.interfaces";

const getUsers = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id, ...remainingQuery } =
    query;
  if (sortBy) {
    fieldValidityChecker(userSortableFields, sortBy);
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

  const andConditions: Prisma.UserWhereInput[] = [{ is_deleted: false }];

  if (id)
    andConditions.push({
      id,
    });

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => {
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

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
    select: {
      ...userSelectedFields,
    },
  });

  const total = await prisma.user.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

const getMe = async (user: TAuthUser | undefined) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
    select: {
      ...userSelectedFields,
    },
  });

  return result;
};

const updateProfile = async (
  user: TAuthUser | undefined,
  payload: Record<string, any>,
  file: TFile | undefined
) => {
  const image: Record<string, any> = {};
  if (file) {
    const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
        id: user?.id,
      },
      select: {
        profile_pic: true,
      },
    });

    if (userInfo.profile_pic) {
      const profile_pic_info = await prisma.image.findFirst({
        where: {
          path: userInfo.profile_pic,
        },
      });
      if (profile_pic_info) {
        await fileUploader.deleteToCloudinary([profile_pic_info.cloud_id]);
        await prisma.image.delete({
          where: {
            id: profile_pic_info.id,
          },
        });
      }
    }

    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cludinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    image["path"] = cludinaryResponse?.secure_url as string;
    image["cloud_id"] = cludinaryResponse?.public_id as string;
    image["name"] = file.originalname;
  }

  let profilePic;

  if (image.path && image.cloud_id) {
    profilePic = await prisma.image.create({
      data: image as TImage,
    });
  }

  if (profilePic?.id) {
    payload.profile_pic = profilePic.path;
  }

  const result = prisma.user.update({
    where: {
      id: user?.id,
    },
    data: payload,
    select: {
      ...userSelectedFields,
    },
  });

  return result;
};

const updateUser = async (id: string, payload: Record<string, any>) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      ...userSelectedFields,
    },
  });
  return result;
};

export const UserServices = {
  updateUser,
  getUsers,
  getMe,
  updateProfile,
};
