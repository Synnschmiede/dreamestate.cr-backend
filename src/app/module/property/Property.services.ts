import prisma from "../../shared/prisma";
import { IProperty } from "./Property.interface";

const createProperty = async (payload: IProperty) => {
    const result = await prisma.properties.create({
        data: payload,
    });
    return result;
};



export const PropertyServices = {
    createProperty,
};