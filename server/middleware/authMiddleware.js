// export function authMiddleware(req, res, next){
//     const token = req.cookies.token;

//     if(!token){
//         return res.status(401).json({ error: "Access denied. No session token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
//         req.user = decoded;
//         next()
//     } catch (err) {
//         return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });

//     }
// }

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function authMiddleware(req, res, next) {
    const token = req.cookies.token;

  
    if (!token) {
        return res.status(401).json({
            error: "Access denied. No session token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        console.log("JWT VERIFY ERROR:", err.message);

        return res.status(401).json({
            error: "Session expired or invalid. Please sign in again."
        });
    }
}