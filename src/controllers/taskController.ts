import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        // Get all tasks or filter by current user
        const userOnly = req.query.mine === "true";
        const tasks = await taskService.getAllTasks(
            userOnly ? req.userId : undefined
        );
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({
            error: error.message || "Failed to fetch tasks",
        });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        // Include comments if requested
        const includeComments = req.query.comments === "true";
        const task = await taskService.getTaskById(taskId, includeComments);
        res.status(200).json(task);
    } catch (error: any) {
        if (error.message === "Task not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to fetch task",
        });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, duedate, piority } = req.body;
        const userId = req.userId!;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // Convert string date to Date object if provided
        const dueDateObj = duedate ? new Date(duedate) : undefined;

        const task = await taskService.createTask(
            title,
            userId,
            description,
            dueDateObj,
            piority
        );
        res.status(201).json(task);
    } catch (error: any) {
        res.status(500).json({
            error: error.message || "Failed to create task",
        });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const userId = req.userId!;
        const { title, description, status, piority } = req.body;

        const updatedTask = await taskService.updateTask(taskId, userId, {
            title,
            description,
            status,
            piority,
        });
        res.status(200).json(updatedTask);
    } catch (error: any) {
        if (error.message === "Task not found or not authorized") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to update task",
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const userId = req.userId!;
        await taskService.deleteTask(taskId, userId);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error: any) {
        if (error.message === "Task not found or not authorized") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to delete task",
        });
    }
};
