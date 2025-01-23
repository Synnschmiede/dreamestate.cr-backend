import { Prisma } from "@prisma/client"
import { sortOrderType } from "../../constants/common"
import { TAuthUser } from "../../interfaces/common"
import prisma from "../../shared/prisma"
import fieldValidityChecker from "../../utils/fieldValidityChecker"
import { generateSlug } from "../../utils/generateSlug"
import pagination from "../../utils/pagination"
import { userSelectedFields } from "../User/User.constants"
import { blogSearchableFields, blogSortableFields } from "./Blog.constants"
import { IBlog } from "./Blog.interfaces"

const createPost = async (user: TAuthUser, data: IBlog) => {
    let slug = generateSlug(data.title)
    const isExist = await prisma.blog.findFirst({
        where: {
            slug
        }
    })
    if (isExist) {
        slug = `${slug}-${Date.now()}`
    }
    const result = await prisma.blog.create({
        data: {
            ...data,
            slug,
            author_id: user.id
        }
    })
    return result
}


const getPosts = async (query: Record<string, any>) => {
    const {
        searchTerm,
        page,
        limit,
        sortBy,
        sortOrder,
        id,
        slug
    } = query;
    if (sortBy) {
        fieldValidityChecker(blogSortableFields, sortBy);
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

    const andConditions: Prisma.BlogWhereInput[] = [];

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
            OR: blogSearchableFields.map((field) => ({
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

    const result = await prisma.blog.findMany({
        where: whereConditons,
        skip,
        take: limitNumber,
        orderBy: {
            [sortWith]: sortSequence,
        },
        include: {
            author: {
                select: {
                    ...userSelectedFields
                }
            }
        }
    });

    const total = await prisma.blog.count({ where: whereConditons });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};

const updatePost = async (id: string, payload: Record<string, any>) => {
    if (payload.title) {
        let slug = generateSlug(payload.title)
        const isExist = await prisma.blog.findFirst({
            where: {
                slug
            }
        })
        if (isExist) {
            slug = `${slug}-${Date.now()}`
        }
        payload.slug = slug
    }
    const result = await prisma.blog.update({
        where: {
            id,
        },
        data: payload,
        include: {
            author: {
                select: {
                    ...userSelectedFields
                }
            }
        }
    });
    return result;
}

const deletePosts = async ({ ids }: { ids: string[] }) => {
    console.log(ids);
    const result = await prisma.blog.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    return {
        deleted_count: result.count,
        message: `${result.count} post deleted successfully`
    }
}

export const BlogServices = {
    createPost,
    getPosts,
    updatePost,
    deletePosts
}