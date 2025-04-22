import { Router } from "express";
import * as commentController from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get(
    "/task/:taskId",
    authMiddleware,
    commentController.getCommentsByTaskId
);
router.post("/task/:taskId", authMiddleware, commentController.createComment);
router.put("/:id", authMiddleware, commentController.updateComment);
router.delete("/:id", authMiddleware, commentController.deleteComment);

export default router;
