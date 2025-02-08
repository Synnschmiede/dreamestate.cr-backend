"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../module/Auth/Auth.routes");
const Blog_routes_1 = require("../module/Blog/Blog.routes");
const Feature_routes_1 = require("../module/Feature/Feature.routes");
const File_routes_1 = require("../module/File/File.routes");
const User_routes_1 = require("../module/User/User.routes");
const Property_routes_1 = require("../module/property/Property.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/auth",
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/property",
        route: Property_routes_1.PropertyRoutes,
    },
    {
        path: "/blog",
        route: Blog_routes_1.BlogRoutes,
    },
    {
        path: "/file",
        route: File_routes_1.FileRoutes,
    },
    {
        path: "/feature",
        route: Feature_routes_1.FeatureRoutes,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
