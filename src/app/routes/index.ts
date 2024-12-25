import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { UserRoutes } from "../module/User/User.routes";
import { PropertyRoutes } from "../module/property/Property.routes";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/property",
    route: PropertyRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
