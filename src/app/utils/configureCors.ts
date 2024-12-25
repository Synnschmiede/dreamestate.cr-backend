function configureCors(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedDomains = ["https://wolf-studios-frontend.vercel.app"];
    if (
        origin &&
        (allowedDomains.includes(origin) || origin.includes("localhost"))
    ) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
}

export default configureCors; 