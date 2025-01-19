import { TAuthUser } from "../../interfaces/common"
import prisma from "../../shared/prisma"
import { generateSlug } from "../../utils/generateSlug"
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

export const BlogServices = {
    createPost
}