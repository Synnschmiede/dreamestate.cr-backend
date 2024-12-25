import { Request } from "express";

function configureCors(req: Request, callback: (error: Error | null, options: any) => void): void {
    const allowedDomains = ["https://wolf-studios-frontend.vercel.app"];
    const origin = req.headers.origin;
    const corsOptions = {
        origin: allowedDomains.includes(origin as string) || origin?.includes("localhost"),
        credentials: true,
    }
    callback(null, corsOptions);
}

export default configureCors; 