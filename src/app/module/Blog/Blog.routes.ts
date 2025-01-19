import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { BlogControllers } from "./Blog.controllers";

const router = Router();

router.post(
    "/post",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    BlogControllers.createPost
);

export const BlogRoutes = router;
