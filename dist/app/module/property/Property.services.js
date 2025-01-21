"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyServices = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../../constants/common");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const generateSlug_1 = require("../../utils/generateSlug");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Property_constants_1 = require("./Property.constants");
const createProperty = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { contact_info, location, features, property_details } = data;
    const propertyObj = {
        title: data.title,
        slug: (0, generateSlug_1.generateSlug)(data.title),
        price: data.price,
        user_id: (user === null || user === void 0 ? void 0 : user.id) || null,
        feature_image: data.feature_image || null,
        description: (data === null || data === void 0 ? void 0 : data.description) || null,
        property_type: (data === null || data === void 0 ? void 0 : data.property_type) || null,
        status: (data === null || data === void 0 ? void 0 : data.status) || client_1.PropertyStatus.AVAILABLE,
        images: data.images,
        tags: (data === null || data === void 0 ? void 0 : data.tags) || [],
        property_details: {
            area_size: property_details === null || property_details === void 0 ? void 0 : property_details.area_size,
            bedroom: property_details === null || property_details === void 0 ? void 0 : property_details.bedroom,
            bathroom: property_details === null || property_details === void 0 ? void 0 : property_details.bathroom,
            garage: property_details === null || property_details === void 0 ? void 0 : property_details.garage,
            available_from: property_details === null || property_details === void 0 ? void 0 : property_details.available_from,
            property_lot_size: property_details === null || property_details === void 0 ? void 0 : property_details.property_lot_size,
            year_build: property_details === null || property_details === void 0 ? void 0 : property_details.year_build,
            structure_type: property_details === null || property_details === void 0 ? void 0 : property_details.structure_type,
            price_info: property_details === null || property_details === void 0 ? void 0 : property_details.price_info,
            room: property_details === null || property_details === void 0 ? void 0 : property_details.room,
            garage_size: property_details === null || property_details === void 0 ? void 0 : property_details.garage_size,
        },
        features: {
            interior_details: features === null || features === void 0 ? void 0 : features.interior_details,
            outdoor_details: features === null || features === void 0 ? void 0 : features.outdoor_details,
            utilities: features === null || features === void 0 ? void 0 : features.utilities,
            other_features: features === null || features === void 0 ? void 0 : features.other_features,
        },
    };
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let createdContactInfo;
        if (contact_info) {
            createdContactInfo = yield tx.contactInfo.create({
                data: {
                    name: contact_info.name,
                    email: contact_info.email,
                    phone: contact_info.phone || null,
                },
            });
        }
        let createdLoacation;
        if (location) {
            createdLoacation = yield tx.location.create({
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
        const property = yield tx.property.create({
            data: Object.assign(Object.assign({}, propertyObj), { contact_info_id: (createdContactInfo === null || createdContactInfo === void 0 ? void 0 : createdContactInfo.id) || null, location_id: (createdLoacation === null || createdLoacation === void 0 ? void 0 : createdLoacation.id) || null }),
        });
        return Object.assign({}, property);
    }));
    return result;
});
const getProperties = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id, slug, category, city, } = query;
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(Property_constants_1.propertySortableFields, sortBy);
    }
    if (sortOrder) {
        (0, fieldValidityChecker_1.default)(common_1.sortOrderType, sortOrder);
    }
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [];
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
            OR: Property_constants_1.propertySearchableFields.map((field) => {
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
        const refineCategories = categories.filter((c) => c !== "ALL");
        andConditions.push({
            property_type: {
                in: refineCategories,
            },
        });
    }
    if (city && city !== "ALL") {
        const cities = city.split(",");
        const refineCities = cities.filter((c) => c !== "ALL");
        andConditions.push({
            location: {
                OR: refineCities.map((city) => ({
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
    const result = yield prisma_1.default.property.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        select: Object.assign({}, Property_constants_1.propertySelectedFields),
    });
    const total = yield prisma_1.default.property.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
exports.PropertyServices = {
    createProperty,
    getProperties,
};
