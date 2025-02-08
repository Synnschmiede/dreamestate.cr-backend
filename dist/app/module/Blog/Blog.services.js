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
exports.BlogServices = void 0;
const common_1 = require("../../constants/common");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fieldValidityChecker_1 = __importDefault(require("../../utils/fieldValidityChecker"));
const generateSlug_1 = require("../../utils/generateSlug");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const User_constants_1 = require("../User/User.constants");
const Blog_constants_1 = require("./Blog.constants");
const createPost = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = (0, generateSlug_1.generateSlug)(data.title);
    const isExist = yield prisma_1.default.blog.findFirst({
        where: {
            slug
        }
    });
    if (isExist) {
        slug = `${slug}-${Date.now()}`;
    }
    const result = yield prisma_1.default.blog.create({
        data: Object.assign(Object.assign({}, data), { slug, author_id: user.id })
    });
    return result;
});
const getPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, sortBy, sortOrder, id, slug, featured } = query;
    if (sortBy) {
        (0, fieldValidityChecker_1.default)(Blog_constants_1.blogSortableFields, sortBy);
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
    if (featured) {
        andConditions.push({
            featured: Boolean(featured)
        });
    }
    if (searchTerm) {
        andConditions.push({
            OR: Blog_constants_1.blogSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const whereConditons = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.blog.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            author: {
                select: Object.assign({}, User_constants_1.userSelectedFields)
            }
        }
    });
    const total = yield prisma_1.default.blog.count({ where: whereConditons });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
});
const updatePost = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.title) {
        let slug = (0, generateSlug_1.generateSlug)(payload.title);
        const isExist = yield prisma_1.default.blog.findFirst({
            where: {
                slug
            }
        });
        if (isExist) {
            slug = `${slug}-${Date.now()}`;
        }
        payload.slug = slug;
    }
    const result = yield prisma_1.default.blog.update({
        where: {
            id,
        },
        data: payload,
        include: {
            author: {
                select: Object.assign({}, User_constants_1.userSelectedFields)
            }
        }
    });
    return result;
});
const deletePosts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ ids }) {
    const result = yield prisma_1.default.blog.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    return {
        deleted_count: result.count,
        message: `${result.count} post deleted successfully`
    };
});
exports.BlogServices = {
    createPost,
    getPosts,
    updatePost,
    deletePosts
};
