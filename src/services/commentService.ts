import prisma from "../prisma/client";

export const getCommentsByTaskId = async (taskId: number) => {
    const comments = await prisma.comment.findMany({
        where: { taskId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return comments;
};

export const createComment = async (
    taskId: number,
    userId: number,
    comment: string
) => {
    // Verify task exists
    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    const newComment = await prisma.comment.create({
        data: {
            taskId,
            userId,
            comment,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return newComment;
};

export const updateComment = async (
    commentId: number,
    userId: number,
    comment: string
) => {
    // Verify comment belongs to the user
    const existingComment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            userId,
        },
    });

    if (!existingComment) {
        throw new Error("Comment not found or not authorized");
    }

    const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { comment },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return updatedComment;
};

export const deleteComment = async (commentId: number, userId: number) => {
    // Verify comment belongs to the user
    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            userId,
        },
    });

    if (!comment) {
        throw new Error("Comment not found or not authorized");
    }

    await prisma.comment.delete({
        where: { id: commentId },
    });

    return { success: true };
};
