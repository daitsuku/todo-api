import { Request, Response } from "express";
import * as commentService from "../services/commentService";

export const getCommentsByTaskId = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const comments = await commentService.getCommentsByTaskId(taskId);
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({
            error: error.message || "Failed to fetch comments",
        });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const taskId = parseInt(req.params.taskId);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const { comment } = req.body;
        const userId = req.userId!;

        if (!comment) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const newComment = await commentService.createComment(
            taskId,
            userId,
            comment
        );
        res.status(201).json(newComment);
    } catch (error: any) {
        if (error.message === "Task not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to create comment",
        });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const commentId = parseInt(req.params.id);

        if (isNaN(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const { comment } = req.body;
        const userId = req.userId!;

        if (!comment) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const updatedComment = await commentService.updateComment(
            commentId,
            userId,
            comment
        );
        res.status(200).json(updatedComment);
    } catch (error: any) {
        if (error.message === "Comment not found or not authorized") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to update comment",
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = parseInt(req.params.id);

        if (isNaN(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const userId = req.userId!;
        await commentService.deleteComment(commentId, userId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error: any) {
        if (error.message === "Comment not found or not authorized") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: error.message || "Failed to delete comment",
        });
    }
};
