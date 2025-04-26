import prisma from "../prisma/client";

export const getAllTasks = async (userId?: number) => {
    const tasks = await prisma.task.findMany({
        where: userId ? { userId } : undefined,
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

    return tasks;
};

export const getTaskById = async (
    taskId: number,
    includeComments: boolean = false
) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            comments: includeComments
                ? {
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
                  }
                : false,
        },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    return task;
};

export const createTask = async (
    title: string,
    userId: number,
    description?: string,
    duedate?: Date,
    priority?: string
) => {
    const task = await prisma.task.create({
        data: {
            title,
            description,
            userId,
            duedate,
            piority: priority,
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

    return task;
};

export const updateTask = async (
    taskId: number,
    userId: number,
    data: {
        title?: string;
        description?: string;
        status?: string;
        piority?: string;
    }
) => {
    // Verify task belongs to the user
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });

    if (!task) {
        throw new Error("Task not found or not authorized");
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data,
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

    return updatedTask;
};

export const deleteTask = async (taskId: number, userId: number) => {
    // Verify task belongs to the user
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId,
        },
    });

    if (!task) {
        throw new Error("Task not found or not authorized");
    }

    await prisma.task.delete({
        where: { id: taskId },
    });

    return { success: true };
};
