import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err.statusCode || 500;

    // Handle Prisma errors
    if (err.code === "P2002") {
        return res.status(409).json({
            error: "A resource with this unique constraint already exists",
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            error: "Resource not found",
        });
    }

    res.status(statusCode).json({
        error: err.message || "Something went wrong",
    });
};
