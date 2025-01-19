"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configureCors(req, callback) {
    const allowedDomains = ["https://wolf-studios-frontend.vercel.app"];
    const origin = req.headers.origin;
    const corsOptions = {
        origin: allowedDomains.includes(origin) || (origin === null || origin === void 0 ? void 0 : origin.includes("localhost")),
        credentials: true,
    };
    callback(null, corsOptions);
}
exports.default = configureCors;
