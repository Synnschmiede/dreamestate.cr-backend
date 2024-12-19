import prisma from "../../shared/prisma";
import { IProperty } from "./Property.interface";

const createProperty = async (payload: IProperty) => {
  console.log(payload);
};

export const PropertyServices = {
  createProperty,
};
