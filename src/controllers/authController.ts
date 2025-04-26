import { Request, Response } from "express";
import * as authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }

        const user = await authService.registerUser(email, password, name);
        res.status(201).json(user);
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: error.message || "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }

        const result = await authService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message || "Login failed" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const result = await authService.logoutUser(userId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Logout failed" });
    }
};

export const getTokenByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Check if user is requesting their own token or has admin privileges
        if (req.userId !== userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to access this token" });
        }

        const tokenData = await authService.getTokenByUserId(userId);
        res.status(200).json(tokenData);
    } catch (error: any) {
        if (error.message === "Token not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to retrieve token",
        });
    }
};
