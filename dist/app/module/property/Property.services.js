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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyServices = void 0;
const common_1 = require("../../constants/common");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const generateSlug_1 = require("../../utils/generateSlug");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Property_constants_1 = require("./Property.constants");
const createProperty = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const property = {
        user_id: user.id,
        title: data.title,
        slug: (0, generateSlug_1.generateSlug)(data.title),
        description: data.description || null,
        feature_image: data.feature_image || null,
        property_type: data.property_type || null,
        price: data.price,
    };
    if (data.status) {
        property.status = data.status;
    }
    if (data.images && data.images.length > 0) {
        property.images = data.images;
    }
    if (data.tags && data.tags.length > 0) {
        property.tags = data.tags;
    }
    if (data.features && data.features.length > 0) {
        property.features = data.features;
    }
    if (data.property_details) {
        property.property_details = data.property_details;
    }
    if (data.location) {
        property.location = data.location;
    }
    const contactInfo = yield prisma_1.default.contactInfo.upsert({
        where: {
            email: data.contact_info.email
        },
        update: {
            name: data.contact_info.name,
            email: data.contact_info.email,
            phone: data.contact_info.phone
        },
        create: {
            name: data.contact_info.name,
            email: data.contact_info.email,
            phone: ((_a = data.contact_info) === null || _a === void 0 ? void 0 : _a.phone) || null
        }
    });
    if (contactInfo.id) {
        property.contact_info_id = contactInfo.id;
    }
    const tags = ((_b = data.tags) === null || _b === void 0 ? void 0 : _b.filter((t) => common_1.uuidRegex.test(t))) || [];
    if (data.tags && ((_c = data.tags) === null || _c === void 0 ? void 0 : _c.length) !== tags.length) {
        const newTags = data.tags.filter((t) => !common_1.uuidRegex.test(t));
        if (newTags.length) {
            yield prisma_1.default.tag.createMany({
                data: newTags.map((t) => ({ name: t }))
            });
            const addedTags = yield prisma_1.default.tag.findMany({
                where: {
                    name: {
                        in: newTags
                    }
                }
            });
            addedTags.forEach((newTag) => tags.push(newTag.id));
        }
    }
    const result = yield prisma_1.default.property.create({
        data: Object.assign(Object.assign({}, property), { tags: {
                connect: tags === null || tags === void 0 ? void 0 : tags.map((tagId) => ({ id: tagId }))
            }, features: {
                connect: (_d = data.features) === null || _d === void 0 ? void 0 : _d.map((featureId) => ({ id: featureId }))
            } })
    });
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
    // if (city && city !== "ALL") {
    //   const cities = city.split(",");
    //   const refineCities = cities.filter((c: string) => c !== "ALL");
    //   andConditions.push({
    //     location: {
    //       OR: refineCities.map((city: string) => ({
    //         city: {
    //           contains: city,
    //           mode: "insensitive",
    //         },
    //       })),
    //     },
    //   });
    // }
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
    const formattedResult = result.map((item) => (Object.assign(Object.assign({}, item), { tags: item.tags.map(tag => tag.name), features: item.features.reduce((acc, feature) => {
            const group = acc.find((g) => g.group_name === feature.feature_group.name);
            if (group) {
                group.features.push(feature.name);
            }
            else {
                acc.push({
                    group_name: feature.feature_group.name,
                    features: [feature.name]
                });
            }
            return acc;
        }, []) })));
    const total = yield prisma_1.default.property.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: formattedResult,
    };
});
const getSingleProperty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield prisma_1.default.property.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            tags: true,
            features: true,
            contact_info: true
        }
    });
    const formattedResult = Object.assign(Object.assign({}, result), { tags: (_a = result.tags) === null || _a === void 0 ? void 0 : _a.map(tag => tag.id) });
    return formattedResult;
});
const updateProperty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { contact_info, tags: inputTags, features, created_at, updated_at } = payload, rest = __rest(payload, ["contact_info", "tags", "features", "created_at", "updated_at"]);
    const property = yield prisma_1.default.property.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            contact_info: true
        }
    });
    if ((contact_info === null || contact_info === void 0 ? void 0 : contact_info.email) && (contact_info === null || contact_info === void 0 ? void 0 : contact_info.email) !== ((_a = property.contact_info) === null || _a === void 0 ? void 0 : _a.email)) {
        const contactInfo = yield prisma_1.default.contactInfo.upsert({
            where: {
                email: payload.contact_info.email
            },
            update: {
                name: payload.contact_info.name,
                email: payload.contact_info.email,
                phone: payload.contact_info.phone
            },
            create: {
                name: payload.contact_info.name,
                email: payload.contact_info.email,
                phone: ((_b = payload.contact_info) === null || _b === void 0 ? void 0 : _b.phone) || null
            }
        });
        if (contactInfo.id) {
            payload.contact_info_id = contactInfo.id;
        }
    }
    if (payload.title && payload.title !== property.title) {
        payload.slug = (0, generateSlug_1.generateSlug)(payload.title);
    }
    const tags = (inputTags === null || inputTags === void 0 ? void 0 : inputTags.filter((t) => common_1.uuidRegex.test(t))) || [];
    if (inputTags && (inputTags === null || inputTags === void 0 ? void 0 : inputTags.length) !== tags.length) {
        const newTags = inputTags.filter((t) => !common_1.uuidRegex.test(t));
        if (newTags.length) {
            yield prisma_1.default.tag.createMany({
                data: newTags.map((t) => ({ name: t }))
            });
            const addedTags = yield prisma_1.default.tag.findMany({
                where: {
                    name: {
                        in: newTags
                    }
                }
            });
            addedTags.forEach((newTag) => tags.push(newTag.id));
        }
    }
    const result = yield prisma_1.default.property.update({
        where: {
            id
        },
        data: Object.assign(Object.assign(Object.assign({}, rest), (tags && tags.length > 0) && {
            tags: {
                set: tags.map((tagId) => ({ id: tagId }))
            }
        }), (features && features.length > 0) && {
            features: {
                set: features.map((featureId) => ({ id: featureId }))
            }
        })
    });
    return result;
});
const deleteProperties = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const result = yield prisma_1.default.property.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return {
        deleted_count: result.count,
        message: `${result.count} property deleted successfully`
    };
});
exports.PropertyServices = {
    createProperty,
    getProperties,
    deleteProperties,
    updateProperty,
    getSingleProperty
};
