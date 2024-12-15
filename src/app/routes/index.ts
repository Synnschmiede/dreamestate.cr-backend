import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { UserRoutes } from "../module/User/User.routes";
import { RecordsRoutes } from "../module/Records/Records.routes";
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
    path: "/record",
    route: RecordsRoutes,
  },
  {
    path: "/property",
    route: PropertyRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
