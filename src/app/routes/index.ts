import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { UserRoutes } from "../module/User/User.routes";
import { RecordsRoutes } from "../module/Records/Records.routes";

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
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
