import prisma from "../../shared/prisma";
import { IProperty } from "./Property.interfaces";

const createProperty = async (payload: IProperty) => {
  // const result = await prisma.property.create(
  //   {
  //     data: payload
  //   }
  // )
};

export const PropertyServices = {
  createProperty,
};
