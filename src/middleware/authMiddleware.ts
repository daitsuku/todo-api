import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import environment from "../config/environment";

interface TokenPayload {
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            environment.JWT_SECRET
        ) as TokenPayload;

        // Check if token exists in database
        const tokenRecord = await prisma.token.findFirst({
            where: {
                userId: decoded.userId,
                token: token,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!tokenRecord) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Add user ID to request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication failed" });
    }
};
