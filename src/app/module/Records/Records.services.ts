import { Prisma } from "@prisma/client";
import { sortOrderType } from "../../constants/common";
import prisma from "../../shared/prisma";
import fieldValidityChecker from "../../utils/fieldValidityChecker";
import pagination from "../../utils/pagination";
import {
  dataManagementSearchableFields,
  dataManagementSortableFields,
} from "./Records.constants";
import { TCreateRecordPayload } from "./Records.interface";

const createRecord = async (payload: TCreateRecordPayload) => {
  let month_uploaded = null;
  if (payload.month_uploaded)
    month_uploaded = new Date(payload.month_uploaded as string);
  const result = await prisma.records.create({
    data: {
      ...payload,
      month_uploaded: month_uploaded,
    },
  });
  return result;
};

const getRecords = async (query: Record<string, any>) => {
  const { searchTerm, page, limit, sortBy, sortOrder, id, ...remainingQuery } =
    query;
  if (sortBy) {
    fieldValidityChecker(dataManagementSortableFields, sortBy);
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

  const andConditions: Prisma.RecordsWhereInput[] = [];

  if (id)
    andConditions.push({
      id,
    });

  if (searchTerm) {
    andConditions.push({
      OR: dataManagementSearchableFields.map((field) => {
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

  const result = await prisma.records.findMany({
    where: whereConditons,
    skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
  });

  const total = await prisma.records.count({ where: whereConditons });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

export const RecordsServices = {
  createRecord,
  getRecords,
};
