import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({
            error: error.message || "Failed to fetch users",
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await userService.getUserById(userId);
        res.status(200).json(user);
    } catch (error: any) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to fetch user",
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Check if user is updating their own profile
        if (req.userId !== userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to update this user" });
        }

        const { email, name, password } = req.body;
        const updatedUser = await userService.updateUser(userId, {
            email,
            name,
            password,
        });

        res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }

        if (error.code === "P2002") {
            return res.status(409).json({ error: "Email already exists" });
        }

        res.status(500).json({
            error: error.message || "Failed to update user",
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Check if user is deleting their own account
        if (req.userId !== userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to delete this user" });
        }

        await userService.deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({
            error: error.message || "Failed to delete user",
        });
    }
};
